import React from 'react';
import {
  Mic,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Layers,
  Store,
  CheckCircle2,
  Lock,
  Zap,
  Globe,
  FileCheck2,
} from 'lucide-react';
import { SupportedLanguage } from '../types';

interface LandingPageViewProps {
  onStartDemo: (initialPrompt?: string, lang?: SupportedLanguage) => void;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onOpenTrustCenter: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onStartDemo,
  onSelectLanguage,
  onOpenTrustCenter,
}) => {
  return (
    <div id="landing-page-view" className="space-y-16 py-4 animate-in fade-in-50 duration-300">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 pt-4 pb-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/90 mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="tracking-wide">AI-POWERED INDIC LENDING INFRASTRUCTURE</span>
        </div>

        {/* Clear 30-Second Statement: VOICE TO WORKING CAPITAL */}
        <h1 className="font-black tracking-tight select-none mb-6">
          <span className="block text-4xl sm:text-6xl lg:text-7xl text-slate-950 font-black tracking-tighter">
            VOICE
          </span>
          <span className="block text-xl sm:text-2xl lg:text-3xl text-slate-400 font-semibold my-1 tracking-widest">
            TO
          </span>
          <span className="block text-4xl sm:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 tracking-tighter">
            WORKING CAPITAL.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          From natural spoken Indic audio to sanctioned capital in under 5 minutes. No manual paperwork, zero confusing forms, completely explainable credit underwriting.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            id="btn-hero-start-demo"
            onClick={() => onStartDemo()}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95"
          >
            <Mic className="w-5 h-5 text-emerald-100" />
            <span>Launch Alley Voice Demo</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            id="btn-hero-architecture"
            onClick={onOpenTrustCenter}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-sm transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>View Architecture & Trust</span>
          </button>
        </div>

        {/* 30-Second Judge Quick-Test Strip */}
        <div className="mt-8 max-w-xl mx-auto p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200 text-xs">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick 30-Second Judge Triggers (1-Click Test)</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => onStartDemo('Mujhe 2 lakh chahiye Diwali ke liye stock kharidne.', 'Hinglish')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-800 font-medium transition-all shadow-2xs text-[11px]"
            >
              Diwali Stock: ₹2L (Hinglish)
            </button>
            <button
              type="button"
              onClick={() => onStartDemo('Nange bakery oven repair madoke 1 lakh beku.', 'Kannada')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-800 font-medium transition-all shadow-2xs text-[11px]"
            >
              Bakery Oven: ₹1L (Kannada)
            </button>
            <button
              type="button"
              onClick={() => onStartDemo('Mujhe 80000 emergency medicine stock ke liye chahiye.', 'Hindi')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-800 font-medium transition-all shadow-2xs text-[11px]"
            >
              Pharma Stock: ₹80K (Hindi)
            </button>
          </div>
        </div>

        {/* Hero Interactive Preview Card: Simulated Merchant Waveform */}
        <div className="mt-10 max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl text-left relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="font-bold text-slate-800">Live Voice Intent Pipeline</span>
            </div>
            <span className="font-mono text-slate-400">Sample: Ramesh Kirana Stores</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 text-white mb-4 shadow-inner">
            <div className="text-[10px] text-emerald-400 font-mono font-bold tracking-wider mb-1 flex items-center gap-1.5">
              <Mic className="w-3 h-3 text-emerald-400" />
              <span>SPOKEN AUDIO (HINGLISH)</span>
            </div>
            <p className="text-base sm:text-lg font-medium italic text-slate-100">
              "Mujhe 2 lakh chahiye Diwali ke liye stock kharidne."
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Extracted Intent</div>
              <div className="font-bold text-slate-900 mt-0.5">₹2,00,000 Inventory</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Deterministic Cap</div>
              <div className="font-bold text-slate-900 mt-0.5">₹1,50,000 Safe Limit</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-emerald-800 text-[10px] font-bold uppercase">Monthly EMI</div>
              <div className="font-black text-emerald-700 mt-0.5">₹13,752 / mo</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Journey Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            The 5-Minute Voice-to-Disbursement Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Voice Request', desc: 'Merchant speaks naturally in their regional language without filling complex digital forms.' },
            { step: '02', title: 'Intent Slotting', desc: 'Gemini Indic engine extracts loan amount, commercial purpose, and seasonal context with high confidence.' },
            { step: '03', title: 'Deterministic Rules', desc: 'Deterministic underwriting calculates debt-service headroom against verified UPI/Account Aggregator inflows.' },
            { step: '04', title: 'Voice KFS & Consent', desc: 'A transparent Key Facts Statement is generated and read out in audio before explicit consent is recorded.' },
            { step: '05', title: 'Instant Disbursement', desc: 'Pre-approved working capital is routed directly to the verified merchant current account.' },
          ].map((item) => (
            <div key={item.step} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-2xl font-black text-slate-200">{item.step}</span>
                <h3 className="text-sm font-bold text-slate-900 mt-2">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Architectural Principles */}
      <section className="max-w-6xl mx-auto px-4 bg-slate-900 text-white rounded-3xl p-8 sm:p-12">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">ENTERPRISE COMPLIANCE</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">
            Built for Regulated Financial Institutions
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            VoiceLend enforces strict structural separation between natural language AI and credit underwriting math.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">Zero Generative Math</h4>
            <p className="text-slate-400 leading-relaxed">
              LLMs are strictly forbidden from calculating interest rates, EMIs, or approval limits. All calculations run on audited deterministic formulas.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700">
            <FileCheck2 className="w-6 h-6 text-sky-400 mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">RBI Digital Lending Aligned</h4>
            <p className="text-slate-400 leading-relaxed">
              Generates compliant Key Facts Statements (KFS) with full APR disclosure, look-up cooling periods, and auditable consent timestamps.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700">
            <Layers className="w-6 h-6 text-amber-400 mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">Model Context Protocol (MCP)</h4>
            <p className="text-slate-400 leading-relaxed">
              Standardized tool contracts allow core banking platforms (CBS) and account aggregators to plug directly into the voice workflow.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Launch Banner */}
      <section className="text-center max-w-3xl mx-auto px-4 pb-8">
        <h3 className="text-2xl font-bold text-slate-900">Experience VoiceLend in Action</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Test with Ramesh Kumar (Bengaluru), Lakshmi Devi (Mysuru), or Shreekanth Patil (Hubballi)
        </p>
        <button
          onClick={() => onStartDemo()}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition-all"
        >
          <Mic className="w-4 h-4 text-emerald-400" />
          <span>Start Interactive Voice Journey</span>
        </button>
      </section>
    </div>
  );
};
