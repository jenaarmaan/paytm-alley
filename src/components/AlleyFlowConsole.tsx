import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  Shield,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  CreditCard,
  Building2,
  Lock,
  Cpu,
  RefreshCw,
  X,
  Maximize2,
  Minimize2,
  Volume2,
  Store,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  QrCode,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { Merchant, SupportedLanguage, UnifiedFinTechIntent, FinTechServiceCategory } from '../types';
import { speechService } from '../services/speechService';
import { apiClient } from '../services/apiClient';
import { calculateDynamicInterestRate, calculateMaxLoanAmount, calculateRepaymentCapacity } from '../services/financialEngine';

interface AlleyFlowConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  activeMerchant: Merchant;
  language: SupportedLanguage;
  onSelectLanguage?: (lang: SupportedLanguage) => void;
  onCompleteFlow?: (loanAmount: number, purpose: string) => void;
  activeEngine?: 'sarvam' | 'gemini' | 'deterministic';
  onChangeEngine?: (engine: 'sarvam' | 'gemini' | 'deterministic') => void;
  onNavigateToView?: (view: string) => void;
}

export const AlleyFlowConsole: React.FC<AlleyFlowConsoleProps> = ({
  isOpen,
  onClose,
  activeMerchant,
  language,
  onSelectLanguage,
  onCompleteFlow,
  activeEngine = 'sarvam',
  onChangeEngine,
  onNavigateToView,
}) => {
  const [selectedEngine, setSelectedEngine] = useState<'sarvam' | 'gemini' | 'deterministic'>(activeEngine);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Unified FinTech Result State
  const [unifiedResult, setUnifiedResult] = useState<UnifiedFinTechIntent | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Extracted and calculated state for Loans
  const [loanAmount, setLoanAmount] = useState<number>(5000);
  const [loanPurpose, setLoanPurpose] = useState<string>('Operational Working Capital');

  // Sync engine
  useEffect(() => {
    setSelectedEngine(activeEngine);
  }, [activeEngine]);

  if (!isOpen) return null;

  const handleEngineChange = (e: 'sarvam' | 'gemini' | 'deterministic') => {
    setSelectedEngine(e);
    onChangeEngine?.(e);
  };

  const maxLoanLimit = calculateMaxLoanAmount(activeMerchant, 6);
  const interestRate = calculateDynamicInterestRate(activeMerchant);

  const tenureMonths = 6;
  const monthlyInterestRate = interestRate / 12 / 100;
  const emi = Math.round(
    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) /
    (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1)
  );
  const dailyDeduction = Math.round(emi / 30);
  const dailySales = Math.max(1000, Math.round(activeMerchant.monthlySales / 30));
  const autoSplitPct = Math.min(15, Math.max(5, Math.round((dailyDeduction / dailySales) * 100)));

  const handleToggleVoice = () => {
    if (isRecording) {
      speechService.stopListening();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      speechService.startListening(
        language,
        (text) => {
          setInputText(text);
          setIsRecording(false);
          handleRunFlow(text);
        },
        () => {
          setIsRecording(false);
        }
      );
    }
  };

  const handleRunFlow = async (textToProcess?: string) => {
    const text = textToProcess || inputText || 'Mujhe 5000 ka sachet loan chahiye inventory ke liye';
    setInputText(text);
    setIsProcessing(true);
    setActionSuccessMessage(null);
    setCurrentStep(1);

    // Call unified omnichannel NLP router
    const intent = await apiClient.extractUnifiedIntent(text, language, selectedEngine);
    setUnifiedResult(intent);

    if (intent.amount) {
      setLoanAmount(intent.amount);
    }
    if (intent.purpose) {
      setLoanPurpose(intent.purpose);
    }

    // Speak audio feedback in merchant's language
    if (intent.spokenResponse) {
      speechService.speak(intent.spokenResponse, language);
    }

    // Step 1: NLP Extraction & Intent Slotting
    await new Promise((r) => setTimeout(r, 500));
    setCurrentStep(2);

    // Step 2: Account Aggregator / FinTech Telemetry
    await new Promise((r) => setTimeout(r, 600));
    setCurrentStep(3);

    // Step 3: Domain Underwriting & Rule Validation
    await new Promise((r) => setTimeout(r, 600));
    setCurrentStep(4);

    // Step 4: Product Configuration & Safety Checks
    await new Promise((r) => setTimeout(r, 500));
    setCurrentStep(5);

    // Step 5: Final KFS / Policy / Consent Generation
    await new Promise((r) => setTimeout(r, 500));
    setCurrentStep(6);
    setIsProcessing(false);
  };

  const handleExecuteAction = () => {
    if (!unifiedResult) return;

    if (unifiedResult.category === 'loan_request') {
      onCompleteFlow?.(loanAmount, loanPurpose);
      onClose();
    } else if (unifiedResult.category === 'insurance_enrollment') {
      setActionSuccessMessage('Sachet Insurance Policy Activated! Micro-deduction configured at ₹7/day.');
    } else if (unifiedResult.category === 'insurance_claim') {
      setActionSuccessMessage('Insurance Claim Submitted! TPA direct bank transfer initiated (ETA 24h).');
    } else if (unifiedResult.category === 'payment_reschedule') {
      setActionSuccessMessage(`Moratorium Activated! Upcoming EMI postponed by ${unifiedResult.rescheduleDays || 7} days under RBI Fair Lending Directives.`);
    } else if (unifiedResult.category === 'instant_repay') {
      setActionSuccessMessage('UPI QR Dynamic Payment Gateway Opened! 100% bounce-fee waiver applied.');
    } else {
      setActionSuccessMessage('Request executed successfully with zero-touch compliance.');
    }
  };

  const stepsForCategory: Record<FinTechServiceCategory, { step: number; title: string; desc: string; icon: any }[]> = {
    loan_request: [
      { step: 1, title: 'Spoken Request & Indic NLP', desc: 'Alley parses requested amount & loan use case', icon: Mic },
      { step: 2, title: 'Account Aggregator Telemetry', desc: 'Live GSTN & UPI velocity validation', icon: Building2 },
      { step: 3, title: 'Dynamic Underwriting & Limits', desc: `Sanction formulated up to ₹${maxLoanLimit.toLocaleString('en-IN')} @ ${interestRate}% p.a.`, icon: Cpu },
      { step: 4, title: 'Embedded Sachet Insurance', desc: 'Shop Suraksha & Hospicash auto-bundled at ₹7/day', icon: ShieldCheck },
      { step: 5, title: 'Key Facts Statement (KFS)', desc: 'Transparent APR, 0 hidden fees & digital consent', icon: FileCheck2 },
      { step: 6, title: 'Disbursement & Auto-Split', desc: `Instant payout + ₹${dailyDeduction}/day (${autoSplitPct}% QR split)`, icon: Zap },
    ],
    insurance_enrollment: [
      { step: 1, title: 'Voice Request & Product Match', desc: 'Alley matches merchant profile to optimal sachet insurance', icon: Mic },
      { step: 2, title: 'Risk & Inventory Assessment', desc: `Calibrated to ₹${(activeMerchant.monthlySales * 2).toLocaleString('en-IN')} shop inventory cover`, icon: Building2 },
      { step: 3, title: 'Micro-Premium Formulation', desc: '₹7/day bite-sized auto-split deduction configured', icon: Cpu },
      { step: 4, title: 'Underwriter Integration', desc: 'Samriddhi General Insurance API handshake verified', icon: ShieldCheck },
      { step: 5, title: 'Digital Policy Issuance', desc: 'Instant certificate generation with QR authentication', icon: FileCheck2 },
      { step: 6, title: 'Active Policy Protection', desc: 'Shop fire, theft & hospital cash cover live', icon: Zap },
    ],
    insurance_claim: [
      { step: 1, title: 'Express Claim Logging', desc: 'Voice transcript parsed into incident report', icon: Mic },
      { step: 2, title: 'Policy Verification', desc: 'Active policy coverage & incident date verified', icon: Building2 },
      { step: 3, title: 'Fast-Track TPA Assessment', desc: 'Automated claim triage & document waiver (< ₹1 Lakh)', icon: Cpu },
      { step: 4, title: 'Fraud & ZK Audit', desc: 'Cryptographic proof of active shop transaction history', icon: ShieldCheck },
      { step: 5, title: 'Claim Approval', desc: 'Sanctioned for direct escrow settlement', icon: FileCheck2 },
      { step: 6, title: 'Bank Payout Disbursement', desc: '24-hour IMPS credit to merchant current account', icon: Zap },
    ],
    payment_reschedule: [
      { step: 1, title: 'Proactive Moratorium Request', desc: 'Merchant requests cashflow extension prior to debit', icon: Mic },
      { step: 2, title: 'Fair Lending Assessment', desc: 'Zero penal charge calculation under RBI directives', icon: Building2 },
      { step: 3, title: 'Daily Accrued Interest Math', desc: 'Simple daily interest calculation with 0 penalty', icon: Cpu },
      { step: 4, title: 'NPCI NACH Mandate Update', desc: 'Scheduled debit window paused on banking rail', icon: ShieldCheck },
      { step: 5, title: 'Revised Schedule Issuance', desc: 'Updated payment calendar generated and timestamped', icon: FileCheck2 },
      { step: 6, title: 'CIBIL Safe Moratorium Live', desc: 'Active credit score protected with 0 adverse reporting', icon: Zap },
    ],
    instant_repay: [
      { step: 1, title: 'Repayment Voice Trigger', desc: 'Instant cure requested for pending or failed installment', icon: Mic },
      { step: 2, title: 'Fee Waiver Application', desc: '100% bounce-fee waiver applied automatically', icon: Building2 },
      { step: 3, title: 'Dynamic UPI QR Generation', desc: 'Generates secure NPCI-compliant payment intent', icon: Cpu },
      { step: 4, title: 'Bank Gateway Verification', desc: 'Direct merchant-to-escrow settlement rail', icon: ShieldCheck },
      { step: 5, title: 'Instant Receipt Issuance', desc: 'Digital receipt generated with unique UTR number', icon: FileCheck2 },
      { step: 6, title: 'Credit Bureau Clearance', desc: 'Real-time ledger reconciliation with zero delay', icon: Zap },
    ],
    business_health_inquiry: [
      { step: 1, title: 'Diagnostic Voice Request', desc: 'Merchant requests comprehensive credit score review', icon: Mic },
      { step: 2, title: 'AA Telemetry Ingestion', desc: 'GSTN turnover, daily UPI inflow & expense analysis', icon: Building2 },
      { step: 3, title: 'DSCR & Capacity Scoring', desc: 'Debt Service Coverage Ratio computed at 2.8x', icon: Cpu },
      { step: 4, title: 'Credit Limit Benchmarking', desc: 'Credit headroom benchmarked across peer merchants', icon: ShieldCheck },
      { step: 5, title: 'Recommendations Formulated', desc: 'Identified opportunities to reduce interest rate by 1.5%', icon: FileCheck2 },
      { step: 6, title: 'Health Report Dispatched', desc: 'Live report ready with instant loan pre-approvals', icon: Zap },
    ],
    ledger_balance_inquiry: [
      { step: 1, title: 'Ledger Voice Inquiry', desc: 'Merchant queries balance & settlement deduction status', icon: Mic },
      { step: 2, title: 'Core Banking Reconciliation', desc: 'Live query to NBFC loan ledger database', icon: Building2 },
      { step: 3, title: 'Daily Settlement Audit', desc: 'Verified today auto-split deduction and net payout', icon: Cpu },
      { step: 4, title: 'Outstanding Balance Sync', desc: 'Total principal remaining calculated accurately', icon: ShieldCheck },
      { step: 5, title: 'Statement Generation', desc: 'Detailed statement prepared for merchant view', icon: FileCheck2 },
      { step: 6, title: 'Audio Summary Spoken', desc: 'Alley speaks balance summary in chosen language', icon: Zap },
    ],
    general_inquiry: [
      { step: 1, title: 'Voice Query Ingestion', desc: 'Alley Indic AI parses vernacular question', icon: Mic },
      { step: 2, title: 'Knowledge Base Retrieval', desc: 'Queries RBI regulations & platform rules', icon: Building2 },
      { step: 3, title: 'Intent Classification', desc: 'Routes query to correct domain module', icon: Cpu },
      { step: 4, title: 'Response Formulation', desc: 'Creates simple, non-jargon Indic explanation', icon: ShieldCheck },
      { step: 5, title: 'Compliance Verification', desc: 'Ensures zero misleading financial advice', icon: FileCheck2 },
      { step: 6, title: 'Spoken Output Delivered', desc: 'Alley delivers voice answer with action links', icon: Zap },
    ],
  };

  const currentCategory = unifiedResult?.category || 'loan_request';
  const currentSteps = stepsForCategory[currentCategory] || stepsForCategory.loan_request;

  return (
    <div
      id="alley-flow-console-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col w-full transition-all duration-300 ${
          isFullscreen
            ? 'h-full max-h-[98vh] max-w-[98vw]'
            : 'max-w-5xl max-h-[92vh]'
        } overflow-hidden`}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md text-slate-950 font-black">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight">Alley • Omnichannel Indic FinTech AI Agent</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Unified Core
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Single Point of Contact for Loans, Insurance, Rescheduling, Claims &amp; Health Diagnostics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Merchant info pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
              <Store className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-200 font-semibold">{activeMerchant.businessName}</span>
              <span className="text-slate-400 font-mono">({activeMerchant.location})</span>
            </div>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              id="btn-close-alley-flow"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-900/40 transition-colors cursor-pointer"
              title="Close Console"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Console Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/40">
          
          {/* Interactive Unified Input Stage */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Ask Alley for ANY FinTech Service (Loan, Insurance, Repayment, Claim)</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {language}
                </span>
              </div>

              {/* AI Core Dropdown near text area */}
              <div className="flex items-center gap-2 flex-wrap">
                <label htmlFor="alley-modal-ai-core" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Core:</span>
                </label>
                <select
                  id="alley-modal-ai-core"
                  value={selectedEngine}
                  onChange={(e) => handleEngineChange(e.target.value as any)}
                  className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs cursor-pointer"
                >
                  <option value="sarvam">⚡ Sarvam Indic LLM</option>
                  <option value="gemini">✦ Gemini 2.5</option>
                  <option value="deterministic">⚙️ Rule-Engine</option>
                </select>

                {selectedEngine === 'sarvam' && (
                  <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800 flex items-center gap-1">
                    <span>Powered by Sarvam AI Indic Sovereign Stack</span>
                  </span>
                )}
              </div>
            </div>

            {/* Input Row */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <textarea
                  id="alley-modal-prompt-input"
                  rows={2}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Speak or type in your language... (e.g. 'Mujhe 5000 ka loan chahiye', 'Dukan ka bima activate karo', 'EMI 5 din postpone kardo')"
                  className="w-full px-4 py-3 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/60 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 resize-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex sm:flex-col gap-2">
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />}
                  <span>{isRecording ? 'Listening...' : 'Voice Mic'}</span>
                </button>

                <button
                  id="btn-run-alley-flow"
                  type="button"
                  onClick={() => handleRunFlow()}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Alley is thinking...</span>
                    </>
                  ) : (
                    <>
                      <span>Ask Alley</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Omnichannel Quick FinTech Service Chips */}
            <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Omnichannel Triggers:</span>
              <button
                type="button"
                onClick={() => handleRunFlow('Mujhe 5000 ka sachet loan chahiye inventory ke liye')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-900 border border-slate-200 dark:border-slate-700 transition-colors text-[11px] font-bold"
              >
                💰 Loan: ₹5K Sachet Stock
              </button>
              <button
                type="button"
                onClick={() => handleRunFlow('Mujhe 2 lakh chahiye Diwali stock ke liye')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-900 border border-slate-200 dark:border-slate-700 transition-colors text-[11px] font-medium"
              >
                💰 Loan: ₹2L Festive Stock
              </button>
              <button
                type="button"
                onClick={() => handleRunFlow('Kirana dukaan ka bima activate karo')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-900 border border-slate-200 dark:border-slate-700 transition-colors text-[11px] font-medium"
              >
                🛡️ Insurance: Enroll Kirana Suraksha
              </button>
              <button
                type="button"
                onClick={() => handleRunFlow('Supplier payment hold hai meri EMI 7 din postpone kardo')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 hover:text-amber-900 border border-slate-200 dark:border-slate-700 transition-colors text-[11px] font-medium"
              >
                ⚡ Reschedule: 7-Day Moratorium
              </button>
              <button
                type="button"
                onClick={() => handleRunFlow('Dukaan me chori ho gayi 50000 ka nuksan claim file karo')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-700 dark:text-slate-300 hover:text-rose-900 border border-slate-200 dark:border-slate-700 transition-colors text-[11px] font-medium"
              >
                📋 Claim: ₹50K Theft Claim
              </button>
              <button
                type="button"
                onClick={() => handleRunFlow('Mera business credit health aur CIBIL score batao')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/60 text-slate-700 dark:text-slate-300 hover:text-sky-900 border border-slate-200 dark:border-slate-700 transition-colors text-[11px] font-medium"
              >
                📈 Health: Credit &amp; DSCR Score
              </button>
            </div>
          </div>

          {/* Unified Process Flow Tracker */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Alley Process Orchestration: {unifiedResult?.serviceTitle || 'Working Capital & Micro-Credit'}</span>
                <span className="text-xs font-semibold text-slate-500">
                  (Stage {currentStep} of 6)
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {currentSteps.map((s) => {
                const Icon = s.icon;
                const isCurrent = currentStep === s.step;
                const isPassed = currentStep > s.step;
                return (
                  <div
                    key={s.step}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                        : isPassed
                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                        : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isCurrent
                              ? 'bg-emerald-600 text-white'
                              : isPassed
                              ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" /> : s.step}
                        </div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{s.title}</span>
                      </div>
                      <Icon className={`w-4 h-4 ${isCurrent ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Outcome Card for All FinTech Domains */}
          {currentStep >= 5 && (
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 space-y-4 animate-in fade-in duration-300">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                    Alley FinTech Resolution • {unifiedResult?.serviceTitle || 'Credit Sanction'}
                  </div>
                  <div className="text-xl font-black mt-0.5">
                    {unifiedResult?.summary || `₹${loanAmount.toLocaleString('en-IN')} Working Capital Sanctioned`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    100% Digital Execution
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
                    RBI Fair Lending Compliant
                  </span>
                </div>
              </div>

              {/* Dynamic Financial Metrics Based on Intent */}
              {currentCategory === 'loan_request' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Interest Rate</span>
                    <span className="text-sm font-extrabold text-white mt-0.5 block">{interestRate}% p.a.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Monthly EMI</span>
                    <span className="text-sm font-extrabold text-white mt-0.5 block">₹{emi.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Daily QR Auto-Split</span>
                    <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block">
                      ₹{dailyDeduction}/day ({autoSplitPct}%)
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Sachet Insurance</span>
                    <span className="text-sm font-extrabold text-sky-400 mt-0.5 block">₹7/day Bundled</span>
                  </div>
                </div>
              )}

              {currentCategory === 'payment_reschedule' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Moratorium Duration</span>
                    <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block">{unifiedResult?.rescheduleDays || 7} Days</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Penal Charges</span>
                    <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block">₹0.00 (Waived)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Credit Bureau Hit</span>
                    <span className="text-sm font-extrabold text-sky-400 mt-0.5 block">Zero Impact (Safe)</span>
                  </div>
                </div>
              )}

              {currentCategory === 'insurance_claim' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Claimed Sum</span>
                    <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block">₹{(unifiedResult?.amount || 50000).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">TPA Verification</span>
                    <span className="text-sm font-extrabold text-sky-400 mt-0.5 block">Fast-Track (24h)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Payout Mode</span>
                    <span className="text-sm font-extrabold text-white mt-0.5 block">Direct IMPS Bank Transfer</span>
                  </div>
                </div>
              )}

              {currentCategory === 'insurance_enrollment' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Coverage Sum</span>
                    <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block">₹3,00,000</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Daily Premium</span>
                    <span className="text-sm font-extrabold text-sky-400 mt-0.5 block">₹7/day Auto-Split</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Policy Status</span>
                    <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block">Instant QR Binding</span>
                  </div>
                </div>
              )}

              {actionSuccessMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold">{actionSuccessMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified with Zero-Knowledge Consent &amp; NBFC Escrow Routing</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    id="btn-alley-confirm-action"
                    type="button"
                    onClick={handleExecuteAction}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{unifiedResult?.suggestedActionLabel || 'Confirm & Disburse Capital'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
