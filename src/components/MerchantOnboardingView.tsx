import React, { useState, useEffect } from 'react';
import { Merchant, SupportedLanguage } from '../types';
import {
  Sparkles,
  Mic,
  Store,
  CheckCircle2,
  RotateCw,
  ShieldCheck,
  IndianRupee,
  Banknote,
  FileCheck,
  User,
  MapPin,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { speechService, speak } from '../services/speechService';
import { getVoiceWelcomeAcknowledgement } from '../services/translations';
import { calculateDynamicInterestRate, calculateMaxLoanAmount, calculateRepaymentCapacity } from '../services/financialEngine';

interface MerchantOnboardingViewProps {
  onMerchantCreated: (newMerchant: Merchant) => void;
  onNavigate: (view: string) => void;
}

const BUSINESS_CATEGORIES = [
  { id: 'kirana', label: 'Kirana / Grocery Store', sector: 'Kirana & Daily Staples', avgTicket: 350 },
  { id: 'qsr', label: 'QSR / Street Food & Chai Stall', sector: 'Food & Quick Service', avgTicket: 120 },
  { id: 'textiles', label: 'Textiles, Garments & Handlooms', sector: 'Apparel & Handlooms', avgTicket: 1200 },
  { id: 'electronics', label: 'Consumer Tech & Mobile Repair', sector: 'Tech & Device Services', avgTicket: 850 },
  { id: 'agri', label: 'Organic Spices & Agri-Produce', sector: 'Agri-Trade & Spices', avgTicket: 950 },
  { id: 'fmcg', label: 'FMCG Wholesale & Distribution', sector: 'FMCG & Grain Wholesale', avgTicket: 3200 },
  { id: 'pharmacy', label: 'Medical, Pharmacy & Wellness', sector: 'Healthcare & Pharma', avgTicket: 480 },
  { id: 'artisan', label: 'Artisan Handicrafts & Pottery', sector: 'Handicrafts & Art', avgTicket: 750 },
  { id: 'auto', label: 'Automobile Spares & Garage Workshop', sector: 'Auto Spares & Services', avgTicket: 1400 },
];

const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  'Hindi',
  'Hinglish',
  'English',
  'Kannada',
  'Tamil',
  'Telugu',
  'Malayalam'
];

export const MerchantOnboardingView: React.FC<MerchantOnboardingViewProps> = ({
  onMerchantCreated,
  onNavigate,
}) => {
  const [name, setName] = useState('Sushmita Sahoo');
  const [businessName, setBusinessName] = useState('Sushmita Handlooms & Silks');
  const [selectedCategory, setSelectedCategory] = useState(BUSINESS_CATEGORIES[2]);
  const [location, setLocation] = useState('Bhubaneswar, Odisha');
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>('Hinglish');
  const [upiHandle, setUpiHandle] = useState('sushmita.silks@paytm');
  const [monthlySales, setMonthlySales] = useState<number>(180000);
  const [vintageMonths, setVintageMonths] = useState<number>(36);
  const [existingEMI, setExistingEMI] = useState<number>(6000);

  // Voice Quick-Fill state
  const [isVoiceFilling, setIsVoiceFilling] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

  // Account Aggregator (AA) telemetry simulation state
  const [isSyncingAA, setIsSyncingAA] = useState(false);
  const [aaStatus, setAaStatus] = useState<'idle' | 'syncing' | 'verified'>('idle');
  const [aaTelemetry, setAaTelemetry] = useState<{
    dailyAvgBalance: number;
    dailyUpiCount: number;
    khataScore: number;
    gstnVerified: boolean;
  } | null>(null);

  // Auto-generate UPI handle as business name changes
  useEffect(() => {
    if (businessName) {
      const clean = businessName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14);
      setUpiHandle(`${clean || 'merchant'}@paytm`);
    }
  }, [businessName]);

  // Voice Quick-Fill listener
  const handleToggleVoiceFill = () => {
    if (isVoiceFilling) {
      speechService.stopListening();
      setIsVoiceFilling(false);
      return;
    }

    setIsVoiceFilling(true);
    setVoiceFeedback('Listening... Speak your shop name, city, or monthly turnover');

    speechService.startListening(
      preferredLanguage,
      (result) => {
        const text = result.transcript.toLowerCase();
        setVoiceFeedback(`Captured: "${result.transcript}"`);

        // Parse Sales / Turnover
        const lakhMatch = text.match(/([\d\.]+)\s*(?:lakh|lac|laakh|l)/i);
        const thousandMatch = text.match(/([\d\.]+)\s*(?:thousand|hazaar|hazar|k)/i);
        const directNumberMatch = text.match(/(?:rupees|rs\.?|sales|turnover)\s*(\d+)/i);

        if (lakhMatch) {
          const val = parseFloat(lakhMatch[1]) * 100000;
          if (!isNaN(val) && val >= 30000 && val <= 1000000) {
            setMonthlySales(Math.min(1000000, Math.max(30000, Math.round(val))));
          }
        } else if (thousandMatch) {
          const val = parseFloat(thousandMatch[1]) * 1000;
          if (!isNaN(val) && val >= 30000 && val <= 1000000) {
            setMonthlySales(Math.round(val));
          }
        } else if (directNumberMatch) {
          const val = parseInt(directNumberMatch[1], 10);
          if (!isNaN(val) && val >= 30000 && val <= 1000000) {
            setMonthlySales(val);
          }
        }

        // Parse City
        const cities = ['bhubaneswar', 'cuttack', 'patna', 'delhi', 'mumbai', 'bengaluru', 'bangalore', 'jaipur', 'lucknow', 'hyderabad', 'chennai', 'madurai', 'kochi', 'kanpur', 'pune', 'kolkata', 'ahmedabad', 'varanasi', 'bhopal'];
        for (const city of cities) {
          if (text.includes(city)) {
            setLocation(city.charAt(0).toUpperCase() + city.slice(1));
            break;
          }
        }

        // Parse Category
        if (text.includes('dairy') || text.includes('grocery') || text.includes('kirana') || text.includes('store')) {
          setSelectedCategory(BUSINESS_CATEGORIES[0]);
        } else if (text.includes('food') || text.includes('chai') || text.includes('restaurant') || text.includes('snack')) {
          setSelectedCategory(BUSINESS_CATEGORIES[1]);
        } else if (text.includes('cloth') || text.includes('saree') || text.includes('garment') || text.includes('textile') || text.includes('handloom')) {
          setSelectedCategory(BUSINESS_CATEGORIES[2]);
        } else if (text.includes('mobile') || text.includes('repair') || text.includes('electronic')) {
          setSelectedCategory(BUSINESS_CATEGORIES[3]);
        } else if (text.includes('spice') || text.includes('farm') || text.includes('agri')) {
          setSelectedCategory(BUSINESS_CATEGORIES[4]);
        }

        if (result.isFinal) {
          setIsVoiceFilling(false);
          setVoiceFeedback('Voice details auto-filled successfully!');
          setTimeout(() => setVoiceFeedback(null), 3000);
        }
      },
      (error) => {
        setIsVoiceFilling(false);
        setVoiceFeedback(error);
        setTimeout(() => setVoiceFeedback(null), 4000);
      }
    );
  };

  // Simulate Account Aggregator (AA) Telemetry
  const handleSyncAA = () => {
    setIsSyncingAA(true);
    setAaStatus('syncing');

    setTimeout(() => {
      setIsSyncingAA(false);
      setAaStatus('verified');
      const dailyInflow = Math.round((monthlySales / 30) / selectedCategory.avgTicket);
      setAaTelemetry({
        dailyAvgBalance: Math.round(monthlySales * 0.22),
        dailyUpiCount: Math.min(85, Math.max(14, dailyInflow)),
        khataScore: 89,
        gstnVerified: true,
      });
      // Calibrate sales slightly with verified statement
      setMonthlySales((prev) => Math.max(prev, Math.round(prev * 1.05)));
    }, 1100);
  };

  // Construct draft merchant for real-time calculation preview
  const draftMerchant: Merchant = {
    merchantId: 'M-PREVIEW',
    name: name.trim() || 'New Merchant',
    businessName: businessName.trim() || 'Local Enterprise',
    businessType: selectedCategory.label,
    businessVintageMonths: vintageMonths,
    monthlySales,
    monthlyCashflow: Math.round(monthlySales * 0.45),
    existingEMI,
    repaymentHistory: 'good',
    digitalTransactionScore: aaStatus === 'verified' ? 92 : 84,
    businessHealth: 'healthy',
    location: location.trim() || 'India',
    preferredLanguage,
    upiQrTransactionsPerMonth: Math.round(monthlySales / selectedCategory.avgTicket),
    activeCreditLines: existingEMI > 0 ? 1 : 0,
    upiHandle,
    tradeSector: selectedCategory.sector,
  };

  const previewCapacity = calculateRepaymentCapacity(draftMerchant);
  const previewMaxLoan = calculateMaxLoanAmount(draftMerchant);
  const previewRate = calculateDynamicInterestRate(draftMerchant);

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const uniqueId = `M-CUSTOM-${randomSuffix}`;

    const newMerchant: Merchant = {
      ...draftMerchant,
      merchantId: uniqueId,
    };

    onMerchantCreated(newMerchant);

    // Trigger voice greeting in their native language
    const welcomeMsg = getVoiceWelcomeAcknowledgement(newMerchant.name, newMerchant.businessName, preferredLanguage);
    speak(welcomeMsg, preferredLanguage);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Real-Time Merchant Onboarding Engine
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Instant Dynamic Underwriting
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Onboard Any Bharat Merchant in 60 Seconds
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Create a custom merchant profile with live sales, business sector, and regional dialect. VoiceLend automatically recalculates credit limits, KFS terms, and bite-sized insurance across the entire platform.
            </p>
          </div>

          {/* Quick Voice Prompt banner */}
          <div className="shrink-0 flex flex-col items-start sm:items-end gap-2">
            <button
              type="button"
              onClick={handleToggleVoiceFill}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md ${
                isVoiceFilling
                  ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 cursor-pointer'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isVoiceFilling ? 'Listening... Speak Details' : 'Voice Quick-Fill'}</span>
            </button>
            {voiceFeedback && (
              <span className="text-[11px] text-emerald-400 font-medium max-w-xs text-right">
                {voiceFeedback}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Form & Real-Time Underwriting Preview Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Comprehensive Onboarding Form */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
          
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Merchant Identity &amp; Business Profile
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enter enterprise credentials or speak naturally to auto-slot fields
            </p>
          </div>

          {/* Row 1: Merchant & Business Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                Merchant Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sushmita Sahoo"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-indigo-500" />
                Shop / Enterprise Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Sushmita Handlooms & Silks"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Row 2: Category & Spoken Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Business Category &amp; Sector
              </label>
              <select
                value={selectedCategory.id}
                onChange={(e) => {
                  const cat = BUSINESS_CATEGORIES.find((c) => c.id === e.target.value) || BUSINESS_CATEGORIES[0];
                  setSelectedCategory(cat);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {BUSINESS_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label} ({cat.sector})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Operating Indic Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as SupportedLanguage)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: City & UPI Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                City / Region
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bhubaneswar, Odisha"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Paytm / UPI VPA ID</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> Auto-Configured
                </span>
              </label>
              <input
                type="text"
                required
                value={upiHandle}
                onChange={(e) => setUpiHandle(e.target.value)}
                placeholder="merchant@paytm"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Financial Telemetry Section */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Live Cashflow &amp; Account Aggregator (AA) Telemetry
                </span>
              </div>

              {/* AA Sync Trigger Button */}
              <button
                type="button"
                onClick={handleSyncAA}
                disabled={isSyncingAA || aaStatus === 'verified'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  aaStatus === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm cursor-pointer'
                }`}
              >
                {isSyncingAA ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing Bank AA...</span>
                  </>
                ) : aaStatus === 'verified' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Bank Statement Verified</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Fetch Bank Statement via AA</span>
                  </>
                )}
              </button>
            </div>

            {/* Monthly Turnover Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Average Monthly Sales / Turnover:</span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">
                  ₹{monthlySales.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="30000"
                max="1000000"
                step="10000"
                value={monthlySales}
                onChange={(e) => setMonthlySales(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹30,000</span>
                <span>₹5,00,000</span>
                <span>₹10,00,000</span>
              </div>
            </div>

            {/* Vintage & Existing EMI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                  <span>Business Vintage:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {vintageMonths} Months ({(vintageMonths / 12).toFixed(1)} yrs)
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="120"
                  step="6"
                  value={vintageMonths}
                  onChange={(e) => setVintageMonths(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                  <span>Existing Monthly Debt EMIs:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    ₹{existingEMI.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={existingEMI}
                  onChange={(e) => setExistingEMI(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Live AA Telemetry Stream */}
            {aaTelemetry && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono animate-in fade-in-50">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Daily Avg Balance</span>
                  <span className="font-bold text-emerald-400">₹{aaTelemetry.dailyAvgBalance.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Daily Inflow Rate</span>
                  <span className="font-bold text-sky-400">{aaTelemetry.dailyUpiCount} txns/day</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Khata Health Score</span>
                  <span className="font-bold text-amber-400">{aaTelemetry.khataScore}/100</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">GSTN &amp; Trade Auth</span>
                  <span className="font-bold text-emerald-400">✓ Verified</span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              id="btn-complete-onboarding"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Banknote className="w-4 h-4" />
              <span>Complete Onboarding &amp; Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 4 Cols: Live Dynamic Underwriting Preview Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 text-white shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  Live Underwriting Engine
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Instant Credit Sanction
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Auto-Computed
              </span>
            </div>

            {/* Calculated Values */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Instant Sanction Limit (Max):</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  ₹{previewMaxLoan.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Capped at 2.0x monthly turnover (₹{monthlySales.toLocaleString('en-IN')})
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Net Monthly EMI Capacity:</span>
                <div className="text-xl font-black text-white font-mono">
                  ₹{previewCapacity.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">/ mo</span>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  (Sales × 30%) - Existing EMI (₹{existingEMI.toLocaleString('en-IN')})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Formulated Rate</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{previewRate}% p.a.</span>
                  <span className="text-[9px] text-slate-500 block">{vintageMonths >= 24 ? '-1.5% vintage' : 'Base rate'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Daily QR Auto-Split</span>
                  <span className="font-mono font-bold text-sky-400 text-sm">~8% - 12%</span>
                  <span className="text-[9px] text-slate-500 block">Evening auto-sweep</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Sachet Insurance Preview</span>
                </div>
                <p className="text-[10px] text-emerald-200/90 leading-snug">
                  Kirana Dukan Suraksha: ₹{(monthlySales * 2).toLocaleString('en-IN')} protection @ ₹7/day.
                </p>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
