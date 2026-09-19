import React, { useState } from 'react';
import {
  ShieldCheck,
  Store,
  HeartPulse,
  AlertTriangle,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
  Building2,
  FileCheck,
  Zap,
  PhoneCall,
  Upload,
  PlusCircle,
  HelpCircle,
  Volume2,
} from 'lucide-react';
import {
  InsuranceProduct,
  InsuranceClaim,
  SupportedLanguage,
  Merchant,
} from '../types';
import { apiClient } from '../services/apiClient';
import { speechService } from '../services/speechService';
import { getVoiceInsuranceAcknowledgement } from '../services/translations';

interface EmbeddedInsuranceViewProps {
  merchant: Merchant;
  selectedLanguage: SupportedLanguage;
  insuranceProducts: InsuranceProduct[];
  insuranceClaims: InsuranceClaim[];
  onToggleEnrollment: (productId: string, enrolled: boolean) => void;
  onClaimFiled: (claim: InsuranceClaim) => void;
  onOpenVoiceLoan?: () => void;
}

export function EmbeddedInsuranceView({
  merchant,
  selectedLanguage,
  insuranceProducts,
  insuranceClaims,
  onToggleEnrollment,
  onClaimFiled,
}: EmbeddedInsuranceViewProps) {
  // Voice Enrollment & Claim States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceFeedbackText, setVoiceFeedbackText] = useState<string>('');
  const [isProcessingVoice, setIsProcessingVoice] = useState<boolean>(false);

  // Claim Filing Modal State
  const [isClaimModalOpen, setIsClaimModalOpen] = useState<boolean>(false);
  const [selectedClaimProduct, setSelectedClaimProduct] = useState<string>('dukan-suraksha');
  const [claimAmount, setClaimAmount] = useState<string>('25000');
  const [claimDescription, setClaimDescription] = useState<string>('');
  const [claimIncidentType, setClaimIncidentType] = useState<InsuranceClaim['claimCategory']>('Fire/Theft');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState<boolean>(false);
  const [uploadedMockFile, setUploadedMockFile] = useState<string | null>(null);

  // Calculate stats
  const activeProducts = insuranceProducts.filter((p) => p.enrolled);
  const totalDailySachet = activeProducts.reduce((sum, p) => sum + p.dailyPremium, 0);
  const totalProtectionAmount = activeProducts.reduce((sum, p) => sum + p.coverageAmount, 0);

  // Voice handler for micro-insurance
  const handleStartVoiceInsurance = () => {
    if (!speechService.isSupported()) {
      setVoiceFeedbackText('Microphone not supported in this browser. Please use manual toggles.');
      return;
    }

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setVoiceFeedbackText('Listening for your insurance request in ' + selectedLanguage + '...');

    speechService.startListening(
      selectedLanguage,
      async (result) => {
        if (result.isFinal && result.transcript.trim()) {
          speechService.stopListening();
          setIsListening(false);
          setIsProcessingVoice(true);
          setVoiceFeedbackText(`Processing: "${result.transcript}"`);

          try {
            const intent = await apiClient.extractInsuranceIntent(result.transcript, selectedLanguage);
            if (intent.action === 'claim') {
              // Open claim modal prefilled
              if (intent.productId) setSelectedClaimProduct(intent.productId);
              setClaimDescription(result.transcript);
              setIsClaimModalOpen(true);
              const ack = getVoiceInsuranceAcknowledgement(
                intent.productName || 'Kirana Dukan Suraksha',
                0,
                selectedLanguage,
                true
              );
              setVoiceFeedbackText(ack);
              speechService.speak(ack, selectedLanguage);
            } else {
              // Enroll or toggle
              const targetProduct = insuranceProducts.find(
                (p) => p.id === intent.productId
              ) || insuranceProducts[0];

              if (targetProduct) {
                onToggleEnrollment(targetProduct.id, true);
                const ack = getVoiceInsuranceAcknowledgement(
                  targetProduct.name,
                  targetProduct.dailyPremium,
                  selectedLanguage,
                  false
                );
                setVoiceFeedbackText(ack);
                speechService.speak(ack, selectedLanguage);
              }
            }
          } catch (e) {
            setVoiceFeedbackText('Could not process voice request. Please tap the toggle button.');
          } finally {
            setIsProcessingVoice(false);
          }
        }
      },
      (error) => {
        setIsListening(false);
        setVoiceFeedbackText(`Voice error: ${error}`);
      }
    );
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingClaim(true);

    const product = insuranceProducts.find((p) => p.id === selectedClaimProduct) || insuranceProducts[0];

    try {
      const claim = await apiClient.fileInsuranceClaim({
        productId: product.id,
        productName: product.name,
        amount: Number(claimAmount) || 25000,
        description: claimDescription || 'Emergency claim reported by merchant',
        incidentDate: new Date().toLocaleDateString('en-IN'),
        claimCategory: claimIncidentType,
      });

      onClaimFiled(claim);
      setIsClaimModalOpen(false);
      setClaimDescription('');
      setUploadedMockFile(null);

      const ack = getVoiceInsuranceAcknowledgement(product.name, 0, selectedLanguage, true);
      setVoiceFeedbackText(ack);
      speechService.speak(ack, selectedLanguage);
    } catch (err) {
      console.error('Claim filing error:', err);
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-800 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Bite-Sized Sachet Micro-Insurance for Bharat
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Zero Lump-Sum Burden. Protection for ₹3 to ₹7/Day.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Institutional micro-insurance underwritten by HDFC ERGO & ICICI Lombard. Premiums auto-deduct daily from evening QR settlements so your store and family are always protected.
            </p>
          </div>

          {/* Sachet Metrics Overview Box */}
          <div className="flex flex-col sm:flex-row gap-3 bg-slate-950/70 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-md">
            <div className="px-3 border-r border-slate-800 last:border-0 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Active Protections</span>
              <div className="text-2xl font-bold text-white flex items-center gap-1.5">
                {activeProducts.length} <span className="text-xs font-normal text-slate-400">/ 3</span>
              </div>
            </div>
            <div className="px-3 border-r border-slate-800 last:border-0 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Total Cover Value</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                ₹{totalProtectionAmount.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="px-3 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Daily Sachet Cost</span>
              <div className="text-2xl font-bold text-sky-400 font-mono">
                ₹{totalDailySachet}<span className="text-xs font-normal text-slate-400">/day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative ambient background accent */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Voice Assistant Mic Trigger for Insurance */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleStartVoiceInsurance}
            disabled={isProcessingVoice}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/30'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
            }`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {isListening ? 'Listening now...' : 'Voice-Assisted Sachet Enrollment'}
              </span>
              <span className="text-[10px] uppercase font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                {selectedLanguage}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {voiceFeedbackText || 'Say: "Dukaan ka 3 lakh bima activate karo" or "Shop insurance add madi"'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsClaimModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            3-Min Instant Claim Assist
          </button>
        </div>
      </div>

      {/* Sachet Insurance Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Available Sachet Protection Plans
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select or speak to enroll. Cancel or pause anytime with 0 lock-in.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Settlement Rail: Daily 11:30 PM UPI Auto-Split
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {insuranceProducts.map((product) => {
            const Icon = product.id === 'dukan-suraksha' ? Store : product.id === 'hospicash' ? HeartPulse : ShieldCheck;
            return (
              <div
                key={product.id}
                className={`rounded-3xl border transition-all flex flex-col justify-between overflow-hidden shadow-sm ${
                  product.enrolled
                    ? 'border-emerald-500 bg-white dark:bg-slate-900 ring-2 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                }`}
              >
                {/* Top Product Header */}
                <div className="p-5 space-y-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-start justify-between gap-2">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      product.enrolled
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {product.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Pricing and Coverage Pill */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Sum Insured</span>
                      <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                        ₹{product.coverageAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Daily Sachet</span>
                      <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        ₹{product.dailyPremium}<span className="text-[10px] font-normal text-slate-500">/day</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="p-5 space-y-2.5 flex-1 text-xs">
                  <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Protection Scope:
                  </div>
                  <ul className="space-y-2">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300 text-[11px] leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 text-[10px] text-slate-400 font-medium">
                    Underwritten by: <span className="text-slate-700 dark:text-slate-200">{product.underwriter}</span>
                  </div>
                </div>

                {/* Action Toggle Footer */}
                <div className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${product.enrolled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {product.enrolled ? 'Active & Covered' : 'Not Enrolled'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const newStatus = !product.enrolled;
                      onToggleEnrollment(product.id, newStatus);
                      const ack = getVoiceInsuranceAcknowledgement(
                        product.name,
                        product.dailyPremium,
                        selectedLanguage,
                        false
                      );
                      setVoiceFeedbackText(newStatus ? ack : `${product.name} paused.`);
                      speechService.speak(newStatus ? ack : `${product.name} paused.`, selectedLanguage);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      product.enrolled
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    }`}
                  >
                    {product.enrolled ? 'Deactivate' : 'Activate (₹' + product.dailyPremium + '/d)'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Deduction Visual Breakdown & Settlement Rail */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                How Daily Sachet Micro-Deduction Works
              </h3>
              <p className="text-xs text-slate-500">
                Transparent evening auto-split breakdown from your store UPI QR collections
              </p>
            </div>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Zero Monthly Lump-Sum Shock
          </span>
        </div>

        {/* Visual Flow Graphic */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Step 1: Daytime UPI Sales</span>
            <div className="text-base font-bold text-slate-900 dark:text-white font-mono">₹6,240 Today</div>
            <p className="text-slate-500 text-[11px]">Customers scan your Paytm/UPI QR throughout the day.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Step 2: 11:30 PM Auto-Sweep</span>
            <div className="text-base font-bold text-sky-600 dark:text-sky-400 font-mono">
              - ₹{totalDailySachet || 10} Sachet Split
            </div>
            <p className="text-slate-500 text-[11px]">
              {totalDailySachet > 0
                ? `₹${totalDailySachet}/day micro-premium swept to insurer escrow.`
                : '₹0 currently (Activate a plan above).'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Step 3: Direct Net Settlement</span>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              ₹{(6240 - (totalDailySachet || 10)).toLocaleString('en-IN')} Settled
            </div>
            <p className="text-slate-500 text-[11px]">Remaining 99.8% balance reaches your bank account instantly.</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">Step 4: Full Protection</span>
            <div className="text-base font-bold text-emerald-700 dark:text-emerald-300 font-mono">
              ₹{totalProtectionAmount.toLocaleString('en-IN')} Active
            </div>
            <p className="text-emerald-600 dark:text-emerald-400 text-[11px]">
              Continuous 24x7 coverage with instant ₹25,000 spot emergency advance.
            </p>
          </div>
        </div>
      </div>

      {/* Claims History & Instant Settlement Tracker */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Insurance Claims & Emergency Disbursals
            </h3>
            <p className="text-xs text-slate-500">
              Track filed incidents, verification milestones, and rapid IMPS payouts
            </p>
          </div>
          <button
            onClick={() => setIsClaimModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            File New Emergency Claim
          </button>
        </div>

        {insuranceClaims.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No claims filed yet. Your business has zero pending incidents.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Claim ID</th>
                  <th className="pb-3 font-semibold">Plan / Incident</th>
                  <th className="pb-3 font-semibold">Claim Amount</th>
                  <th className="pb-3 font-semibold">Filed Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Payout Channel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {insuranceClaims.map((claim) => (
                  <tr key={claim.claimId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {claim.claimId}
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">{claim.productName}</div>
                      <div className="text-[11px] text-slate-500">{claim.description}</div>
                    </td>
                    <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      ₹{claim.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 text-slate-500">{claim.dateFiled}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        claim.status === 'Disbursed' || claim.status === 'Approved'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-[11px] text-slate-600 dark:text-slate-300">
                      {claim.payoutEta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Instant Claim Filing Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    3-Minute Emergency Claim Filing
                  </h3>
                  <p className="text-xs text-slate-500">
                    Instant ₹25,000 spot emergency advance on verification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitClaim} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Affected Coverage
                </label>
                <select
                  value={selectedClaimProduct}
                  onChange={(e) => setSelectedClaimProduct(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium"
                >
                  {insuranceProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Coverage: ₹{p.coverageAmount.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Incident Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Fire/Theft', 'Hospitalization', 'Loan Protection'] as const).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setClaimIncidentType(cat)}
                      className={`p-2 rounded-xl text-center font-medium border text-[11px] transition-all ${
                        claimIncidentType === cat
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Loss / Claim Amount (₹)
                </label>
                <input
                  type="number"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  placeholder="25000"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description of Incident (or use Voice)
                </label>
                <textarea
                  value={claimDescription}
                  onChange={(e) => setClaimDescription(e.target.value)}
                  placeholder="e.g. Electrical short circuit damaged inventory or 3 days clinic hospitalization..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Evidence Photo / Bill Mockup
                </label>
                <div
                  onClick={() => setUploadedMockFile('store_damage_photo_sep26.jpg')}
                  className="p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center cursor-pointer hover:border-emerald-500 transition-colors"
                >
                  <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    {uploadedMockFile ? `✓ Attached: ${uploadedMockFile}` : 'Tap to attach store photo or discharge slip'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingClaim}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md"
                >
                  {isSubmittingClaim ? 'Filing Claim...' : 'Submit Claim & Request Advance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
