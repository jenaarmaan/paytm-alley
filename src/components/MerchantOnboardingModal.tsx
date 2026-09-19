import React, { useState, useEffect } from 'react';
import { Merchant, SupportedLanguage } from '../types';
import { 
  X, 
  Sparkles, 
  Mic, 
  Store, 
  CheckCircle2, 
  RotateCw,
  ShieldCheck,
  IndianRupee,
  Banknote,
  FileCheck,
  User
} from 'lucide-react';
import { speechService, speak } from '../services/speechService';
import { getVoiceWelcomeAcknowledgement } from '../services/translations';

interface MerchantOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMerchantCreated: (newMerchant: Merchant) => void;
}

const BUSINESS_CATEGORIES = [
  { id: 'kirana', label: 'Kirana / Grocery Store', sector: 'Kirana & Daily Staples', avgTicket: 350 },
  { id: 'qsr', label: 'QSR / Street Food & Chai Stall', sector: 'Food & Quick Service', avgTicket: 120 },
  { id: 'textiles', label: 'Textiles, Garments & Handlooms', sector: 'Apparel & Handlooms', avgTicket: 1200 },
  { id: 'electronics', label: 'Consumer Tech & Mobile Repair', sector: 'Tech & Device Services', avgTicket: 850 },
  { id: 'agri', label: 'Organic Spices & Agri-Produce', sector: 'Agri-Trade & Spices', avgTicket: 950 },
  { id: 'fmcg', label: 'FMCG Wholesale & Distribution', sector: 'FMCG & Grain Wholesale', avgTicket: 3200 },
  { id: 'pharmacy', label: 'Medical, Pharmacy & Wellness', sector: 'Healthcare & Pharma', avgTicket: 480 },
  { id: 'pooja', label: 'Temple Florist & Puja Essentials', sector: 'Micro-Retail Stall', avgTicket: 80 },
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

export const MerchantOnboardingModal: React.FC<MerchantOnboardingModalProps> = ({
  isOpen,
  onClose,
  onMerchantCreated,
}) => {
  const [name, setName] = useState('Anil Sharma');
  const [businessName, setBusinessName] = useState('Sharma Dairy & Daily Needs');
  const [selectedCategory, setSelectedCategory] = useState(BUSINESS_CATEGORIES[0]);
  const [location, setLocation] = useState('Patna, Bihar');
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>('Hinglish');
  const [upiHandle, setUpiHandle] = useState('sharma.dairy@paytm');
  const [monthlySales, setMonthlySales] = useState<number>(150000);
  const [vintageYears, setVintageYears] = useState<number>(3.5);
  const [existingEMI, setExistingEMI] = useState<number>(5000);

  // Voice Quick-Fill state
  const [isVoiceFilling, setIsVoiceFilling] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

  // Account Aggregator (AA) simulation state
  const [isSyncingAA, setIsSyncingAA] = useState(false);
  const [aaStatus, setAaStatus] = useState<'idle' | 'syncing' | 'verified'>('idle');

  // Auto-generate UPI handle as business name changes
  useEffect(() => {
    if (businessName) {
      const clean = businessName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14);
      setUpiHandle(`${clean || 'merchant'}@paytm`);
    }
  }, [businessName]);

  if (!isOpen) return null;

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

        // Parse Sales / Amount
        const lakhMatch = text.match(/([\d\.]+)\s*(?:lakh|lac|laakh|l)/i);
        const thousandMatch = text.match(/([\d\.]+)\s*(?:thousand|hazaar|hazar|k)/i);
        const directNumberMatch = text.match(/(?:rupees|rs\.?|sales|turnover)\s*(\d+)/i);

        if (lakhMatch) {
          const val = parseFloat(lakhMatch[1]) * 100000;
          if (!isNaN(val) && val >= 30000 && val <= 1000000) {
            setMonthlySales(Math.min(500000, Math.max(30000, Math.round(val))));
          }
        } else if (thousandMatch) {
          const val = parseFloat(thousandMatch[1]) * 1000;
          if (!isNaN(val) && val >= 30000 && val <= 500000) {
            setMonthlySales(Math.round(val));
          }
        } else if (directNumberMatch) {
          const val = parseInt(directNumberMatch[1], 10);
          if (!isNaN(val) && val >= 30000 && val <= 500000) {
            setMonthlySales(val);
          }
        }

        // Parse City
        const cities = ['patna', 'delhi', 'mumbai', 'bengaluru', 'bangalore', 'jaipur', 'lucknow', 'hyderabad', 'chennai', 'madurai', 'kochi', 'kanpur', 'pune', 'kolkata', 'ahmedabad', 'varanasi', 'bhopal'];
        for (const city of cities) {
          if (text.includes(city)) {
            setLocation(city.charAt(0).toUpperCase() + city.slice(1));
            break;
          }
        }

        // Parse Category
        if (text.includes('dairy') || text.includes('grocery') || text.includes('kirana') || text.includes('store')) {
          setSelectedCategory(BUSINESS_CATEGORIES[0]);
        } else if (text.includes('food') || text.includes('chai') || text.includes('restaurant') || text.includes('hotel') || text.includes('snack')) {
          setSelectedCategory(BUSINESS_CATEGORIES[1]);
        } else if (text.includes('cloth') || text.includes('saree') || text.includes('garment') || text.includes('textile')) {
          setSelectedCategory(BUSINESS_CATEGORIES[2]);
        } else if (text.includes('mobile') || text.includes('repair') || text.includes('electronic')) {
          setSelectedCategory(BUSINESS_CATEGORIES[3]);
        } else if (text.includes('spice') || text.includes('farm') || text.includes('agri')) {
          setSelectedCategory(BUSINESS_CATEGORIES[4]);
        } else if (text.includes('medicine') || text.includes('pharma') || text.includes('medical') || text.includes('chemist')) {
          setSelectedCategory(BUSINESS_CATEGORIES[6]);
        } else if (text.includes('flower') || text.includes('pooja') || text.includes('puja') || text.includes('stall')) {
          setSelectedCategory(BUSINESS_CATEGORIES[7]);
        }

        // Parse Name / Shop if "my shop is X" or "merinaam X"
        const shopMatch = text.match(/(?:my shop is|shop name is|dukan ka naam hai|dukaan)\s+([a-zA-Z\s]+)/i);
        if (shopMatch && shopMatch[1].trim()) {
          const extracted = shopMatch[1].trim().split(' ').slice(0, 4).join(' ');
          setBusinessName(extracted.charAt(0).toUpperCase() + extracted.slice(1));
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
      // Calibrate sales slightly with verified telemetry
      setMonthlySales((prev) => Math.max(prev, Math.round(prev * 1.05)));
    }, 1200);
  };

  // Dynamic Ingestion & Underwriting calculation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const vintageMonths = Math.round(vintageYears * 12);
    // Estimated surplus cashflow ~45% of sales
    const monthlyCashflow = Math.round(monthlySales * 0.45);
    
    // Dynamic Digital Health Score
    let score = 82;
    if (vintageMonths > 36) score += 6;
    if (vintageMonths > 48) score += 4;
    if (existingEMI < monthlyCashflow * 0.15) score += 4;
    if (aaStatus === 'verified') score += 3;
    score = Math.min(98, Math.max(65, score));

    // Estimated QR scans
    const upiQrTransactions = Math.round(monthlySales / selectedCategory.avgTicket);

    // Generate unique ID e.g. M1042
    const randomId = `M${Math.floor(1000 + Math.random() * 9000)}`;

    const newMerchant: Merchant = {
      merchantId: randomId,
      name: name.trim() || 'New Merchant',
      businessName: businessName.trim() || 'Local Enterprise',
      businessType: selectedCategory.label,
      businessVintageMonths: vintageMonths,
      monthlySales,
      monthlyCashflow,
      existingEMI,
      repaymentHistory: score > 85 ? 'excellent' : 'good',
      digitalTransactionScore: score,
      businessHealth: score >= 80 ? 'healthy' : 'moderate',
      location: location.trim() || 'India',
      preferredLanguage,
      upiQrTransactionsPerMonth: upiQrTransactions,
      activeCreditLines: existingEMI > 0 ? 1 : 0,
      upiHandle: upiHandle || `${name.toLowerCase().replace(/\s+/g, '')}@paytm`,
      tradeSector: selectedCategory.sector,
    };

    onMerchantCreated(newMerchant);
    onClose();

    // Trigger instant welcome voice greeting in their native language
    const welcomeMsg = getVoiceWelcomeAcknowledgement(newMerchant.name, newMerchant.businessName, preferredLanguage);
    speak(welcomeMsg, preferredLanguage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header with gradient flare */}
        <div className="relative bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 px-6 py-5 border-b border-slate-700/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Instant Merchant Onboarding
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Underwriting
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Onboard a new merchant profile in 60 seconds with instant AI underwriting
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Voice Quick-Fill Banner */}
          <div className="mt-4 flex items-center justify-between bg-slate-800/80 border border-indigo-500/30 rounded-2xl p-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Voice Quick-Fill</span>
                <span className="text-[11px] text-slate-400">
                  {voiceFeedback || 'Tap mic and say "Sharma Dairy in Patna, monthly sales 1.5 lakh"'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleVoiceFill}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isVoiceFilling
                  ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isVoiceFilling ? 'Listening...' : 'Quick Speak'}</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Row 1: Merchant & Business Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Merchant Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-indigo-400" />
                Shop / Enterprise Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Ramesh Kirana & Provisions"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Row 2: Category & Spoken Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Business Category (9 Sectors)
              </label>
              <select
                value={selectedCategory.id}
                onChange={(e) => {
                  const cat = BUSINESS_CATEGORIES.find(c => c.id === e.target.value) || BUSINESS_CATEGORIES[0];
                  setSelectedCategory(cat);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {BUSINESS_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-slate-100">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Preferred Spoken Indic Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as SupportedLanguage)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} className="bg-slate-900 text-slate-100">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: City & UPI Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                City / Region
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Patna, Bihar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Paytm / UPI QR Handle</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-medium">
                  <ShieldCheck className="w-3 h-3" /> Auto-Generated
                </span>
              </label>
              <input
                type="text"
                required
                value={upiHandle}
                onChange={(e) => setUpiHandle(e.target.value)}
                placeholder="merchant@paytm"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Financial Telemetry Section */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-emerald-400" />
                Financial Telemetry & Underwriting
              </span>

              {/* Bank AA Sync Button */}
              <button
                type="button"
                onClick={handleSyncAA}
                disabled={isSyncingAA || aaStatus === 'verified'}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  aaStatus === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40'
                }`}
              >
                {isSyncingAA ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing AA Telemetry...</span>
                  </>
                ) : aaStatus === 'verified' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Bank AA Verified</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Sync Bank AA (Simulate)</span>
                  </>
                )}
              </button>
            </div>

            {/* Monthly Sales Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Monthly UPI / Cash Turnover</span>
                <span className="font-bold text-emerald-400 text-sm">
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
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>₹30,000</span>
                <span>₹5,00,000</span>
                <span>₹10,00,000</span>
              </div>
            </div>

            {/* Vintage & Existing EMI */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Business Vintage ({vintageYears} Years)
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={vintageYears}
                  onChange={(e) => setVintageYears(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Existing Monthly EMI (₹{existingEMI.toLocaleString('en-IN')})
                </label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={existingEMI}
                  onChange={(e) => setExistingEMI(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Real-time calculated credit preview */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">Monthly Repayment Capacity</span>
                <span className="font-semibold text-slate-200">
                  ₹{Math.max(0, Math.round(monthlySales * 0.30 - existingEMI)).toLocaleString('en-IN')} / mo
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Instant Working Capital Limit</span>
                <span className="font-bold text-emerald-400">
                  Up to ₹{Math.min(500000, Math.max(15000, Math.round(monthlySales * 2.0))).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 border border-emerald-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Banknote className="w-4 h-4" />
              <span>Complete Onboarding & Switch</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
