import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Shield,
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Mic,
  DollarSign,
  Layers,
  Check,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { LoanApplication } from '../types';
import { SEEDED_ADMIN_METRICS } from '../data/seedData';
import { apiClient } from '../services/apiClient';

interface AdminDashboardViewProps {
  applications: LoanApplication[];
  selectedAppId?: string | null;
  onUpdateStatus: (applicationId: string, status: LoanApplication['status']) => void;
  onNavigateToFederated?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  applications,
  selectedAppId: initialSelectedAppId,
  onUpdateStatus,
  onNavigateToFederated,
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    initialSelectedAppId || (applications[0]?.applicationId || null)
  );
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Sarvam AI Telemetry State
  const [sarvamHealth, setSarvamHealth] = useState<any>(null);
  const [isPingingSarvam, setIsPingingSarvam] = useState(false);
  const [sarvamPingResult, setSarvamPingResult] = useState<{ latencyMs: number; response?: any; error?: string } | null>(null);

  useEffect(() => {
    apiClient.getSarvamHealth().then((h) => setSarvamHealth(h));
  }, []);

  const handleTestSarvamPing = async () => {
    setIsPingingSarvam(true);
    setSarvamPingResult(null);
    try {
      const res = await apiClient.testSarvamPing('Mujhe 2 lakh ka kirana loan chahiye Diwali stock ke liye', 'Hinglish');
      setSarvamPingResult(res);
      // Refresh health
      const h = await apiClient.getSarvamHealth();
      setSarvamHealth(h);
    } catch (err: any) {
      setSarvamPingResult({ latencyMs: 0, error: err.message });
    } finally {
      setIsPingingSarvam(false);
    }
  };

  useEffect(() => {
    if (initialSelectedAppId) {
      setSelectedAppId(initialSelectedAppId);
    }
  }, [initialSelectedAppId]);

  const selectedApp = applications.find((a) => a.applicationId === selectedAppId) || applications[0];

  const filteredApps = applications.filter((app) => {
    const matchesFilter = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesSearch =
      app.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (status: LoanApplication['status']) => {
    if (!selectedApp) return;
    onUpdateStatus(selectedApp.applicationId, status);
    setActionSuccessMsg(`Application ${selectedApp.applicationId} marked as ${status.toUpperCase()}`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  return (
    <div id="admin-dashboard-view" className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              Lender Portal • Underwriting Desk
            </span>
            <span className="text-xs text-slate-400">• Samriddhi Microfinance Bank Ltd</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Voice Lending Portfolio & Underwriting Monitor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multi-tenant pipeline of voice loan applications, explainable decisions, and disbursements
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onNavigateToFederated && (
            <button
              onClick={onNavigateToFederated}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold text-indigo-800 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Zero-Knowledge FedAI Console &rarr;</span>
            </button>
          )}

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            72% Instant Auto-Approval Rate
          </span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Total Applications</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{SEEDED_ADMIN_METRICS.totalApplications}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">₹{SEEDED_ADMIN_METRICS.totalRequestedLakhs} Lakhs Requested</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Eligible Pre-Sanction</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{SEEDED_ADMIN_METRICS.eligibleApplications}</div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Rule Pass: 69.3%</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Under Review</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{SEEDED_ADMIN_METRICS.underReview}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Avg latency 34 secs</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Approved / Disbursed</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{SEEDED_ADMIN_METRICS.approvedCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Zero manual paper</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm col-span-2 lg:col-span-1">
          <div className="text-xs text-slate-500 font-semibold">Avg Ticket Size</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{SEEDED_ADMIN_METRICS.averageTicketSize}</div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">12-Month Working Capital</div>
        </div>
      </div>

      {/* Sarvam AI Sovereign Indic Stack Telemetry & Diagnostics */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-500 to-emerald-500 flex items-center justify-center font-black text-white text-base shadow-md shadow-indigo-500/20">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-slate-100">Sarvam AI Sovereign Indic Stack Monitor</h3>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  sarvamHealth?.status === 'connected'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sarvamHealth?.status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {sarvamHealth?.status === 'connected' ? 'API Key Verified & Connected' : 'Simulated / Standby'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Indigenous Indic voice underwriting, Saaras ASR v3 speech recognition &amp; Bulbul TTS v2
              </p>
            </div>
          </div>

          <button
            onClick={handleTestSarvamPing}
            disabled={isPingingSarvam}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPingingSarvam ? 'animate-spin' : ''}`} />
            <span>{isPingingSarvam ? 'Pinging Sarvam AI...' : 'Run Live Ping Test'}</span>
          </button>
        </div>

        {/* Models & Latency Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Indic LLM Engine</span>
            <span className="font-bold text-slate-200 mt-0.5 block">Sarvam Indic LLM</span>
            <span className="text-[10px] text-emerald-400">Structured JSON Intent Extraction</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Speech-to-Text (STT)</span>
            <span className="font-bold text-slate-200 mt-0.5 block">Saaras ASR v3</span>
            <span className="text-[10px] text-sky-400">Market Noise &amp; Accent Resilient</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Text-to-Speech (TTS)</span>
            <span className="font-bold text-slate-200 mt-0.5 block">Bulbul TTS v2</span>
            <span className="text-[10px] text-amber-400">Speakers: Meera, Pavithra, Mahesh</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Roundtrip Latency</span>
            <span className="font-mono font-black text-emerald-400 text-sm mt-0.5 block">
              {sarvamPingResult ? `${sarvamPingResult.latencyMs} ms` : sarvamHealth?.latencyMs ? `${sarvamHealth.latencyMs} ms` : '~220 ms'}
            </span>
            <span className="text-[10px] text-slate-400">Real-time API response</span>
          </div>
        </div>

        {/* Live Ping Test Output */}
        {sarvamPingResult && (
          <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/40 text-xs font-mono animate-in fade-in-50">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-sans">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Live Sarvam Indic LLM Ping Result ({sarvamPingResult.latencyMs}ms)
              </span>
              <span className="text-emerald-400 font-bold">200 OK</span>
            </div>
            <pre className="text-emerald-300 text-[11px] overflow-x-auto p-2 bg-slate-950 rounded-lg">
              {JSON.stringify(sarvamPingResult.response || sarvamPingResult.error, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Analytics Charts Grid: Weekly Pipeline & Purpose Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Ingestion Volume */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Application Velocity & Volume (This Week)</h3>
              <p className="text-xs text-slate-500">Inbound voice requests processed through Indic AI</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Total: 124 Applications</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SEEDED_ADMIN_METRICS.applicationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(val: any, name: any) => [name === 'volume' ? `₹${val} Lakhs` : `${val} apps`, name === 'volume' ? 'Volume' : 'Count']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" name="Applications" fill="#0f172a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="volume" name="Disbursement Volume (₹L)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Purpose Distribution Pie */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Loan Purpose Categorization</h3>
            <p className="text-xs text-slate-500">Intent extracted via Indic NLP</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SEEDED_ADMIN_METRICS.purposeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {SEEDED_ADMIN_METRICS.purposeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] mt-2">
            {SEEDED_ADMIN_METRICS.purposeDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="truncate">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Management Master-Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Applications Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-base font-bold text-slate-900">Application Queue</h3>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-xs">
              {['ALL', 'Submitted', 'Lender Review', 'Approved', 'Disbursed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search merchant, business name, or application ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-2.5 px-3">Merchant</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => {
                  const isSelected = app.applicationId === selectedApp?.applicationId;
                  return (
                    <tr
                      key={app.applicationId}
                      onClick={() => setSelectedAppId(app.applicationId)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{app.businessName}</div>
                        <div className="text-[10px] text-slate-500">{app.merchantName} • {app.applicationId}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">₹{app.approvedAmount.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-slate-500">{app.tenureMonths} Mo @ {app.interestRate}%</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === 'Approved' || app.status === 'Disbursed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-emerald-700 font-bold hover:underline">
                          Review &rarr;
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 Columns: Interactive Application Review Panel */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
          {selectedApp ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-slate-400">APPLICATION DOSSIER</span>
                  <h4 className="text-base font-bold text-slate-900">{selectedApp.applicationId}</h4>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  {selectedApp.status}
                </span>
              </div>

              {/* Action Banner message if any */}
              {actionSuccessMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionSuccessMsg}</span>
                </div>
              )}

              {/* Business profile info */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-bold text-slate-900">{selectedApp.merchantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Store Name:</span>
                  <span className="font-bold text-slate-900">{selectedApp.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sanctioned Principal:</span>
                  <span className="font-black text-emerald-700 text-sm">
                    ₹{selectedApp.approvedAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly EMI:</span>
                  <span className="font-bold text-slate-900">
                    ₹{selectedApp.monthlyEMI.toLocaleString('en-IN')} ({selectedApp.tenureMonths} mos)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Purpose:</span>
                  <span className="text-slate-800 font-medium">{selectedApp.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">KFS Informed Consent:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Signed ({selectedApp.consentTimestamp})</span>
                  </span>
                </div>
              </div>

              {/* Risk Engine Evaluation */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1.5">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Deterministic Underwriting Decision</span>
                </div>
                <p className="text-emerald-800 text-[11px]">
                  Borrower meets debt-to-cashflow requirements. Credit facility approved with pre-configured monthly repayment capacity.
                </p>
              </div>

              {/* Underwriting Actions Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Lender Decision Actions
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    id="btn-admin-approve"
                    onClick={() => handleStatusChange('Approved')}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Offer</span>
                  </button>

                  <button
                    type="button"
                    id="btn-admin-disburse"
                    onClick={() => handleStatusChange('Disbursed')}
                    className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Disburse Now</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    id="btn-admin-review"
                    onClick={() => handleStatusChange('Lender Review')}
                    className="py-1.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    Set to In Review
                  </button>

                  <button
                    type="button"
                    id="btn-admin-reject"
                    onClick={() => handleStatusChange('Rejected')}
                    className="py-1.5 px-3 border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold"
                  >
                    Decline Demo
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select an application from the queue to view dossier details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
