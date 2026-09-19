import React, { useState } from 'react';
import {
  IndianRupee,
  Calendar,
  Percent,
  Calculator,
  FileText,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
  Layers,
  Zap,
  CheckCircle2,
  HelpCircle,
  Volume2,
} from 'lucide-react';
import { LoanOffer, Merchant, SupportedLanguage, InsuranceProduct } from '../types';
import { generateLoanOffer, calculateAmortizationSchedule } from '../services/financialEngine';
import { TRANSLATIONS, getVoiceRepaymentModeFeedback } from '../services/translations';
import { SEEDED_INSURANCE_PRODUCTS } from '../data/seedData';
import { speechService } from '../services/speechService';

interface LoanOfferCardProps {
  initialOffer: LoanOffer;
  merchant: Merchant;
  language: SupportedLanguage;
  onContinueToKFS: (finalOffer: LoanOffer) => void;
  onSpeakExplanation?: () => void;
}

export const LoanOfferCard: React.FC<LoanOfferCardProps> = ({
  initialOffer,
  merchant,
  language,
  onContinueToKFS,
  onSpeakExplanation,
}) => {
  const [selectedTenure, setSelectedTenure] = useState<number>(initialOffer.tenureMonths || 12);
  const [repaymentMode, setRepaymentMode] = useState<'daily' | 'monthly'>('daily');
  const [showAmortization, setShowAmortization] = useState<boolean>(false);
  const [selectedInsuranceIds, setSelectedInsuranceIds] = useState<string[]>(['dukan-suraksha', 'credit-shield']);

  const t = TRANSLATIONS[language] || TRANSLATIONS['English'];

  const selectedInsuranceProducts: InsuranceProduct[] = React.useMemo(() => {
    return SEEDED_INSURANCE_PRODUCTS.filter((p) => selectedInsuranceIds.includes(p.id));
  }, [selectedInsuranceIds]);

  const insuranceDailyTotal = selectedInsuranceProducts.reduce((sum, p) => sum + p.dailyPremium, 0);

  // Dynamically recompute offer when tenure, frequency, or insurance changes
  const activeOffer: LoanOffer = React.useMemo(() => {
    return generateLoanOffer(
      merchant,
      initialOffer.loanAmount,
      selectedTenure,
      undefined,
      repaymentMode,
      selectedInsuranceProducts
    );
  }, [merchant, initialOffer.loanAmount, selectedTenure, repaymentMode, selectedInsuranceProducts]);

  const schedule = React.useMemo(() => {
    return calculateAmortizationSchedule(
      activeOffer.loanAmount,
      activeOffer.annualInterestRate,
      activeOffer.tenureMonths,
      activeOffer.monthlyEMI
    );
  }, [activeOffer]);

  const handleToggleRepaymentMode = (mode: 'daily' | 'monthly') => {
    setRepaymentMode(mode);
    const feedback = getVoiceRepaymentModeFeedback(
      mode,
      activeOffer.dailyDeductionAmount,
      activeOffer.monthlyEMI,
      language
    );
    speechService.speak(feedback, language);
  };

  const toggleInsurance = (productId: string) => {
    setSelectedInsuranceIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  return (
    <div id="loan-offer-card" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-8 animate-in fade-in-50 duration-300 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Simulated Working Capital Offer</span>
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.workingCapitalOffer}
          </h3>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-500 font-medium">Lending Partner</div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Samriddhi NBFC Bank Ltd (RBI Regulated)
          </div>
        </div>
      </div>

      {/* Main Highlights Hero: Amount + Dual-Repayment Metric */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md space-y-1">
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Sanctioned Working Capital
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono">
            ₹{activeOffer.loanAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-emerald-400 font-medium pt-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero collateral required • Direct Escrow IMPS Payout</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-white space-y-1">
          <div className="text-xs text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>{repaymentMode === 'daily' ? 'Rozana Chhota Kist (Daily QR Split)' : t.estimatedEMI}</span>
            <span className="text-[10px] bg-emerald-200/80 dark:bg-emerald-900 px-2 py-0.5 rounded-full text-emerald-900 dark:text-emerald-200 font-bold">
              {repaymentMode === 'daily' ? '⭐ Recommended' : 'Monthly NACH'}
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
            ₹{repaymentMode === 'daily' ? activeOffer.dailyDeductionAmount : activeOffer.monthlyEMI.toLocaleString('en-IN')}
            <span className="text-base font-medium text-slate-500">/{repaymentMode === 'daily' ? 'day' : 'month'}</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 pt-1">
            {repaymentMode === 'daily'
              ? `Auto-split from evening UPI settlement (~${activeOffer.qrSplitPercentage}% of daily volume)`
              : 'Auto-debit on 5th of each month via NACH e-mandate'}
          </div>
        </div>
      </div>

      {/* Repayment Mode Dual-Switcher Box */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Repayment Strategy Rails
            </span>
          </div>
          <span className="text-[11px] text-slate-500">Switch mode anytime</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option A: Daily QR Auto-Split */}
          <div
            onClick={() => handleToggleRepaymentMode('daily')}
            className={`cursor-pointer rounded-2xl border p-4 transition-all ${
              repaymentMode === 'daily'
                ? 'border-emerald-500 bg-white dark:bg-slate-900 ring-2 ring-emerald-500/30 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${repaymentMode === 'daily' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                Daily QR Auto-Split ("Rozana Chhota Kist")
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                ₹{activeOffer.dailyDeductionAmount}/day
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Deducted automatically at 11:30 PM from your daily QR settlement. Prevents month-end cash strain and guarantees 0 bounce charges.
            </p>
          </div>

          {/* Option B: Standard Monthly EMI */}
          <div
            onClick={() => handleToggleRepaymentMode('monthly')}
            className={`cursor-pointer rounded-2xl border p-4 transition-all ${
              repaymentMode === 'monthly'
                ? 'border-emerald-500 bg-white dark:bg-slate-900 ring-2 ring-emerald-500/30 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${repaymentMode === 'monthly' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                Standard Monthly EMI
              </span>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                ₹{activeOffer.monthlyEMI.toLocaleString('en-IN')}/mo
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Full installment debited once a month on the 5th via bank NACH mandate. Requires keeping lump-sum liquidity in bank.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tenure Slider */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Select Loan Duration ({selectedTenure} Months)</span>
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {selectedTenure} Months
          </span>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          id="tenure-slider"
          min="6"
          max="24"
          step="3"
          value={selectedTenure}
          onChange={(e) => setSelectedTenure(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />

        {/* Tenure Markers */}
        <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1">
          <span className={selectedTenure === 6 ? 'text-emerald-600 font-bold' : ''}>6 mo</span>
          <span className={selectedTenure === 9 ? 'text-emerald-600 font-bold' : ''}>9 mo</span>
          <span className={selectedTenure === 12 ? 'text-emerald-600 font-bold' : ''}>12 mo (Standard)</span>
          <span className={selectedTenure === 18 ? 'text-emerald-600 font-bold' : ''}>18 mo</span>
          <span className={selectedTenure === 24 ? 'text-emerald-600 font-bold' : ''}>24 mo</span>
        </div>
      </div>

      {/* Bundled Sachet Micro-Insurance Selector */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Bundle Sachet Protection (Optional • Add to Daily Split)
            </span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            +₹{insuranceDailyTotal}/day total
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SEEDED_INSURANCE_PRODUCTS.map((prod) => {
            const isSelected = selectedInsuranceIds.includes(prod.id);
            return (
              <div
                key={prod.id}
                onClick={() => toggleInsurance(prod.id)}
                className={`cursor-pointer rounded-2xl border p-3 flex items-start gap-3 transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleInsurance(prod.id)}
                  className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{prod.name}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      +₹{prod.dailyPremium}/d
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    ₹{prod.coverageAmount.toLocaleString('en-IN')} coverage underwritten by {prod.underwriter.split(' ')[0]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Breakdown Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Clear Cost Breakdown
          </span>
          <span className="text-[11px] text-slate-500">100% Transparent Terms</span>
        </div>

        <div className="p-4 divide-y divide-slate-100 dark:divide-slate-800 text-xs space-y-2.5">
          <div className="flex justify-between pt-1 font-medium">
            <span className="text-slate-600 dark:text-slate-400">Annual Interest Rate</span>
            <span className="font-bold text-slate-900 dark:text-white">{activeOffer.annualInterestRate}% p.a. (Reducing Balance)</span>
          </div>
          <div className="flex justify-between pt-2.5 font-medium">
            <span className="text-slate-600 dark:text-slate-400">Total Interest Payable ({activeOffer.tenureMonths} mos)</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">₹{activeOffer.totalInterestPayable.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between pt-2.5 font-medium">
            <span className="text-slate-600 dark:text-slate-400">Processing Fee (1.5% + 18% GST)</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">
              ₹{(activeOffer.processingFee + activeOffer.gstOnProcessingFee).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between pt-2.5 font-medium">
            <span className="text-slate-600 dark:text-slate-400">Net Disbursal to Current Account</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">
              ₹{activeOffer.netDisbursalAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between pt-2.5 font-medium">
            <span className="text-slate-600 dark:text-slate-400 font-bold">{t.totalPayable}</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm font-mono">
              ₹{activeOffer.totalRepaymentAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Toggle Amortization Schedule */}
      <div>
        <button
          type="button"
          id="btn-toggle-amortization"
          onClick={() => setShowAmortization(!showAmortization)}
          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1.5"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{showAmortization ? 'Hide Monthly Amortization Table' : 'View Full Monthly Repayment Schedule'}</span>
        </button>

        {showAmortization && (
          <div className="mt-3 max-h-56 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-2xl text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                <tr>
                  <th className="py-2 px-3">Month</th>
                  <th className="py-2 px-3">EMI</th>
                  <th className="py-2 px-3">Principal</th>
                  <th className="py-2 px-3">Interest</th>
                  <th className="py-2 px-3">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {schedule.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-1.5 px-3 font-semibold text-slate-800 dark:text-slate-200 font-sans">Month {row.month}</td>
                    <td className="py-1.5 px-3 font-medium">₹{row.emi.toLocaleString('en-IN')}</td>
                    <td className="py-1.5 px-3 text-emerald-600 dark:text-emerald-400 font-medium">₹{row.principalPaid.toLocaleString('en-IN')}</td>
                    <td className="py-1.5 px-3 text-slate-500">₹{row.interestPaid.toLocaleString('en-IN')}</td>
                    <td className="py-1.5 px-3 font-semibold">₹{row.closingBalance.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer CTA & Voice Readout */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        {onSpeakExplanation && (
          <button
            type="button"
            onClick={onSpeakExplanation}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-emerald-500" />
            <span>Explain Offer in {language}</span>
          </button>
        )}

        <button
          type="button"
          id="btn-view-kfs"
          onClick={() => onContinueToKFS(activeOffer)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white font-bold text-sm shadow-md transition-all ml-auto hover:translate-x-0.5"
        >
          <FileText className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{t.viewKeyFacts}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
