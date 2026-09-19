import { Router, Request, Response } from 'express';
import {
  extractLoanIntent,
  extractInsuranceIntent,
  explainLoanOffer,
  explainVoiceKFS,
} from './geminiService';
import { sarvamService } from './sarvamService';
import { mockLenderService } from './mockLenderService';
import { mcpAdapter } from './mcpAdapter';
import {
  calculateEligibility,
  generateLoanOffer,
  generateKFS,
} from '../src/services/financialEngine';

export const apiRouter = Router();

// Helper for standard API response format
function sendSuccess<T>(res: Response, data: T) {
  res.json({
    success: true,
    data,
    error: null,
    timestamp: new Date().toISOString(),
  });
}

function sendError(res: Response, code: string, message: string, status = 400) {
  res.status(status).json({
    success: false,
    data: null,
    error: {
      code,
      message,
    },
    timestamp: new Date().toISOString(),
  });
}

// ----------------------------------------------------
// SARVAM AI INDIC SOVEREIGN STACK ROUTES
// ----------------------------------------------------
apiRouter.get('/sarvam/health', async (req: Request, res: Response) => {
  try {
    const health = await sarvamService.getHealth();
    return sendSuccess(res, health);
  } catch (err: any) {
    return sendError(res, 'SARVAM_HEALTH_CHECK_FAILED', err.message || 'Health check error');
  }
});

apiRouter.post('/sarvam/chat', async (req: Request, res: Response) => {
  try {
    const { transcript, language } = req.body;
    if (!transcript) {
      return sendError(res, 'INVALID_TRANSCRIPT', 'Transcript text is required.');
    }
    const intent = await sarvamService.extractLoanIntent(transcript, language || 'Hinglish');
    return sendSuccess(res, intent);
  } catch (err: any) {
    return sendError(res, 'SARVAM_CHAT_FAILED', err.message || 'Sarvam chat completion failed');
  }
});

apiRouter.post('/sarvam/tts', async (req: Request, res: Response) => {
  try {
    const { text, language, speaker } = req.body;
    if (!text) {
      return sendError(res, 'INVALID_TEXT', 'Text for speech synthesis is required.');
    }
    const result = await sarvamService.synthesizeSpeech(text, language || 'English', speaker || 'meera');
    return sendSuccess(res, result);
  } catch (err: any) {
    return sendError(res, 'SARVAM_TTS_FAILED', err.message || 'Bulbul TTS synthesis failed');
  }
});

// ----------------------------------------------------
// AI VOICE & INTENT ROUTES
// ----------------------------------------------------
apiRouter.post('/voice/extract-intent', async (req: Request, res: Response) => {
  try {
    const { transcript, language, engine } = req.body;
    if (!transcript || typeof transcript !== 'string') {
      return sendError(res, 'INVALID_TRANSCRIPT', 'Spoken transcript text is required.');
    }

    let intent;
    if (engine === 'sarvam' || (!process.env.GEMINI_API_KEY && sarvamService.isConfigured())) {
      intent = await sarvamService.extractLoanIntent(transcript, language || 'Hinglish');
    } else {
      intent = await extractLoanIntent(transcript, language || 'Hinglish');
    }
    return sendSuccess(res, intent);
  } catch (err: any) {
    console.error('Intent extraction failed:', err);
    return sendError(res, 'VOICE_PROCESSING_FAILED', err.message || 'Unable to process the voice request.');
  }
});

apiRouter.post('/voice/extract-insurance-intent', async (req: Request, res: Response) => {
  try {
    const { transcript, language } = req.body;
    if (!transcript || typeof transcript !== 'string') {
      return sendError(res, 'INVALID_TRANSCRIPT', 'Spoken transcript text is required.');
    }

    const intent = await extractInsuranceIntent(transcript, language || 'Hinglish');
    return sendSuccess(res, intent);
  } catch (err: any) {
    console.error('Insurance intent extraction failed:', err);
    return sendError(res, 'INSURANCE_VOICE_FAILED', err.message || 'Unable to process the insurance request.');
  }
});

apiRouter.post('/voice/explain-offer', async (req: Request, res: Response) => {
  try {
    const { eligibility, offer, language } = req.body;
    if (!eligibility || !offer) {
      return sendError(res, 'MISSING_DATA', 'Eligibility and Offer details are required.');
    }

    const explanation = await explainLoanOffer(eligibility, offer, language || 'English');
    return sendSuccess(res, { explanation });
  } catch (err: any) {
    return sendError(res, 'EXPLANATION_FAILED', 'Could not generate explanation.');
  }
});

apiRouter.post('/voice/explain-kfs', async (req: Request, res: Response) => {
  try {
    const { kfs, language } = req.body;
    if (!kfs) {
      return sendError(res, 'MISSING_KFS', 'Key Facts Statement details are required.');
    }

    const explanation = await explainVoiceKFS(kfs, language || 'English');
    return sendSuccess(res, { explanation });
  } catch (err: any) {
    return sendError(res, 'KFS_EXPLANATION_FAILED', 'Could not generate voice KFS explanation.');
  }
});

// ----------------------------------------------------
// MERCHANT CONTEXT ROUTES
// ----------------------------------------------------
apiRouter.get('/merchants', (req: Request, res: Response) => {
  const merchants = mockLenderService.getAllMerchants();
  return sendSuccess(res, merchants);
});

apiRouter.post('/merchants', (req: Request, res: Response) => {
  const merchant = req.body;
  if (!merchant || !merchant.merchantId || !merchant.name) {
    return sendError(res, 'INVALID_MERCHANT', 'Valid merchant object is required');
  }
  const registered = mockLenderService.registerMerchant(merchant);
  return sendSuccess(res, registered);
});

apiRouter.get('/merchants/:id', (req: Request, res: Response) => {
  const merchant = mockLenderService.getMerchant(req.params.id);
  if (!merchant) return sendError(res, 'MERCHANT_NOT_FOUND', 'Merchant not found', 404);
  return sendSuccess(res, merchant);
});

apiRouter.get('/merchants/:id/context', (req: Request, res: Response) => {
  const merchant = mockLenderService.getMerchant(req.params.id);
  if (!merchant) return sendError(res, 'MERCHANT_NOT_FOUND', 'Merchant not found', 404);

  const cashflow = mockLenderService.getMerchantCashflow(req.params.id);
  const transactions = mockLenderService.getMerchantTransactions(req.params.id);

  return sendSuccess(res, {
    merchant,
    cashflow,
    transactions,
  });
});

// ----------------------------------------------------
// DETERMINISTIC FINANCIAL ENGINE ROUTES
// ----------------------------------------------------
apiRouter.post('/loans/eligibility', (req: Request, res: Response) => {
  const { merchantId, requestedAmount, tenureMonths } = req.body;
  const merchant = mockLenderService.getMerchant(merchantId || 'M001');
  if (!merchant) return sendError(res, 'MERCHANT_NOT_FOUND', 'Merchant not found', 404);

  const amount = Number(requestedAmount) || 200000;
  const tenure = Number(tenureMonths) || 12;

  const result = calculateEligibility(merchant, amount, tenure);
  return sendSuccess(res, result);
});

apiRouter.post('/loans/offers', (req: Request, res: Response) => {
  const { merchantId, sanctionedAmount, tenureMonths, repaymentFrequency, bundledInsurance } = req.body;
  const merchant = mockLenderService.getMerchant(merchantId || 'M001');
  if (!merchant) return sendError(res, 'MERCHANT_NOT_FOUND', 'Merchant not found', 404);

  const amount = Number(sanctionedAmount) || 150000;
  const tenure = Number(tenureMonths) || 12;
  const freq = repaymentFrequency === 'monthly' ? 'monthly' : 'daily';

  const offer = generateLoanOffer(merchant, amount, tenure, undefined, freq, bundledInsurance || []);
  return sendSuccess(res, offer);
});

apiRouter.post('/loans/kfs', (req: Request, res: Response) => {
  const { merchantId, offer } = req.body;
  const merchant = mockLenderService.getMerchant(merchantId || 'M001');
  if (!merchant || !offer) return sendError(res, 'INVALID_DATA', 'Merchant and Offer are required');

  const kfs = generateKFS(merchant, offer);
  return sendSuccess(res, kfs);
});

// ----------------------------------------------------
// EMBEDDED SACHET INSURANCE ROUTES
// ----------------------------------------------------
apiRouter.get('/insurance/products', (req: Request, res: Response) => {
  const products = mockLenderService.getInsuranceProducts();
  return sendSuccess(res, products);
});

apiRouter.post('/insurance/enroll', (req: Request, res: Response) => {
  const { productId, enrolled } = req.body;
  if (!productId) return sendError(res, 'PRODUCT_ID_REQUIRED', 'productId is required');

  const updated = mockLenderService.toggleInsuranceEnrollment(productId, Boolean(enrolled));
  if (!updated) return sendError(res, 'PRODUCT_NOT_FOUND', 'Insurance product not found', 404);
  return sendSuccess(res, updated);
});

apiRouter.get('/insurance/claims', (req: Request, res: Response) => {
  const claims = mockLenderService.getInsuranceClaims();
  return sendSuccess(res, claims);
});

apiRouter.post('/insurance/claims', (req: Request, res: Response) => {
  const { productId, productName, amount, description, incidentDate, claimCategory } = req.body;
  if (!productId || !amount) {
    return sendError(res, 'INVALID_CLAIM_DATA', 'productId and amount are required');
  }

  const claim = mockLenderService.fileInsuranceClaim({
    productId,
    productName: productName || 'Sachet Protection Plan',
    amount: Number(amount),
    description: description || 'Merchant submitted voice claim',
    incidentDate: incidentDate || new Date().toLocaleDateString('en-IN'),
    claimCategory: claimCategory || 'Fire/Theft',
  });

  return sendSuccess(res, claim);
});

// ----------------------------------------------------
// APPLICATION SUBMISSION & MANAGEMENT ROUTES
// ----------------------------------------------------
apiRouter.get('/loans/applications', (req: Request, res: Response) => {
  const apps = mockLenderService.getAllApplications();
  return sendSuccess(res, apps);
});

apiRouter.post('/loans/applications', (req: Request, res: Response) => {
  const { merchantId, requestedAmount, approvedAmount, purpose, tenureMonths, interestRate, monthlyEMI } = req.body;

  if (!merchantId || !approvedAmount) {
    return sendError(res, 'INVALID_APPLICATION_DATA', 'Missing required application fields.');
  }

  const app = mockLenderService.createApplication({
    merchantId,
    requestedAmount: Number(requestedAmount) || Number(approvedAmount),
    approvedAmount: Number(approvedAmount),
    purpose: purpose || 'Working capital',
    tenureMonths: Number(tenureMonths) || 12,
    interestRate: Number(interestRate) || 18,
    monthlyEMI: Number(monthlyEMI) || 13752,
  });

  return sendSuccess(res, app);
});

apiRouter.get('/loans/applications/:id', (req: Request, res: Response) => {
  const app = mockLenderService.getApplication(req.params.id);
  if (!app) return sendError(res, 'APPLICATION_NOT_FOUND', 'Loan application not found', 404);
  return sendSuccess(res, app);
});

apiRouter.patch('/loans/applications/:id/status', (req: Request, res: Response) => {
  const { status, note } = req.body;
  const updated = mockLenderService.updateApplicationStatus(req.params.id, status, note);
  if (!updated) return sendError(res, 'APPLICATION_NOT_FOUND', 'Loan application not found', 404);
  return sendSuccess(res, updated);
});

apiRouter.get('/loans/active/:merchantId', (req: Request, res: Response) => {
  const activeLoan = mockLenderService.getActiveLoan(req.params.merchantId);
  return sendSuccess(res, activeLoan);
});

apiRouter.get('/admin/metrics', (req: Request, res: Response) => {
  const metrics = mockLenderService.getAdminMetrics();
  return sendSuccess(res, metrics);
});

// ----------------------------------------------------
// MCP TOOL REGISTRY & RUNNER
// ----------------------------------------------------
apiRouter.get('/mcp/tools', (req: Request, res: Response) => {
  return sendSuccess(res, mcpAdapter.getTools());
});

apiRouter.post('/mcp/execute', async (req: Request, res: Response) => {
  try {
    const toolName = req.body.toolName || req.body.tool_name;
    const args = req.body.args || req.body.arguments || req.body.parameters || {};
    if (!toolName) return sendError(res, 'TOOL_REQUIRED', 'toolName is required');

    const result = await mcpAdapter.executeTool(toolName, args);
    return sendSuccess(res, result);
  } catch (err: any) {
    return sendError(res, 'MCP_EXECUTION_FAILED', err.message || 'Execution error');
  }
});

// ----------------------------------------------------
// MOCK ENTERPRISE APIs (with simulated latency)
// ----------------------------------------------------
apiRouter.get('/mock/merchant/:id', async (req: Request, res: Response) => {
  await new Promise((r) => setTimeout(r, 450));
  const merchant = mockLenderService.getMerchant(req.params.id);
  if (!merchant) return res.status(404).json({ error: 'Merchant not found' });
  res.json({ merchant, source: 'Core Banking CBS V4.2' });
});

apiRouter.get('/mock/merchant/:id/cashflow', async (req: Request, res: Response) => {
  await new Promise((r) => setTimeout(r, 550));
  const cashflow = mockLenderService.getMerchantCashflow(req.params.id);
  res.json({ cashflow, aggregator: 'Setu / Finvu Account Aggregator' });
});

apiRouter.get('/mock/merchant/:id/transactions', async (req: Request, res: Response) => {
  await new Promise((r) => setTimeout(r, 380));
  const tx = mockLenderService.getMerchantTransactions(req.params.id);
  res.json({ transactions: tx, switch: 'NPCI UPI BharatQR' });
});

apiRouter.post('/mock/lender/applications', async (req: Request, res: Response) => {
  await new Promise((r) => setTimeout(r, 600));
  res.json({
    lenderStatus: 'RECEIVED',
    partnerLender: 'Samriddhi Microfinance Bank Ltd',
    sanctionRef: `SMB-${Date.now()}`,
    riskDecision: 'AUTO_APPROVED_TIER_A',
  });
});
