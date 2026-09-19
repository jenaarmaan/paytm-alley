import React, { useState } from 'react';
import {
  X,
  LogIn,
  BadgeCheck,
  Users,
  UserPlus,
  Store,
  MapPin,
  IndianRupee,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Merchant, SupportedLanguage } from '../types';
import { authService } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'otp';
  onAuthSuccess: (merchant: Merchant) => void;
  merchants: Record<string, Merchant>;
}

const BUSINESS_CATEGORIES = [
  { id: 'kirana', label: 'Kirana & Daily Staples', sector: 'Kirana & Grocery' },
  { id: 'textiles', label: 'Textiles & Handloom Weaving', sector: 'Apparel & Silks' },
  { id: 'qsr', label: 'Street Food & Quick Service', sector: 'Food & Chai Stall' },
  { id: 'electronics', label: 'Consumer Tech & Mobile Repair', sector: 'Tech & Electronics' },
  { id: 'agri', label: 'Organic Agri-Spices & Export', sector: 'Agri-Trade & Spices' },
  { id: 'fmcg', label: 'FMCG & Grain Wholesale', sector: 'Wholesale & Grain' },
  { id: 'pharma', label: 'Pharmacy & Medical Store', sector: 'Healthcare & Wellness' },
  { id: 'artisan', label: 'Artisan Handicrafts & Pottery', sector: 'Handicrafts & Art' },
];

const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  'Hindi',
  'Hinglish',
  'English',
  'Kannada',
  'Tamil',
  'Telugu',
  'Malayalam',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
  merchants,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    initialMode === 'register' ? 'register' : 'login'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regCategory, setRegCategory] = useState(BUSINESS_CATEGORIES[0]);
  const [regLocation, setRegLocation] = useState('');
  const [regMonthlySales, setRegMonthlySales] = useState<number>(180000);
  const [regVintageMonths, setRegVintageMonths] = useState<number>(36);
  const [regExistingEMI, setRegExistingEMI] = useState<number>(5000);
  const [regLanguage, setRegLanguage] = useState<SupportedLanguage>('Hinglish');

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

  // Handle New Merchant Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regBusinessName.trim() || !regLocation.trim()) return;

    setIsLoading(true);
    try {
      const newMerchant = authService.registerMerchant({
        name: regName.trim(),
        businessName: regBusinessName.trim(),
        businessType: regCategory.label,
        tradeSector: regCategory.sector,
        location: regLocation.trim(),
        monthlySales: regMonthlySales,
        businessVintageMonths: regVintageMonths,
        existingEMI: regExistingEMI,
        preferredLanguage: regLanguage,
      });

      onAuthSuccess(newMerchant);
      onClose();
    } catch (err) {
      console.error('Error registering merchant:', err);
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md">
              {activeTab === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg tracking-tight">
                  {activeTab === 'login' ? 'Select Merchant Profile to Sign In' : 'Create & Onboard New Merchant'}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeTab === 'login' ? 'Instant Access' : 'New User Setup'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {activeTab === 'login'
                  ? '1-click login to authenticate and load store cash flow & UPI QR records'
                  : 'Register a new store profile with customized sales and language'}
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Select Existing Merchant (1-Click Login)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4 text-indigo-500" />
            <span>Register New Merchant (+ Onboard)</span>
          </button>
        </div>

        {/* Modal Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950/40">
          
          {/* TAB 1: EXISTING MERCHANTS LIST */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span>Available Merchant Accounts</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
          )}

          {/* TAB 2: REGISTER / CREATE NEW USER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Store className="w-4 h-4 text-indigo-500" />
                      <span>New Merchant Registration</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Enter shop and financial details to immediately onboard and sign in.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Auto-Generates Merchant ID
                  </span>
                </div>

                {/* Name & Store Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                      Merchant Owner Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Sushmita Sahoo"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-indigo-500" />
                      Shop / Enterprise Name
                    </label>
                    <input
                      type="text"
                      required
                      value={regBusinessName}
                      onChange={(e) => setRegBusinessName(e.target.value)}
                      placeholder="e.g. Sushmita Silks & Handlooms"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Category & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Business Sector
                    </label>
                    <select
                      value={regCategory.id}
                      onChange={(e) => {
                        const cat = BUSINESS_CATEGORIES.find((c) => c.id === e.target.value) || BUSINESS_CATEGORIES[0];
                        setRegCategory(cat);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      City &amp; State
                    </label>
                    <input
                      type="text"
                      required
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      placeholder="e.g. Bhubaneswar, Odisha"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Monthly Sales & Language */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Monthly Turnover:</span>
                      <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                        ₹{regMonthlySales.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="30000"
                      max="1000000"
                      step="10000"
                      value={regMonthlySales}
                      onChange={(e) => setRegMonthlySales(parseInt(e.target.value, 10))}
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>₹30,000</span>
                      <span>₹5,00,000</span>
                      <span>₹10,00,000</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Indic Language
                    </label>
                    <select
                      value={regLanguage}
                      onChange={(e) => setRegLanguage(e.target.value as SupportedLanguage)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Vintage & Existing EMI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                      <span>Business Vintage:</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {regVintageMonths} Months ({(regVintageMonths / 12).toFixed(1)} yrs)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="120"
                      step="6"
                      value={regVintageMonths}
                      onChange={(e) => setRegVintageMonths(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                      <span>Existing Monthly Debt EMIs:</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        ₹{regExistingEMI.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={regExistingEMI}
                      onChange={(e) => setRegExistingEMI(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || !regName.trim() || !regBusinessName.trim()}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Merchant &amp; Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
