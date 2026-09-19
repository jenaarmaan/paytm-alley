import React from 'react';
import {
  Mic,
  TrendingUp,
  IndianRupee,
  CreditCard,
  HeartPulse,
  ArrowRight,
  Sparkles,
  Store,
  Clock,
  ShieldCheck,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { Merchant, SupportedLanguage, ActiveLoan, LoanApplication } from '../types';
import { TRANSLATIONS } from '../services/translations';
import { DEMO_SCENARIOS } from '../data/seedData';
import { calculateEligibility } from '../services/financialEngine';

interface MerchantDashboardViewProps {
  merchant: Merchant;
  language: SupportedLanguage;
  activeLoan?: ActiveLoan | null;
  recentApplications: LoanApplication[];
  onStartVoiceLoan: (initialPrompt?: string) => void;
  onViewMyLoans: () => void;
  onViewBusinessHealth: () => void;
  onViewInsurance?: () => void;
}

export const MerchantDashboardView: React.FC<MerchantDashboardViewProps> = ({
  merchant,
  language,
  activeLoan,
  recentApplications = [],
  onStartVoiceLoan,
  onViewMyLoans,
  onViewBusinessHealth,
  onViewInsurance,
}) => {
  const safeMerchant: Merchant = merchant || {
    merchantId: 'M001',
    name: 'Ramesh Kumar',
    businessName: 'Ramesh General Stores',
    businessType: 'Kirana / Grocery',
    businessVintageMonths: 50,
    monthlySales: 180000,
    monthlyCashflow: 82000,
    existingEMI: 11500,
    repaymentHistory: 'good',
    digitalTransactionScore: 87,
    businessHealth: 'healthy',
    location: 'Kanpur / Bengaluru',
    preferredLanguage: 'Hinglish',
    upiQrTransactionsPerMonth: 420,
    activeCreditLines: 1,
    upiHandle: 'ramesh.kirana@paytm',
    tradeSector: 'Kirana & Daily Staples',
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS['English'];
  const monthlyCashflow = safeMerchant.monthlyCashflow || Math.round((safeMerchant.monthlySales || 150000) * 0.45);
  const existingEMI = safeMerchant.existingEMI || 0;
  const debtRatio = monthlyCashflow > 0 ? ((existingEMI / monthlyCashflow) * 100).toFixed(0) : '0';
  const eligibility = calculateEligibility(safeMerchant, 0);
  const safeApplications = recentApplications || [];

  return (
    <div id="merchant-dashboard-view" className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Greeting & Store Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Verified Kirana Store
            </span>
            <span className="text-xs text-slate-400">• {safeMerchant.location || 'India'}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {t.goodMorning}, {safeMerchant.name || 'Merchant'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {safeMerchant.businessName || 'Enterprise'} • Operational for {((safeMerchant.businessVintageMonths || 36) / 12).toFixed(1)} years
          </p>
        </div>

        {/* Quick Health Tag */}
        <button
          onClick={onViewBusinessHealth}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
        >
          <HeartPulse className="w-4 h-4 text-emerald-600" />
          <span>Health: {t.healthy} ({safeMerchant.digitalTransactionScore || 87}/100)</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Main Hero Voice Call-to-Action Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-900 text-white p-5 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pre-Qualified Working Capital Buffer Available</span>
          </span>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
            {t.askForLoan}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
            Need inventory stock for the upcoming festive rush, store renovation, or supplier advance? Simply tap and speak in {language}.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-dashboard-start-voice"
              onClick={() => onStartVoiceLoan()}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Mic className="w-5 h-5" />
              <span>{t.tapToSpeak} ({language})</span>
            </button>

            <span className="text-xs text-slate-400 hidden sm:inline">
              Instant voice recognition • Zero paperwork
            </span>
          </div>

          {/* Quick preset suggestions: Horizontal Swipeable Pill Strip on Mobile */}
          <div className="mt-5 pt-4 border-t border-slate-700/60 text-xs">
            <div className="text-slate-400 font-medium mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Demo Prompts (Swipe to select):</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {DEMO_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => onStartVoiceLoan(sc.spokenPrompt)}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors shadow-2xs hover:border-emerald-400/50 cursor-pointer whitespace-nowrap"
                >
                  "{sc.spokenPrompt}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Rupee Soundwave Background Art */}
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none hidden md:block">
          <svg className="w-80 h-80 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z" />
          </svg>
        </div>
      </div>

      {/* 4 Financial Snapshot Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Working Capital */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">{t.availableWorkingCapital}</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{eligibility.eligibleMaxAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pre-assessed credit ceiling</span>
          </div>
        </div>

        {/* Monthly Sales */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">{t.monthlySales}</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{(safeMerchant.monthlySales || 150000).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            +8.4% from last month
          </div>
        </div>

        {/* Monthly Cashflow */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">{t.monthlyCashflow}</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            ₹{monthlyCashflow.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Net operating surplus
          </div>
        </div>

        {/* Current Debt Burden */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">{t.currentEMI}</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{existingEMI.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {debtRatio}% of surplus (Healthy &lt;30%)
          </div>
        </div>
      </div>

      {/* Embedded Sachet Micro-Insurance Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 p-5 rounded-2xl border border-indigo-500/20 shadow-sm text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-100">Dukan Suraksha &amp; Sachet Insurance</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ₹3/day Micro-Split
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Protect your shop from fire/theft and secure merchant health cash with auto daily QR deductions.
            </p>
          </div>
        </div>

        {onViewInsurance && (
          <button
            onClick={onViewInsurance}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <span>Explore Sachet Insurance</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Two Column Section: Active Loan & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Loan Quick Card */}
        {activeLoan ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Ongoing Working Capital Loan</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Regular Active
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 mb-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Loan Facility ID:</span>
                <span className="font-mono font-bold text-slate-900">{activeLoan.loanId}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Outstanding Balance:</span>
                <span className="font-bold text-slate-900">₹{(activeLoan.outstandingBalance || 0).toLocaleString('en-IN')} / ₹{(activeLoan.originalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Next Due Installment:</span>
                <span className="font-bold text-emerald-700">₹{(activeLoan.monthlyEMI || 0).toLocaleString('en-IN')} ({activeLoan.nextDueDate})</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-2">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${((activeLoan.completedTenureMonths || 0) / (activeLoan.tenureMonths || 12)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>{activeLoan.completedTenureMonths || 0} Months Paid</span>
                <span>{(activeLoan.tenureMonths || 12) - (activeLoan.completedTenureMonths || 0)} Months Remaining</span>
              </div>
            </div>

            <button
              onClick={onViewMyLoans}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Repayment Schedule</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-center items-center text-center">
            <CreditCard className="w-10 h-10 text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No Active Borrowings</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              You currently have zero outstanding active credit balances with VoiceLend.
            </p>
          </div>
        )}

        {/* Recent Applications Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Recent Applications</h3>
            <span className="text-xs text-slate-500">{safeApplications.length} Recorded</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {safeApplications.slice(0, 3).map((app) => (
              <div key={app.applicationId} className="py-3 flex items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>₹{(app.approvedAmount || app.requestedAmount || 0).toLocaleString('en-IN')}</span>
                    <span className="text-[10px] font-mono text-slate-400 font-normal">({app.applicationId})</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{app.purpose} • {app.timestamp}</div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    app.status === 'Approved' || app.status === 'Disbursed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={onViewMyLoans}
            className="w-full mt-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View All Applications</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
