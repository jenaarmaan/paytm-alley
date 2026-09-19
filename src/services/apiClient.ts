import {
  LoanIntent,
  InsuranceIntent,
  UnifiedFinTechIntent,
  SupportedLanguage,
  Merchant,
  EligibilityResult,
  LoanOffer,
  KeyFactsStatement,
  LoanApplication,
  ActiveLoan,
  InsuranceProduct,
  InsuranceClaim,
  MCPTool,
  ApiResponse,
} from '../types';
import {
  SEEDED_MERCHANTS,
  SEEDED_APPLICATIONS,
  SEEDED_ACTIVE_LOAN,
  SEEDED_INSURANCE_PRODUCTS,
  SEEDED_INSURANCE_CLAIMS,
} from '../data/seedData';
import {
  calculateEligibility,
  generateLoanOffer,
  generateKFS,
} from './financialEngine';

export class ApiClient {
  private baseUrl = '/api';
  private merchantsRegistry: Record<string, Merchant> = { ...SEEDED_MERCHANTS };
  private activeLoansRegistry: Record<string, ActiveLoan> = { [SEEDED_ACTIVE_LOAN.merchantId]: SEEDED_ACTIVE_LOAN };

  public async registerMerchant(merchant: Merchant): Promise<Merchant> {
    this.merchantsRegistry[merchant.merchantId] = merchant;
    try {
      await fetch(`${this.baseUrl}/merchants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merchant),
      });
    } catch (e) {
      // client memory fallback is sufficient
    }
    return merchant;
  }

  public getMerchant(merchantId: string): Merchant {
    return this.merchantsRegistry[merchantId] || Object.values(this.merchantsRegistry)[0] || SEEDED_MERCHANTS['M001'];
  }

  public async extractIntent(
    transcript: string,
    language: SupportedLanguage,
    engine: 'sarvam' | 'gemini' | 'deterministic' = 'sarvam'
  ): Promise<LoanIntent> {
    try {
      const res = await fetch(`${this.baseUrl}/voice/extract-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, language, engine }),
      });
      const data: ApiResponse<LoanIntent> = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      console.warn('Backend API unavailable, executing client fallback for intent extraction');
    }

    // Client fallback
    const lower = transcript.toLowerCase();
    let amount = 150000;
    const lakhMatch = lower.match(/(\d+(\.\d+)?)\s*(lakh|lac|lakhs|lakh rupees|lakh ka)/i);
    const directNumMatch = lower.match(/(?:rs\.?|₹|inr)?\s*(\d{1,3}(?:,\d{3})+|\d{4,7})/i);
    const kMatch = lower.match(/(\d+)\s*(?:k|thousand|hazaar)/i);

    if (lakhMatch) {
      amount = Math.round(parseFloat(lakhMatch[1]) * 100000);
    } else if (kMatch) {
      amount = Math.round(parseFloat(kMatch[1]) * 1000);
    } else if (directNumMatch) {
      amount = parseInt(directNumMatch[1].replace(/,/g, ''), 10);
    } else if (lower.includes('2 lakh') || lower.includes('two lakh') || lower.includes('200000') || lower.includes('2 lac')) {
      amount = 200000;
    } else if (lower.includes('1.5 lakh') || lower.includes('150000')) {
      amount = 150000;
    } else if (lower.includes('1 lakh') || lower.includes('one lakh') || lower.includes('100000') || lower.includes('1 lac')) {
      amount = 100000;
    } else if (lower.includes('75,000') || lower.includes('75000') || lower.includes('75 thousand')) {
      amount = 75000;
    }

    return {
      intent: 'loan_request',
      requested_amount: amount,
      currency: 'INR',
      purpose: lower.includes('expand') ? 'business_expansion' : lower.includes('diwali') || lower.includes('stock') ? 'inventory_purchase' : 'working_capital',
      use_case: lower.includes('expand') ? 'Store Expansion' : 'Festive Inventory Purchase',
      business_context: lower.includes('diwali') ? 'Diwali Festive Stock' : 'Working Capital Buffer',
      language,
      confidence: 0.96,
      missing_information: [],
      raw_transcript: transcript,
      engine: 'deterministic',
    };
  }

  public async extractUnifiedIntent(
    transcript: string,
    language: SupportedLanguage = 'Hinglish',
    engine: 'sarvam' | 'gemini' | 'deterministic' = 'sarvam'
  ): Promise<UnifiedFinTechIntent> {
    try {
      const res = await fetch(`${this.baseUrl}/unified-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, language, engine }),
      });
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      console.warn('Backend unified intent API failed, using client fallback parser');
    }

    const lower = transcript.toLowerCase();
    if (lower.includes('reschedule') || lower.includes('postpone') || lower.includes('aage badha') || lower.includes('moratorium')) {
      return {
        category: 'payment_reschedule',
        serviceTitle: 'Payment Reschedule & 0-Penalty Moratorium',
        summary: 'Proactive 7-day payment extension requested with 0 penal charges under RBI guidelines.',
        rescheduleDays: 7,
        rescheduleReason: 'Temporary cashflow buffer',
        confidence: 0.96,
        language,
        spokenResponse: 'Aapki request par agli EMI 7 din ke liye bina kisi penalty ke postpone kardi gayi hai.',
        rawTranscript: transcript,
        engine: 'deterministic',
        suggestedActionLabel: 'Confirm 7-Day Moratorium',
      };
    }

    if (lower.includes('claim') || lower.includes('nuksan') || lower.includes('chori') || lower.includes('damage')) {
      return {
        category: 'insurance_claim',
        serviceTitle: 'Express Micro-Insurance Claim Filing',
        summary: 'Express claim filing with 24-hr direct bank disbursement.',
        amount: 50000,
        productId: 'dukan-suraksha',
        productName: 'Kirana Dukan Suraksha',
        confidence: 0.95,
        language,
        spokenResponse: 'Aapka insurance claim darj kar liya gaya hai. TPA 24 ghante me direct payout karega.',
        rawTranscript: transcript,
        engine: 'deterministic',
        suggestedActionLabel: 'Submit Claim Dossier',
      };
    }

    if (lower.includes('bima') || lower.includes('insurance') || lower.includes('suraksha') || lower.includes('hospicash') || lower.includes('credit shield')) {
      return {
        category: 'insurance_enrollment',
        serviceTitle: 'Bite-Sized Sachet Micro-Insurance',
        summary: 'Activate sachet insurance protection bundled with daily QR settlements.',
        productId: 'dukan-suraksha',
        productName: 'Kirana Dukan Suraksha',
        confidence: 0.95,
        language,
        spokenResponse: 'Kirana Dukan Suraksha bima rozana ₹7/day auto-split se activate kiya ja raha hai.',
        rawTranscript: transcript,
        engine: 'deterministic',
        suggestedActionLabel: 'Activate Sachet Policy',
      };
    }

    if (lower.includes('health') || lower.includes('cibil') || lower.includes('score')) {
      return {
        category: 'business_health_inquiry',
        serviceTitle: 'Financial Health & Credit Diagnostic',
        summary: 'Live Account Aggregator credit score and cashflow health index.',
        confidence: 0.95,
        language,
        spokenResponse: 'Aapka business health score 87/100 hai aur credit standing bilkul healthy hai.',
        rawTranscript: transcript,
        engine: 'deterministic',
        suggestedActionLabel: 'View Health Telemetry',
      };
    }

    // Default: Loan request
    const loanIntent = this.fallbackExtract(transcript, language);
    return {
      category: 'loan_request',
      serviceTitle: 'Working Capital & Micro-Credit',
      summary: `Sanction formulated for ₹${(loanIntent.requested_amount || 5000).toLocaleString('en-IN')}.`,
      amount: loanIntent.requested_amount || 5000,
      purpose: loanIntent.use_case,
      confidence: 0.96,
      language,
      spokenResponse: `Aapke ₹${(loanIntent.requested_amount || 5000).toLocaleString('en-IN')} ke loan request ka underwriting audit tayyar hai.`,
      rawTranscript: transcript,
      engine: 'deterministic',
      suggestedActionLabel: 'Proceed to Loan Offer',
    };
  }

  public async getMerchantContext(merchantId: string): Promise<{
    merchant: Merchant;
    cashflow: any;
    transactions: any;
  }> {
    try {
      const res = await fetch(`${this.baseUrl}/merchants/${merchantId}/context`);
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      console.warn('Backend merchant context API failed, using seeded client fallback');
    }

    const merchant = SEEDED_MERCHANTS[merchantId] || SEEDED_MERCHANTS['M001'];
    return {
      merchant,
      cashflow: {
        merchantId,
        monthlySales: merchant.monthlySales,
        monthlyCashflow: merchant.monthlyCashflow,
        existingEMI: merchant.existingEMI,
        averageDailyUpiInflow: Math.round(merchant.monthlySales / 30),
      },
      transactions: {
        totalVolumePast30Days: merchant.upiQrTransactionsPerMonth,
        settlementSuccessRate: '99.4%',
      },
    };
  }

  public async getEligibility(
    merchantId: string,
    requestedAmount: number,
    tenureMonths: number = 12
  ): Promise<EligibilityResult> {
    try {
      const res = await fetch(`${this.baseUrl}/loans/eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId, requestedAmount, tenureMonths }),
      });
      const data: ApiResponse<EligibilityResult> = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      console.warn('Backend eligibility check failed, using local deterministic engine');
    }

    const merchant = SEEDED_MERCHANTS[merchantId] || SEEDED_MERCHANTS['M001'];
    return calculateEligibility(merchant, requestedAmount, tenureMonths);
  }

  public async extractInsuranceIntent(transcript: string, language: SupportedLanguage): Promise<InsuranceIntent> {
    try {
      const res = await fetch(`${this.baseUrl}/voice/extract-insurance-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, language }),
      });
      const data: ApiResponse<InsuranceIntent> = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      console.warn('Backend insurance intent API failed, running client fallback');
    }

    const lower = transcript.toLowerCase();
    let productId = 'dukan-suraksha';
    let productName = 'Kirana Dukan Suraksha';
    let action: InsuranceIntent['action'] = 'enroll';

    if (lower.includes('hospicash') || lower.includes('health') || lower.includes('hospital')) {
      productId = 'hospicash';
      productName = 'Merchant Hospicash & Health Shield';
    } else if (lower.includes('credit') || lower.includes('shield') || lower.includes('loan')) {
      productId = 'credit-shield';
      productName = 'Loan EMI Credit Shield';
    }

    if (lower.includes('claim') || lower.includes('damage') || lower.includes('nuksan')) {
      action = 'claim';
    }

    return {
      intent: action === 'claim' ? 'insurance_claim' : 'insurance_enrollment',
      productId,
      productName,
      action,
      coverageRequested: productId === 'dukan-suraksha' ? 300000 : 150000,
      language,
      confidence: 0.95,
      rawTranscript: transcript,
      engine: 'deterministic',
    };
  }

  public async getInsuranceProducts(): Promise<InsuranceProduct[]> {
    try {
      const res = await fetch(`${this.baseUrl}/insurance/products`);
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      // fallback
    }
    return SEEDED_INSURANCE_PRODUCTS;
  }

  public async toggleInsuranceEnrollment(productId: string, enrolled: boolean): Promise<InsuranceProduct | null> {
    try {
      const res = await fetch(`${this.baseUrl}/insurance/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, enrolled }),
      });
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      // fallback
    }
    const item = SEEDED_INSURANCE_PRODUCTS.find(p => p.id === productId);
    if (item) item.enrolled = enrolled;
    return item || null;
  }

  public async getInsuranceClaims(): Promise<InsuranceClaim[]> {
    try {
      const res = await fetch(`${this.baseUrl}/insurance/claims`);
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      // fallback
    }
    return SEEDED_INSURANCE_CLAIMS;
  }

  public async fileInsuranceClaim(claimData: {
    productId: string;
    productName: string;
    amount: number;
    description: string;
    incidentDate?: string;
    claimCategory?: InsuranceClaim['claimCategory'];
  }): Promise<InsuranceClaim> {
    try {
      const res = await fetch(`${this.baseUrl}/insurance/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimData),
      });
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      // fallback
    }

    const fallbackClaim: InsuranceClaim = {
      claimId: `CLM-2026-09${Math.floor(10 + Math.random() * 89)}`,
      productId: claimData.productId,
      productName: claimData.productName,
      amount: claimData.amount,
      status: 'Document Verification',
      dateFiled: 'Today (Live)',
      incidentDate: claimData.incidentDate || 'Recent',
      description: claimData.description,
      payoutEta: 'Instant advance ₹25,000 queued for IMPS',
      claimCategory: claimData.claimCategory || 'Fire/Theft',
    };
    return fallbackClaim;
  }

  public async getLoanOffer(
    merchantId: string,
    sanctionedAmount: number,
    tenureMonths: number = 12,
    repaymentFrequency: 'monthly' | 'daily' = 'daily',
    bundledInsurance: InsuranceProduct[] = []
  ): Promise<LoanOffer> {
    try {
      const res = await fetch(`${this.baseUrl}/loans/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId, sanctionedAmount, tenureMonths, repaymentFrequency, bundledInsurance }),
      });
      const data: ApiResponse<LoanOffer> = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      console.warn('Backend offer generation failed, using local deterministic engine');
    }

    const merchant = this.getMerchant(merchantId);
    return generateLoanOffer(merchant, sanctionedAmount, tenureMonths, undefined, repaymentFrequency, bundledInsurance);
  }

  public async getKFS(merchantId: string, offer: LoanOffer): Promise<KeyFactsStatement> {
    try {
      const res = await fetch(`${this.baseUrl}/loans/kfs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId, offer }),
      });
      const data: ApiResponse<KeyFactsStatement> = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      console.warn('Backend KFS generation failed, using local deterministic engine');
    }

    const merchant = this.getMerchant(merchantId);
    return generateKFS(merchant, offer);
  }

  public async explainOffer(
    eligibility: EligibilityResult,
    offer: LoanOffer,
    language: SupportedLanguage
  ): Promise<string> {
    try {
      const res = await fetch(`${this.baseUrl}/voice/explain-offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eligibility, offer, language }),
      });
      const data = await res.json();
      if (data.success && data.data?.explanation) return data.data.explanation;
    } catch (e) {
      // ignore
    }

    if (language === 'Hinglish') {
      return `Aapki dukaan ki regular bikri aur verified cash flow ke aadhar par, humara financial engine ₹${offer.loanAmount.toLocaleString('en-IN')} ka simulated working capital offer deta hai. Iski monthly EMI lagbhag ₹${offer.monthlyEMI.toLocaleString('en-IN')} hogi ${offer.tenureMonths} mahine ke liye.`;
    }
    if (language === 'Kannada') {
      return `ನಿಮ್ಮ ವ್ಯವಹಾರದ ಸ್ಥಿರತೆ ಮತ್ತು ಮಾಸಿಕ ನಗದು ಹರಿವಿನ ಆಧಾರದ ಮೇಲೆ, ₹${offer.loanAmount.toLocaleString('en-IN')} ಮೊತ್ತದ ದುಡಿಯುವ ಬಂಡವಾಳ ಸಾಲದ ಆಫರ್ ಸಿದ್ಧವಾಗಿದೆ. ಮಾಸಿಕ ಇಎಂಐ ₹${offer.monthlyEMI.toLocaleString('en-IN')} (${offer.tenureMonths} ತಿಂಗಳು).`;
    }
    return `Based on your ${(eligibility.factors[2]?.description || 'operating stability')} and monthly cashflow, our deterministic engine offers ₹${offer.loanAmount.toLocaleString('en-IN')} for ${offer.tenureMonths} months with an EMI of ₹${offer.monthlyEMI.toLocaleString('en-IN')}.`;
  }

  public async explainKFS(kfs: KeyFactsStatement, language: SupportedLanguage): Promise<string> {
    try {
      const res = await fetch(`${this.baseUrl}/voice/explain-kfs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kfs, language }),
      });
      const data = await res.json();
      if (data.success && data.data?.explanation) return data.data.explanation;
    } catch (e) {
      // ignore
    }

    return `You are applying for a simulated loan of ₹${kfs.sanctionedAmount.toLocaleString('en-IN')} for ${kfs.tenureMonths} months. Your estimated monthly EMI is ₹${kfs.monthlyInstallmentEMI.toLocaleString('en-IN')}. The simulated interest rate is ${kfs.rateOfInterestAnnual} percent per year.`;
  }

  public async submitApplication(data: {
    merchantId: string;
    requestedAmount: number;
    approvedAmount: number;
    purpose: string;
    tenureMonths: number;
    interestRate: number;
    monthlyEMI: number;
  }): Promise<LoanApplication> {
    try {
      const res = await fetch(`${this.baseUrl}/loans/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result: ApiResponse<LoanApplication> = await res.json();
      if (result.success && result.data) return result.data;
    } catch (e) {
      console.warn('Backend submission failed, creating local submitted application');
    }

    const merchant = this.getMerchant(data.merchantId);
    const dynamicAppId = `VL-2026-00${Math.floor(100 + Math.random() * 899)}`;
    return {
      applicationId: dynamicAppId,
      merchantId: data.merchantId,
      merchantName: merchant.name,
      businessName: merchant.businessName,
      requestedAmount: data.requestedAmount,
      approvedAmount: data.approvedAmount,
      purpose: data.purpose,
      tenureMonths: data.tenureMonths,
      interestRate: data.interestRate,
      monthlyEMI: data.monthlyEMI,
      status: 'Submitted',
      timestamp: 'Just now',
      kfsAcknowledged: true,
      consentTimestamp: new Date().toLocaleString('en-IN'),
      timeline: [
        { title: 'Voice Request Captured', description: 'Intent extracted via Multilingual Speech', timestamp: 'Completed', completed: true, current: false },
        { title: 'Financial Underwriting', description: 'Deterministic capacity evaluation passed', timestamp: 'Completed', completed: true, current: false },
        { title: 'Consent & Voice KFS Signed', description: 'Explicit merchant consent logged', timestamp: 'Completed', completed: true, current: false },
        { title: 'Lender Verification', description: 'Simulated automated policy check', timestamp: 'In progress', completed: false, current: true },
        { title: 'Direct Disbursement', description: 'Direct credit to current account', timestamp: 'Pending review', completed: false, current: false },
      ],
    };
  }

  public async getApplications(): Promise<LoanApplication[]> {
    try {
      const res = await fetch(`${this.baseUrl}/loans/applications`);
      const data: ApiResponse<LoanApplication[]> = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      // ignore
    }
    return SEEDED_APPLICATIONS;
  }

  public async updateApplicationStatus(
    applicationId: string,
    status: LoanApplication['status']
  ): Promise<LoanApplication | null> {
    try {
      const res = await fetch(`${this.baseUrl}/loans/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      // ignore
    }
    return null;
  }

  public saveActiveLoan(loan: ActiveLoan) {
    this.activeLoansRegistry[loan.merchantId] = loan;
  }

  public async getActiveLoan(merchantId: string): Promise<ActiveLoan> {
    try {
      const res = await fetch(`${this.baseUrl}/loans/active/${merchantId}`);
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      // ignore
    }

    if (this.activeLoansRegistry[merchantId]) {
      return this.activeLoansRegistry[merchantId];
    }

    const merchant = this.getMerchant(merchantId);
    const amount = Math.min(200000, Math.max(50000, Math.round(merchant.monthlySales * 0.8)));
    const rate = 16.0;
    const emi = Math.round(amount * 0.091);
    const dailyDeduction = Math.round(emi / 30);
    const dailySales = Math.max(1000, Math.round(merchant.monthlySales / 30));

    const generatedLoan: ActiveLoan = {
      loanId: `LN-2026-${merchantId}`,
      applicationId: `VL-2026-${merchantId}`,
      merchantId: merchant.merchantId,
      originalAmount: amount,
      outstandingBalance: amount,
      tenureMonths: 12,
      completedTenureMonths: 0,
      monthlyEMI: emi,
      repaymentFrequency: 'daily',
      dailyDeductionAmount: dailyDeduction,
      qrDeductionPercentage: Math.min(15, Math.max(5, Math.round((dailyDeduction / dailySales) * 100))),
      annualInterestRate: rate,
      nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      dailySettlementHistory: [
        { date: 'Today (Live)', totalQrVolume: dailySales, autoSplitDeducted: dailyDeduction, netMerchantPayout: dailySales - dailyDeduction, status: 'Settled' },
      ],
      repaymentHistory: Array.from({ length: 12 }, (_, i) => ({
        month: `Month ${i + 1}`,
        emiPaid: emi,
        status: 'Upcoming' as const,
      })),
    };

    this.activeLoansRegistry[merchantId] = generatedLoan;
    return generatedLoan;
  }

  public async getAdminMetrics(): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}/admin/metrics`);
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      // ignore
    }
    return null;
  }

  public async getMCPTools(): Promise<MCPTool[]> {
    try {
      const res = await fetch(`${this.baseUrl}/mcp/tools`);
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      // ignore
    }
    return [];
  }

  public async executeMCPTool(toolName: string, args: Record<string, any>): Promise<any> {
    const res = await fetch(`${this.baseUrl}/mcp/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolName, args }),
    });
    return res.json();
  }

  public async getSarvamHealth(): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}/sarvam/health`);
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      // ignore
    }
    return {
      status: 'unconfigured',
      apiKeyConfigured: false,
      latencyMs: 0,
      models: {
        llm: 'Sarvam Indic LLM',
        stt: 'Saaras ASR v3',
        tts: 'Bulbul TTS v2',
      },
      supportedLanguages: ['Hindi', 'Hinglish', 'Kannada', 'Tamil', 'Telugu', 'Malayalam', 'English'],
      lastChecked: new Date().toISOString(),
    };
  }

  public async testSarvamPing(prompt: string = 'Mujhe 2 lakh ka inventory loan chahiye', language: SupportedLanguage = 'Hinglish'): Promise<{ success: boolean; latencyMs: number; response?: any; error?: string }> {
    const start = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}/sarvam/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: prompt, language }),
      });
      const data = await res.json();
      const latencyMs = Date.now() - start;
      if (data.success && data.data) {
        return { success: true, latencyMs, response: data.data };
      }
      return { success: false, latencyMs, error: data.error?.message || 'Chat failed' };
    } catch (err: any) {
      return { success: false, latencyMs: Date.now() - start, error: err.message || 'Connection error' };
    }
  }

  public async synthesizeSarvamTTS(text: string, language: SupportedLanguage = 'English', speaker: string = 'meera'): Promise<string | null> {
    try {
      const res = await fetch(`${this.baseUrl}/sarvam/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language, speaker }),
      });
      const data = await res.json();
      if (data.success && data.data?.audioBase64) {
        return data.data.audioBase64;
      }
    } catch (e) {
      // fallback to browser Web Speech API
    }
    return null;
  }
}

export const apiClient = new ApiClient();
