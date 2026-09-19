import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Activity,
  HeartPulse,
  TrendingUp,
  ShieldCheck,
  Zap,
  Store,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Merchant, SupportedLanguage } from '../types';
import { SEEDED_MONTHLY_FINANCIALS } from '../data/seedData';
import { TRANSLATIONS } from '../services/translations';

interface BusinessHealthViewProps {
  merchant: Merchant;
  language: SupportedLanguage;
  onStartVoiceLoan: () => void;
}

export const BusinessHealthView: React.FC<BusinessHealthViewProps> = ({
  merchant,
  language,
  onStartVoiceLoan,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['English'];

  return (
    <div id="business-health-view" className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Health Index
            </span>
            <span className="text-xs text-slate-400">• Updated daily from UPI QR switch</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {merchant.businessName} — Financial Health
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational cash flow patterns, debt coverage ratios, and digital footprint analytics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Digital Composite Score</div>
            <div className="text-2xl font-black text-emerald-600">{merchant.digitalTransactionScore}/100</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <HeartPulse className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* 4 Financial Ratios */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Debt Service Coverage (DSCR)</div>
          <div className="text-2xl font-black text-slate-900">7.1x</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Excellent (&gt;1.5x minimum benchmark)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Debt-to-Cashflow Ratio</div>
          <div className="text-2xl font-black text-slate-900">
            {((merchant.existingEMI / merchant.monthlyCashflow) * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Substantial headroom (Cap: 30%)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Monthly UPI Volume</div>
          <div className="text-2xl font-black text-slate-900">{merchant.upiQrTransactionsPerMonth || 420}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            99.4% settlement success rate
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Store Vintage</div>
          <div className="text-2xl font-black text-slate-900">
            {(merchant.businessVintageMonths / 12).toFixed(1)} Yrs
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Zero supplier payment defaults
          </div>
        </div>
      </div>

      {/* Recharts Chart: Monthly Sales vs Surplus Cash Flow */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Revenue & Operating Surplus Trend</h3>
            <p className="text-xs text-slate-500">6-Month historical performance via Account Aggregator</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              Gross Sales (₹)
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded-full bg-sky-500"></span>
              Net Cashflow (₹)
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SEEDED_MONTHLY_FINANCIALS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCashflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${(v/1000)}k`} />
              <Tooltip
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="sales" name="Monthly Sales" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
              <Area type="monotone" dataKey="cashflow" name="Net Cashflow" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCashflow)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supplier & Distributor Payment Discipline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-2">Commercial Distributor Settlement History</h3>
        <p className="text-xs text-slate-500 mb-4">
          Direct verification with regional distributor accounts (Hindustan Unilever, ITC, Nandini Dairy)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">Hindustan Unilever Distributor</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Average Volume: ₹42,000 / mo</div>
              <div className="text-[10px] text-emerald-700 font-bold mt-1">100% Timely Settlements</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">ITC FMCG Wholesale Hub</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Average Volume: ₹34,500 / mo</div>
              <div className="text-[10px] text-emerald-700 font-bold mt-1">100% Timely Settlements</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">Nandini Dairy Cooperative</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Average Volume: ₹18,200 / mo</div>
              <div className="text-[10px] text-emerald-700 font-bold mt-1">Daily Automated Clearing</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
