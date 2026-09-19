import React, { useState, useEffect } from 'react';
import { ActiveLoan, ReschedulePlan, SupportedLanguage } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  IndianRupee, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Mic, 
  RotateCcw,
  Zap,
  ArrowRight,
  BookOpen,
  Info,
  BadgePercent,
  TrendingDown,
  Building,
  Check
} from 'lucide-react';
import { 
  calculateRescheduleOptions, 
  applyReschedule, 
  curePaymentFailure 
} from '../services/rescheduleEngine';
import { speechService, speak } from '../services/speechService';
import { 
  getVoiceRescheduleAcknowledgement, 
  getVoiceCureAcknowledgement 
} from '../services/translations';

interface PaymentRescheduleRepayModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLoan: ActiveLoan;
  language: SupportedLanguage;
  onLoanUpdated: (updatedLoan: ActiveLoan) => void;
  initialTab?: 'reschedule' | 'repay' | 'rbi';
}

const RESCHEDULE_REASONS = [
  'Wholesale Inventory Stocking Advance',
  'Festival Rush Pre-Procurement',
  'Delayed Customer Khata Receivables',
  'Medical or Family Emergency',
  'Machinery or Deep-Freezer Repair',
];

export const PaymentRescheduleRepayModal: React.FC<PaymentRescheduleRepayModalProps> = ({
  isOpen,
  onClose,
  activeLoan,
  language,
  onLoanUpdated,
  initialTab = 'reschedule',
}) => {
  const [activeTab, setActiveTab] = useState<'reschedule' | 'repay' | 'rbi'>(initialTab);
  const [selectedReason, setSelectedReason] = useState<string>(RESCHEDULE_REASONS[0]);
  const [is48HoursAdvance, setIs48HoursAdvance] = useState<boolean>(true);
  const [selectedStrategyIndex, setSelectedStrategyIndex] = useState<number>(0);

  // Voice Assistant State
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceTranscriptFeedback, setVoiceTranscriptFeedback] = useState<string | null>(null);

  // Repayment Simulation State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessUTR, setPaymentSuccessUTR] = useState<string | null>(null);

  // Reschedule Confirmation state
  const [confirmedPlan, setConfirmedPlan] = useState<ReschedulePlan | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
    setPaymentSuccessUTR(null);
    setConfirmedPlan(null);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const rescheduleOptions = calculateRescheduleOptions(activeLoan, is48HoursAdvance, selectedReason);
  const selectedPlan = rescheduleOptions[selectedStrategyIndex] || rescheduleOptions[0];

  // Voice command listener to choose options
  const handleToggleVoice = () => {
    if (isVoiceListening) {
      speechService.stopListening();
      setIsVoiceListening(false);
      return;
    }

    setIsVoiceListening(true);
    setVoiceTranscriptFeedback('Listening... Say "7 days", "15 days", "daily QR", or "skip month"');

    speechService.startListening(
      language,
      (result) => {
        const text = result.transcript.toLowerCase();
        setVoiceTranscriptFeedback(`Heard: "${result.transcript}"`);

        if (text.includes('7') || text.includes('seven') || text.includes('hafta') || text.includes('saat')) {
          setSelectedStrategyIndex(0);
        } else if (text.includes('15') || text.includes('fifteen') || text.includes('pandrah') || text.includes('grace')) {
          setSelectedStrategyIndex(1);
        } else if (text.includes('daily') || text.includes('rozana') || text.includes('qr') || text.includes('har din')) {
          setSelectedStrategyIndex(2);
        } else if (text.includes('skip') || text.includes('month') || text.includes('tenure') || text.includes('mahina')) {
          setSelectedStrategyIndex(3);
        }

        if (result.isFinal) {
          setIsVoiceListening(false);
          setTimeout(() => setVoiceTranscriptFeedback(null), 3500);
        }
      },
      (err) => {
        setIsVoiceListening(false);
        setVoiceTranscriptFeedback(err);
        setTimeout(() => setVoiceTranscriptFeedback(null), 3000);
      }
    );
  };

  // Handle Reschedule Submission
  const handleConfirmReschedule = () => {
    const updated = applyReschedule(activeLoan, selectedPlan);
    onLoanUpdated(updated);
    setConfirmedPlan(selectedPlan);

    // Voice Acknowledgement
    const speechText = getVoiceRescheduleAcknowledgement(
      selectedPlan.strategyLabel,
      selectedPlan.newDueDate,
      selectedPlan.adminFee,
      language
    );
    speak(speechText, language);
  };

  // Handle Instant Payment Settlement
  const handleSettleRepayment = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      const generatedUTR = `UPI/2026/${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const updated = curePaymentFailure(activeLoan, generatedUTR);
      setIsProcessingPayment(false);
      setPaymentSuccessUTR(generatedUTR);
      onLoanUpdated(updated);

      // Voice Acknowledgement
      const speechText = getVoiceCureAcknowledgement(activeLoan.monthlyEMI, generatedUTR, language);
      speak(speechText, language);
    }, 1200);
  };

  const incident = activeLoan.failedIncident;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header with gradient flare */}
        <div className="relative bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 px-6 py-5 border-b border-slate-700/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-bold">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">Payment Reschedule &amp; Repay</h2>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    RBI Fair Lending Compliant
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Proactive short-term liquidity extensions &amp; 72-hour bounce-fee cure window
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-4 pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setActiveTab('reschedule');
                setPaymentSuccessUTR(null);
                setConfirmedPlan(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'reschedule'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Proactive Reschedule</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('repay');
                setConfirmedPlan(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
                activeTab === 'repay'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Instant Repay / Cure</span>
              {incident && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('rbi')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'rbi'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>RBI Norms &amp; Case Studies</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PROACTIVE RESCHEDULE */}
        {activeTab === 'reschedule' && (
          <div className="p-6 space-y-6">
            {confirmedPlan ? (
              /* Success Confirmation View */
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">EMI Rescheduled Successfully!</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Your automated NACH debit has been revised under RBI Fair Lending Protection.
                  </p>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs space-y-2 max-w-md mx-auto text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Strategy:</span>
                    <span className="font-bold text-white">{confirmedPlan.strategyLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Revised Due Date:</span>
                    <span className="font-bold text-emerald-400">{confirmedPlan.newDueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Accrued Simple Interest:</span>
                    <span className="text-slate-200 font-mono">₹{confirmedPlan.accruedInterest} (Zero Penal Interest)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Admin Processing Fee:</span>
                    <span className="text-slate-200 font-mono">₹{confirmedPlan.adminFee}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800">
                    <span className="text-slate-300 font-semibold">CIBIL Bureau Impact:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {confirmedPlan.cibilImpact}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Configuration & Strategy Cards */
              <>
                {/* Voice Selection Assistant Banner */}
                <div className="flex items-center justify-between bg-slate-800/80 border border-amber-500/30 rounded-2xl p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block">Voice Moratorium Assistant</span>
                      <span className="text-[11px] text-slate-400">
                        {voiceTranscriptFeedback || 'Tap mic and say "7 days extend karo" or "Convert to daily QR"'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isVoiceListening
                        ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/30'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isVoiceListening ? 'Listening...' : 'Voice Select'}</span>
                  </button>
                </div>

                {/* Reason & Notice Period Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Reason for Cash Flow Buffer
                    </label>
                    <select
                      value={selectedReason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                    >
                      {RESCHEDULE_REASONS.map((r) => (
                        <option key={r} value={r} className="bg-slate-900">
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Advance Request Notice</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        {is48HoursAdvance ? '₹0 Admin Fee on 7-Day' : 'Standard Tier'}
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setIs48HoursAdvance(true)}
                        className={`py-1 text-xs font-medium rounded-lg transition-all ${
                          is48HoursAdvance
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        &ge; 48h in Advance
                      </button>
                      <button
                        type="button"
                        onClick={() => setIs48HoursAdvance(false)}
                        className={`py-1 text-xs font-medium rounded-lg transition-all ${
                          !is48HoursAdvance
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        &lt; 48h Notice
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4 Strategy Comparison Cards */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Select Fair-Lending Moratorium Option
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {rescheduleOptions.map((opt, idx) => {
                      const isSelected = selectedStrategyIndex === idx;
                      return (
                        <div
                          key={opt.strategy}
                          onClick={() => setSelectedStrategyIndex(idx)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                            isSelected
                              ? 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/10'
                              : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <span className="font-bold text-sm text-white block">
                                {opt.strategyLabel}
                              </span>
                              <span className="text-[11px] text-amber-400/90 font-medium">
                                Revised: {opt.newDueDate}
                              </span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-700'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>

                          <div className="space-y-1 text-[11px] text-slate-300 pt-2 border-t border-slate-800/80">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Admin Fee:</span>
                              <span className="font-semibold text-slate-200">
                                {opt.adminFee === 0 ? <span className="text-emerald-400 font-bold">₹0 (Free)</span> : `₹${opt.adminFee}`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Accrued Interest:</span>
                              <span className="font-semibold text-slate-200">₹{opt.accruedInterest}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Penal Fee:</span>
                              <span className="text-emerald-400 font-bold">₹0 (RBI Protected)</span>
                            </div>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 truncate max-w-[170px]">{opt.rbiComplianceNote}</span>
                            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" />
                              Zero CIBIL Hit
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div className="text-xs">
                    <span className="text-slate-400 block">Total Due on New Date:</span>
                    <span className="text-base font-bold text-emerald-400">
                      ₹{selectedPlan.totalDueOnNewDate.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmReschedule}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>Confirm Reschedule</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: INSTANT REPAY & CURE FAILURE */}
        {activeTab === 'repay' && (
          <div className="p-6 space-y-6">
            {paymentSuccessUTR ? (
              /* Payment Success Receipt */
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Payment Received &amp; Account Cured!</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Your installment of ₹{activeLoan.monthlyEMI.toLocaleString('en-IN')} has been settled in real-time.
                  </p>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs space-y-2 max-w-md mx-auto text-left font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Bank Reference UTR:</span>
                    <span className="font-bold text-emerald-400">{paymentSuccessUTR}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Late Penal Fee:</span>
                    <span className="text-emerald-400 font-sans font-bold">₹0 (100% Waived)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Account Standing:</span>
                    <span className="text-emerald-400 font-sans font-bold">Regular / Current</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              /* Incident Banner & UPI QR Generator */
              <>
                {incident ? (
                  <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shrink-0 mt-0.5">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-bold text-sm text-red-200">
                          Automated Debit Interrupted ({incident.failureReason})
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          72h No-Penalty Buffer Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        {incident.failureDescription}
                      </p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2 flex-wrap">
                        <span>Failed on: <strong className="text-slate-200">{incident.failedAt}</strong></span>
                        <span>Cure buffer expires: <strong className="text-amber-400">{incident.curePeriodExpiresAt}</strong></span>
                        <span className="text-emerald-400 font-semibold">Standard ₹450 late fee: 100% Waived</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Upcoming Monthly Installment</span>
                      <span className="text-[11px] text-slate-400">Regular automated debit due on {activeLoan.nextDueDate}</span>
                    </div>
                    <span className="text-base font-black text-emerald-400">
                      ₹{activeLoan.monthlyEMI.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {/* Instant Dynamic UPI Repayment QR Card */}
                <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
                  {/* Dynamic QR Code Simulation */}
                  <div className="p-3 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center shrink-0">
                    <div className="w-36 h-36 bg-slate-100 rounded-lg flex items-center justify-center p-2 relative">
                      {/* Simulated QR Pattern */}
                      <QrCode className="w-32 h-32 text-slate-900" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                          ₹
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono mt-1.5">Scan with any UPI App</span>
                  </div>

                  {/* Payment Breakdown & Multi-app triggers */}
                  <div className="flex-1 w-full space-y-3">
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Installment Amount:</span>
                        <span className="font-bold text-white">₹{activeLoan.monthlyEMI.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Late Penalty Fee:</span>
                        <span className="text-emerald-400 font-bold">
                          <span className="line-through text-slate-500 mr-1.5">₹450</span>
                          ₹0 (Waived)
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-800">
                        <span className="text-slate-300 font-bold">Total to Settle:</span>
                        <span className="text-base font-black text-emerald-400">
                          ₹{activeLoan.monthlyEMI.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] text-slate-400 block mb-1.5 uppercase tracking-wider font-semibold">
                        Instant Multi-Channel UPI Clearance
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {['Paytm UPI', 'PhonePe', 'Google Pay', 'BHIM UPI'].map((app) => (
                          <span key={app} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSettleRepayment}
                      disabled={isProcessingPayment}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    >
                      {isProcessingPayment ? (
                        <span>Simulating Instant Clearance...</span>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>Pay ₹{activeLoan.monthlyEMI.toLocaleString('en-IN')} Now (Instant Cure)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 3: RBI NORMS & CASE STUDIES */}
        {activeTab === 'rbi' && (
          <div className="p-6 space-y-5">
            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm mb-1">
                <ShieldCheck className="w-4 h-4" />
                RBI Fair Lending Directive on Moratoriums &amp; Penal Charges (2024)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Under Reserve Bank of India (RBI) Fair Lending Guidelines, regulated NBFCs and Digital Lending Apps (DLAs) must not levy exorbitant penal compounding on micro-merchants experiencing short-term liquidity distress. Lenders are mandated to offer transparent simple-interest daily extensions and a 72-hour cure buffer before reporting delinquencies.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Real-World Bharat Merchant Case Studies
              </h4>

              {/* Case Study 1 */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">Ramesh Kumar (Kirana Store, Kanpur)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                      7-Day Sachet Moratorium
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">Saved ₹850 in Penal Fees</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ramesh had ordered ₹1.2L of Diwali inventory stock, leaving his bank balance tight 2 days before his ₹12,500 EMI debit. Instead of suffering a bank bounce charge (₹450) + lender penal fee (₹400), he requested a 7-day sachet extension in Hindi. He paid just ₹62 in simple accrued interest, protected his 780 CIBIL score, and cleared the loan once festival sales kicked in.
                </p>
              </div>

              {/* Case Study 2 */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">Mohammed Farooq (QSR Stall, Hyderabad)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold">
                      Daily QR Catch-Up
                    </span>
                  </div>
                  <span className="text-xs font-bold text-sky-400">Zero Month-End Cash Stress</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  After experiencing a brief lull in evening footfall, Farooq avoided a lump-sum ₹13,500 debit by converting the month's repayment into 30 daily ₹450 micro-splits from his Paytm QR soundbox sweeps. His supplier working capital stayed fluid throughout the month.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTab('reschedule')}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Back to Reschedule
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
