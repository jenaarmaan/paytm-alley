import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  TrendingUp,
  BadgeCheck
} from 'lucide-react';
import { EligibilityResult, LoanOffer, SupportedLanguage } from '../types';
import { speechService } from '../services/speechService';
import { TRANSLATIONS } from '../services/translations';

interface EligibilityCardProps {
  eligibility: EligibilityResult;
  offer: LoanOffer;
  language: SupportedLanguage;
  explanationText: string;
  onProceedToOffer: () => void;
}

export const EligibilityCard: React.FC<EligibilityCardProps> = ({
  eligibility,
  offer,
  language,
  explanationText,
  onProceedToOffer,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showRulesDetail, setShowRulesDetail] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS['English'];

  const handleToggleVoiceExplanation = () => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speechService.speak(explanationText, language, () => {
        setIsSpeaking(false);
      });
    }
  };

  return (
    <div id="eligibility-card" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Simulated Loan Eligibility: Approved
              </h3>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                Deterministic Pass
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Evaluated strictly against financial capacity rules — not generative guessing.
            </p>
          </div>
        </div>

        {/* Explain with Voice Button */}
        <button
          type="button"
          id="btn-voice-explain"
          onClick={handleToggleVoiceExplanation}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
            isSpeaking
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isSpeaking ? 'Stop Audio' : t.explainOffer}</span>
        </button>
      </div>

      {/* Comparison Grid: Requested vs Cap vs Recommended */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Card 1: Requested Amount */}
        <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
              <span>Requested Amount</span>
              {eligibility.requestedAmount <= eligibility.eligibleMaxAmount ? (
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-extrabold bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Approved
                </span>
              ) : (
                <span className="text-[10px] text-amber-700 dark:text-amber-300 font-extrabold bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Capped
                </span>
              )}
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              ₹{eligibility.requestedAmount.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            {eligibility.requestedAmount <= eligibility.eligibleMaxAmount
              ? 'Exact requested amount sanctioned'
              : 'Requested amount exceeded safe ratio'}
          </div>
        </div>

        {/* Card 2: Max Credit Capacity */}
        <div className="p-4.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/50 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-1.5">
              Max Credit Capacity
            </div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              ₹{eligibility.eligibleMaxAmount.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Based on 30% debt-service capacity
          </div>
        </div>

        {/* Card 3: Sanctioned Capital Offer */}
        <div className="p-4.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/5 dark:from-emerald-950/60 dark:to-teal-950/30 border-2 border-emerald-500/60 dark:border-emerald-500/50 shadow-md ring-2 ring-emerald-500/10 flex flex-col justify-between">
          <div>
            <div className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Sanctioned Capital Offer</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              ₹{offer.loanAmount.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold mt-2">
            {offer.loanAmount === eligibility.requestedAmount
              ? '100% Match of requested loan'
              : 'Safe working capital sanction'}
          </div>
        </div>
      </div>

      {/* Explainable Underwriting Factor Breakdown */}
      <div className="mb-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 dark:border-slate-800 pb-3">
          <div className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.whyThisOffer}</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Weighted Underwriting Scoring
          </span>
        </div>

        {/* 4 Factor Score Bars */}
        <div className="space-y-4">
          {eligibility.factors.map((factor, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">{factor.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{factor.description}</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-[10px]">
                    {factor.rating} ({factor.score}/10)
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(factor.score / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spoken AI Explanation Summary */}
      <div className="mb-6 p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 text-sky-950 dark:text-sky-200 text-xs">
        <div className="font-extrabold text-sky-900 dark:text-sky-300 flex items-center gap-2 mb-1.5">
          <Volume2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>Natural Language Explanation ({language}):</span>
        </div>
        <p className="leading-relaxed font-medium text-slate-700 dark:text-slate-300">{explanationText}</p>
      </div>

      {/* Collapsible Rule Triggers Accordion */}
      <div className="mb-6 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowRulesDetail(!showRulesDetail)}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Deterministic Policy Checks ({eligibility.ruleTriggers.length} Verified)</span>
          </span>
          {showRulesDetail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showRulesDetail && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 p-3 text-xs space-y-2">
            {eligibility.ruleTriggers.map((rule, idx) => (
              <div key={idx} className="pt-2 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{rule.ruleName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{rule.detail}</div>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                  PASSED
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Disclaimer: Evaluated strictly by deterministic financial models under RBI Fair Lending Practices.
        </p>
        <button
          type="button"
          id="btn-view-loan-offer"
          onClick={onProceedToOffer}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <span>Review Loan Offer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
