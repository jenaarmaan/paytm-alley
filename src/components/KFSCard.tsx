import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Volume2,
  VolumeX,
  ShieldCheck,
  AlertCircle,
  CheckSquare,
  Square,
  ArrowRight,
  Info,
  Scale,
  Building2,
} from 'lucide-react';
import { KeyFactsStatement, SupportedLanguage } from '../types';
import { speechService } from '../services/speechService';
import { TRANSLATIONS } from '../services/translations';

interface KFSCardProps {
  kfs: KeyFactsStatement;
  language: SupportedLanguage;
  voiceKfsSummary: string;
  onConfirmConsent: () => void;
  onBackToOffer: () => void;
}

export const KFSCard: React.FC<KFSCardProps> = ({
  kfs,
  language,
  voiceKfsSummary,
  onConfirmConsent,
  onBackToOffer,
}) => {
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      speechService.stopSpeaking();
    };
  }, []);

  const t = TRANSLATIONS[language] || TRANSLATIONS['English'];

  const handleToggleVoiceKFS = () => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speechService.speak(voiceKfsSummary, language, () => {
        setIsSpeaking(false);
      });
    }
  };

  return (
    <div id="kfs-card" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-8 animate-in fade-in-50 duration-300 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center">
            <FileCheck2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {t.keyFactsTitle}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono">
                {kfs.kfsId}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              RBI Master Directions (Digital Lending) • Regulated Partner Escrow
            </p>
          </div>
        </div>

        {/* Audio Readout of KFS */}
        <button
          type="button"
          id="btn-voice-kfs"
          onClick={handleToggleVoiceKFS}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isSpeaking
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isSpeaking ? 'Stop Voice Audio' : t.listenToSummary}</span>
        </button>
      </div>

      {/* Voice KFS Audio Text Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200 text-xs">
        <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-800 dark:text-emerald-400">
          <Volume2 className="w-3.5 h-3.5" />
          <span>Spoken Voice KFS Script ({language}):</span>
        </div>
        <p className="leading-relaxed font-medium italic">"{voiceKfsSummary}"</p>
      </div>

      {/* Structured KFS Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
            <tr>
              <th className="py-2.5 px-4">Standardized Metric</th>
              <th className="py-2.5 px-4 text-right">Sanctioned Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">Borrower Entity</td>
              <td className="py-2.5 px-4 text-right font-bold text-slate-900 dark:text-white">{kfs.businessName} ({kfs.merchantName})</td>
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">Credit Facility Type</td>
              <td className="py-2.5 px-4 text-right font-bold text-slate-900 dark:text-white">{kfs.loanType}</td>
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 bg-emerald-50/30 dark:bg-emerald-950/20">
              <td className="py-2.5 px-4 text-slate-900 dark:text-emerald-300 font-bold">Sanctioned Loan Amount</td>
              <td className="py-2.5 px-4 text-right font-black text-emerald-700 dark:text-emerald-400 text-sm font-mono">
                ₹{kfs.sanctionedAmount.toLocaleString('en-IN')}
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">Repayment Mechanism</td>
              <td className="py-2.5 px-4 text-right font-bold text-emerald-700 dark:text-emerald-400">
                {kfs.repaymentFrequency === 'daily'
                  ? `Daily QR Auto-Split (₹${kfs.dailyInstallmentAmount || Math.round(kfs.monthlyInstallmentEMI / 30)}/day)`
                  : `Monthly EMI (₹${kfs.monthlyInstallmentEMI.toLocaleString('en-IN')}/mo)`}
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">Loan Tenure</td>
              <td className="py-2.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                {kfs.tenureMonths} Months ({kfs.totalInstallmentsCount} Total Installments)
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">Annual Interest Rate & Type</td>
              <td className="py-2.5 px-4 text-right font-bold text-slate-900 dark:text-white">{kfs.rateOfInterestAnnual}% p.a. ({kfs.interestType} Balance)</td>
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">Total Interest Payable</td>
              <td className="py-2.5 px-4 text-right text-slate-800 dark:text-slate-200 font-mono">₹{kfs.totalInterestCost.toLocaleString('en-IN')}</td>
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">Upfront Processing Charges (incl. 18% GST)</td>
              <td className="py-2.5 px-4 text-right text-slate-800 dark:text-slate-200 font-mono">₹{kfs.processingCharges.toLocaleString('en-IN')}</td>
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">Net Disbursal Amount to Bank Current A/C</td>
              <td className="py-2.5 px-4 text-right font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                ₹{kfs.netDisbursement.toLocaleString('en-IN')}
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 bg-slate-100/50 dark:bg-slate-800/30">
              <td className="py-2.5 px-4 text-slate-900 dark:text-white font-bold">Total Amount to be Repaid</td>
              <td className="py-2.5 px-4 text-right font-black text-slate-900 dark:text-white text-sm font-mono">
                ₹{kfs.totalAmountToPay.toLocaleString('en-IN')}
              </td>
            </tr>
            {kfs.bundledInsuranceSummary && (
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 bg-indigo-50/30 dark:bg-indigo-950/20">
                <td className="py-2.5 px-4 text-slate-900 dark:text-indigo-300 font-bold">Bundled Sachet Protections</td>
                <td className="py-2.5 px-4 text-right text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                  {kfs.bundledInsuranceSummary}
                </td>
              </tr>
            )}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">Cooling-off / Look-up Period</td>
              <td className="py-2.5 px-4 text-right text-slate-800 dark:text-slate-200">{kfs.coolingOffPeriodDays} Business Days (Zero exit fee)</td>
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">LSP Technology Role</td>
              <td className="py-2.5 px-4 text-right text-slate-800 dark:text-slate-300">
                VoiceLend (Lending Service Provider) • ₹0 borrower origination charge
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">Originating Regulated Entity (RE)</td>
              <td className="py-2.5 px-4 text-right font-semibold text-slate-800 dark:text-slate-200">
                {kfs.lenderName} ({kfs.lenderRegistration})
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Explicit Consent Checkbox Section */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        <label
          htmlFor="kfs-consent-checkbox"
          className="flex items-start gap-3 cursor-pointer select-none"
        >
          <input
            type="checkbox"
            id="kfs-consent-checkbox"
            checked={hasConsented}
            onChange={(e) => setHasConsented(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">
              Explicit Informed Consent & Digital Authorization
            </span>
            <p className="leading-relaxed text-[11px]">
              {t.iUnderstandTerms} I authorize partner bank Samriddhi NBFC to disburse ₹{kfs.sanctionedAmount.toLocaleString('en-IN')} via Zero-Touch Escrow and enable the selected {kfs.repaymentFrequency === 'daily' ? 'Daily QR Auto-Split' : 'Monthly NACH'} repayment rail.
            </p>
          </div>
        </label>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBackToOffer}
          className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          Back to Offer Adjustments
        </button>

        <button
          type="button"
          id="btn-submit-application"
          disabled={!hasConsented}
          onClick={onConfirmConsent}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
            hasConsented
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 hover:translate-x-0.5'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t.submitApplication}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
