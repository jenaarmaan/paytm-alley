import React, { useState } from 'react';
import { Mic, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface FloatingAlleyWidgetProps {
  onClick: () => void;
  language: SupportedLanguage;
  activeEngine?: 'sarvam' | 'gemini' | 'deterministic';
}

export const FloatingAlleyWidget: React.FC<FloatingAlleyWidgetProps> = ({
  onClick,
  language,
  activeEngine = 'sarvam',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Expanded Hover Pill / Tooltip */}
      {isHovered && (
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl border border-indigo-500/30 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-tight text-emerald-400 flex items-center gap-1">
              <span>Alley Indic Voice Agent</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </span>
            <span className="text-[10px] text-slate-300">
              Click to open complete Loan & Process Flow
            </span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400 ml-1" />
        </div>
      )}

      {/* Floating Action Button */}
      <button
        id="btn-floating-alley-launcher"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Open Alley Voice & Process Console"
        className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-slate-950 via-indigo-950 to-emerald-900 hover:from-slate-900 hover:to-emerald-800 text-white flex flex-col items-center justify-center shadow-xl shadow-emerald-950/40 border border-emerald-400/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        {/* Pulsing glow aura */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 opacity-30 group-hover:opacity-60 blur-sm transition-opacity animate-pulse" />

        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative">
            <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-200 mt-0.5 font-sans">
            Alley
          </span>
        </div>
      </button>
    </div>
  );
};
