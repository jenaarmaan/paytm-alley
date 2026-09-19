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
    <div id="eligibility-card" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-slate-900">
                Simulated Loan Eligibility: Approved
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Deterministic Pass
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluated strictly against financial capacity rules — not generative guessing.
            </p>
          </div>
        </div>

        {/* Explain with Voice Button */}
        <button
          type="button"
          id="btn-voice-explain"
          onClick={handleToggleVoiceExplanation}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isSpeaking
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isSpeaking ? 'Stop Audio' : t.explainOffer}</span>
        </button>
      </div>

      {/* Comparison Grid: Requested vs Cap vs Recommended */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Requested Amount</span>
            {eligibility.requestedAmount <= eligibility.eligibleMaxAmount ? (
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                Approved
              </span>
            ) : (
              <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.2 rounded">
                Capped
              </span>
            )}
          </div>
          <div className={`text-xl font-black text-slate-800 dark:text-white font-mono`}>
            ₹{eligibility.requestedAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {eligibility.requestedAmount <= eligibility.eligibleMaxAmount
              ? 'Exact requested amount sanctioned'
              : 'Requested amount exceeded safe ratio'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="text-xs font-semibold text-slate-500 mb-1">
            Max Credit Capacity
          </div>
          <div className="text-xl font-black text-indigo-700 dark:text-indigo-400 font-mono">
            ₹{eligibility.eligibleMaxAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Based on 30% debt-service capacity
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 shadow-2xs">
          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sanctioned Capital Offer</span>
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
            ₹{offer.loanAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium mt-1">
            {offer.loanAmount === eligibility.requestedAmount
              ? '100% Match of requested loan'
              : 'Safe working capital sanction'}
          </div>
        </div>
      </div>

      {/* Explainable Underwriting Factor Breakdown */}
      <div className="mb-6 p-5 rounded-xl bg-slate-50 border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-700" />
            <span>{t.whyThisOffer}</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Weighted Underwriting Scoring
          </span>
        </div>

        {/* 4 Factor Score Bars */}
        <div className="space-y-3">
          {eligibility.factors.map((factor, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{factor.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">{factor.description}</span>
                  <span className="font-bold text-emerald-700 px-1.5 py-0.5 rounded bg-emerald-100/60 text-[10px]">
                    {factor.rating} ({factor.score}/10)
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(factor.score / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spoken AI Explanation Summary */}
      <div className="mb-6 p-4 rounded-xl bg-sky-50/70 border border-sky-200 text-sky-900 text-xs">
        <div className="font-bold text-sky-950 flex items-center gap-1.5 mb-1">
          <Volume2 className="w-4 h-4 text-sky-700" />
          <span>Natural Language Explanation ({language}):</span>
        </div>
        <p className="leading-relaxed font-medium">{explanationText}</p>
      </div>

      {/* Collapsible Rule Triggers Accordion */}
      <div className="mb-6 border border-slate-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowRulesDetail(!showRulesDetail)}
          className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-slate-600" />
            <span>Deterministic Policy Checks ({eligibility.ruleTriggers.length} Verified)</span>
          </span>
          {showRulesDetail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showRulesDetail && (
          <div className="divide-y divide-slate-100 bg-white p-3 text-xs space-y-2">
            {eligibility.ruleTriggers.map((rule, idx) => (
              <div key={idx} className="pt-2 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-800">{rule.ruleName}</div>
                    <div className="text-[11px] text-slate-500">{rule.detail}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0 border border-emerald-200">
                  PASSED
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <p className="text-[11px] text-slate-500">
          Disclaimer: Eligible for this simulated offer based on hackathon demo underwriting rules.
        </p>
        <button
          type="button"
          id="btn-view-loan-offer"
          onClick={onProceedToOffer}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all hover:translate-x-0.5"
        >
          <span>Review Loan Offer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
