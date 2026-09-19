import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Building2,
  ArrowRight,
  Landmark,
  CheckCircle2,
  FileText,
  Lock,
  ExternalLink,
  Info,
  Layers,
  ArrowDownUp,
  Cpu,
  BadgeCheck,
  Scale,
} from 'lucide-react';

interface CapitalFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CapitalFlowModal({ isOpen, onClose }: CapitalFlowModalProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'flow' | 'safeguards' | 'rbi-checklist'>('flow');

  if (!isOpen) return null;

  const flowSteps = [
    {
      step: 1,
      name: 'Borrower (Merchant)',
      actor: 'Kirana Store Owner',
      role: 'Speaks loan request in Hindi/Kannada & accepts digital consent',
      icon: Building2,
      accent: 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400',
      tag: 'Demand Originator',
      actionText: 'Consent to Account Aggregator & Biometric e-KYC',
    },
    {
      step: 2,
      name: 'VoiceLend (LSP / DLA)',
      actor: 'Digital Lending App Layer',
      role: 'Multilingual Voice AI + Deterministic Underwriting + KFS presentation',
      icon: Cpu,
      accent: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
      tag: 'Regulated LSP Tech',
      actionText: 'Calculates cashflow capacity; Never touches borrower capital',
    },
    {
      step: 3,
      name: 'Account Aggregator (AA)',
      actor: 'Sahamati / Setu / Anumati',
      role: 'Encrypted, tamper-proof financial data fetch from Merchant Bank',
      icon: ArrowDownUp,
      accent: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
      tag: 'RBI Regulated AA',
      actionText: 'Streams 6-month GST & UPI cashflow telemetry directly to Lender',
    },
    {
      step: 4,
      name: 'Regulated Lending Partner',
      actor: 'NBFC / Small Finance Bank',
      role: 'Balance-sheet risk sanction, policy clearance & KFS issuance',
      icon: Landmark,
      accent: 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
      tag: 'Balance Sheet Lender (RE)',
      actionText: 'Approves credit limit & authorizes escrow fund release',
    },
    {
      step: 5,
      name: 'Zero-Touch Escrow (NPCI)',
      actor: 'Direct Bank Settlement',
      role: 'Direct transfer from Lender Escrow to Merchant Account via IMPS',
      icon: ShieldCheck,
      accent: 'border-violet-500 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
      tag: 'Disbursement Rail',
      actionText: 'Zero intermediary transit: ₹1,50,000 credited in <45 seconds',
    },
  ];

  const complianceItems = [
    {
      title: 'Zero-Touch Escrow Disbursement',
      rule: 'RBI Digital Lending Guidelines Clause 3.1',
      status: 'Fully Compliant',
      detail: 'Loan disbursal is executed directly from the Regulated Entity (RE) escrow account to the verified merchant current account. VoiceLend has zero access to borrower principal funds.',
    },
    {
      title: 'Explicit Multilingual Key Facts Statement (KFS)',
      rule: 'RBI Master Direction - KFS Standard (2024)',
      status: 'Fully Compliant',
      detail: 'Before contract execution, a standardized KFS detailing APR, processing fees, penal interest, and cooling-off period is shown visually and read aloud in the merchant’s native tongue.',
    },
    {
      title: 'Lending Service Provider (LSP) Fee Transparency',
      rule: 'RBI Master Direction on Digital Lending (2022)',
      status: 'Fully Compliant',
      detail: 'VoiceLend receives a fixed 1.5% - 2.5% origination tech fee paid directly by the partner NBFC. Zero hidden fees or pass-through charges are levied on the micro-merchant.',
    },
    {
      title: '3-Day Look-Up / Cooling-Off Period',
      rule: 'RBI Borrower Protection Framework',
      status: 'Fully Compliant',
      detail: 'Borrower can exit the working capital facility within 3 business days by repaying principal with zero pre-payment or foreclosure penalty.',
    },
    {
      title: 'Account Aggregator Encrypted Data Rail',
      rule: 'RBI-Sahamati Data Governance',
      status: 'Fully Compliant',
      detail: 'All bank cashflow statements are fetched via RBI-registered Account Aggregators with explicit time-bounded purpose consent and cryptographic audit log.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Regulated Capital Architecture & Fund Flow</h3>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                  RBI Master Directions 2024
                </span>
              </div>
              <p className="text-xs text-slate-300">
                End-to-end institutional fund routing, LSP technology boundaries & regulatory safeguards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('flow')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'flow'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            Interactive Fund & Data Flow
          </button>
          <button
            onClick={() => setActiveTab('safeguards')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'safeguards'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Lock className="w-4 h-4" />
            LSP Zero-Touch Safeguards
          </button>
          <button
            onClick={() => setActiveTab('rbi-checklist')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'rbi-checklist'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <BadgeCheck className="w-4 h-4" />
            RBI Compliance Audit Matrix
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900 dark:text-slate-100">
          {activeTab === 'flow' && (
            <div className="space-y-6">
              {/* Flow Steps Horizontal Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {flowSteps.map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeStep === item.step;
                  return (
                    <div
                      key={item.step}
                      onClick={() => setActiveStep(item.step)}
                      className={`cursor-pointer rounded-2xl border p-3.5 transition-all flex flex-col justify-between ${
                        isSelected
                          ? `${item.accent} ring-2 ring-emerald-500/50 shadow-md`
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            Step {item.step}
                          </span>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold leading-tight">{item.name}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{item.actor}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        {item.tag}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Step Deep-Dive Box */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                      {activeStep}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {flowSteps[activeStep - 1].name} — Detailed Mechanism
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Protocol: {activeStep === 3 ? 'Sahamati AA v2.1' : activeStep === 5 ? 'NPCI IMPS / e-NACH' : 'REST over TLS 1.3'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {flowSteps[activeStep - 1].role}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Actions Executed in this Phase:
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                      {flowSteps[activeStep - 1].actionText}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-sky-500" />
                      Regulatory Boundary Guarantee:
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                      {activeStep === 2
                        ? 'Strict LSP boundary: No fund co-mingling, pool accounts, or synthetic credit structuring.'
                        : activeStep === 4
                        ? 'Lending partner retains 100% credit risk & underwriting balance sheet liability.'
                        : 'Cryptographic non-repudiation audit trail stored for 8 years per RBI guidelines.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fund Routing Architecture Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-emerald-200">
                    Zero Balance-Sheet Risk for VoiceLend
                  </span>
                  <p className="text-emerald-700 dark:text-emerald-300 text-[11px] leading-relaxed">
                    VoiceLend is certified strictly as an origination, voice-AI, and underwriting engine technology layer (LSP/DLA). All credit risk, loan books, interest income, and default provisions reside exclusively with our registered banking partners (Protium, InCred, AU Small Finance Bank).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'safeguards' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Direct Escrow Disbursement</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    No intermediary wallets or pass-through ledger accounts. Disbursal commands originate from the partner NBFC’s treasury and settle directly into the merchant’s current account via NPCI IMPS.
                  </p>
                  <div className="pt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Verified zero-touch flow
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">LSP Fee Revenue Model</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    VoiceLend charges zero fee to borrowers. A technology facilitation fee of 1.5% - 2.5% of sanctioned principal is invoiced directly to the lending institution on successful disbursal.
                  </p>
                  <div className="pt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ 100% borrower fee transparency
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Cryptographic Consent Log</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Every voice loan request captures timestamped audio transcripts, SHA-256 intent signatures, and IP/Device tokens stored on immutable append-only audit ledgers for banking compliance.
                  </p>
                  <div className="pt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ RBI Audit Trail Ready
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                    <ArrowDownUp className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Daily Auto-Split Recovery Rails</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Rather than monthly lumpsum shocks, daily repayments are automatically swept from verified UPI QR collections, lowering portfolio NPA (Non-Performing Asset) rates below 1.2%.
                  </p>
                  <div className="pt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Frictionless micro-servicing
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rbi-checklist' && (
            <div className="space-y-3">
              {complianceItems.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      {item.status}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 pl-6">
                    {item.rule}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Lending Partners: Samriddhi NBFC • InCred Capital • AU SFB Sandbox</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold hover:opacity-90 transition-opacity"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
}
