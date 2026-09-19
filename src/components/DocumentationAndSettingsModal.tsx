import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Settings,
  Users,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Volume2,
  Sparkles,
  Cpu,
  RefreshCw,
  Building2,
  ExternalLink,
  Store,
  MapPin,
  QrCode,
  BadgeCheck,
  Layers,
  ArrowRight,
  UserPlus,
  Lock,
  FileCheck2,
  Code
} from 'lucide-react';
import { Merchant, SupportedLanguage } from '../types';
import { apiClient } from '../services/apiClient';

interface DocumentationAndSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'personas' | 'settings' | 'documentation' | 'rails';
  merchants: Record<string, Merchant>;
  activeMerchantId: string;
  onSelectMerchant: (merchantId: string) => void;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  autoVoiceEnabled: boolean;
  onToggleAutoVoice: () => void;
  activeEngine: 'sarvam' | 'gemini' | 'deterministic';
  onChangeEngine: (engine: 'sarvam' | 'gemini' | 'deterministic') => void;
  onOpenOnboarding: () => void;
  onStartVoiceLoanWithPrompt?: (prompt: string, lang?: SupportedLanguage) => void;
  onOpenCapitalRails?: () => void;
}

export const DocumentationAndSettingsModal: React.FC<DocumentationAndSettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'personas',
  merchants,
  activeMerchantId,
  onSelectMerchant,
  selectedLanguage,
  onSelectLanguage,
  autoVoiceEnabled,
  onToggleAutoVoice,
  activeEngine,
  onChangeEngine,
  onOpenOnboarding,
  onStartVoiceLoanWithPrompt,
  onOpenCapitalRails,
}) => {
  const [activeTab, setActiveTab] = useState<'personas' | 'settings' | 'documentation' | 'rails'>(initialTab);
  const [isPingingSarvam, setIsPingingSarvam] = useState(false);
  const [sarvamPingResult, setSarvamPingResult] = useState<{ latencyMs: number; success: boolean; response?: any; error?: string } | null>(null);

  if (!isOpen) return null;

  const activeMerchant = merchants[activeMerchantId] || Object.values(merchants)[0];

  const handleTestSarvam = async () => {
    setIsPingingSarvam(true);
    setSarvamPingResult(null);
    try {
      const res = await apiClient.testSarvamPing('Mujhe 2 lakh ka kirana loan chahiye Diwali stock ke liye', 'Hinglish');
      setSarvamPingResult(res);
    } catch (err: any) {
      setSarvamPingResult({ success: false, latencyMs: 0, error: err.message });
    } finally {
      setIsPingingSarvam(false);
    }
  };

  const languages: SupportedLanguage[] = [
    'Hinglish',
    'Hindi',
    'Tamil',
    'Kannada',
    'Bengali',
    'Telugu',
    'Marathi',
    'Gujarati',
    'English',
  ];

  return (
    <div
      id="docs-settings-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col w-full max-w-5xl max-h-[90vh] overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-600 to-emerald-500 flex items-center justify-center font-bold text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Documentation, Demo Personas & Settings Hub
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Indic FinTech
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Switch demo merchant logins, configure AI core settings, and inspect system architecture
              </p>
            </div>
          </div>

          <button
            id="btn-close-docs-settings"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-950/90 text-white flex items-center gap-2 border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('personas')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'personas'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Demo Personas ({Object.keys(merchants).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>System Settings & AI Core</span>
          </button>

          <button
            onClick={() => setActiveTab('documentation')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'documentation'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Architecture & Specs</span>
          </button>

          <button
            onClick={() => setActiveTab('rails')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'rails'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Capital Rails & Compliance</span>
          </button>
        </div>

        {/* Modal Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950/40">
          
          {/* TAB 1: DEMO PERSONAS & MULTI-USER LOGINS */}
          {activeTab === 'personas' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Select Demo Merchant Profile
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any merchant persona below to instantly switch the entire platform context, credit limits, and telemetry.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenOnboarding();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Onboard New Persona</span>
                </button>
              </div>

              {/* Grid of Merchant Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(merchants).map((m) => {
                  const isSelected = m.merchantId === activeMerchantId;
                  return (
                    <div
                      key={m.merchantId}
                      className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-br from-emerald-50/90 to-teal-50/40 dark:from-emerald-950/40 dark:to-slate-900 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div>
                        {/* Header with Avatar and ID */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                                  {m.name}
                                </span>
                                <BadgeCheck className="w-3.5 h-3.5 text-sky-500" />
                              </div>
                              <span className="text-[11px] text-slate-500 font-medium block">
                                {m.businessName}
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {m.merchantId}
                          </span>
                        </div>

                        {/* Details Pill */}
                        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-[11px]">Sector:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {m.tradeSector || m.businessType}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-[11px]">Monthly Sales:</span>
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                              ₹{(m.monthlySales || 150000).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-[11px]">Location & Language:</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {m.location} ({m.preferredLanguage})
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-[11px]">Digital Score:</span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                              {m.digitalTransactionScore}/100 ({m.businessHealth})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            onSelectMerchant(m.merchantId);
                            onClose();
                          }}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-900'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Active Profile</span>
                            </>
                          ) : (
                            <span>Switch to Profile</span>
                          )}
                        </button>

                        {onStartVoiceLoanWithPrompt && (
                          <button
                            onClick={() => {
                              onSelectMerchant(m.merchantId);
                              onClose();
                              onStartVoiceLoanWithPrompt(
                                `Mujhe 2 lakh ka loan chahiye ${m.businessName} ke liye`,
                                m.preferredLanguage
                              );
                            }}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
                            title="Launch Voice Loan for this merchant"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SYSTEM SETTINGS & AI CORE */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Language Preferences */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Vernacular Indic Language Configuration</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select the default dialect for Indic speech recognition, key facts explanations, and voice feedback.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => onSelectLanguage(lang)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedLanguage === lang
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Core Engine Selection */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    <span>AI Core & NLP Engine Selection</span>
                  </h3>
                  <button
                    onClick={handleTestSarvam}
                    disabled={isPingingSarvam}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isPingingSarvam ? 'animate-spin' : ''}`} />
                    <span>{isPingingSarvam ? 'Pinging...' : 'Ping Sarvam AI'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div
                    onClick={() => onChangeEngine('sarvam')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      activeEngine === 'sarvam'
                        ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                        ⚡ Sarvam Indic LLM
                      </span>
                      {activeEngine === 'sarvam' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Sovereign Indic Stack with Saaras STT & Bulbul TTS.
                    </p>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded mt-2 inline-block">
                      Recommended for Indic
                    </span>
                  </div>

                  <div
                    onClick={() => onChangeEngine('gemini')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      activeEngine === 'gemini'
                        ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                        ✦ Gemini 2.5
                      </span>
                      {activeEngine === 'gemini' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      High-reasoning model for complex multi-intent conversational underwriting.
                    </p>
                  </div>

                  <div
                    onClick={() => onChangeEngine('deterministic')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      activeEngine === 'deterministic'
                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 ring-2 ring-slate-500/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                        ⚙️ Rule-Engine
                      </span>
                      {activeEngine === 'deterministic' && <CheckCircle2 className="w-4 h-4 text-slate-700" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Deterministic slot-matching for 100% offline rule compliance.
                    </p>
                  </div>
                </div>

                {/* Ping Result if available */}
                {sarvamPingResult && (
                  <div className="p-3 bg-slate-900 text-white rounded-xl text-xs font-mono mt-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Sarvam API Status</span>
                      <span>Latency: {sarvamPingResult.latencyMs} ms</span>
                    </div>
                    <pre className="text-emerald-400 text-[11px] overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(sarvamPingResult.response || sarvamPingResult.error, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Audio Spoken Feedback Toggle */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Auto Spoken Audio Feedback
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Automatically speak back loan terms, acknowledgements, and KFS summaries in regional Indic audio.
                  </p>
                </div>
                <button
                  onClick={onToggleAutoVoice}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    autoVoiceEnabled
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  {autoVoiceEnabled ? 'Enabled (ON)' : 'Disabled (OFF)'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM ARCHITECTURE & DOCUMENTATION */}
          {activeTab === 'documentation' && (
            <div className="space-y-6">
              
              {/* Dynamic Underwriting Math Specification */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Cpu className="w-4 h-4" />
                  <h3 className="text-sm font-extrabold tracking-tight">
                    Deterministic Underwriting Formulation
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  VoiceLend eliminates arbitrary credit rejections by employing a mathematically transparent underwriting engine driven by Account Aggregator (AA) telemetry:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      1. Monthly EMI Capacity
                    </span>
                    <code className="text-indigo-600 dark:text-indigo-400 text-[11px] block font-mono">
                      (Sales × 0.30) - Existing EMIs
                    </code>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      30% debt-service ratio ceiling
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      2. Sanction Bounds
                    </span>
                    <code className="text-emerald-600 dark:text-emerald-400 text-[11px] block font-mono">
                      [max(15k, 0.25×Sales), min(500k, 2.0×Sales)]
                    </code>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Dynamic range tied to turnover
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      3. Dynamic Interest Rate
                    </span>
                    <code className="text-amber-600 dark:text-amber-400 text-[11px] block font-mono">
                      16.0% - 1.5%(vintage) + 1.0%(debt)
                    </code>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Reward vintage & low leverage
                    </span>
                  </div>
                </div>
              </div>

              {/* Zero-Knowledge Federated Learning */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <h3 className="text-sm font-extrabold tracking-tight">
                    Zero-Knowledge Federated Learning Architecture
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Merchant cashflows, UPI customer details, and invoices NEVER leave the merchant device unencrypted. Training weights are aggregated via FedAvg with differential privacy guarantees ($\varepsilon = 0.5, \delta = 10^{-5}$) and verified using Zero-Knowledge Proofs.
                </p>
              </div>

              {/* Sachet Insurance & Daily Auto-Split */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
                  <Zap className="w-4 h-4" />
                  <h3 className="text-sm font-extrabold tracking-tight">
                    Sachet Insurance & Daily QR Auto-Split Repayment
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Micro-premiums are auto-deducted daily from merchant Paytm Soundbox/UPI QR settlements (₹3 to ₹7/day). When cashflow dips occur, the platform activates a 72-hour No-CIBIL-Hit moratorium buffer with 100% bounce-fee waiver under RBI Fair Lending Directives.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CAPITAL RAILS & COMPLIANCE */}
          {activeTab === 'rails' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      RBI-Compliant Lending Capital Rails
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Direct disbursement from NBFC Escrow into Merchant Bank Account (No intermediary pool account).
                    </p>
                  </div>
                  {onOpenCapitalRails && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCapitalRails();
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-500 transition-all cursor-pointer"
                    >
                      Open Full Rails Modal
                    </button>
                  )}
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-xl text-xs font-mono space-y-2">
                  <div className="text-emerald-400 font-bold">1. Digital Consent & Key Facts Statement (KFS) Generation</div>
                  <div className="text-slate-300 pl-4">→ Encrypted digital audit trail with timestamp, Aadhaar OTP / Biometric token</div>
                  <div className="text-sky-400 font-bold">2. Direct Escrow Disbursal</div>
                  <div className="text-slate-300 pl-4">→ NBFC Partner (Credit Saison / Muthoot) → RBI NEFT/IMPS → Merchant Current A/C</div>
                  <div className="text-amber-400 font-bold">3. Auto-Split Daily Repayment</div>
                  <div className="text-slate-300 pl-4">→ Daily Paytm Soundbox QR Inflow (5%-15% auto-split) → Escrow Settlement</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Active Merchant: <strong className="text-slate-800 dark:text-slate-200">{activeMerchant.name}</strong> ({activeMerchant.businessName})</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Hub
          </button>
        </div>

      </div>
    </div>
  );
};
