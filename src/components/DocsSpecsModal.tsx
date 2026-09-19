import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Terminal,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  Server,
  ArrowRight
} from 'lucide-react';
import { MCP_TOOLS_CATALOG } from '../data/seedData';

interface DocsSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMCP?: () => void;
  onOpenCapitalRails?: () => void;
}

export const DocsSpecsModal: React.FC<DocsSpecsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToMCP,
  onOpenCapitalRails,
}) => {
  const [copiedMcpConfig, setCopiedMcpConfig] = useState(false);

  if (!isOpen) return null;

  const handleCopyMcpConfig = () => {
    const config = {
      mcpServers: {
        paytmVoiceLend: {
          url: `${window.location.origin}/api/mcp`,
          description: "Paytm VoiceLend Model Context Protocol Server for Indic Underwriting & Micro-Loans",
          protocolVersion: "2024-11-05",
          tools: MCP_TOOLS_CATALOG.map((t) => t.name),
        },
      },
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopiedMcpConfig(true);
    setTimeout(() => setCopiedMcpConfig(false), 2000);
  };

  return (
    <div
      id="docs-specs-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col w-full max-w-5xl max-h-[90vh] overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-emerald-500 flex items-center justify-center font-bold text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Architecture, MCP &amp; System Specifications
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Technical Docs
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Core banking MCP tool registry, deterministic underwriting math, and federated learning architecture
              </p>
            </div>
          </div>

          <button
            id="btn-close-docs"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950/40">
          
          {/* SECTION 1: MODEL CONTEXT PROTOCOL (MCP) TOOL REGISTRY */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Model Context Protocol (MCP) Tool Registry
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    Endpoint: /api/mcp
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Production MCP server providing 6 deterministic core banking and credit underwriting tools to autonomous AI agents.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMcpConfig}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Copy MCP server configuration for Cursor/Claude/Agent IDE"
                >
                  {copiedMcpConfig ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMcpConfig ? 'Copied!' : 'Copy MCP JSON'}</span>
                </button>

                {onNavigateToMCP && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToMCP();
                    }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Open MCP Playground ↗</span>
                  </button>
                )}
              </div>
            </div>

            {/* 6 MCP Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {MCP_TOOLS_CATALOG.map((tool) => (
                <div
                  key={tool.name}
                  className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <code className="font-mono font-bold text-slate-900 dark:text-white text-[11px]">
                        {tool.name}
                      </code>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          tool.type === 'ACTION'
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-sky-100 text-sky-900 dark:bg-sky-950/60 dark:text-sky-300'
                        }`}
                      >
                        {tool.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: DETERMINISTIC UNDERWRITING MATH */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Cpu className="w-4 h-4" />
              <h3 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                Deterministic Underwriting Formulation
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              VoiceLend eliminates arbitrary credit rejections by employing a mathematically transparent underwriting engine driven by Account Aggregator (AA) telemetry:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  1. Monthly EMI Capacity
                </span>
                <code className="text-indigo-600 dark:text-indigo-400 text-[11px] block font-mono font-bold">
                  (Sales × 0.30) - Existing EMIs
                </code>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  30% debt-service ratio ceiling
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  2. Sanction Bounds
                </span>
                <code className="text-emerald-600 dark:text-emerald-400 text-[11px] block font-mono font-bold">
                  [max(15k, 0.25×Sales), min(500k, 2.0×Sales)]
                </code>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Dynamic range tied to turnover
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  3. Dynamic Interest Rate
                </span>
                <code className="text-amber-600 dark:text-amber-400 text-[11px] block font-mono font-bold">
                  16.0% - 1.5%(vintage) + 1.0%(debt)
                </code>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Reward vintage &amp; low leverage
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 3: ZERO-KNOWLEDGE FEDERATED LEARNING */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                Zero-Knowledge Federated Learning Architecture
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Merchant cashflows, UPI customer details, and invoices NEVER leave the merchant device unencrypted. Training weights are aggregated via FedAvg with differential privacy guarantees ($\varepsilon = 0.5, \delta = 10^{-5}$) and verified using Zero-Knowledge Proofs.
            </p>
          </div>

          {/* SECTION 4: SACHET INSURANCE & DAILY SOUNDBOX QR REPAYMENT */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
              <Zap className="w-4 h-4" />
              <h3 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                Sachet Insurance &amp; Daily QR Auto-Split Repayment
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Micro-premiums are auto-deducted daily from merchant Paytm Soundbox/UPI QR settlements (₹3 to ₹7/day). When cashflow dips occur, the platform activates a 72-hour No-CIBIL-Hit moratorium buffer with 100% bounce-fee waiver under RBI Fair Lending Directives.
            </p>
          </div>

          {/* SECTION 5: RBI CAPITAL RAILS */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  RBI-Compliant Lending Capital Rails &amp; Direct Escrow
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct disbursement from NBFC Partner Escrow into Merchant Bank Account (No pool account intermediary).
                </p>
              </div>
              {onOpenCapitalRails && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCapitalRails();
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  View Capital Rails
                </button>
              )}
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl text-xs font-mono space-y-2">
              <div className="text-emerald-400 font-bold">1. Digital Consent &amp; Key Facts Statement (KFS) Generation</div>
              <div className="text-slate-300 pl-4">→ Encrypted digital audit trail with timestamp, Aadhaar OTP / Biometric token</div>
              <div className="text-sky-400 font-bold">2. Direct Escrow Disbursal</div>
              <div className="text-slate-300 pl-4">→ NBFC Partner (Credit Saison / Muthoot) → RBI NEFT/IMPS → Merchant Current A/C</div>
              <div className="text-amber-400 font-bold">3. Auto-Split Daily Repayment</div>
              <div className="text-slate-300 pl-4">→ Daily Paytm Soundbox QR Inflow (5%-15% auto-split) → Escrow Settlement</div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>VoiceLend Technical Architecture &amp; Model Context Protocol</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Specs
          </button>
        </div>

      </div>
    </div>
  );
};
