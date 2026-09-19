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
  QrCode
} from 'lucide-react';
import { Merchant, SupportedLanguage } from '../types';
import { speechService } from '../services/speechService';
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
}) => {
  const [selectedEngine, setSelectedEngine] = useState<'sarvam' | 'gemini' | 'deterministic'>(activeEngine);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Extracted and calculated state
  const [loanAmount, setLoanAmount] = useState<number>(150000);
  const [loanPurpose, setLoanPurpose] = useState<string>('Festival Stock & Inventory Expansion');
  const [insuranceSelected, setInsuranceSelected] = useState<boolean>(true);

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
        },
        () => {
          setIsRecording(false);
        }
      );
    }
  };

  const handleRunFlow = async (textToProcess?: string) => {
    const text = textToProcess || inputText || 'Mujhe 2 lakh ka inventory loan chahiye Diwali ke liye';
    setInputText(text);
    setIsProcessing(true);
    setCurrentStep(1);

    // Parse amount from text if present
    const matchedNum = text.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lakh|lac|k|thousand|rupee|rs)?/i);
    if (text.toLowerCase().includes('2 lakh') || text.toLowerCase().includes('2l')) {
      setLoanAmount(200000);
      setLoanPurpose('Festival Stocking & Bulk Inventory');
    } else if (text.toLowerCase().includes('1 lakh') || text.toLowerCase().includes('1l')) {
      setLoanAmount(100000);
      setLoanPurpose('Equipment Purchase & Store Upgrade');
    } else if (text.toLowerCase().includes('80000') || text.toLowerCase().includes('80k')) {
      setLoanAmount(80000);
      setLoanPurpose('Emergency Working Capital & Medicine Stock');
    } else if (matchedNum) {
      const val = parseFloat(matchedNum[1].replace(/,/g, ''));
      if (text.toLowerCase().includes('lakh') || text.toLowerCase().includes('lac')) {
        setLoanAmount(val * 100000);
      } else if (val < 1000) {
        setLoanAmount(val * 100000);
      } else {
        setLoanAmount(val);
      }
    }

    // Step 1: NLP Extraction
    await new Promise((r) => setTimeout(r, 600));
    setCurrentStep(2);

    // Step 2: Account Aggregator Telemetry
    await new Promise((r) => setTimeout(r, 700));
    setCurrentStep(3);

    // Step 3: Dynamic Underwriting
    await new Promise((r) => setTimeout(r, 700));
    setCurrentStep(4);

    // Step 4: Sachet Insurance Tailoring
    await new Promise((r) => setTimeout(r, 600));
    setCurrentStep(5);

    // Step 5: Key Fact Statement & RBI Consent
    await new Promise((r) => setTimeout(r, 600));
    setCurrentStep(6);
    setIsProcessing(false);
  };

  const handleConfirmDisbursement = () => {
    onCompleteFlow?.(loanAmount, loanPurpose);
    onClose();
  };

  const steps = [
    {
      step: 1,
      title: 'Spoken Request & NLP Parsing',
      desc: 'Alley Indic Voice Agent parses vernacular prompt & intent',
      icon: Mic,
      status: currentStep >= 1 ? 'completed' : 'pending',
    },
    {
      step: 2,
      title: 'Account Aggregator Telemetry',
      desc: 'Real-time GSTN, UPI velocity & cashflow validation',
      icon: Building2,
      status: currentStep >= 2 ? 'completed' : 'pending',
    },
    {
      step: 3,
      title: 'Dynamic Underwriting & Limit Calculation',
      desc: `Sanction formulated up to ₹${maxLoanLimit.toLocaleString('en-IN')} @ ${interestRate}% p.a.`,
      icon: Cpu,
      status: currentStep >= 3 ? 'completed' : 'pending',
    },
    {
      step: 4,
      title: 'Embedded Sachet Micro-Insurance',
      desc: `Kirana Dukan Suraksha & Hospicash auto-bundled at ₹7/day`,
      icon: ShieldCheck,
      status: currentStep >= 4 ? 'completed' : 'pending',
    },
    {
      step: 5,
      title: 'Key Facts Statement (KFS) & RBI Consent',
      desc: 'Transparent APR, 0 hidden fees, digital consent verification',
      icon: FileCheck2,
      status: currentStep >= 5 ? 'completed' : 'pending',
    },
    {
      step: 6,
      title: 'Disbursement & Auto-Split NACH Settlement',
      desc: `Instant credit to bank + ₹${dailyDeduction}/day (${autoSplitPct}% QR split)`,
      icon: Zap,
      status: currentStep >= 6 ? 'completed' : 'pending',
    },
  ];

  return (
    <div
      id="alley-flow-console-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        className={`bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col w-full transition-all duration-300 ${
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
                <span className="font-extrabold text-lg tracking-tight">Alley Indic Voice & Process Console</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Flow
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-End Voice Underwriting, Sachet Insurance & Daily Repayment Lifecycle
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
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              id="btn-close-alley-flow"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-900/40 transition-colors"
              title="Close Console"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Console Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          
          {/* Interactive Input & Trigger Stage */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Talk with Alley or Enter Spoken Prompt</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Language: {language}
                </span>
              </div>

              {/* AI Core Dropdown near text area */}
              <div className="flex items-center gap-2 flex-wrap">
                <label htmlFor="alley-modal-ai-core" className="text-xs font-bold text-slate-700 flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Core:</span>
                </label>
                <select
                  id="alley-modal-ai-core"
                  value={selectedEngine}
                  onChange={(e) => handleEngineChange(e.target.value as any)}
                  className="bg-white text-slate-900 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs cursor-pointer"
                >
                  <option value="sarvam">⚡ Sarvam Indic LLM</option>
                  <option value="gemini">✦ Gemini 2.5</option>
                  <option value="deterministic">⚙️ Rule-Engine</option>
                </select>

                {selectedEngine === 'sarvam' && (
                  <span className="text-[10px] text-amber-800 font-semibold px-2 py-1 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center gap-1">
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
                  placeholder="Tell Alley what you need... (e.g. Mujhe 2 lakh ka loan chahiye Diwali stock ke liye)"
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/60 focus:bg-white resize-none"
                />
              </div>

              <div className="flex sm:flex-col gap-2">
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-700" />}
                  <span>{isRecording ? 'Listening...' : 'Voice Mic'}</span>
                </button>

                <button
                  id="btn-run-alley-flow"
                  type="button"
                  onClick={() => handleRunFlow()}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Execute Full Flow</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Instant Scenarios */}
            <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Triggers:</span>
              <button
                type="button"
                onClick={() => handleRunFlow('Mujhe 2 lakh chahiye Diwali ke liye stock kharidne.')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 transition-colors text-[11px] font-medium"
              >
                Diwali Stock (₹2,00,000)
              </button>
              <button
                type="button"
                onClick={() => handleRunFlow('Nange bakery oven repair madoke 1 lakh beku.')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 transition-colors text-[11px] font-medium"
              >
                Bakery Upgrade (₹1,00,000)
              </button>
              <button
                type="button"
                onClick={() => handleRunFlow('Mujhe 80000 emergency medicine stock ke liye chahiye.')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 transition-colors text-[11px] font-medium"
              >
                Emergency Working Capital (₹80,000)
              </button>
            </div>
          </div>

          {/* Process Flow Stages */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Alley Step-by-Step FinTech Process Tracker</span>
                <span className="text-xs font-semibold text-slate-500">
                  (Stage {currentStep} of 6)
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {steps.map((s) => {
                const Icon = s.icon;
                const isCurrent = currentStep === s.step;
                const isPassed = currentStep > s.step;
                return (
                  <div
                    key={s.step}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-emerald-50/90 border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                        : isPassed
                        ? 'bg-white border-slate-200 shadow-2xs'
                        : 'bg-slate-100/60 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isCurrent
                              ? 'bg-emerald-600 text-white'
                              : isPassed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : s.step}
                        </div>
                        <span className="font-bold text-xs text-slate-900">{s.title}</span>
                      </div>
                      <Icon className={`w-4 h-4 ${isCurrent ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Outcome / Decision Card when ready */}
          {currentStep >= 5 && (
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                    Sanction Formulation & Key Facts
                  </div>
                  <div className="text-xl font-black mt-0.5">
                    ₹{loanAmount.toLocaleString('en-IN')} Working Capital Sanctioned
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    Zero Prepayment Penalty
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
                    Daily NACH Auto-Split
                  </span>
                </div>
              </div>

              {/* Financial Breakdown Grid */}
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>RBI Compliant • 100% Digital Consent & Real-time Core Banking Disbursal</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                  >
                    Close
                  </button>
                  <button
                    id="btn-alley-confirm-disbursement"
                    type="button"
                    onClick={handleConfirmDisbursement}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Confirm & Disburse Capital</span>
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
