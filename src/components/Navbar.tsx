import React, { useState } from 'react';
import {
  Mic,
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  Shield,
  ShieldCheck,
  Layers,
  Menu,
  X,
  Store,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import { Merchant, SupportedLanguage } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  activeMerchant: Merchant;
  language: SupportedLanguage;
  onOpenCapitalFlow?: () => void;
  onOpenOnboarding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeMerchant,
  language,
  onOpenCapitalFlow,
  onOpenOnboarding,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Store },
    { id: 'merchant-onboarding', label: 'Onboard', icon: UserPlus, badge: 'Instant' },
    { id: 'merchant-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'merchant-voice', label: 'Alley Voice', icon: Mic, highlight: true },
    { id: 'insurance', label: 'Sachet Insurance', icon: Shield, badge: '₹3/d' },
    { id: 'merchant-loans', label: 'My Loans', icon: CreditCard },
    { id: 'merchant-health', label: 'Business Health', icon: TrendingUp },
    { id: 'federated-security', label: 'Privacy & FedAI', icon: ShieldCheck, badge: 'ZKP' },
    { id: 'admin-dashboard', label: 'Lender Portal', icon: Shield },
    { id: 'enterprise-integrations', label: 'API & MCP', icon: Layers },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-9 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo: Speech Waveform into Rupee Symbol */}
        <div
          id="nav-logo"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-sky-950 to-emerald-800 flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
            {/* Custom SVG logo: Waveform merging into Rupee Symbol */}
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Soundwave bars */}
              <path d="M2 10v4" className="text-sky-400 stroke-sky-400" />
              <path d="M5 7v10" className="text-emerald-400 stroke-emerald-400" />
              {/* Rupee symbol curve */}
              <path d="M9 7h8" />
              <path d="M9 11h6" />
              <path d="M9 7c4 0 5 4 0 7l6 6" className="stroke-emerald-400" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
                Voice<span className="text-emerald-600">Lend</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Indic AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium -mt-0.5 tracking-tight">
              From Voice to Working Capital
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : item.highlight
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold border border-emerald-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.highlight && !isActive ? 'text-emerald-600' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Prominent Onboard Button & Merchant Profile Badge */}
        <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <button
            id="btn-navbar-onboard-merchant"
            onClick={() => {
              if (onOpenOnboarding) {
                onOpenOnboarding();
              } else {
                onNavigate('merchant-onboarding');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Onboard a new merchant profile in 60 seconds"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Onboard New Merchant</span>
          </button>

          {onOpenCapitalFlow && (
            <button
              onClick={onOpenCapitalFlow}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="View RBI-compliant capital flow and fund routing architecture"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Capital Rails</span>
            </button>
          )}

          <div className="text-right hidden lg:block">
            <div className="text-xs font-bold text-slate-900">{activeMerchant.businessName}</div>
            <div className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {activeMerchant.location.split(',')[0]} • {language}
            </div>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          id="btn-mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top duration-150">
          <div className="p-2 mb-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">{activeMerchant.businessName}</div>
              <div className="text-[11px] text-slate-500">{activeMerchant.name} • {language}</div>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Verified Kirana
            </span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : item.highlight
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
