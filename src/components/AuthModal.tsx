import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Store,
  MapPin,
  Building2,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  BadgeCheck,
  Smartphone,
  Users,
  Shield,
  Briefcase
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

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
  merchants,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'demolist' | 'signup'>(
    initialMode === 'register' ? 'signup' : 'signin'
  );
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regSector, setRegSector] = useState('Kirana & Daily Staples');
  const [regMonthlySales, setRegMonthlySales] = useState(180000);
  const [regVintageMonths, setRegVintageMonths] = useState(36);
  const [regExistingEMI, setRegExistingEMI] = useState(5000);
  const [regLocation, setRegLocation] = useState('Kanpur, Uttar Pradesh');
  const [regLanguage, setRegLanguage] = useState<SupportedLanguage>('Hinglish');

  if (!isOpen) return null;

  // 1-Click Quick Login by Merchant ID
  const handleQuickLogin = (merchantId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const loggedInMerchant = authService.login(merchantId, 'quick_demo');
      setIsLoading(false);
      onAuthSuccess(loggedInMerchant);
      onClose();
    }, 250);
  };

  // Mobile + OTP Login
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsOtpSent(true);
      setOtp('420108'); // Auto-populate for quick testing
      setIsLoading(false);
    }, 350);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setIsLoading(true);
    setTimeout(() => {
      const merchant = authService.loginWithMobile(mobileNumber, otp);
      setIsLoading(false);
      onAuthSuccess(merchant);
      onClose();
    }, 350);
  };

  // Registration / Onboarding
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regBusinessName.trim()) return;
    setIsLoading(true);

    setTimeout(() => {
      const newMerchant = authService.registerMerchant({
        name: regName.trim(),
        businessName: regBusinessName.trim(),
        tradeSector: regSector,
        monthlySales: regMonthlySales,
        businessVintageMonths: regVintageMonths,
        existingEMI: regExistingEMI,
        location: regLocation,
        preferredLanguage: regLanguage,
      });
      setIsLoading(false);
      onAuthSuccess(newMerchant);
      onClose();
    }, 450);
  };

  const merchantList = Object.values(merchants);

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
                  Merchant Authentication &amp; Sign In
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  NPCI &amp; RBI Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sign in with your mobile OTP or select a pre-configured demo role from the list
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
        <div className="px-6 bg-slate-950/90 text-white flex items-center gap-2 border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'signin'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Sign In (Mobile + OTP)</span>
          </button>

          <button
            onClick={() => setActiveTab('demolist')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'demolist'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Demo Role Logins (List View)</span>
          </button>

          <button
            onClick={() => setActiveTab('signup')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'signup'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up / Register New</span>
          </button>
        </div>

        {/* Modal Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950/40">
          
          {/* TAB 1: SIGN IN (MOBILE + OTP & QUICK DEMO ROLE ACCELERATOR) */}
          {activeTab === 'signin' && (
            <div className="max-w-md mx-auto py-2 space-y-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-2">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Merchant Mobile Sign In
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your registered 10-digit mobile number for instant OTP verification.
                  </p>
                </div>

                {!isOtpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="98765 43210"
                          className="w-full pl-12 pr-4 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || mobileNumber.length < 10}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Send Instant OTP</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                      <span>OTP sent to +91 {mobileNumber}</span>
                      <button
                        type="button"
                        onClick={() => setIsOtpSent(false)}
                        className="font-bold underline text-[11px] cursor-pointer"
                      >
                        Change
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Enter 6-Digit OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="420108"
                        className="w-full text-center tracking-widest text-lg font-mono font-black py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block text-center">
                        Demo auto-filled with <strong>420108</strong>
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || otp.length < 4}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify &amp; Enter Dashboard</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Quick Switch to Demo Role List */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    onClick={() => setActiveTab('demolist')}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Or 1-Click Login with Demo Roles (List View)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEMO / ROLE LOGINS IN A CLEAN LIST FORMAT (NOT CARDS) */}
          {activeTab === 'demolist' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Select Demo Role / Merchant Profile to Sign In
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Structured list format for instantaneous 1-click role authentication.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                  {merchantList.length} Roles Available
                </span>
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

          {/* TAB 3: SIGN UP / ONBOARD NEW MERCHANT FORM */}
          {activeTab === 'signup' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Register &amp; Onboard Business Profile
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Create a new merchant account with instant Account Aggregator digital credit scoring.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                    Instant Active Session
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Merchant Owner Name *
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Armaan Jena"
                      className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Store / Business Name *
                    </label>
                    <input
                      type="text"
                      value={regBusinessName}
                      onChange={(e) => setRegBusinessName(e.target.value)}
                      placeholder="e.g. Armaan Electronics &amp; Mobiles"
                      className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Trade Sector
                    </label>
                    <select
                      value={regSector}
                      onChange={(e) => setRegSector(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="Kirana & Daily Staples">Kirana &amp; Daily Staples</option>
                      <option value="Consumer Electronics & Mobiles">Consumer Electronics &amp; Mobiles</option>
                      <option value="Textiles & Handloom Weaving">Textiles &amp; Apparel</option>
                      <option value="Food & Beverage / QSR Stall">Food &amp; Beverage / QSR</option>
                      <option value="FMCG Wholesale & Distribution">FMCG Wholesale</option>
                      <option value="Pharmacy & Healthcare">Pharmacy &amp; Healthcare</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Location / City
                    </label>
                    <input
                      type="text"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      placeholder="e.g. Bhubaneswar, Odisha"
                      className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Monthly Sales Turnover: <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">₹{regMonthlySales.toLocaleString('en-IN')}</strong>
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        (Daily UPI Inflow ~₹{Math.round(regMonthlySales / 30).toLocaleString('en-IN')})
                      </span>
                    </div>
                    <input
                      type="range"
                      min={20000}
                      max={1000000}
                      step={10000}
                      value={regMonthlySales}
                      onChange={(e) => setRegMonthlySales(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Business Vintage
                    </label>
                    <select
                      value={regVintageMonths}
                      onChange={(e) => setRegVintageMonths(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value={12}>1 Year Operational</option>
                      <option value={24}>2 Years Operational</option>
                      <option value={36}>3 Years Operational</option>
                      <option value={48}>4+ Years Operational</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Dialect / Language
                    </label>
                    <select
                      value={regLanguage}
                      onChange={(e) => setRegLanguage(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="Hinglish">Hinglish</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Kannada">Kannada</option>
                      <option value="Telugu">Telugu</option>
                      <option value="Bengali">Bengali</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !regName.trim() || !regBusinessName.trim()}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Complete Registration &amp; Sign In</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
