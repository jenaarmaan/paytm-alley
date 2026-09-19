export type SupportedLanguage = 
  | 'English'
  | 'Hindi'
  | 'Kannada'
  | 'Telugu'
  | 'Tamil'
  | 'Malayalam'
  | 'Hinglish';

export interface Merchant {
  merchantId: string;
  name: string;
  businessName: string;
  businessType: string;
  businessVintageMonths: number;
  monthlySales: number;
  monthlyCashflow: number;
  existingEMI: number;
  repaymentHistory: 'excellent' | 'good' | 'fair' | 'poor';
  digitalTransactionScore: number; // 0 - 100
  businessHealth: 'healthy' | 'moderate' | 'caution';
  location: string;
  preferredLanguage: SupportedLanguage;
  upiQrTransactionsPerMonth: number;
  activeCreditLines: number;
  upiHandle?: string;
  tradeSector?: string;
  avatarUrl?: string;
}

export interface LoanIntent {
  intent: 'loan_request' | 'clarification' | 'inquiry';
  requested_amount: number | null;
  currency: string;
  purpose: 'working_capital' | 'business_expansion' | 'inventory_purchase' | 'equipment' | 'emergency';
  use_case: string;
  business_context: string;
  language: SupportedLanguage;
  confidence: number;
  missing_information: string[];
  clarification_question?: string;
  raw_transcript: string;
  engine?: 'gemini' | 'sarvam' | 'deterministic';
}

export interface InsuranceProduct {
  id: 'dukan-suraksha' | 'hospicash' | 'credit-shield' | string;
  name: string;
  tagline: string;
  coverageAmount: number;
  dailyPremium: number;
  annualEquivalent: number;
  underwriter: string;
  features: string[];
  badge: string;
  enrolled: boolean;
  category: 'Property' | 'Health' | 'Credit';
  iconName?: string;
  policyNo?: string;
}

export interface InsuranceClaim {
  claimId: string;
  productId: string;
  productName: string;
  amount: number;
  status: 'Submitted' | 'Document Verification' | 'Approved' | 'Disbursed' | 'Rejected';
  dateFiled: string;
  incidentDate: string;
  description: string;
  payoutEta: string;
  evidenceFiles?: string[];
  claimCategory: 'Fire/Theft' | 'Hospitalization' | 'Loan Protection';
}

export interface InsuranceIntent {
  intent: 'insurance_enrollment' | 'insurance_claim' | 'insurance_inquiry';
  productId: string | null;
  productName: string | null;
  action: 'enroll' | 'cancel' | 'claim' | 'info';
  coverageRequested?: number;
  language: SupportedLanguage;
  confidence: number;
  rawTranscript: string;
  engine?: 'gemini' | 'sarvam' | 'deterministic';
}

export interface UnderwritingConfig {
  maxDebtServiceRatio: number; // e.g. 0.30
  maxLoanToCashflowMultiplier: number; // e.g. 2.0
  minimumBusinessVintageMonths: number; // e.g. 12
  minimumRepaymentScore: number; // e.g. 60
  annualInterestRate: number; // e.g. 0.18 (18%)
  processingFeePercent: number; // e.g. 0.015 (1.5%)
  gstPercent: number; // 0.18 on processing fee
}

export interface FactorBreakdown {
  label: string;
  score: number; // 0 to 10
  rating: 'Good' | 'Strong' | 'Optimal' | 'Caution';
  description: string;
}

export interface EligibilityResult {
  merchantId: string;
  requestedAmount: number;
  eligibleMinAmount: number;
  eligibleMaxAmount: number;
  recommendedAmount: number;
  isEligible: boolean;
  maxMonthlyRepaymentCapacity: number;
  debtServiceRatio: number;
  factors: FactorBreakdown[];
  ruleTriggers: {
    ruleName: string;
    passed: boolean;
    detail: string;
  }[];
  explanationSummary: string;
}

export interface LoanOffer {
  offerId: string;
  merchantId: string;
  loanAmount: number;
  tenureMonths: number;
  annualInterestRate: number; // in percent, e.g. 18
  monthlyEMI: number;
  repaymentFrequency: 'monthly' | 'daily';
  dailyDeductionAmount: number; // e.g. ₹458/day
  qrSplitPercentage: number; // e.g. 8%
  processingFee: number;
  gstOnProcessingFee: number;
  netDisbursalAmount: number;
  totalInterestPayable: number;
  totalRepaymentAmount: number;
  aprPercent: number; // Annual Percentage Rate
  disclaimer: string;
  createdAt: string;
  bundledInsurance?: InsuranceProduct[];
}

export interface KeyFactsStatement {
  kfsId: string;
  merchantName: string;
  businessName: string;
  loanType: string;
  sanctionedAmount: number;
  tenureMonths: number;
  rateOfInterestAnnual: number;
  interestType: 'Fixed' | 'Reducing';
  monthlyInstallmentEMI: number;
  repaymentFrequency: 'monthly' | 'daily';
  dailyInstallmentAmount: number;
  totalInstallmentsCount: number;
  totalInterestCost: number;
  processingCharges: number;
  netDisbursement: number;
  totalAmountToPay: number;
  penalInterestRate: string;
  coolingOffPeriodDays: number;
  lenderName: string;
  lenderRegistration: string;
  validTill: string;
  disclaimerNote: string;
  bundledInsuranceSummary?: string;
  lspFeeDescription?: string;
}

export interface LoanApplication {
  applicationId: string;
  merchantId: string;
  merchantName: string;
  businessName: string;
  requestedAmount: number;
  approvedAmount: number;
  purpose: string;
  tenureMonths: number;
  interestRate: number;
  monthlyEMI: number;
  repaymentFrequency?: 'monthly' | 'daily';
  dailyDeductionAmount?: number;
  status: 'Submitted' | 'Financial Verification' | 'Lender Review' | 'Approved' | 'Disbursed' | 'Rejected';
  timestamp: string;
  kfsAcknowledged: boolean;
  consentTimestamp: string;
  timeline: {
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
    current: boolean;
  }[];
  selectedInsurance?: InsuranceProduct[];
}

export type RescheduleStrategy = 
  | 'sachet_7_days'
  | 'grace_15_days'
  | 'split_across_tenure'
  | 'daily_qr_catchup';

export interface ReschedulePlan {
  rescheduleId: string;
  strategy: RescheduleStrategy;
  strategyLabel: string;
  reason: string;
  originalDueDate: string;
  newDueDate: string;
  originalEMI: number;
  accruedInterest: number;
  adminFee: number;
  penalInterestCharged: number; // strictly 0 under RBI guidelines
  totalDueOnNewDate: number;
  cibilImpact: 'Zero Negative Impact' | 'Protected';
  rbiComplianceNote: string;
}

export interface PaymentIncident {
  incidentId: string;
  failureReason: 'INSUFFICIENT_FUNDS' | 'NACH_SERVER_TIMEOUT' | 'MANDATE_REJECTED';
  failureDescription: string;
  failedAt: string;
  curePeriodExpiresAt: string; // 72h buffer
  standardPenalFee: number; // ₹450
  waivedPenalFee: number; // ₹450
  currentAmountToSettle: number;
  cureStatus: 'Within Cure Window' | 'Expired';
}

export interface ActiveLoan {
  loanId: string;
  applicationId: string;
  merchantId: string;
  originalAmount: number;
  outstandingBalance: number;
  tenureMonths: number;
  completedTenureMonths: number;
  monthlyEMI: number;
  repaymentFrequency: 'monthly' | 'daily';
  dailyDeductionAmount: number;
  qrDeductionPercentage: number;
  nextDueDate: string;
  annualInterestRate: number;
  rescheduleCount?: number;
  activeReschedule?: ReschedulePlan;
  failedIncident?: PaymentIncident;
  repaymentHistory: {
    month: string;
    emiPaid: number;
    status: 'Paid' | 'Upcoming' | 'Delayed' | 'Rescheduled';
    paidDate?: string;
    note?: string;
    utr?: string;
  }[];
  dailySettlementHistory: {
    date: string;
    totalQrVolume: number;
    autoSplitDeducted: number;
    netMerchantPayout: number;
    status: 'Settled' | 'Processing';
  }[];
}

export interface MCPTool {
  name: string;
  description: string;
  type: 'READ' | 'ACTION';
  requiresConfirmation: boolean;
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  examplePayload: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: {
    code: string;
    message: string;
  } | null;
  timestamp: string;
}

export type LoanJourneyState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'CONFIRMING' | 'OFFER' | 'KFS' | 'SUCCESS';

export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  merchantId: string;
  spokenPrompt: string;
  language: SupportedLanguage;
  expectedAmount: number;
  expectedPurpose: string;
  expectedOffer: number;
}
