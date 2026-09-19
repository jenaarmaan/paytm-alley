import { ActiveLoan, ReschedulePlan, RescheduleStrategy, PaymentIncident } from '../types';

/**
 * Calculates accrued simple interest per RBI Fair Lending Directives (2024).
 * Strictly zero penal interest or compounding.
 */
export function calculateAccruedInterest(
  principalAmount: number,
  annualInterestRate: number,
  daysDelayed: number
): number {
  if (daysDelayed <= 0) return 0;
  const rateDecimal = annualInterestRate / 100;
  // Simple Daily Accrual Formula
  return Math.round((principalAmount * rateDecimal * daysDelayed) / 365);
}

/**
 * Generates the 4 fair-lending reschedule options for a given active loan.
 */
export function calculateRescheduleOptions(
  loan: ActiveLoan,
  is48HoursAdvance: boolean = true,
  reason: string = 'Wholesale Inventory Advance'
): ReschedulePlan[] {
  // Approximate principal portion of the EMI
  const estimatedPrincipal = Math.round(loan.monthlyEMI * 0.78);
  const originalDate = new Date();
  originalDate.setDate(originalDate.getDate() + 3); // 3 days ahead as typical upcoming due date

  const formatNewDate = (days: number): string => {
    const d = new Date(originalDate);
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const origDueStr = originalDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // Option 1: 7-Day Sachet Delay
  const sachetInterest = calculateAccruedInterest(estimatedPrincipal, loan.annualInterestRate, 7);
  const sachetFee = is48HoursAdvance ? 0 : 49;
  const optSachet: ReschedulePlan = {
    rescheduleId: `RSC-${Math.floor(1000 + Math.random() * 9000)}`,
    strategy: 'sachet_7_days',
    strategyLabel: '7-Day Sachet Delay',
    reason,
    originalDueDate: origDueStr,
    newDueDate: formatNewDate(7),
    originalEMI: loan.monthlyEMI,
    accruedInterest: sachetInterest,
    adminFee: sachetFee,
    penalInterestCharged: 0,
    totalDueOnNewDate: loan.monthlyEMI + sachetInterest + sachetFee,
    cibilImpact: 'Zero Negative Impact',
    rbiComplianceNote: 'Protected under RBI Fair Lending Guidelines. Simple accrued daily interest only.',
  };

  // Option 2: 15-Day Mid-Month Grace
  const graceInterest = calculateAccruedInterest(estimatedPrincipal, loan.annualInterestRate, 15);
  const graceFee = is48HoursAdvance ? 49 : 99;
  const optGrace: ReschedulePlan = {
    rescheduleId: `RSC-${Math.floor(1000 + Math.random() * 9000)}`,
    strategy: 'grace_15_days',
    strategyLabel: '15-Day Mid-Month Grace',
    reason,
    originalDueDate: origDueStr,
    newDueDate: formatNewDate(15),
    originalEMI: loan.monthlyEMI,
    accruedInterest: graceInterest,
    adminFee: graceFee,
    penalInterestCharged: 0,
    totalDueOnNewDate: loan.monthlyEMI + graceInterest + graceFee,
    cibilImpact: 'Zero Negative Impact',
    rbiComplianceNote: '100% bounce-fee avoidance. Aligns with mid-month khata collections.',
  };

  // Option 3: Rozana Kist (Daily QR Auto-Split)
  const dailyDeduction = Math.round(loan.monthlyEMI / 30);
  const optDailyQR: ReschedulePlan = {
    rescheduleId: `RSC-${Math.floor(1000 + Math.random() * 9000)}`,
    strategy: 'daily_qr_catchup',
    strategyLabel: 'Rozana Kist (Daily QR Auto-Split)',
    reason,
    originalDueDate: origDueStr,
    newDueDate: 'Next 30 Days (Daily)',
    originalEMI: loan.monthlyEMI,
    accruedInterest: 0,
    adminFee: 0,
    penalInterestCharged: 0,
    totalDueOnNewDate: loan.monthlyEMI,
    cibilImpact: 'Protected',
    rbiComplianceNote: `Split into ₹${dailyDeduction}/day deductions from evening QR settlements. Zero cash-flow stress.`,
  };

  // Option 4: Split Across Remaining Tenure
  const remainingMonths = Math.max(1, loan.tenureMonths - loan.completedTenureMonths);
  const monthlyIncrement = Math.round(loan.monthlyEMI / remainingMonths);
  const tenureInterest = calculateAccruedInterest(estimatedPrincipal, loan.annualInterestRate, 30);
  const restructuringFee = 149;
  const optTenure: ReschedulePlan = {
    rescheduleId: `RSC-${Math.floor(1000 + Math.random() * 9000)}`,
    strategy: 'split_across_tenure',
    strategyLabel: 'Tenure Restructure (Skip Month)',
    reason,
    originalDueDate: origDueStr,
    newDueDate: `Distributed across ${remainingMonths} months (+₹${monthlyIncrement}/mo)`,
    originalEMI: loan.monthlyEMI,
    accruedInterest: tenureInterest,
    adminFee: restructuringFee,
    penalInterestCharged: 0,
    totalDueOnNewDate: loan.monthlyEMI + tenureInterest + restructuringFee,
    cibilImpact: 'Protected',
    rbiComplianceNote: 'Restructures installment into upcoming tenure without default classification.',
  };

  return [optSachet, optGrace, optDailyQR, optTenure];
}

/**
 * Applies a selected reschedule plan onto an active loan.
 */
export function applyReschedule(loan: ActiveLoan, plan: ReschedulePlan): ActiveLoan {
  const updatedSchedule = loan.repaymentHistory.map((item, idx) => {
    if (idx === loan.completedTenureMonths) {
      return {
        ...item,
        status: 'Rescheduled' as const,
        note: `Rescheduled (${plan.strategyLabel}) to ${plan.newDueDate}. Fee: ₹${plan.adminFee}, Interest: ₹${plan.accruedInterest}`,
      };
    }
    return item;
  });

  return {
    ...loan,
    rescheduleCount: (loan.rescheduleCount || 0) + 1,
    activeReschedule: plan,
    failedIncident: undefined, // Clear any failed incident if resolved via reschedule
    nextDueDate: plan.newDueDate,
    repaymentHistory: updatedSchedule,
  };
}

/**
 * Simulates a NACH automated debit failure to test the 72-hour cure buffer.
 */
export function simulatePaymentFailure(
  loan: ActiveLoan,
  reason: PaymentIncident['failureReason'] = 'INSUFFICIENT_FUNDS'
): ActiveLoan {
  const descriptions: Record<PaymentIncident['failureReason'], string> = {
    INSUFFICIENT_FUNDS: 'Automated NACH debit returned: Insufficient settlement balance in merchant account.',
    NACH_SERVER_TIMEOUT: 'NPCI Core Clearing Gateway Timeout: Mandate debit unacknowledged.',
    MANDATE_REJECTED: 'Bank e-Mandate Synchronization Interrupted during scheduled 04:00 AM batch.',
  };

  const now = new Date();
  const cureExpires = new Date(now.getTime() + 72 * 60 * 60 * 1000);

  const incident: PaymentIncident = {
    incidentId: `INC-${Math.floor(10000 + Math.random() * 90000)}`,
    failureReason: reason,
    failureDescription: descriptions[reason],
    failedAt: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    curePeriodExpiresAt: cureExpires.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    standardPenalFee: 450,
    waivedPenalFee: 450,
    currentAmountToSettle: loan.monthlyEMI, // ₹0 penalty if in cure window!
    cureStatus: 'Within Cure Window',
  };

  const updatedSchedule = loan.repaymentHistory.map((item, idx) => {
    if (idx === loan.completedTenureMonths) {
      return {
        ...item,
        status: 'Delayed' as const,
        note: `Debit Failed (${reason}). 72h Fee-Waived Cure Window Active.`,
      };
    }
    return item;
  });

  return {
    ...loan,
    failedIncident: incident,
    repaymentHistory: updatedSchedule,
  };
}

/**
 * Cures a payment failure via instant multi-channel UPI repayment.
 */
export function curePaymentFailure(loan: ActiveLoan, utr: string): ActiveLoan {
  const updatedSchedule = loan.repaymentHistory.map((item, idx) => {
    if (idx === loan.completedTenureMonths) {
      return {
        ...item,
        status: 'Paid' as const,
        paidDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        note: `Cured via Instant UPI (UTR: ${utr}). 100% Late Fee Waived.`,
        utr,
      };
    }
    return item;
  });

  const nextDue = new Date();
  nextDue.setMonth(nextDue.getMonth() + 1);

  return {
    ...loan,
    completedTenureMonths: loan.completedTenureMonths + 1,
    outstandingBalance: Math.max(0, loan.outstandingBalance - loan.monthlyEMI),
    failedIncident: undefined,
    activeReschedule: undefined,
    nextDueDate: nextDue.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    repaymentHistory: updatedSchedule,
  };
}
