import React from 'react';
import { ShieldCheck, AlertCircle, X } from 'lucide-react';
import { LoanOffer, Merchant, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../services/translations';

interface ConsentModalProps {
  isOpen: boolean;
  offer: LoanOffer;
  merchant: Merchant;
  language: SupportedLanguage;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  offer,
  merchant,
  language,
  onCancel,
  onConfirm,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS['English'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="consent-modal-content"
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-slate-900">{t.confirmModalTitle}</h4>
          </div>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loan details recap */}
        <div className="space-y-3 text-xs mb-5">
          <p className="text-slate-600">
            You are about to submit a simulated working capital credit dossier on behalf of:
          </p>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Merchant Business:</span>
              <span className="font-bold text-slate-900">{merchant.businessName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sanctioned Amount:</span>
              <span className="font-black text-emerald-700 text-sm">
                ₹{offer.loanAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tenure & Rate:</span>
              <span className="font-bold text-slate-900">
                {offer.tenureMonths} Months @ {offer.annualInterestRate}% p.a.
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Monthly EMI:</span>
              <span className="font-black text-slate-900">
                ₹{offer.monthlyEMI.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            Note: This is a hackathon simulation. Your digital submission will be registered in the in-memory lender core.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            id="btn-modal-confirm-submit"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md transition-all disabled:bg-slate-300"
          >
            {isSubmitting ? (
              <span>Submitting Dossier...</span>
            ) : (
              <span>{t.confirmApplication}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
