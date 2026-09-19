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
  UserPlus,
  BookOpen,
  Settings,
  Volume2,
  VolumeX,
  Sparkles,
  BadgeCheck,
  LogIn,
  LogOut,
  User
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const primaryNavItems = [
    { id: 'landing', label: 'Overview', icon: Store },
    { id: 'merchant-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'merchant-voice', label: 'Alley Voice', icon: Mic, highlight: true },
    { id: 'merchant-loans', label: 'My Loans', icon: CreditCard },
    { id: 'insurance', label: 'Sachet Insurance', icon: Shield, badge: '₹3/d' },
    { id: 'merchant-health', label: 'Business Health', icon: TrendingUp },
    { id: 'federated-security', label: 'Privacy & FedAI', icon: ShieldCheck, badge: 'ZKP' },
    { id: 'admin-dashboard', label: 'Lender Portal', icon: Shield },
  ];

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Logo & Active Persona Quick Trigger */}
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
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white font-sans">
                  Voice<span className="text-emerald-600">Lend</span>
                </span>
                <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Alley AI
                </span>
              </div>
            </div>
          </div>

          {/* Quick Active Persona Switcher Pill (when authenticated) */}
          {isAuthenticated ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                id="btn-navbar-switch-persona"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 text-left transition-all cursor-pointer group"
                title="Account Menu & Profile Details"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                  {activeMerchant.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="hidden lg:block leading-tight">
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <span className="truncate max-w-[100px]">{activeMerchant.name}</span>
                    <BadgeCheck className="w-3 h-3 text-sky-500 shrink-0" />
                  </div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate max-w-[100px]">
                    {activeMerchant.businessName}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileDropdownOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : 'group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Merchant Session</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{activeMerchant.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{activeMerchant.businessName} • {activeMerchant.location}</p>
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

        {/* Center: Clean Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : item.highlight
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200/80 dark:border-emerald-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.highlight && !isActive ? 'text-emerald-600' : ''}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions, Docs & Settings, Onboard/Logout Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Docs & Specs Trigger Button (Desktop & Tablet) */}
          <button
            id="btn-navbar-docs-hub"
            onClick={() => onOpenDocs?.()}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Open Architecture & MCP Specifications"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Docs &amp; Specs</span>
          </button>

          {/* Settings Trigger Button (Desktop & Tablet) */}
          <button
            id="btn-navbar-settings"
            onClick={() => onOpenSettings?.()}
            className="hidden md:flex p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="System Settings & Profile"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Audio Spoken Toggle */}
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

          {/* Desktop/Tablet Log In or Log Out Button */}
          {isAuthenticated ? (
            <button
              id="btn-navbar-logout"
              onClick={onLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 transition-all cursor-pointer shadow-xs"
              title="Log Out Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          ) : (
            <button
              id="btn-navbar-login"
              onClick={() => onOpenAuth?.('login')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-sm shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {isAuthenticated ? (
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {activeMerchant.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{activeMerchant.name}</div>
                  <div className="text-[10px] text-slate-500">{activeMerchant.businessName}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth?.('login');
                  }}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Switch
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout?.();
                  }}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth?.('login');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center cursor-pointer"
              >
                Log In
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDocs?.();
              }}
              className="flex-1 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 text-xs font-bold text-center"
            >
              Docs &amp; Specs
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSettings?.();
              }}
              className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold text-center"
            >
              Settings
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

