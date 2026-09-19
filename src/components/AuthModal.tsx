import React, { useState } from 'react';
import {
  X,
  LogIn,
  BadgeCheck,
  Users,
} from 'lucide-react';
import { Merchant } from '../types';
import { authService } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'otp';
  onAuthSuccess: (merchant: Merchant) => void;
  merchants: Record<string, Merchant>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  merchants,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // 1-Click Quick Login by Merchant ID
  const handleQuickLogin = (merchantId: string) => {
    setIsLoading(true);
    try {
      const merchant = authService.login(merchantId, 'quick_demo');
      onAuthSuccess(merchant);
      onClose();
    } catch (e) {
      console.error('Quick login error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const merchantList = Object.values(merchants).filter((m) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(query) ||
      m.businessName.toLowerCase().includes(query) ||
      m.location.toLowerCase().includes(query) ||
      (m.tradeSector && m.tradeSector.toLowerCase().includes(query)) ||
      m.merchantId.toLowerCase().includes(query)
    );
  });

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col w-full max-w-4xl max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Select Merchant Profile to Sign In
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Instant Access
                </span>
              </div>
              <p className="text-xs text-slate-400">
                1-click login to authenticate and load store cash flow &amp; UPI QR records
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950/40">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>Available Merchant Accounts</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select any verified business persona to start testing voice loans and financial tools.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search store, city, owner..."
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-56"
              />
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl whitespace-nowrap">
                {merchantList.length} Roles
              </span>
            </div>
          </div>

          {/* LIST VIEW (Table-Like High-Density List) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
            {merchantList.map((m) => (
              <div
                key={m.merchantId}
                className="p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Left: Avatar & Identity */}
                <div className="flex items-center gap-3 min-w-[220px]">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {m.name}
                      </span>
                      <BadgeCheck className="w-3.5 h-3.5 text-sky-500" />
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {m.merchantId}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                      {m.businessName} • {m.tradeSector || m.businessType}
                    </span>
                  </div>
                </div>

                {/* Middle: Location & Monthly Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-6 text-xs text-slate-600 dark:text-slate-400 sm:px-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Monthly Turnover</span>
                    <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-xs">
                      ₹{(m.monthlySales || 150000).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Location</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate block max-w-[120px]">
                      {m.location}
                    </span>
                  </div>

                  <div className="hidden sm:block">
                    <span className="text-[10px] text-slate-400 block">Dialect &amp; Score</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">
                      {m.preferredLanguage} ({m.digitalTransactionScore}/100)
                    </span>
                  </div>
                </div>

                {/* Right: 1-Click Action Button */}
                <button
                  onClick={() => handleQuickLogin(m.merchantId)}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In as {m.name.split(' ')[0]}</span>
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
