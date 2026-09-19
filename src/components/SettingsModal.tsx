import React, { useState } from 'react';
import {
  X,
  Settings,
  Store,
  BadgeCheck,
  Volume2,
  Cpu,
  RefreshCw,
  CheckCircle2,
  UserPlus
} from 'lucide-react';
import { Merchant, SupportedLanguage } from '../types';
import { apiClient } from '../services/apiClient';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchants: Record<string, Merchant>;
  activeMerchantId: string;
  onSelectMerchant: (merchantId: string) => void;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  autoVoiceEnabled: boolean;
  onToggleAutoVoice: () => void;
  activeEngine: 'sarvam' | 'gemini' | 'deterministic';
  onChangeEngine: (engine: 'sarvam' | 'gemini' | 'deterministic') => void;
  onOpenOnboarding?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
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
}) => {
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
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col w-full max-w-3xl max-h-[90vh] overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-600 to-emerald-500 flex items-center justify-center font-bold text-white shadow-md">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg tracking-tight">
                  System Settings &amp; Profile Configuration
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active Control
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Single point of contact for merchant profile switching, vernacular dialects, and AI core
              </p>
            </div>
          </div>

          <button
            id="btn-close-settings"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950/40">
          
          {/* SECTION 1: MERCHANT PROFILE MANAGEMENT (Single Point of Contact Dropdown) */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Merchant Profile Management
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a registered profile from the dropdown to immediately switch active business context.
                </p>
              </div>
              {onOpenOnboarding && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenOnboarding();
                  }}
                  className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Onboard New Merchant</span>
                </button>
              )}
            </div>

            {/* Dropdown Selector */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-6 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Switch Active Merchant Profile:
                </label>
                <select
                  value={activeMerchantId}
                  onChange={(e) => onSelectMerchant(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {Object.values(merchants).map((m) => (
                    <option key={m.merchantId} value={m.merchantId}>
                      [{m.merchantId}] {m.name} — {m.businessName} (₹{(m.monthlySales || 150000).toLocaleString('en-IN')}/mo)
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Profile Snapshot Card */}
              <div className="md:col-span-6 p-3.5 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {activeMerchant.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                      <span>{activeMerchant.name}</span>
                      <BadgeCheck className="w-3.5 h-3.5 text-sky-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      {activeMerchant.businessName} • {activeMerchant.location}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Monthly Sales</span>
                  <span className="text-xs font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                    ₹{(activeMerchant.monthlySales || 150000).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: VERNACULAR INDIC LANGUAGE CONFIGURATION */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>Vernacular Indic Language Configuration</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select the default dialect for Indic speech recognition, key facts explanations, and voice feedback.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => onSelectLanguage(lang)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedLanguage === lang
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 3: AI CORE & NLP ENGINE SELECTION */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>AI Core &amp; NLP Engine Selection</span>
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
                  Sovereign Indic Stack with Saaras STT &amp; Bulbul TTS.
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
                  High-reasoning model for complex conversational underwriting.
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

            {/* Ping Result */}
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

          {/* SECTION 4: AUDIO FEEDBACK TOGGLE */}
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
            Close Settings
          </button>
        </div>

      </div>
    </div>
  );
};
