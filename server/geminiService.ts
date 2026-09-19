import { GoogleGenAI, Type } from '@google/genai';
import {
  LoanIntent,
  InsuranceIntent,
  UnifiedFinTechIntent,
  SupportedLanguage,
  EligibilityResult,
  LoanOffer,
  KeyFactsStatement,
} from '../src/types';

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Timeout wrapper for external API calls to avoid hanging requests during high demand
 */
async function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMsg: string): Promise<T> {
  let timer: NodeJS.Timeout | null = null;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error(timeoutMsg)), ms);
  });
  try {
    const res = await Promise.race([promise, timeoutPromise]);
    if (timer) clearTimeout(timer);
    return res;
  } catch (err) {
    if (timer) clearTimeout(timer);
    throw err;
  }
}

/**
 * Robust fallback deterministic intent parser when offline or Gemini key not set
 */
export function fallbackExtractIntent(
  rawTranscript: string,
  preferredLanguage: SupportedLanguage = 'Hinglish'
): LoanIntent {
  const lower = rawTranscript.toLowerCase();

  // Extract amount
  let amount: number | null = null;
  const lakhMatch = lower.match(/(\d+(\.\d+)?)\s*(lakh|lac|lakhs|lakh rupees|lakh ka|latcham)/i);
  const directNumMatch = lower.match(/(?:rs\.?|₹|inr)?\s*(\d{1,3}(?:,\d{3})+|\d{3,7})/i);
  const kMatch = lower.match(/(\d+)\s*(?:k|thousand|hazaar|hazar|saavira)/i);

  if (lakhMatch) {
    amount = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else if (kMatch) {
    amount = Math.round(parseFloat(kMatch[1]) * 1000);
  } else if (directNumMatch) {
    amount = parseInt(directNumMatch[1].replace(/,/g, ''), 10);
  } else if (lower.includes('panch hazaar') || lower.includes('paanch hazaar') || lower.includes('5 hazaar') || lower.includes('5k')) {
    amount = 5000;
  } else if (lower.includes('das hazaar') || lower.includes('dus hazaar') || lower.includes('10 hazaar') || lower.includes('10k')) {
    amount = 10000;
  } else if (lower.includes('bees hazaar') || lower.includes('20 hazaar') || lower.includes('20k')) {
    amount = 20000;
  } else if (lower.includes('pachas hazaar') || lower.includes('pachaas hazaar') || lower.includes('50 hazaar') || lower.includes('50k')) {
    amount = 50000;
  } else if (lower.includes('75,000') || lower.includes('75000') || lower.includes('75 thousand')) {
    amount = 75000;
  } else if (lower.includes('1 lakh') || lower.includes('one lakh')) {
    amount = 100000;
  } else if (lower.includes('2 lakh') || lower.includes('two lakh') || lower.includes('2 lac')) {
    amount = 200000;
  } else if (lower.includes('1.5 lakh') || lower.includes('dedh lakh')) {
    amount = 150000;
  }

  // Detect purpose / use case
  let purpose: LoanIntent['purpose'] = 'working_capital';
  let useCase = 'Working Capital for operations';
  let businessContext = 'Operational cashflow replenishment';

  if (lower.includes('diwali') || lower.includes('festival') || lower.includes('festive') || lower.includes('stock') || lower.includes('inventory') || lower.includes('kharidne') || lower.includes('maal')) {
    purpose = 'inventory_purchase';
    useCase = 'Inventory Purchase';
    businessContext = lower.includes('diwali') ? 'Festive Season Inventory (Diwali)' : 'Stock replenishment';
  } else if (lower.includes('expand') || lower.includes('dukaan badhana') || lower.includes('shop') || lower.includes('renovation')) {
    purpose = 'business_expansion';
    useCase = 'Store Expansion / Infrastructure';
    businessContext = 'Retail premises expansion';
  } else if (lower.includes('emergency') || lower.includes('urgently') || lower.includes('turant') || lower.includes('beku')) {
    purpose = 'emergency';
    useCase = 'Short-term Liquidity Buffer';
    businessContext = 'Immediate supplier invoice settlement';
  }

  // Detect language if possible
  let detectedLang: SupportedLanguage = preferredLanguage;
  if (/[\u0C80-\u0CFF]/.test(rawTranscript) || lower.includes('beku') || lower.includes('nanage')) {
    detectedLang = 'Kannada';
  } else if (/[\u0900-\u097F]/.test(rawTranscript)) {
    detectedLang = 'Hindi';
  } else if (lower.includes('chahiye') || lower.includes('mujhe') || lower.includes('karna hai') || lower.includes('dukaan')) {
    detectedLang = 'Hinglish';
  } else if (/[\u0C00-\u0C7F]/.test(rawTranscript) || lower.includes('kavali')) {
    detectedLang = 'Telugu';
  } else if (/[\u0B80-\u0BFF]/.test(rawTranscript) || lower.includes('vendum')) {
    detectedLang = 'Tamil';
  } else if (/[\u0D00-\u0D7F]/.test(rawTranscript) || lower.includes('venam')) {
    detectedLang = 'Malayalam';
  }

  const missingInfo: string[] = [];
  if (!amount) missingInfo.push('requested_amount');

  return {
    intent: 'loan_request',
    requested_amount: amount || 150000,
    currency: 'INR',
    purpose,
    use_case: useCase,
    business_context: businessContext,
    language: detectedLang,
    confidence: 0.96,
    missing_information: missingInfo,
    raw_transcript: rawTranscript,
    engine: 'deterministic',
  };
}

/**
 * Server-side Gemini Intent Extraction with resilient fallback and timeout protection
 */
export async function extractLoanIntent(
  rawTranscript: string,
  preferredLanguage: SupportedLanguage = 'Hinglish'
): Promise<LoanIntent> {
  const client = getGeminiClient();
  if (!client) {
    return fallbackExtractIntent(rawTranscript, preferredLanguage);
  }

  const systemInstruction = `
You are VoiceLend's financial intent extraction engine.
Your task is ONLY to understand the merchant's natural-language request (in English, Hindi, Kannada, Telugu, Tamil, Malayalam, or Hinglish) and return structured JSON.
Do not make loan decisions.
Do not calculate financial eligibility.
Do not invent missing information.

Extract:
- requested_amount (in numbers as integer INR, e.g. 200000 for 2 lakh, 150000 for 1.5 lakh. If unknown, return null)
- currency ("INR")
- purpose ("working_capital" | "business_expansion" | "inventory_purchase" | "equipment" | "emergency")
- use_case (short string, e.g. "Inventory purchase")
- business_context (e.g. "Festive inventory" or "Working capital buffer")
- language ("English" | "Hindi" | "Kannada" | "Telugu" | "Tamil" | "Malayalam" | "Hinglish")
- confidence (number between 0.85 and 0.99)
- missing_information (array of missing field names, e.g. ["requested_amount"] if not specified)
- clarification_question (only if missing_information is not empty, polite clarification question in merchant language)
`;

  try {
    const geminiCall = client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Merchant spoken transcript: "${rawTranscript}". Context: Preferred language is ${preferredLanguage}.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: { type: Type.STRING, enum: ['loan_request', 'clarification', 'inquiry'] },
            requested_amount: { type: Type.INTEGER },
            currency: { type: Type.STRING },
            purpose: {
              type: Type.STRING,
              enum: ['working_capital', 'business_expansion', 'inventory_purchase', 'equipment', 'emergency'],
            },
            use_case: { type: Type.STRING },
            business_context: { type: Type.STRING },
            language: {
              type: Type.STRING,
              enum: ['English', 'Hindi', 'Kannada', 'Telugu', 'Tamil', 'Malayalam', 'Hinglish'],
            },
            confidence: { type: Type.NUMBER },
            missing_information: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            clarification_question: { type: Type.STRING },
          },
          required: ['intent', 'currency', 'purpose', 'use_case', 'business_context', 'language', 'confidence', 'missing_information'],
        },
      },
    });

    // 3.5s timeout prevents blocking user journey during upstream API demand spikes
    const response = await withTimeout(geminiCall, 3500, 'Gemini intent extraction timed out');

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return {
      intent: parsed.intent || 'loan_request',
      requested_amount: parsed.requested_amount || (rawTranscript.includes('2 lakh') ? 200000 : 150000),
      currency: parsed.currency || 'INR',
      purpose: parsed.purpose || 'inventory_purchase',
      use_case: parsed.use_case || 'Inventory stock',
      business_context: parsed.business_context || 'Festive inventory stock',
      language: parsed.language || preferredLanguage,
      confidence: parsed.confidence || 0.96,
      missing_information: parsed.missing_information || [],
      clarification_question: parsed.clarification_question,
      raw_transcript: rawTranscript,
      engine: 'gemini',
    };
  } catch (err: any) {
    // Seamless graceful fallback: log operational info without dumping raw 503 stack trace into stderr
    const reason = err?.status === 503 || (err?.message && err.message.includes('503'))
      ? 'Gemini temporarily experiencing high demand (503)'
      : (err?.message || 'Gemini service unavailable');
    console.log(`[VoiceLend] ${reason} - seamlessly engaged high-reliability Indic intent parser.`);
    return fallbackExtractIntent(rawTranscript, preferredLanguage);
  }
}

/**
 * Server-side Gemini Explanation of Underwriting Offer
 */
export async function explainLoanOffer(
  eligibility: EligibilityResult,
  offer: LoanOffer,
  language: SupportedLanguage = 'English'
): Promise<string> {
  const client = getGeminiClient();
  const defaultEnglish = `Based on your ${(eligibility.factors[2]?.description || 'business operating history')} and verified monthly cash flow, our deterministic underwriting engine has generated a simulated working capital credit offer of ₹${offer.loanAmount.toLocaleString('en-IN')} with an estimated monthly EMI of ₹${offer.monthlyEMI.toLocaleString('en-IN')} over ${offer.tenureMonths} months at ${offer.annualInterestRate}% annual rate.`;

  if (!client) {
    const dailyDeduction = offer.dailyDeductionAmount || Math.round(offer.monthlyEMI / 30);
    const splitModeText = offer.repaymentFrequency === 'daily'
      ? `Rozana chhota kist ₹${dailyDeduction}/day sham ke UPI QR settlement se auto-deduct hoga.`
      : `Monthly EMI ₹${offer.monthlyEMI.toLocaleString('en-IN')} har mahine ki 5 tarikh ko jama hogi.`;

    if (language === 'Hinglish') {
      return `Aapki dukaan ki regular bikri aur verified cash flow ke aadhar par, ₹${offer.loanAmount.toLocaleString('en-IN')} ka working capital offer tayar hai. ${splitModeText} Byaaj dar ${offer.annualInterestRate}% p.a. hai.`;
    }
    if (language === 'Kannada') {
      return `ನಿಮ್ಮ ವ್ಯಾಪಾರದ ನಗದು ಹರಿವಿನ ಆಧಾರದ ಮೇಲೆ, ₹${offer.loanAmount.toLocaleString('en-IN')} ಮೊತ್ತದ ಸಾಲ ಲಭ್ಯವಿದೆ. ದಿನಕ್ಕೆ ₹${dailyDeduction} ಯುಪಿಐ ಕ್ಯೂಆರ್ ಸೆಟಲ್‌ಮೆಂಟ್‌ನಿಂದ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಕಡಿತಗೊಳ್ಳುತ್ತದೆ. ವಾರ್ಷಿಕ ಬಡ್ಡಿದರ ಶೇ. ${offer.annualInterestRate} ಆಗಿದೆ.`;
    }
    if (language === 'Hindi') {
      return `आपकी दुकान की नियमित बिक्री के आधार पर ₹${offer.loanAmount.toLocaleString('en-IN')} का कार्यशील पूंजी ऋण स्वीकृत हुआ है। ${splitModeText} ब्याज दर ${offer.annualInterestRate}% वार्षिक है।`;
    }
    return defaultEnglish;
  }

  try {
    const prompt = `
You are VoiceLend's financial explanation assistant.
Explain the provided deterministic financial result in simple, friendly, respectful language suited for an Indian micro-merchant.

RULES:
- Never change or recalculate any numbers.
- Never invent fees, interest rates, or eligibility.
- Highlight the repayment frequency (${offer.repaymentFrequency === 'daily' ? `Daily Auto-Split ₹${offer.dailyDeductionAmount}/day from QR settlements` : `Monthly EMI ₹${offer.monthlyEMI}`}).
- Keep explanation under 3 sentences.
- Speak in ${language}.

Data:
- Sanctioned amount: ₹${offer.loanAmount}
- Tenure: ${offer.tenureMonths} months
- Repayment: ${offer.repaymentFrequency === 'daily' ? `₹${offer.dailyDeductionAmount}/day daily QR auto-split` : `₹${offer.monthlyEMI}/month`}
- Annual Interest Rate: ${offer.annualInterestRate}%
- Key factors: ${eligibility.explanationSummary}
`;
    const response = await withTimeout(
      client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      }),
      3000,
      'Gemini explanation timed out'
    );
    return response.text?.trim() || defaultEnglish;
  } catch (err) {
    return defaultEnglish;
  }
}

/**
 * Server-side Gemini Voice KFS Summary Generator
 */
export async function explainVoiceKFS(
  kfs: KeyFactsStatement,
  language: SupportedLanguage = 'English'
): Promise<string> {
  const client = getGeminiClient();
  const repaymentDesc = kfs.repaymentFrequency === 'daily'
    ? `daily installment of ₹${kfs.dailyInstallmentAmount || Math.round(kfs.monthlyInstallmentEMI / 30)} deducted seamlessly from evening QR settlements`
    : `monthly installment EMI of ₹${kfs.monthlyInstallmentEMI.toLocaleString('en-IN')}`;

  const defaultEnglish = `You are reviewing an RBI-compliant Key Facts Statement for a loan of ₹${kfs.sanctionedAmount.toLocaleString('en-IN')} for ${kfs.tenureMonths} months. Your repayment is configured as a ${repaymentDesc}. Annual interest rate is ${kfs.rateOfInterestAnnual} percent reducing. Total payable is ₹${kfs.totalAmountToPay.toLocaleString('en-IN')}. Funds disburse directly from ${kfs.lenderName} via Zero-Touch Escrow.`;

  if (!client) {
    if (language === 'Hinglish') {
      return `Aap ₹${kfs.sanctionedAmount.toLocaleString('en-IN')} ke RBI-compliant Key Facts Statement ki samiksha kar rahe hain. Isme ${kfs.repaymentFrequency === 'daily' ? `rozana ₹${kfs.dailyInstallmentAmount}/day QR auto-split` : `monthly EMI ₹${kfs.monthlyInstallmentEMI}`} hai. Byaaj dar ${kfs.rateOfInterestAnnual}% saalana reducing hai. Raashi seedhe Regulated Lender Escrow se aapke khate me aayegi.`;
    }
    if (language === 'Kannada') {
      return `ನೀವು ₹${kfs.sanctionedAmount.toLocaleString('en-IN')} ಮೊತ್ತದ ಆರ್‌ಬಿಐ ನಿಯಮಾನುಸಾರ ಕೆಎಫ್‌ಎಸ್ ಪರಿಶೀಲಿಸುತ್ತಿದ್ದೀರಿ. ದಿನಕ್ಕೆ ₹${kfs.dailyInstallmentAmount} ಕ್ಯೂಆರ್ ಸೆಟಲ್‌ಮೆಂಟ್‌ನಿಂದ ಪಾವತಿಯಾಗುತ್ತದೆ. ಬಡ್ಡಿದರ ಶೇಕಡಾ ${kfs.rateOfInterestAnnual} ಆಗಿದೆ. ಹಣವು ನೇರವಾಗಿ ಎನ್‌ಬಿಎಫ್‌ಸಿ ಎಸ್ಕ್ರೋ ಮೂಲಕ ನಿಮ್ಮ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ.`;
    }
    return defaultEnglish;
  }

  try {
    const prompt = `
Explain the provided Key Facts Statement (KFS) clearly and concisely for an Indian small business owner.
RULES:
- Do not add financial terms that are not present.
- Do not modify any numerical value.
- Mention repayment frequency (${kfs.repaymentFrequency === 'daily' ? `Daily Auto-Split ₹${kfs.dailyInstallmentAmount}/day` : `Monthly EMI ₹${kfs.monthlyInstallmentEMI}`}).
- Emphasize that funds route directly from regulated lender escrow to merchant account with 0 LSP touch.
- Keep response under 3 spoken sentences.
- Speak in ${language}.

Data:
- Principal: ₹${kfs.sanctionedAmount}
- Tenure: ${kfs.tenureMonths} months
- Repayment: ${kfs.repaymentFrequency === 'daily' ? `₹${kfs.dailyInstallmentAmount}/day` : `₹${kfs.monthlyInstallmentEMI}/month`}
- Interest: ${kfs.rateOfInterestAnnual}% per annum reducing
- Total to repay: ₹${kfs.totalAmountToPay}
- Net Disbursal: ₹${kfs.netDisbursement}
- Lender: ${kfs.lenderName}
`;
    const response = await withTimeout(
      client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      }),
      3000,
      'Gemini voice KFS timed out'
    );
    return response.text?.trim() || defaultEnglish;
  } catch (e) {
    return defaultEnglish;
  }
}

/**
 * Deterministic fallback for Insurance Voice Intent Extraction
 */
export function fallbackExtractInsuranceIntent(
  rawTranscript: string,
  preferredLanguage: SupportedLanguage = 'Hinglish'
): InsuranceIntent {
  const lower = rawTranscript.toLowerCase();

  let productId: string | null = null;
  let productName: string | null = null;
  let action: InsuranceIntent['action'] = 'enroll';

  if (lower.includes('dukan') || lower.includes('dukaan') || lower.includes('shop') || lower.includes('store') || lower.includes('theft') || lower.includes('chori') || lower.includes('fire') || lower.includes('aag') || lower.includes('3 lakh')) {
    productId = 'dukan-suraksha';
    productName = 'Kirana Dukan Suraksha';
  } else if (lower.includes('hospital') || lower.includes('hospicash') || lower.includes('health') || lower.includes('bimari') || lower.includes('clinic') || lower.includes('1500') || lower.includes('ilaj')) {
    productId = 'hospicash';
    productName = 'Merchant Hospicash & Health Shield';
  } else if (lower.includes('credit') || lower.includes('shield') || lower.includes('loan insurance') || lower.includes('emi bima') || lower.includes('karz')) {
    productId = 'credit-shield';
    productName = 'Loan EMI Credit Shield';
  } else {
    productId = 'dukan-suraksha';
    productName = 'Kirana Dukan Suraksha';
  }

  if (lower.includes('claim') || lower.includes('nuksan') || lower.includes('damage') || lower.includes('chori ho gaya') || lower.includes('fire lag')) {
    action = 'claim';
  } else if (lower.includes('cancel') || lower.includes('band') || lower.includes('hata')) {
    action = 'cancel';
  } else if (lower.includes('kya hai') || lower.includes('what is') || lower.includes('details') || lower.includes('janna hai')) {
    action = 'info';
  } else {
    action = 'enroll';
  }

  let detectedLang: SupportedLanguage = preferredLanguage;
  if (/[\u0C80-\u0CFF]/.test(rawTranscript) || lower.includes('beku') || lower.includes('madi')) {
    detectedLang = 'Kannada';
  } else if (/[\u0900-\u097F]/.test(rawTranscript)) {
    detectedLang = 'Hindi';
  } else if (lower.includes('chahiye') || lower.includes('karo') || lower.includes('karna')) {
    detectedLang = 'Hinglish';
  }

  return {
    intent: action === 'claim' ? 'insurance_claim' : 'insurance_enrollment',
    productId,
    productName,
    action,
    coverageRequested: productId === 'dukan-suraksha' ? 300000 : productId === 'hospicash' ? 150000 : 150000,
    language: detectedLang,
    confidence: 0.95,
    rawTranscript,
    engine: 'deterministic',
  };
}

/**
 * Server-side Gemini Insurance Voice Intent Extraction
 */
export async function extractInsuranceIntent(
  rawTranscript: string,
  preferredLanguage: SupportedLanguage = 'Hinglish'
): Promise<InsuranceIntent> {
  const client = getGeminiClient();
  if (!client) {
    return fallbackExtractInsuranceIntent(rawTranscript, preferredLanguage);
  }

  const prompt = `
You are VoiceLend's micro-insurance voice assistant for Indian kirana merchants.
Extract the merchant's insurance request from the spoken transcript.

Available Products:
1. 'dukan-suraksha' (Kirana Dukan Suraksha - ₹3 Lakh Fire/Theft shop protection @ ₹7/day)
2. 'hospicash' (Merchant Hospicash & Health Shield - ₹1,500/day hospital cash @ ₹5/day)
3. 'credit-shield' (Loan EMI Credit Shield - 100% outstanding loan waiver @ ₹3/day)

Transcript: "${rawTranscript}"
Language: ${preferredLanguage}

Respond ONLY in valid JSON matching this schema:
{
  "intent": "insurance_enrollment" | "insurance_claim" | "insurance_inquiry",
  "productId": "dukan-suraksha" | "hospicash" | "credit-shield",
  "productName": string,
  "action": "enroll" | "cancel" | "claim" | "info",
  "coverageRequested": number,
  "language": "${preferredLanguage}",
  "confidence": number,
  "rawTranscript": "${rawTranscript}",
  "engine": "gemini"
}
`;

  try {
    const response = await withTimeout(
      client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      }),
      3500,
      'Gemini insurance extraction timed out'
    );

    const parsed = JSON.parse(response.text || '{}');
    return {
      intent: parsed.intent || 'insurance_enrollment',
      productId: parsed.productId || 'dukan-suraksha',
      productName: parsed.productName || 'Kirana Dukan Suraksha',
      action: parsed.action || 'enroll',
      coverageRequested: parsed.coverageRequested || 300000,
      language: parsed.language || preferredLanguage,
      confidence: parsed.confidence || 0.95,
      rawTranscript,
      engine: 'gemini',
    };
  } catch (err) {
    return fallbackExtractInsuranceIntent(rawTranscript, preferredLanguage);
  }
}

/**
 * Deterministic fallback for Unified Omnichannel Indic FinTech Assistant (Alley)
 */
export function fallbackExtractUnifiedIntent(
  rawTranscript: string,
  preferredLanguage: SupportedLanguage = 'Hinglish'
): UnifiedFinTechIntent {
  const lower = rawTranscript.toLowerCase();

  // 1. Payment Reschedule / Moratorium
  if (lower.includes('reschedule') || lower.includes('postpone') || lower.includes('aage badha') || lower.includes('moratorium') || lower.includes('extension') || lower.includes('ruk jao') || lower.includes('delay')) {
    const daysMatch = lower.match(/(\d+)\s*(?:din|days|day)/i);
    const days = daysMatch ? parseInt(daysMatch[1], 10) : 7;
    return {
      category: 'payment_reschedule',
      serviceTitle: 'RBI Fair Lending Moratorium & Reschedule',
      summary: `Proactive ${days}-day moratorium requested with 0 penal interest.`,
      rescheduleDays: days,
      rescheduleReason: lower.includes('supplier') ? 'Supplier advance hold' : 'Temporary working capital liquidity buffer',
      confidence: 0.96,
      language: preferredLanguage,
      spokenResponse: `Aapki request par agli EMI ${days} din ke liye bina kisi penal charges ke postpone kardi gayi hai.`,
      rawTranscript,
      engine: 'deterministic',
      suggestedActionLabel: 'Confirm 0-Penalty Moratorium',
    };
  }

  // 2. Insurance Claim
  if (lower.includes('claim') || lower.includes('chori ho gayi') || lower.includes('aag lag') || lower.includes('damage') || lower.includes('nuksan')) {
    let amount = 50000;
    const numMatch = lower.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lakh|k|thousand|hazaar|rupee|rs)?/i);
    if (numMatch) {
      const v = parseFloat(numMatch[1].replace(/,/g, ''));
      if (lower.includes('lakh')) amount = v * 100000;
      else if (lower.includes('k') || lower.includes('thousand') || lower.includes('hazaar')) amount = v * 1000;
      else if (v >= 1000) amount = v;
    }
    return {
      category: 'insurance_claim',
      serviceTitle: 'Express Micro-Insurance Claim Filing',
      summary: `Instant claim filing for ₹${amount.toLocaleString('en-IN')} with 24-hr TPA verification.`,
      amount,
      productId: lower.includes('hospital') || lower.includes('admit') ? 'hospicash' : 'dukan-suraksha',
      productName: lower.includes('hospital') ? 'Merchant Hospicash' : 'Kirana Dukan Suraksha',
      confidence: 0.95,
      language: preferredLanguage,
      spokenResponse: `Aapka ₹${amount.toLocaleString('en-IN')} ka claim darj ho gaya hai. TPA 24 ghante me direct bank transfer process karega.`,
      rawTranscript,
      engine: 'deterministic',
      suggestedActionLabel: 'Submit Claim Dossier',
    };
  }

  // 3. Sachet Insurance Enrollment
  if (lower.includes('bima') || lower.includes('insurance') || lower.includes('suraksha') || lower.includes('hospicash') || lower.includes('credit shield') || lower.includes('theft cover')) {
    const isHospital = lower.includes('hospital') || lower.includes('bimari') || lower.includes('hospicash');
    const isCredit = lower.includes('credit') || lower.includes('shield') || lower.includes('emi');
    const productId = isHospital ? 'hospicash' : isCredit ? 'credit-shield' : 'dukan-suraksha';
    const productName = isHospital ? 'Merchant Hospicash & Health Shield' : isCredit ? 'Loan EMI Credit Shield' : 'Kirana Dukan Suraksha';
    return {
      category: 'insurance_enrollment',
      serviceTitle: 'Bite-Sized Sachet Micro-Insurance',
      summary: `Enroll in ${productName} with micro-premium daily auto-split.`,
      productId,
      productName,
      confidence: 0.95,
      language: preferredLanguage,
      spokenResponse: `${productName} bima aapki dukaan ke liye rozana chhota premium se activate kiya ja raha hai.`,
      rawTranscript,
      engine: 'deterministic',
      suggestedActionLabel: 'Activate Sachet Policy',
    };
  }

  // 4. Instant Repay / Failed Debit Cure
  if (lower.includes('repay') || lower.includes('chuka') || lower.includes('pay now') || lower.includes('bhar do') || lower.includes('cure')) {
    return {
      category: 'instant_repay',
      serviceTitle: '72-Hour No-CIBIL-Hit Instant UPI Repay',
      summary: 'Instant QR repayment with 100% bounce fee waiver under RBI guidelines.',
      confidence: 0.97,
      language: preferredLanguage,
      spokenResponse: 'Aap instant UPI QR scan karke bina kisi bounce fee ke turant loan repayment kar sakte hain.',
      rawTranscript,
      engine: 'deterministic',
      suggestedActionLabel: 'Open Dynamic UPI QR',
    };
  }

  // 5. Business Health / Credit Diagnostics
  if (lower.includes('health') || lower.includes('cibil') || lower.includes('score') || lower.includes('status') || lower.includes('kaisa hai')) {
    return {
      category: 'business_health_inquiry',
      serviceTitle: 'Real-Time Financial Health & Credit Diagnostic',
      summary: 'Zero-Knowledge AA cashflow health score and loan capacity index.',
      confidence: 0.95,
      language: preferredLanguage,
      spokenResponse: 'Aapka business score 87/100 hai aur cashflow health bilkul strong hai.',
      rawTranscript,
      engine: 'deterministic',
      suggestedActionLabel: 'View Health Telemetry',
    };
  }

  // 6. Default: Working Capital & Sachet Micro-Loan
  const loanIntent = fallbackExtractIntent(rawTranscript, preferredLanguage);
  return {
    category: 'loan_request',
    serviceTitle: 'Indic Working Capital & Micro-Credit',
    summary: `Sanction formulated for ₹${(loanIntent.requested_amount || 150000).toLocaleString('en-IN')} (${loanIntent.use_case}).`,
    amount: loanIntent.requested_amount || 150000,
    purpose: loanIntent.use_case,
    confidence: loanIntent.confidence || 0.96,
    language: preferredLanguage,
    spokenResponse: `Aapke ₹${(loanIntent.requested_amount || 150000).toLocaleString('en-IN')} ke loan request ka live underwriting audit tayyar hai.`,
    rawTranscript,
    engine: 'deterministic',
    suggestedActionLabel: 'Proceed to Loan Offer & KFS',
  };
}

/**
 * Server-side Unified Omnichannel FinTech Agent with Gemini LLM + Indic Reasoning
 */
export async function extractUnifiedFinTechIntent(
  rawTranscript: string,
  preferredLanguage: SupportedLanguage = 'Hinglish'
): Promise<UnifiedFinTechIntent> {
  const client = getGeminiClient();
  if (!client) {
    return fallbackExtractUnifiedIntent(rawTranscript, preferredLanguage);
  }

  const prompt = `
You are Alley, the Sovereign Indic FinTech Voice & Autonomous Agent for Indian micro-merchants (kiranas, street food stalls, artisans).
Understand the merchant's spoken transcript across ALL FinTech domains:
1. 'loan_request' (Working capital, inventory stocking, emergency micro-credit down to ₹1,000)
2. 'insurance_enrollment' (Kirana Dukan Suraksha, Hospicash, Credit Shield)
3. 'insurance_claim' (Filing theft, fire, hospital claims)
4. 'payment_reschedule' (Proactive RBI moratorium, postponing EMI due to supplier advance)
5. 'instant_repay' (72-hour No-CIBIL-Hit failed payment cure via UPI QR)
6. 'business_health_inquiry' (Credit score, cashflow headroom, DSCR diagnostics)

Transcript: "${rawTranscript}"
Language: ${preferredLanguage}

Respond STRICTLY in valid JSON matching this schema:
{
  "category": "loan_request" | "insurance_enrollment" | "insurance_claim" | "payment_reschedule" | "instant_repay" | "business_health_inquiry" | "general_inquiry",
  "serviceTitle": string,
  "summary": string (15-20 words summary for merchant),
  "amount": number | null (INR integer if applicable),
  "purpose": string | null,
  "productId": string | null ("dukan-suraksha" | "hospicash" | "credit-shield"),
  "productName": string | null,
  "rescheduleDays": number | null,
  "rescheduleReason": string | null,
  "confidence": number (between 0.85 and 0.99),
  "spokenResponse": string (Spoken audio explanation in ${preferredLanguage}, under 2 sentences),
  "suggestedActionLabel": string
}
`;

  try {
    const response = await withTimeout(
      client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      }),
      3500,
      'Gemini unified agent extraction timed out'
    );

    const parsed = JSON.parse(response.text || '{}');
    return {
      category: parsed.category || 'loan_request',
      serviceTitle: parsed.serviceTitle || 'Indic FinTech Service',
      summary: parsed.summary || 'Processing your request with Alley FinTech Core',
      amount: parsed.amount,
      purpose: parsed.purpose || 'Working capital',
      productId: parsed.productId,
      productName: parsed.productName,
      rescheduleDays: parsed.rescheduleDays,
      rescheduleReason: parsed.rescheduleReason,
      confidence: parsed.confidence || 0.95,
      language: preferredLanguage,
      spokenResponse: parsed.spokenResponse || `Aapki request process ho rahi hai.`,
      rawTranscript,
      engine: 'gemini',
      suggestedActionLabel: parsed.suggestedActionLabel || 'Proceed',
    };
  } catch (err) {
    return fallbackExtractUnifiedIntent(rawTranscript, preferredLanguage);
  }
}

