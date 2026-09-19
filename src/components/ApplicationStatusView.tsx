import React from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
  RotateCcw,
  ExternalLink,
  Store,
} from 'lucide-react';
import { LoanApplication, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../services/translations';

interface ApplicationStatusViewProps {
  application: LoanApplication;
  language: SupportedLanguage;
  onStartNewVoiceLoan: () => void;
  onViewInLenderPortal: (appId: string) => void;
  onViewMyLoans: () => void;
}

export const ApplicationStatusView: React.FC<ApplicationStatusViewProps> = ({
  application,
  language,
  onStartNewVoiceLoan,
  onViewInLenderPortal,
  onViewMyLoans,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['English'];

  return (
    <div id="application-status-view" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 animate-in fade-in-50 duration-300">
      {/* Top Success Banner */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Application Submitted
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
          {t.applicationSubmitted}
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-mono">
          Reference ID: <span className="font-bold text-slate-900">{application.applicationId}</span>
        </p>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div className="text-[11px] text-slate-500 font-medium">Sanctioned Amount</div>
          <div className="text-lg font-black text-slate-900 mt-0.5">
            ₹{application.approvedAmount.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div className="text-[11px] text-slate-500 font-medium">Tenure</div>
          <div className="text-lg font-bold text-slate-900 mt-0.5">
            {application.tenureMonths} Months
          </div>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div className="text-[11px] text-slate-500 font-medium">Monthly EMI</div>
          <div className="text-lg font-bold text-emerald-700 mt-0.5">
            ₹{application.monthlyEMI.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div className="text-[11px] text-slate-500 font-medium">Current Status</div>
          <div className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-1 rounded-full mt-1.5 inline-block">
            {application.status}
          </div>
        </div>
      </div>

      {/* 5-Step Process Timeline */}
      <div className="max-w-2xl mx-auto mb-8 p-6 rounded-2xl bg-slate-50 border border-slate-200/90">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-600" />
          <span>Real-time Lending Journey Timeline</span>
        </h4>

        <div className="space-y-4 relative">
          {/* Vertical progress line */}
          <div className="absolute top-3 bottom-3 left-4 w-0.5 bg-slate-200 -z-0"></div>

          {application.timeline.map((step, idx) => (
            <div key={idx} className="relative z-10 flex items-start gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  step.completed
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : step.current
                    ? 'bg-sky-600 text-white ring-4 ring-sky-100 animate-pulse'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>

              <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{step.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{step.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Judge & User Quick Actions */}
      <div className="max-w-xl mx-auto flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          id="btn-view-in-lender"
          onClick={() => onViewInLenderPortal(application.applicationId)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
        >
          <span>Open Lender Review Dashboard</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          id="btn-status-myloans"
          onClick={onViewMyLoans}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all"
        >
          <span>View My Active Loans</span>
        </button>

        <button
          type="button"
          id="btn-status-rerecord"
          onClick={onStartNewVoiceLoan}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Voice Journey</span>
        </button>
      </div>
    </div>
  );
};
