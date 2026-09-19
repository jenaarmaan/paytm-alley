import React from 'react';
import { Merchant } from '../types';
import { 
  Store, 
  MapPin, 
  QrCode, 
  Sparkles, 
  UserPlus, 
  Volume2,
  BadgeCheck
} from 'lucide-react';
import { speak } from '../services/speechService';

interface PersonaPerspectiveBarProps {
  merchants: Record<string, Merchant>;
  activeMerchantId: string;
  onSelectMerchant: (merchantId: string) => void;
  onOpenOnboarding: () => void;
}

export const PersonaPerspectiveBar: React.FC<PersonaPerspectiveBarProps> = ({
  merchants,
  activeMerchantId,
  onSelectMerchant,
  onOpenOnboarding,
}) => {
  const activeMerchant = merchants[activeMerchantId] || Object.values(merchants)[0];

  const handleSpeakPersona = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeMerchant) return;
    const text = `Viewing perspective of ${activeMerchant.name}, owner of ${activeMerchant.businessName}, ${activeMerchant.location}. Monthly sales of rupees ${activeMerchant.monthlySales.toLocaleString('en-IN')}.`;
    speak(text, 'English');
  };

  return (
    <aside aria-label="Merchant Persona Switcher" className="w-full bg-slate-900/90 backdrop-blur-md border-b border-indigo-500/20 shadow-md text-white px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        
        {/* Left: Active Persona Details & Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-600 to-emerald-500 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20 border border-white/20 text-sm">
              {activeMerchant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-100 text-sm tracking-tight truncate flex items-center gap-1.5">
                {activeMerchant.name}
                <BadgeCheck className="w-4 h-4 text-sky-400 inline" />
              </span>
              <span className="text-xs text-slate-400 font-medium">• {activeMerchant.businessName}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {activeMerchant.tradeSector || activeMerchant.businessType}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {activeMerchant.location}
              </span>
              <span className="flex items-center gap-1 text-sky-300/90 font-mono">
                <QrCode className="w-3.5 h-3.5 text-sky-400" />
                {activeMerchant.upiHandle || `${activeMerchant.name.toLowerCase().replace(/\s+/g, '')}@paytm`}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-emerald-400 font-medium">
                  Score {activeMerchant.digitalTransactionScore}/100
                </span>
                <span className="text-slate-500">({activeMerchant.businessHealth})</span>
              </span>
            </div>
          </div>

          <button
            onClick={handleSpeakPersona}
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors border border-slate-700/60 ml-1"
            title="Listen to Merchant Profile Overview"
          >
            <Volume2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Intro</span>
          </button>
        </div>

        {/* Right: Persona Switcher Pills & Onboard Button */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            {Object.values(merchants).map((m) => {
              const isActive = m.merchantId === activeMerchant.merchantId;
              return (
                <button
                  key={m.merchantId}
                  onClick={() => onSelectMerchant(m.merchantId)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-sm shadow-indigo-500/30 border border-sky-400/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent'
                  }`}
                  title={`${m.name} (${m.businessName}) - ${m.location}`}
                >
                  <Store className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{m.name.split(' ')[0]}</span>
                  <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${isActive ? 'bg-black/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {m.merchantId}
                  </span>
                </button>
              );
            })}
          </div>

          {/* "+ Onboard New Merchant" Action */}
          <button
            onClick={onOpenOnboarding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 border border-emerald-400/30 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap ml-1"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Onboard Merchant</span>
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
          </button>
        </div>

      </div>
    </aside>
  );
};
