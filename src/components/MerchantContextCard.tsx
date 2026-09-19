import React, { useState } from 'react';
import {
  Store,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Activity,
  MapPin,
  TrendingUp,
  CreditCard,
  Network,
  CheckCircle,
} from 'lucide-react';
import { Merchant, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../services/translations';

interface MerchantContextCardProps {
  merchant: Merchant;
  language: SupportedLanguage;
}

export const MerchantContextCard: React.FC<MerchantContextCardProps> = ({
  merchant,
  language,
}) => {
  const [showGraphView, setShowGraphView] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS['English'];

  const vintageYears = (merchant.businessVintageMonths / 12).toFixed(1);
  const debtRatio = ((merchant.existingEMI / merchant.monthlyCashflow) * 100).toFixed(1);

  return (
    <div id="merchant-context-card" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-lg shadow-xs">
            {merchant.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{merchant.businessName}</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Verified Merchant
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{merchant.location}</span>
              <span>•</span>
              <span>{merchant.businessType}</span>
            </p>
          </div>
        </div>

        {/* Toggle between Metrics and Graph View */}
        <button
          type="button"
          id="btn-toggle-context-graph"
          onClick={() => setShowGraphView(!showGraphView)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Network className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{showGraphView ? 'Show Metrics Table' : 'View Context Graph'}</span>
        </button>
      </div>

      {/* Main Content: Either Structured Grid or Visual Graph */}
      {!showGraphView ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Monthly Sales */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.monthlySales}</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              ₹{merchant.monthlySales.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
              Based on UPI settlements
            </div>
          </div>

          {/* Monthly Cashflow */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{t.monthlyCashflow}</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              ₹{merchant.monthlyCashflow.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Net operating surplus
            </div>
          </div>

          {/* Existing EMI */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{t.currentEMI}</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              ₹{merchant.existingEMI.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              {debtRatio}% of monthly cashflow
            </div>
          </div>

          {/* Vintage & Track Record */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>Business Vintage</span>
            </div>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {vintageYears} Years
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5 capitalize">
              {merchant.repaymentHistory} Repayment Record
            </div>
          </div>
        </div>
      ) : (
        /* Visual Context Graph */
        <div className="relative py-6 px-4 bg-slate-900 text-white rounded-xl overflow-hidden">
          <div className="text-xs text-slate-400 font-mono mb-4 text-center">
            FINANCIAL KNOWLEDGE GRAPH • UNDERWRITING SIGNALS
          </div>

          {/* Radiating Nodes Layout */}
          <div className="relative max-w-lg mx-auto h-64 flex items-center justify-center">
            {/* Center Node: Business */}
            <div className="z-10 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl text-center border-2 border-emerald-400">
              <Store className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs font-extrabold">{merchant.businessName}</div>
              <div className="text-[10px] text-emerald-100 font-mono">ID: {merchant.merchantId}</div>
            </div>

            {/* Orbiting Signal Nodes */}
            {/* Top: Monthly Sales */}
            <div className="absolute top-2 left-6 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-left shadow">
              <div className="text-[10px] text-slate-400">Monthly Sales</div>
              <div className="text-xs font-bold text-emerald-400">₹{merchant.monthlySales.toLocaleString('en-IN')}</div>
            </div>

            {/* Top Right: Cash Flow */}
            <div className="absolute top-2 right-6 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-left shadow">
              <div className="text-[10px] text-slate-400">Surplus Cashflow</div>
              <div className="text-xs font-bold text-sky-400">₹{merchant.monthlyCashflow.toLocaleString('en-IN')}</div>
            </div>

            {/* Bottom Left: Existing Debt */}
            <div className="absolute bottom-2 left-6 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-left shadow">
              <div className="text-[10px] text-slate-400">Active EMI</div>
              <div className="text-xs font-bold text-amber-400">₹{merchant.existingEMI.toLocaleString('en-IN')}</div>
            </div>

            {/* Bottom Right: Track Record */}
            <div className="absolute bottom-2 right-6 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-left shadow">
              <div className="text-[10px] text-slate-400">Digital Activity Score</div>
              <div className="text-xs font-bold text-emerald-400">{merchant.digitalTransactionScore}/100</div>
            </div>

            {/* Connecting lines via SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-700" strokeWidth="1.5" strokeDasharray="3 3">
              <line x1="25%" y1="18%" x2="50%" y2="50%" />
              <line x1="75%" y1="18%" x2="50%" y2="50%" />
              <line x1="25%" y1="82%" x2="50%" y2="50%" />
              <line x1="75%" y1="82%" x2="50%" y2="50%" />
            </svg>
          </div>
        </div>
      )}

      {/* Security notice */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Grounded in verified account aggregator & merchant UPI records</span>
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          Source: Account Aggregator / NPCI
        </span>
      </div>
    </div>
  );
};
