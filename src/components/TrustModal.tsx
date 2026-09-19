import React from 'react';
import { ShieldCheck, X, CheckCircle2, Lock, FileText, Cpu, AlertTriangle } from 'lucide-react';

interface TrustModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrustModal: React.FC<TrustModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">VoiceLend Trust & Architecture Principles</h3>
              <p className="text-xs text-slate-500">Explainability, Compliance, and Deterministic Credit Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-xs text-slate-600">
          {/* Section 1: The Core Architecture Rule */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
              <Cpu className="w-4 h-4 text-emerald-700" />
              <span>Core Principle: Strict Separation of LLM & Financial Calculations</span>
            </div>
            <p className="text-emerald-900 leading-relaxed">
              In financial services, generative hallucinations can lead to severe regulatory and solvency risks. VoiceLend enforces a strict boundary:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-emerald-900 font-medium">
              <li><strong>LLM Responsibility (Gemini 3.8 Flash):</strong> Speech interpretation, regional language translation, extracting requested amounts &amp; purposes, and phrasing explainable summaries.</li>
              <li><strong>Deterministic Financial Core:</strong> Calculation of debt capacity, 30% DSR ceiling caps, standard monthly reducing-balance EMI formulas, processing fees, and Key Facts Statements.</li>
            </ul>
          </div>

          {/* Section 2: RBI Compliance Standards */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-700" />
              <span>RBI Digital Lending Guidelines Compliance</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Mandatory KFS Generation</span>
                <span>Standardized Key Facts Statement is displayed and read out aloud before recording any consent.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Explicit Informed Consent</span>
                <span>No automatic execution. Submissions require merchant affirmative confirmation and timestamp logging.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Look-up / Cooling Period</span>
                <span>3-day cooling-off window provided for borrowers to exit without penalty.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">No Hidden Processing Costs</span>
                <span>All GST, processing fees, APR calculations, and penal charges explicitly disclosed.</span>
              </div>
            </div>
          </div>

          {/* Section 3: Synthetic Test Data Notice */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Hackathon Demonstration Notice</span>
              <span>
                All merchant profiles (Ramesh Kumar, Lakshmi Devi, Shreekanth Patil) and simulated NBFC entities (Samriddhi Microfinance Bank Ltd) are synthetic fixtures constructed for hackathon evaluation.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 mt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};
