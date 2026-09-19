import React, { useState } from 'react';
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Mic,
  FileText,
  ShieldCheck,
  TrendingUp,
  Zap,
  ArrowDownUp,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Award,
  RotateCcw,
  RotateCw,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { ActiveLoan, LoanApplication, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../services/translations';
import { PaymentRescheduleRepayModal } from './PaymentRescheduleRepayModal';
import { simulatePaymentFailure } from '../services/rescheduleEngine';
import { SEEDED_ACTIVE_LOAN } from '../data/seedData';

interface MyLoansViewProps {
  activeLoan: ActiveLoan | null;
  applications: LoanApplication[];
  language: SupportedLanguage;
  onStartVoiceLoan: () => void;
  onUpdateActiveLoan?: (updatedLoan: ActiveLoan) => void;
}

export const MyLoansView: React.FC<MyLoansViewProps> = ({
  activeLoan,
  applications,
  language,
  onStartVoiceLoan,
  onUpdateActiveLoan,
}) => {
  const [activeTab, setActiveTab] = useState<'daily-stream' | 'monthly-history' | 'applications'>('daily-stream');
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<'reschedule' | 'repay' | 'rbi'>('reschedule');
  const t = TRANSLATIONS[language] || TRANSLATIONS['English'];

  const dailyHistory = activeLoan?.dailySettlementHistory || [
    { date: '18 Sep 2026', totalQrVolume: 6240, autoSplitDeducted: 458, netMerchantPayout: 5782, status: 'Settled' },
    { date: '17 Sep 2026', totalQrVolume: 5890, autoSplitDeducted: 458, netMerchantPayout: 5432, status: 'Settled' },
    { date: '16 Sep 2026', totalQrVolume: 7120, autoSplitDeducted: 458, netMerchantPayout: 6662, status: 'Settled' },
    { date: '15 Sep 2026', totalQrVolume: 6450, autoSplitDeducted: 458, netMerchantPayout: 5992, status: 'Settled' },
    { date: '14 Sep 2026', totalQrVolume: 4980, autoSplitDeducted: 458, netMerchantPayout: 4522, status: 'Settled' },
    { date: '13 Sep 2026', totalQrVolume: 8300, autoSplitDeducted: 458, netMerchantPayout: 7842, status: 'Settled' },
    { date: 'Today (Live)', totalQrVolume: 5120, autoSplitDeducted: 458, netMerchantPayout: 4662, status: 'Processing' },
  ];

  const totalDeductedThisWeek = dailyHistory.reduce((sum, d) => sum + d.autoSplitDeducted, 0);

  const handleOpenReschedule = (tab: 'reschedule' | 'repay' | 'rbi' = 'reschedule') => {
    setModalInitialTab(tab);
    setIsRescheduleModalOpen(true);
  };

  const handleSimulateFailure = () => {
    if (!activeLoan) return;
    const failedLoan = simulatePaymentFailure(activeLoan, 'INSUFFICIENT_FUNDS');
    onUpdateActiveLoan?.(failedLoan);
    setModalInitialTab('repay');
    setIsRescheduleModalOpen(true);
  };

  const handleResetLoan = () => {
    onUpdateActiveLoan?.(SEEDED_ACTIVE_LOAN);
  };

  const incident = activeLoan?.failedIncident;
  const activeReschedule = activeLoan?.activeReschedule;

  return (
    <div id="my-loans-view" className="space-y-6 animate-in fade-in-50 duration-300">
      
      {/* Judge & QA Sandbox Testing Bar */}
      <div className="bg-slate-900 border border-amber-500/30 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white text-xs shadow-md">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 text-[10px] uppercase tracking-wider">
            QA Sandbox
          </span>
          <span className="text-slate-300 font-medium">
            Test RBI Moratoriums &amp; 72-Hour Failure Cure Buffer:
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSimulateFailure}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-all shadow-sm shadow-red-600/20 active:scale-95"
            title="Trigger simulated NACH bounce to test 72-hour cure and zero penal fee waiver"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate NACH Failure</span>
          </button>

          <button
            onClick={() => handleOpenReschedule('reschedule')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-all shadow-sm shadow-amber-600/20 active:scale-95"
            title="Open proactive pre-debit extension selector"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Test Proactive Reschedule</span>
          </button>

          <button
            onClick={handleResetLoan}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
            title="Reset loan to pristine state"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.myLoans}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active credit facilities, proactive moratoriums, and daily QR auto-split settlement stream
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenReschedule('rbi')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 text-slate-700 text-xs font-semibold transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>RBI Fair Lending Norms</span>
          </button>

          <button
            onClick={onStartVoiceLoan}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Mic className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Apply with Voice</span>
          </button>
        </div>
      </div>

      {/* Dynamic Failure / Moratorium Alert Banner */}
      {incident && (
        <div className="p-5 rounded-3xl bg-red-950/80 border border-red-500/50 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-400/40 text-red-300 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-red-100">
                  Scheduled NACH Debit Interrupted ({incident.failureReason})
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  72h 100% Late-Fee Waiver Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {incident.failureDescription} Settle within the 72h cure window (expires <strong className="text-amber-300">{incident.curePeriodExpiresAt}</strong>) to maintain zero adverse CIBIL reporting.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenReschedule('repay')}
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 whitespace-nowrap transition-transform hover:scale-105"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Pay &amp; Cure Dues (₹0 Late Fee)</span>
          </button>
        </div>
      )}

      {activeReschedule && !incident && (
        <div className="p-5 rounded-3xl bg-amber-950/60 border border-amber-500/40 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-amber-100">
                  Moratorium Active: {activeReschedule.strategyLabel}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeReschedule.cibilImpact}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Revised Due Date: <strong className="text-amber-300">{activeReschedule.newDueDate}</strong>. Simple daily accrued interest: ₹{activeReschedule.accruedInterest}, Penal fee: ₹0.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenReschedule('repay')}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold whitespace-nowrap transition-colors"
          >
            <span>Pre-Pay Early</span>
          </button>
        </div>
      )}

      {/* Active Loan Details Card */}
      {activeLoan && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Working Capital Facility</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Daily Auto-Split Active
                  </span>
                  {activeLoan.rescheduleCount && activeLoan.rescheduleCount > 0 && (
                    <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      Rescheduled {activeLoan.rescheduleCount}x (Max 2)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Facility ID: {activeLoan.loanId} • Samriddhi Bank
                </p>
              </div>
            </div>

            {/* Next Due & Moratorium Actions */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">Next Due Date</div>
                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {activeLoan.nextDueDate}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenReschedule('reschedule')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
                  title="Request 7-day, 15-day or daily QR moratorium"
                >
                  Reschedule EMI
                </button>
                <button
                  onClick={() => handleOpenReschedule('repay')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                  title="Pay installment via UPI QR"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>

          {/* Metric Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 font-medium">Sanctioned Principal</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                ₹{activeLoan.originalAmount.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 font-medium">Outstanding Principal</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                ₹{activeLoan.outstandingBalance.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900">
              <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold">Daily QR Auto-Split</div>
              <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 font-mono">
                ₹{activeLoan.dailyDeductionAmount || 458}<span className="text-xs font-normal text-slate-500">/day</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 font-medium">Monthly Installment (Base)</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                ₹{activeLoan.monthlyEMI.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Sub-Tabs: Daily Auto-Split Stream vs Monthly Historical */}
          <div className="space-y-4 pt-2">
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('daily-stream')}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
                  activeTab === 'daily-stream'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Live Daily QR Auto-Split Stream
              </button>
              <button
                onClick={() => setActiveTab('monthly-history')}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
                  activeTab === 'monthly-history'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Monthly Aggregate Statement &amp; Moratorium Log
              </button>
            </div>

            {activeTab === 'daily-stream' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Weekly Auto-Split Progress: <strong className="text-slate-900 dark:text-white font-mono">₹{totalDeductedThisWeek.toLocaleString('en-IN')}</strong> settled</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% quota achieved</span>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                      <tr>
                        <th className="py-2.5 px-4">Settlement Date</th>
                        <th className="py-2.5 px-4">Gross QR Collections</th>
                        <th className="py-2.5 px-4">Auto-Split Repayment (8%)</th>
                        <th className="py-2.5 px-4">Net Payout to Bank</th>
                        <th className="py-2.5 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                      {dailyHistory.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="py-2.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">{item.date}</td>
                          <td className="py-2.5 px-4 font-mono text-slate-900 dark:text-white">
                            ₹{item.totalQrVolume.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                            - ₹{item.autoSplitDeducted}
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{item.netMerchantPayout.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                item.status === 'Settled'
                                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                  : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              }`}
                            >
                              {item.status === 'Settled' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'monthly-history' && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    <tr>
                      <th className="py-2.5 px-4">Billing Month</th>
                      <th className="py-2.5 px-4">Installment Due</th>
                      <th className="py-2.5 px-4">Status &amp; Notes</th>
                      <th className="py-2.5 px-4">Settlement / Due Date</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {activeLoan.repaymentHistory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="py-2.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">{item.month}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white font-mono">
                          ₹{item.emiPaid.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="space-y-0.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                item.status === 'Paid'
                                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                  : item.status === 'Rescheduled'
                                  ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                  : item.status === 'Delayed'
                                  ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {item.status === 'Paid' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                              {item.status === 'Delayed' && <AlertTriangle className="w-3 h-3 text-red-500" />}
                              {item.status}
                            </span>
                            {item.note && (
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                                {item.note}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 font-mono">
                          {item.paidDate || activeLoan.nextDueDate}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {item.status === 'Upcoming' && (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenReschedule('reschedule')}
                                className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold text-[11px]"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => handleOpenReschedule('repay')}
                                className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px]"
                              >
                                Pay
                              </button>
                            </div>
                          )}
                          {item.status === 'Delayed' && (
                            <button
                              onClick={() => handleOpenReschedule('repay')}
                              className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] animate-pulse"
                            >
                              Cure Dues
                            </button>
                          )}
                          {item.status === 'Rescheduled' && (
                            <button
                              onClick={() => handleOpenReschedule('repay')}
                              className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]"
                            >
                              Pre-Pay
                            </button>
                          )}
                          {item.status === 'Paid' && (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                              Cleared
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Applications Archive Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 md:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Past Applications &amp; Submissions</h3>

        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
              <tr>
                <th className="py-2.5 px-4">Application ID</th>
                <th className="py-2.5 px-4">Purpose</th>
                <th className="py-2.5 px-4">Amount</th>
                <th className="py-2.5 px-4">Tenure</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Submission Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {applications.map((app) => (
                <tr key={app.applicationId} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">{app.applicationId}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{app.purpose}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white font-mono">
                    ₹{app.approvedAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{app.tenureMonths} Months</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        app.status === 'Disbursed' || app.status === 'Approved'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500">{app.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Reschedule & Repay Modal */}
      {activeLoan && (
        <PaymentRescheduleRepayModal
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          activeLoan={activeLoan}
          language={language}
          onLoanUpdated={(updated) => {
            onUpdateActiveLoan?.(updated);
          }}
          initialTab={modalInitialTab}
        />
      )}
    </div>
  );
};
