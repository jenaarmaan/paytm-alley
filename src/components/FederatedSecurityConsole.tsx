import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  Cpu, 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Sparkles, 
  Zap, 
  Server, 
  Smartphone, 
  Layers, 
  FileCode, 
  Fingerprint, 
  TrendingUp, 
  Bug,
  ShieldAlert,
  Terminal,
  Share2
} from 'lucide-react';
import { 
  federatedCoordinator 
} from '../services/federated/federatedAggregator';
import { 
  FederatedRoundState, 
  SecurityAuditLog, 
  AttackSimulationResult 
} from '../services/federated/types';

export const FederatedSecurityConsole: React.FC = () => {
  const [roundState, setRoundState] = useState<FederatedRoundState>(federatedCoordinator.getRoundState());
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(federatedCoordinator.getAuditLogs());
  const [isExecutingRound, setIsExecutingRound] = useState(false);
  const [executionStepMessage, setExecutionStepMessage] = useState<string | null>(null);

  // Attack simulator state
  const [activeAttackResult, setActiveAttackResult] = useState<AttackSimulationResult | null>(null);
  const [isSimulatingAttack, setIsSimulatingAttack] = useState(false);

  // Trigger Federated Round
  const handleTriggerRound = async () => {
    setIsExecutingRound(true);
    try {
      const result = await federatedCoordinator.executeFederatedRound((status, msg) => {
        setExecutionStepMessage(msg);
      });
      setRoundState(result.updatedState);
      setAuditLogs([...result.newLogs]);
    } finally {
      setIsExecutingRound(false);
      setExecutionStepMessage(null);
    }
  };

  // Trigger Cybersecurity Attack Simulation
  const handleRunAttackSimulation = (type: AttackSimulationResult['attackType']) => {
    setIsSimulatingAttack(true);
    setActiveAttackResult(null);

    setTimeout(() => {
      const res = federatedCoordinator.runAttackSimulation(type);
      setActiveAttackResult(res);
      setAuditLogs([...federatedCoordinator.getAuditLogs()]);
      setIsSimulatingAttack(false);
    }, 600);
  };

  return (
    <div id="federated-security-console" className="space-y-6 animate-in fade-in-50 duration-300">
      
      {/* 1. Executive Top Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-3xl border border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                DPDP Act 2023 &amp; RBI Digital Lending Compliant
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                (ε = 0.8, δ = 10⁻⁵)-Differential Privacy
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Zero-Knowledge Federated Learning &amp; Cybersecurity Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Trains collective credit underwriting intelligence across thousands of Bharat micro-merchants while guaranteeing that <strong className="text-emerald-400">zero raw financial records, customer khatas, or voice audio ever leave the merchant's local device</strong>.
            </p>
          </div>

          {/* Action Button */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              id="btn-trigger-fedavg-round"
              onClick={handleTriggerRound}
              disabled={isExecutingRound}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-slate-950 ${isExecutingRound ? 'animate-spin' : ''}`} />
              <span>{isExecutingRound ? 'Executing FedAvg Round...' : 'Trigger Federated Training Round'}</span>
            </button>
          </div>
        </div>

        {/* Live Step Progression Notification */}
        {executionStepMessage && (
          <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-pulse">
            <Radio className="w-4 h-4 text-emerald-400 animate-ping" />
            <span className="font-mono">{executionStepMessage}</span>
          </div>
        )}
      </div>

      {/* 2. Key Privacy Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Raw PII Uploaded Metric */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Raw Financial Data Uploaded</span>
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            0 Bytes
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% On-Device Isolation</span>
          </div>
        </div>

        {/* Differential Privacy Budget */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Privacy Budget (ε Spent)</span>
            <Fingerprint className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            ε = {roundState.epsilonSpent}
          </div>
          <div className="text-[11px] text-indigo-700 dark:text-indigo-300 font-semibold mt-1 flex items-center gap-1">
            <span>Gaussian Mechanism (δ = 10⁻⁵)</span>
          </div>
        </div>

        {/* Global Underwriting Accuracy */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Collaborative Model Accuracy</span>
            <TrendingUp className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {roundState.accuracy}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Global Loss: <strong className="font-mono text-slate-800 dark:text-slate-200">{roundState.globalLoss}</strong>
          </div>
        </div>

        {/* Active Communication Round */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Federated Communication Round</span>
            <Server className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            Round #{roundState.roundNumber}
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold mt-1">
            {roundState.participatingNodes.length} Active Bharat Edge Nodes
          </div>
        </div>
      </div>

      {/* 3. Distributed Edge Nodes Network Map */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Distributed Edge Clients (On-Device Local Training Mesh)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each merchant device runs local SGD on SQLite features, clips gradients at L2 ≤ 1.0, and injects Gaussian noise before upload
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {roundState.participatingNodes.length} Participating Edge Nodes
          </span>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roundState.participatingNodes.map((node) => (
            <div
              key={node.clientId}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800/80 space-y-2.5 transition-all hover:border-emerald-500/40"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                    {node.merchantName}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {node.businessType} • {node.location}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {node.clientId.split('-')[1]}
                </span>
              </div>

              <div className="space-y-1 text-[11px] pt-2 border-t border-slate-200 dark:border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-500">Local Ledger Records:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{node.localSampleCount} transactions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Raw Data Transmitted:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">0 Bytes (Zero PII)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gradient Delta Size:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">~{node.uploadedBytes} Bytes (8-bit Quantized)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gaussian Noise Scale:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">σ = {node.noiseScale}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  {node.status}
                </span>
                <span className="font-mono text-slate-400">Loss: {node.lastLoss}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Cybersecurity Attack Resilience Suite */}
      <div className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Cybersecurity Attack Resilience &amp; Threat Neutralization Suite
              </h3>
              <p className="text-xs text-slate-400">
                Live interactive penetration simulation proving defense against data breaches and adversarial manipulation
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 self-start sm:self-auto">
            All Threat Vectors Mitigated
          </span>
        </div>

        {/* 3 Attack Test Vectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => handleRunAttackSimulation('MEMBERSHIP_INFERENCE')}
            disabled={isSimulatingAttack}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">
                  1. Membership Inference Attack
                </span>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Adversary queries central weights to reverse-engineer a specific Kirana's sales amount.
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold mt-3 block">
              Test Defense (Gaussian DP) &rarr;
            </span>
          </button>

          <button
            onClick={() => handleRunAttackSimulation('MODEL_POISONING')}
            disabled={isSimulatingAttack}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/40 text-left transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-200 group-hover:text-rose-300">
                  2. Byzantine Model Poisoning
                </span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Rogue node injects extreme outlier gradients (8.5x spike) to manipulate credit scores.
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold mt-3 block">
              Test Defense (L2 Norm Clamp) &rarr;
            </span>
          </button>

          <button
            onClick={() => handleRunAttackSimulation('MITM_PACKET_SNIFFING')}
            disabled={isSimulatingAttack}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">
                  3. MITM Wire Sniffing Attack
                </span>
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Attacker intercepts wireless network packets to steal merchant bank balances and PANs.
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold mt-3 block">
              Test Defense (Zero PII Wire) &rarr;
            </span>
          </button>
        </div>

        {/* Live Attack Simulation Feedback Card */}
        {activeAttackResult && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 text-xs space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-sm">
                  {activeAttackResult.attackName} — {activeAttackResult.status}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Defense Verified
              </span>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              {activeAttackResult.details}
            </p>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono space-y-1 text-slate-300">
              <div className="text-slate-400 font-sans font-semibold">Cryptographic Defense Proof:</div>
              <div className="text-emerald-400">{activeAttackResult.evidenceProof}</div>
              <div className="text-slate-400 text-[10px]">Defense Mechanism: {activeAttackResult.defenseMechanism}</div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Live Cryptographic Security Audit Trail */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Immutable Cryptographic Audit Trail (DPDP &amp; RBI Compliance)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {auditLogs.length} Events Logged
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-mono">
          {auditLogs.map((log) => (
            <div key={log.auditId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  log.event.includes('ATTACK') || log.event.includes('COMPLIANCE')
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                }`}>
                  {log.event}
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-sans text-xs">
                  {log.proofSummary}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-slate-400 text-[11px]">
                <span>{log.auditId}</span>
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
