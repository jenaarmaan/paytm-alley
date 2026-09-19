import React, { useState } from 'react';
import {
  Layers,
  Terminal,
  Code2,
  Play,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  RefreshCw,
  Server,
  ArrowRight,
} from 'lucide-react';
import { MCP_TOOLS_CATALOG } from '../data/seedData';
import { MCPTool } from '../types';
import { apiClient } from '../services/apiClient';

interface EnterpriseIntegrationsViewProps {
  onOpenCapitalFlow?: () => void;
}

export const EnterpriseIntegrationsView: React.FC<EnterpriseIntegrationsViewProps> = ({
  onOpenCapitalFlow,
}) => {
  const [selectedTool, setSelectedTool] = useState<MCPTool>(MCP_TOOLS_CATALOG[0]);
  const [paramInput, setParamInput] = useState<string>(
    JSON.stringify(MCP_TOOLS_CATALOG[0].examplePayload, null, 2)
  );
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  const handleSelectTool = (tool: MCPTool) => {
    setSelectedTool(tool);
    setParamInput(JSON.stringify(tool.examplePayload, null, 2));
    setExecutionResult(null);
  };

  const handleExecuteTool = async () => {
    setIsExecuting(true);
    setExecutionResult(null);
    try {
      const parsedArgs = JSON.parse(paramInput);
      const res = await apiClient.executeMCPTool(selectedTool.name, parsedArgs);
      setExecutionResult(res);
    } catch (err: any) {
      setExecutionResult({ error: err.message || 'Execution error' });
    } finally {
      setIsExecuting(false);
    }
  };

  const sampleCurl = `curl -X POST http://localhost:3000/api/voice/extract-intent \\
  -H "Content-Type: application/json" \\
  -d '{
    "transcript": "Mujhe 2 lakh chahiye Diwali ke liye stock kharidne.",
    "language": "Hinglish"
  }'`;

  return (
    <div id="enterprise-integrations-view" className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Model Context Protocol (MCP) & Core Banking REST APIs
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Enterprise Lending Architecture & Tool Registry
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Production-grade interface for NBFC core banking, account aggregators, and agent orchestration
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCapitalFlow && (
              <button
                onClick={onOpenCapitalFlow}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>View Capital Flow Diagram</span>
              </button>
            )}
            <span className="text-xs font-mono bg-slate-900 text-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>MCP Protocol v2024.11</span>
            </span>
          </div>
        </div>
      </div>

      {/* Architecture Separation Diagram */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">
          SYSTEM ARCHITECTURE & SEPARATION OF RESPONSIBILITY
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="flex items-center gap-2 text-sky-400 font-bold mb-2">
              <Zap className="w-4 h-4" />
              <span>1. AI Intent & Voice Layer</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Handles multilingual Indic speech recognition and semantic slot filling via Gemini 3.8 Flash. Generates user-friendly voice explanations. Never performs calculations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>2. Deterministic Financial Core</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Executes strict mathematical formulas: standard EMI calculation, debt service limits (30% ceiling), credit history gating, and key facts generation. 100% reproducible.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
              <Layers className="w-4 h-4" />
              <span>3. MCP & Enterprise Bridge</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Provides secure tool execution boundaries. Distinguishes READ operations from irreversible ACTION operations (disbursement, consent recording) requiring confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive MCP Tool Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Columns: Tool Registry List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Registered MCP Tools ({MCP_TOOLS_CATALOG.length})</h3>
          <p className="text-xs text-slate-500 mb-4">Click to inspect schema and execute live</p>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {MCP_TOOLS_CATALOG.map((tool) => {
              const isSelected = selectedTool.name === tool.name;
              return (
                <div
                  key={tool.name}
                  onClick={() => handleSelectTool(tool)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{tool.name}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        tool.type === 'ACTION'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {tool.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{tool.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Columns: Interactive Executor */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400">TOOL SPECIFICATION</span>
                <h4 className="text-base font-bold text-slate-900 font-mono">{selectedTool.name}</h4>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  selectedTool.type === 'ACTION'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {selectedTool.type === 'ACTION' ? 'ACTION (Consent Required)' : 'READ (Idempotent)'}
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4">{selectedTool.description}</p>

            {/* Parameter Input JSON Editor */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Execution Arguments (JSON)</span>
                <span className="text-[10px] text-slate-400 font-mono">Editable Schema</span>
              </div>
              <textarea
                value={paramInput}
                onChange={(e) => setParamInput(e.target.value)}
                rows={4}
                className="w-full font-mono text-xs p-3 bg-slate-900 text-emerald-300 rounded-xl border border-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Execute Button */}
            <div className="flex justify-end mb-4">
              <button
                type="button"
                id="btn-execute-mcp-tool"
                disabled={isExecuting}
                onClick={handleExecuteTool}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all disabled:bg-slate-300"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Tool...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Execute MCP Tool</span>
                  </>
                )}
              </button>
            </div>

            {/* Result Output Viewer */}
            {executionResult && (
              <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 overflow-x-auto max-h-64">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Tool Output Response</span>
                  <span className="text-emerald-400 font-bold">200 OK</span>
                </div>
                <pre className="text-emerald-300">{JSON.stringify(executionResult, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REST API & Curl Quick Integration */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">Direct Core Banking REST API Example</h3>
          </div>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(sampleCurl);
              setCopiedCurl(true);
              setTimeout(() => setCopiedCurl(false), 2000);
            }}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
          >
            {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCurl ? 'Copied to Clipboard' : 'Copy cURL'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
          {sampleCurl}
        </pre>
      </div>
    </div>
  );
};
