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
  Smartphone
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
  const [mode, setMode] = useState<'login' | 'register' | 'otp'>(initialMode);
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

  // 1-Click Quick Login
  const handleQuickLogin = (merchantId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const loggedInMerchant = authService.login(merchantId, 'quick_demo');
      setIsLoading(false);
      onAuthSuccess(loggedInMerchant);
      onClose();
    }, 300);
  };

  // Mobile + OTP Login
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsOtpSent(true);
      setOtp('420108'); // Auto-populate for seamless demo
      setIsLoading(false);
    }, 400);
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
    }, 400);
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
    }, 500);
  };

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
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Merchant Authentication Portal
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  NPCI &amp; RBI Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Log in to your merchant account or register a new business profile with live credit underwriting
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
            onClick={() => setMode('login')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              mode === 'login'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Quick Merchant Logins</span>
          </button>

          <button
            onClick={() => setMode('otp')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              mode === 'otp'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile + OTP Login</span>
          </button>

          <button
            onClick={() => setMode('register')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              mode === 'register'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Onboard / Register New Merchant</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950/40">
          
          {/* TAB 1: QUICK 1-CLICK MERCHANT LOGIN */}
          {mode === 'login' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Select a Registered Merchant Profile to Log In
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    1-Click authentication with persistent local session storage.
                  </p>
                </div>
                <button
                  onClick={() => setMode('register')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  + New Merchant
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {Object.values(merchants).map((m) => (
                  <div
                    key={m.merchantId}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                              <span>{m.name}</span>
                              <BadgeCheck className="w-3.5 h-3.5 text-sky-500" />
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium block">
                              {m.businessName}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {m.merchantId}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">Turnover:</span>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                            ₹{(m.monthlySales || 150000).toLocaleString('en-IN')}/mo
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">Location:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                            {m.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickLogin(m.merchantId)}
                      disabled={isLoading}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Log In as {m.name.split(' ')[0]}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MOBILE + OTP LOGIN */}
          {mode === 'otp' && (
            <div className="max-w-md mx-auto py-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-2">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Merchant Mobile Login
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your registered 10-digit Bharat mobile number to receive instant OTP authentication.
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
                        className="font-bold underline text-[11px]"
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
              </div>
            </div>
          )}

          {/* TAB 3: REGISTER / ONBOARD NEW MERCHANT */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Register &amp; Onboard Business Profile
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter your store details to generate instant Account Aggregator digital credit scores.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                    Instant Active Context
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
                      Preferred Language
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
                      <span>Complete Registration &amp; Log In</span>
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
