import React from 'react';
import { Sparkles, ShieldCheck, Play, UserCheck, Layers, Bot, Volume2, VolumeX } from 'lucide-react';
import { SupportedLanguage, Merchant } from '../types';
import { SEEDED_MERCHANTS, DEMO_SCENARIOS } from '../data/seedData';

interface DemoBannerProps {
  currentView: string;
  onNavigate: (view: string) => void;
  selectedMerchantId: string;
  onSelectMerchant: (merchantId: string) => void;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onRunFullDemo: () => void;
  onOpenTrustModal: () => void;
  autoVoiceEnabled: boolean;
  onToggleAutoVoice: () => void;
  merchants?: Record<string, Merchant>;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  currentView,
  onNavigate,
  selectedMerchantId,
  onSelectMerchant,
  selectedLanguage,
  onSelectLanguage,
  onRunFullDemo,
  onOpenTrustModal,
  autoVoiceEnabled,
  onToggleAutoVoice,
  merchants = SEEDED_MERCHANTS,
}) => {
  const merchant = merchants[selectedMerchantId] || Object.values(merchants)[0] || SEEDED_MERCHANTS['M001'];

  return (
    <aside aria-label="Demo controls" id="demo-environment-banner" className="bg-slate-900 text-white text-xs border-b border-slate-800 py-2 px-3 sm:px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Environment Badge & Scenario Selector */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold tracking-wider text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            HACKATHON DEMO ENVIRONMENT
          </span>

          {/* Quick Merchant Selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 hidden sm:inline">Merchant:</span>
            <select
              id="merchant-selector"
              value={selectedMerchantId}
              onChange={(e) => onSelectMerchant(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              aria-label="Select Demo Merchant Profile"
            >
              {Object.values(merchants).map((m) => (
                <option key={m.merchantId} value={m.merchantId} className="bg-slate-900 text-white">
                  {m.name} ({m.businessName.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
            <Bot className="w-3.5 h-3.5 text-sky-400" />
            <select
              id="global-language-selector"
              value={selectedLanguage}
              onChange={(e) => onSelectLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              aria-label="Select Primary Language"
            >
              <option value="English" className="bg-slate-900">English</option>
              <option value="Hinglish" className="bg-slate-900">Hinglish</option>
              <option value="Hindi" className="bg-slate-900">हिन्दी (Hindi)</option>
              <option value="Kannada" className="bg-slate-900">ಕನ್ನಡ (Kannada)</option>
              <option value="Telugu" className="bg-slate-900">తెలుగు (Telugu)</option>
              <option value="Tamil" className="bg-slate-900">தமிழ் (Tamil)</option>
              <option value="Malayalam" className="bg-slate-900">മലയാളം (Malayalam)</option>
            </select>
          </div>

          {/* Auto Voice Feedback Toggle */}
          <button
            id="btn-toggle-auto-voice"
            onClick={onToggleAutoVoice}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-semibold transition-all ${
              autoVoiceEnabled
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/90'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Automatically speak AI responses back to the merchant in their regional language"
          >
            {autoVoiceEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Auto Voice: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>Auto Voice: OFF</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Quick Demo Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Quick Scenario Pills */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-300">
            <span className="text-slate-400">Preset:</span>
            {DEMO_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                id={`btn-scenario-${sc.id.toLowerCase()}`}
                onClick={() => {
                  onSelectMerchant(sc.merchantId);
                  onSelectLanguage(sc.language);
                  onNavigate('merchant-voice');
                }}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
                title={`Try: "${sc.spokenPrompt}"`}
              >
                {sc.title}
              </button>
            ))}
          </div>

          {/* 1-Click Automated Demo button */}
          <button
            id="btn-run-full-demo"
            onClick={onRunFullDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium shadow-sm transition-all text-xs"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Run 1-Click Demo</span>
          </button>

          {/* Trust center modal trigger */}
          <button
            id="btn-trust-center"
            onClick={onOpenTrustModal}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-slate-400 hover:text-white transition-colors"
            title="View Architecture & Trust Principles"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Trust & Rules</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
