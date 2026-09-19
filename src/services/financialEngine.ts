import {
  Merchant,
  UnderwritingConfig,
  EligibilityResult,
  LoanOffer,
  KeyFactsStatement,
  FactorBreakdown,
  InsuranceProduct,
} from '../types';

export const DEFAULT_UNDERWRITING_CONFIG: UnderwritingConfig = {
  maxDebtServiceRatio: 0.30, // 30% of monthly sales/cashflow available for debt servicing
  maxLoanToCashflowMultiplier: 2.0, // Cap at 2x monthly sales
  minimumBusinessVintageMonths: 12, // 1 year minimum vintage
  minimumRepaymentScore: 60, // 60/100 threshold
  annualInterestRate: 16.0, // Base 16% per annum
  processingFeePercent: 1.5, // 1.5% one-time fee
  gstPercent: 18.0, // 18% GST on processing fee
};

/**
 * Calculates dynamic interest rate formulated from merchant vintage and cashflow risk:
 * - Base Rate: 16% p.a.
 * - Vintage Discount: -1.5% if vintage >= 24 months
 * - Cashflow Volatility Adjustment: +1.0% if existing EMIs > 20% of sales
 */
export function calculateDynamicInterestRate(merchant: Merchant): number {
  let rate = 16.0;
  if (merchant.businessVintageMonths >= 24) {
    rate -= 1.5;
  }
  const monthlyTurnover = merchant.monthlySales || merchant.monthlyCashflow || 100000;
  if ((merchant.existingEMI / monthlyTurnover) > 0.20) {
    rate += 1.0;
  }
  return Number(rate.toFixed(1));
}

/**
 * Deterministic calculation of Monthly Equated Installment (EMI)
 * Formula: P * r * (1+r)^n / ((1+r)^n - 1)
 * @param principal Loan amount in INR
 * @param annualRatePercent Annual interest rate e.g. 16 for 16%
 * @param tenureMonths Loan duration in months e.g. 12
 */
export function calculateEMI(
  principal: number,
  annualRatePercent: number,
  tenureMonths: number
): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRatePercent === 0) return Math.round(principal / tenureMonths);

  const monthlyRate = annualRatePercent / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

/**
 * Calculates net available monthly capacity for additional loan EMI
 * Formula: Max Monthly EMI Capacity = (Merchant Monthly Sales * 0.30) - Existing EMIs
 */
export function calculateRepaymentCapacity(
  merchant: Merchant,
  config: UnderwritingConfig = DEFAULT_UNDERWRITING_CONFIG
): number {
  const sales = merchant.monthlySales || merchant.monthlyCashflow || 100000;
  const ratio = config.maxDebtServiceRatio || 0.30;
  const allowedTotalDebtObligation = sales * ratio;
  const netSurplusForNewLoan = Math.max(0, allowedTotalDebtObligation - merchant.existingEMI);
  return Math.round(netSurplusForNewLoan);
}

/**
 * Calculates dynamic loan sanction range based on merchant's live sales:
 * - Min Amount = max(₹15,000, Monthly Sales * 0.25)
 * - Max Amount = min(₹5,00,000, Monthly Sales * 2.0)
 */
export function calculateMaxLoanAmount(
  merchant: Merchant,
  tenureMonths: number = 12,
  config: UnderwritingConfig = DEFAULT_UNDERWRITING_CONFIG
): number {
  const sales = merchant.monthlySales || merchant.monthlyCashflow || 100000;
  const netMonthlyCapacity = calculateRepaymentCapacity(merchant, config);
  const rate = calculateDynamicInterestRate(merchant);

  // Maximum loan based on capacity
  const monthlyRate = rate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const capacityBasedPrincipal = (netMonthlyCapacity * (factor - 1)) / (monthlyRate * factor);

  // Policy ceiling based on sales (max 2.0x monthly sales, capped at ₹5,00,000)
  const salesCeiling = Math.min(500000, sales * 2.0);

  // Minimum of capacity-derived and sales policy ceiling
  const rawMax = Math.min(capacityBasedPrincipal, salesCeiling);

  // Round to nearest ₹5,000
  return Math.max(15000, Math.floor(rawMax / 5000) * 5000);
}

/**
 * Comprehensive eligibility evaluation with transparent explainability
 */
export function calculateEligibility(
  merchant: Merchant,
  requestedAmount: number,
  tenureMonths: number = 12,
  config: UnderwritingConfig = DEFAULT_UNDERWRITING_CONFIG
): EligibilityResult {
  const sales = merchant.monthlySales || merchant.monthlyCashflow || 100000;
  const maxRepaymentCapacity = calculateRepaymentCapacity(merchant, config);
  const maxEligible = calculateMaxLoanAmount(merchant, tenureMonths, config);
  const minEligible = Math.max(15000, Math.round(sales * 0.25));
  const dynamicRate = calculateDynamicInterestRate(merchant);

  // Rule verification
  const vintagePassed = merchant.businessVintageMonths >= config.minimumBusinessVintageMonths;
  const repaymentPassed = merchant.repaymentHistory !== 'poor';
  const digitalPassed = merchant.digitalTransactionScore >= config.minimumRepaymentScore;
  const capacityPassed = maxRepaymentCapacity >= 3000;

  const ruleTriggers = [
    {
      ruleName: 'Business Vintage Check',
      passed: vintagePassed,
      detail: `${(merchant.businessVintageMonths / 12).toFixed(1)} years operational (Policy: >= ${(config.minimumBusinessVintageMonths / 12).toFixed(0)} year)`,
    },
    {
      ruleName: 'Debt-to-Sales Capacity Check',
      passed: capacityPassed,
      detail: `Net available monthly headroom: ₹${maxRepaymentCapacity.toLocaleString('en-IN')} after existing EMI ₹${merchant.existingEMI.toLocaleString('en-IN')}`,
    },
    {
      ruleName: 'Repayment Track Record',
      passed: repaymentPassed,
      detail: `Merchant score tagged as '${merchant.repaymentHistory.toUpperCase()}' based on UPI repayment discipline`,
    },
    {
      ruleName: 'Digital Footprint Index',
      passed: digitalPassed,
      detail: `Digital score ${merchant.digitalTransactionScore}/100 with ${merchant.upiQrTransactionsPerMonth || 340} monthly UPI QR sales`,
    },
  ];

  const isEligible = vintagePassed && repaymentPassed && capacityPassed;

  // Recommended amount: minimum of requested and maxEligible
  let recommendedAmount = isEligible ? Math.min(requestedAmount, maxEligible) : 0;
  if (recommendedAmount < minEligible && isEligible) {
    recommendedAmount = minEligible;
  }
  // Round to ₹5,000 increments
  recommendedAmount = Math.round(recommendedAmount / 5000) * 5000;

  const currentDebtRatio = ((merchant.existingEMI / sales) * 100);

  const factors: FactorBreakdown[] = [
    {
      label: 'Monthly Cashflow Capacity',
      score: Math.min(10, Math.round((maxRepaymentCapacity / 20000) * 10)),
      rating: maxRepaymentCapacity > 12000 ? 'Strong' : 'Good',
      description: `Monthly turnover of ₹${sales.toLocaleString('en-IN')} provides ₹${maxRepaymentCapacity.toLocaleString('en-IN')}/mo headroom`,
    },
    {
      label: 'Existing Obligations',
      score: Math.max(2, 10 - Math.round((currentDebtRatio / 30) * 10)),
      rating: currentDebtRatio < 15 ? 'Optimal' : 'Good',
      description: `Current EMI of ₹${merchant.existingEMI.toLocaleString('en-IN')} represents ${currentDebtRatio.toFixed(1)}% of monthly turnover`,
    },
    {
      label: 'Business Stability',
      score: Math.min(10, Math.round((merchant.businessVintageMonths / 48) * 10)),
      rating: merchant.businessVintageMonths >= 24 ? 'Strong' : 'Good',
      description: `${(merchant.businessVintageMonths / 12).toFixed(1)} years continuous operations in ${merchant.location}`,
    },
    {
      label: 'Repayment Discipline',
      score: merchant.repaymentHistory === 'excellent' ? 10 : merchant.repaymentHistory === 'good' ? 8 : 5,
      rating: merchant.repaymentHistory === 'excellent' ? 'Optimal' : 'Good',
      description: `Dynamic interest rate formulated at ${dynamicRate}% p.a. based on vintage and debt profile`,
    },
  ];

  const explanationSummary = isEligible
    ? `Based on ${merchant.businessName}'s ${(merchant.businessVintageMonths / 12).toFixed(1)}-year operating history and monthly turnover of ₹${sales.toLocaleString('en-IN')}, you qualify for a working capital credit offer up to ₹${maxEligible.toLocaleString('en-IN')} at ${dynamicRate}% p.a.`
    : `Application cannot proceed automatically because cashflow headroom is insufficient or minimum business vintage criteria were not met.`;

  return {
    merchantId: merchant.merchantId,
    requestedAmount,
    eligibleMinAmount: minEligible,
    eligibleMaxAmount: maxEligible,
    recommendedAmount,
    isEligible,
    maxMonthlyRepaymentCapacity: maxRepaymentCapacity,
    debtServiceRatio: currentDebtRatio,
    factors,
    ruleTriggers,
    explanationSummary,
  };
}

/**
 * Generates an explainable, deterministic loan offer with dual repayment modes
 */
export function generateLoanOffer(
  merchant: Merchant,
  sanctionedAmount: number,
  tenureMonths: number = 12,
  config: UnderwritingConfig = DEFAULT_UNDERWRITING_CONFIG,
  repaymentFrequency: 'monthly' | 'daily' = 'daily',
  bundledInsurance: InsuranceProduct[] = []
): LoanOffer {
  const effectiveRate = calculateDynamicInterestRate(merchant);
  const monthlyEMI = calculateEMI(sanctionedAmount, effectiveRate, tenureMonths);
  const totalRepaymentAmount = monthlyEMI * tenureMonths;
  const totalInterestPayable = Math.max(0, totalRepaymentAmount - sanctionedAmount);

  // Daily auto-split math: 30 days per month
  const dailyDeductionAmount = Math.round(monthlyEMI / 30);
  const dailyAvgSales = Math.max(1000, Math.round((merchant.monthlySales || 100000) / 30));
  const rawQrSplit = (dailyDeductionAmount / dailyAvgSales) * 100;
  const qrSplitPercentage = Math.min(15, Math.max(5, Math.round(rawQrSplit)));

  const processingFee = Math.round((sanctionedAmount * config.processingFeePercent) / 100);
  const gstOnProcessingFee = Math.round((processingFee * config.gstPercent) / 100);
  const netDisbursalAmount = sanctionedAmount - (processingFee + gstOnProcessingFee);

  // Approximate APR
  const aprPercent = Number(
    (
      effectiveRate +
      ((processingFee + gstOnProcessingFee) / sanctionedAmount) * (12 / tenureMonths) * 100
    ).toFixed(2)
  );

  return {
    offerId: `OFF-${Date.now().toString().slice(-6)}`,
    merchantId: merchant.merchantId,
    loanAmount: sanctionedAmount,
    tenureMonths,
    annualInterestRate: effectiveRate,
    monthlyEMI,
    repaymentFrequency,
    dailyDeductionAmount,
    qrSplitPercentage,
    processingFee,
    gstOnProcessingFee,
    netDisbursalAmount,
    totalInterestPayable,
    totalRepaymentAmount,
    aprPercent,
    bundledInsurance,
    disclaimer: 'Calculated by VoiceLend deterministic underwriting engine based on live merchant telemetry.',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Generates a complete Key Facts Statement (KFS)
 */
export function generateKFS(merchant: Merchant, offer: LoanOffer): KeyFactsStatement {
  const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const insuranceSummary = offer.bundledInsurance && offer.bundledInsurance.length > 0
    ? offer.bundledInsurance.map(i => `${i.name} (₹${i.coverageAmount.toLocaleString('en-IN')} cover @ ₹${i.dailyPremium}/day)`).join(' + ')
    : 'No optional micro-insurance selected';

  return {
    kfsId: `KFS-2026-${offer.offerId.replace('OFF-', '')}`,
    merchantName: merchant.name,
    businessName: merchant.businessName,
    loanType: 'Unsecured Merchant Working Capital Loan',
    sanctionedAmount: offer.loanAmount,
    tenureMonths: offer.tenureMonths,
    rateOfInterestAnnual: offer.annualInterestRate,
    interestType: 'Reducing',
    monthlyInstallmentEMI: offer.monthlyEMI,
    repaymentFrequency: offer.repaymentFrequency || 'daily',
    dailyInstallmentAmount: offer.dailyDeductionAmount || Math.round(offer.monthlyEMI / 30),
    totalInstallmentsCount: offer.repaymentFrequency === 'daily' ? offer.tenureMonths * 30 : offer.tenureMonths,
    totalInterestCost: offer.totalInterestPayable,
    processingCharges: offer.processingFee + offer.gstOnProcessingFee,
    netDisbursement: offer.netDisbursalAmount,
    totalAmountToPay: offer.totalRepaymentAmount,
    penalInterestRate: '24% p.a. on overdue installment balance',
    coolingOffPeriodDays: 3,
    lenderName: 'Samriddhi Microfinance Bank Ltd (RBI Regulated Lending Partner)',
    lenderRegistration: 'RBI/NBFC/ND-SI/2024/9912',
    validTill: validUntil,
    disclaimerNote: 'RBI-compliant Digital Lending Key Facts Statement. All principal routed via Zero-Touch Escrow.',
    bundledInsuranceSummary: insuranceSummary,
    lspFeeDescription: 'VoiceLend operates as an RBI-compliant LSP (Lending Service Provider). Origination technology fee is paid directly by the lender with zero borrower pass-through.',
  };
}

/**
 * Detailed loan repayment amortization schedule
 */
export function calculateAmortizationSchedule(
  principal: number,
  annualRatePercent: number,
  tenureMonths: number,
  monthlyEMI: number
) {
  const schedule = [];
  let balance = principal;
  const monthlyRate = annualRatePercent / 12 / 100;

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = Math.round(balance * monthlyRate);
    const principalPaid = Math.min(balance, monthlyEMI - interest);
    balance = Math.max(0, balance - principalPaid);

    schedule.push({
      month,
      emi: monthlyEMI,
      principalPaid,
      interestPaid: interest,
      closingBalance: balance,
    });
  }
  return schedule;
}
