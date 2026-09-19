import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  BookOpen,
  Settings,
  Volume2,
  VolumeX,
  Sparkles,
  BadgeCheck,
  LogIn,
  LogOut,
  User,
  ArrowRight,
} from 'lucide-react';
import { Merchant, SupportedLanguage } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  activeMerchant: Merchant;
  language: SupportedLanguage;
  isAuthenticated?: boolean;
  onOpenAuth?: (mode?: 'login' | 'register' | 'otp') => void;
  onLogout?: () => void;
  onOpenCapitalFlow?: () => void;
  onOpenDocs?: () => void;
  onOpenSettings?: () => void;
  autoVoiceEnabled?: boolean;
  onToggleAutoVoice?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeMerchant,
  language,
  isAuthenticated = true,
  onOpenAuth,
  onLogout,
  onOpenCapitalFlow,
  onOpenDocs,
  onOpenSettings,
  autoVoiceEnabled = true,
  onToggleAutoVoice,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const featureItems = [
    {
      id: 'merchant-voice',
      label: 'Alley Voice Lending',
      desc: 'Vernacular Speech-to-Intent Working Capital',
      icon: Mic,
      highlight: true,
      badge: 'Live Indic AI',
    },
    {
      id: 'merchant-dashboard',
      label: 'Store Dashboard',
      desc: 'Cashflow surplus & UPI settlement overview',
      icon: LayoutDashboard,
    },
    {
      id: 'merchant-loans',
      label: 'My Loans & Repayment',
      desc: 'Daily QR auto-split schedule & 0-penalty grace',
      icon: CreditCard,
    },
    {
      id: 'insurance',
      label: 'Sachet Micro-Insurance',
      desc: '₹3/day Swasthya Raksha & ₹5/day Dukan Suraksha',
      icon: Shield,
      badge: '₹3/Day',
    },
    {
      id: 'merchant-health',
      label: 'Business Health & Insights',
      desc: 'Account Aggregator & seasonal cashflow metrics',
      icon: TrendingUp,
    },
    {
      id: 'federated-security',
      label: 'Privacy & FedAI Console',
      desc: 'Zero-Knowledge On-Device Federated Learning',
      icon: ShieldCheck,
      badge: 'ZKP Guard',
    },
    {
      id: 'admin-dashboard',
      label: 'Lender Portal & Desk',
      desc: 'Multi-tenant underwriting & live disbursement queue',
      icon: Layers,
    },
    {
      id: 'landing',
      label: 'Platform Overview',
      desc: 'Hero architecture & fintech journey overview',
      icon: Store,
    },
  ];

  return (
    <>
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo & Persona Quick Pill */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Logo */}
            <div
              id="nav-logo"
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 cursor-pointer group select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 via-sky-950 to-emerald-800 flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 10v4" className="text-sky-400 stroke-sky-400" />
                  <path d="M5 7v10" className="text-emerald-400 stroke-emerald-400" />
                  <path d="M9 7h8" />
                  <path d="M9 11h6" />
                  <path d="M9 7c4 0 5 4 0 7l6 6" className="stroke-emerald-400" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white font-sans">
                    Voice<span className="text-emerald-600">Lend</span>
                  </span>
                  <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    ALLEY AI
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Active Persona Switcher Pill (when authenticated) */}
            {isAuthenticated ? (
              <div className="relative ml-1" ref={profileDropdownRef}>
                <button
                  id="btn-navbar-switch-persona"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 text-left transition-all cursor-pointer group"
                  title="Account Menu & Profile Details"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                    {(activeMerchant?.name || 'Merchant').split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="hidden sm:block leading-tight">
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <span className="truncate max-w-[120px]">{activeMerchant?.name || 'Merchant'}</span>
                      <BadgeCheck className="w-3 h-3 text-sky-500 shrink-0" />
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileDropdownOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : 'group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Merchant Session</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{activeMerchant?.name || 'Merchant'}</p>
                      <p className="text-[11px] text-slate-500 truncate">{activeMerchant?.businessName || 'Store'} • {activeMerchant?.location || 'India'}</p>
                    </div>

                    <div className="p-1.5 space-y-1 text-xs">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenAuth?.('login');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-left cursor-pointer"
                      >
                        <User className="w-4 h-4 text-indigo-500" />
                        <span>Switch Account Profile</span>
                      </button>

                      <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onLogout?.();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Right Controls: Docs, Settings, Voice Soundbox, Log Out & 3-Line Menu */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Docs & Specs Trigger */}
            <button
              id="btn-navbar-docs-hub"
              onClick={() => onOpenDocs?.()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-all cursor-pointer"
              title="Open Architecture & MCP Specifications"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Docs &amp; Specs</span>
            </button>

            {/* Settings Trigger */}
            <button
              id="btn-navbar-settings"
              onClick={() => onOpenSettings?.()}
              className="hidden sm:flex p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="System Settings & Profile"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Audio Voice Soundbox Toggle */}
            {onToggleAutoVoice && (
              <button
                onClick={onToggleAutoVoice}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  autoVoiceEnabled
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                    : 'text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
                title={`Spoken Voice Feedback: ${autoVoiceEnabled ? 'ON' : 'OFF'} (${language})`}
              >
                {autoVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}

            {/* Log In / Log Out Quick Button */}
            {isAuthenticated ? (
              <button
                id="btn-navbar-logout"
                onClick={onLogout}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 transition-all cursor-pointer"
                title="Log Out Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            ) : (
              <button
                id="btn-navbar-login"
                onClick={() => onOpenAuth?.('login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}

            {/* Three-Line Hamburger Menu Button (Always clean on top right) */}
            <button
              id="btn-navbar-menu"
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
              aria-label="Open Navigation Menu"
              title="All Features & Navigation"
            >
              <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Feature Navigation Drawer (Right Side Flyout) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-250">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                  VL
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">VoiceLend Navigation</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">All Vernacular FinTech Features</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Session Strip inside drawer */}
            {isAuthenticated && (
              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {(activeMerchant?.name || 'Merchant').split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <span>{activeMerchant?.name || 'Merchant'}</span>
                      <BadgeCheck className="w-3.5 h-3.5 text-sky-500" />
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {activeMerchant?.businessName || 'Store'} • ₹{(activeMerchant?.monthlySales || 150000).toLocaleString('en-IN')}/mo
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onOpenAuth?.('login');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Switch
                </button>
              </div>
            )}

            {/* Feature List (Scrollable clean content) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                FinTech Services &amp; Portals
              </div>

              {featureItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`drawer-nav-${item.id}`}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-3 rounded-2xl transition-all text-left cursor-pointer group ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                        : item.highlight
                        ? 'bg-emerald-50/80 text-slate-900 dark:bg-emerald-950/40 dark:text-white border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100'
                        : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                        : item.highlight
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold truncate">{item.label}</span>
                        {item.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] mt-0.5 leading-tight ${isActive ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onOpenDocs?.();
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 text-xs font-bold hover:bg-indigo-100 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Docs &amp; Specs</span>
                </button>

                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onOpenSettings?.();
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </button>
              </div>

              {isAuthenticated && (
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Current Session</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
