import React, { useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { LoanIntent, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../services/translations';

interface IntentCardProps {
  intent: LoanIntent;
  language: SupportedLanguage;
  onConfirm: (updatedIntent: LoanIntent) => void;
  onReRecord: () => void;
}

export const IntentCard: React.FC<IntentCardProps> = ({
  intent,
  language,
  onConfirm,
  onReRecord,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState(intent.requested_amount);
  const [editedPurpose, setEditedPurpose] = useState(intent.purpose);
  const [editedUseCase, setEditedUseCase] = useState(intent.use_case);

  const t = TRANSLATIONS[language] || TRANSLATIONS['English'];

  const handleSaveEdit = () => {
    setIsEditing(false);
    onConfirm({
      ...intent,
      requested_amount: editedAmount,
      purpose: editedPurpose,
      use_case: editedUseCase,
    });
  };

  return (
    <div id="intent-card" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 animate-in fade-in-50 duration-300">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.hereIsWhatIUnderstood}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {intent.engine === 'deterministic'
                ? 'Extracted via High-Reliability Indic Language Core (Deterministic Engine)'
                : 'Extracted from voice via Gemini Indic Natural Language Core'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {intent.engine === 'deterministic' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <span>High-Reliability Fallback</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{Math.round(intent.confidence * 100)}% Confidence</span>
          </span>
        </div>
      </div>

      {/* Raw spoken quote */}
      {intent.raw_transcript && (
        <div className="p-3 mb-6 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs italic flex items-center gap-2">
          <span className="font-semibold text-slate-500 uppercase not-italic tracking-wider text-[10px]">Spoken:</span>
          <span className="text-slate-900 dark:text-white font-medium">"{intent.raw_transcript}"</span>
        </div>
      )}

      {/* Structured Fields Display / Edit Mode */}
      {!isEditing ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Requested Amount */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.loanAmount}</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              ₹{(intent.requested_amount ?? 150000).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              INR ({intent.currency})
            </div>
          </div>

          {/* Purpose */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
              <Tag className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{t.purpose}</span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white capitalize">
              {intent.purpose.replace(/_/g, ' ')}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {intent.use_case}
            </div>
          </div>

          {/* Business Context & Language */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Context &amp; Language</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {intent.business_context}
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
              Spoken in {intent.language}
            </div>
          </div>
        </div>
      ) : (
        /* Edit Form */
        <div className="p-4 mb-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Edit Extracted Values
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Requested Loan Amount (₹)
              </label>
              <input
                type="number"
                id="input-edit-amount"
                step="5000"
                value={editedAmount ?? ''}
                onChange={(e) => setEditedAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Loan Purpose Category
              </label>
              <select
                id="select-edit-purpose"
                value={editedPurpose}
                onChange={(e) => setEditedPurpose(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
              >
                <option value="inventory_purchase">Inventory Purchase (Stock)</option>
                <option value="working_capital">General Working Capital</option>
                <option value="business_expansion">Shop / Business Expansion</option>
                <option value="equipment">Equipment & POS Machinery</option>
                <option value="emergency">Emergency Operational Liquidity</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              id="btn-save-edit-intent"
              onClick={handleSaveEdit}
              className="px-4 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              type="button"
              id="btn-edit-intent"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t.edit}</span>
            </button>
          )}
          <button
            type="button"
            id="btn-rerecord-intent"
            onClick={onReRecord}
            className="px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Speak Again
          </button>
        </div>

        <button
          type="button"
          id="btn-confirm-intent"
          onClick={() => onConfirm(intent)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all hover:translate-x-0.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{t.thatsCorrect}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
