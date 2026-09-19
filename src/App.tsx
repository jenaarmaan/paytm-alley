import React, { useState, useEffect } from 'react';
import { DemoBanner } from './components/DemoBanner';
import { Navbar } from './components/Navbar';
import { VoiceRecorder } from './components/VoiceRecorder';
import { IntentCard } from './components/IntentCard';
import { MerchantContextCard } from './components/MerchantContextCard';
import { EligibilityCard } from './components/EligibilityCard';
import { LoanOfferCard } from './components/LoanOfferCard';
import { KFSCard } from './components/KFSCard';
import { ConsentModal } from './components/ConsentModal';
import { ApplicationStatusView } from './components/ApplicationStatusView';
import { MerchantDashboardView } from './components/MerchantDashboardView';
import { MyLoansView } from './components/MyLoansView';
import { BusinessHealthView } from './components/BusinessHealthView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { EnterpriseIntegrationsView } from './components/EnterpriseIntegrationsView';
import { LandingPageView } from './components/LandingPageView';
import { EmbeddedInsuranceView } from './components/EmbeddedInsuranceView';
import { CapitalFlowModal } from './components/CapitalFlowModal';
import { TrustModal } from './components/TrustModal';
import { PersonaPerspectiveBar } from './components/PersonaPerspectiveBar';
import { MerchantOnboardingModal } from './components/MerchantOnboardingModal';
import { CheckCircle2, Volume2, VolumeX, X } from 'lucide-react';
import { speechService } from './services/speechService';
import { getVoiceIntentAcknowledgement, getVoiceSubmissionAcknowledgement } from './services/translations';

import {
  SupportedLanguage,
  Merchant,
  LoanIntent,
  EligibilityResult,
  LoanOffer,
  KeyFactsStatement,
  LoanApplication,
  ActiveLoan,
  InsuranceProduct,
  InsuranceClaim,
} from './types';

import {
  SEEDED_MERCHANTS,
  SEEDED_APPLICATIONS,
  SEEDED_ACTIVE_LOAN,
  SEEDED_INSURANCE_PRODUCTS,
  SEEDED_INSURANCE_CLAIMS,
} from './data/seedData';
import { apiClient } from './services/apiClient';
import { calculateEligibility, generateLoanOffer, generateKFS } from './services/financialEngine';

export function App() {
  // Navigation & Profile States
  const [currentView, setCurrentView] = useState<string>('merchant-dashboard');
  const [merchantsMap, setMerchantsMap] = useState<Record<string, Merchant>>(SEEDED_MERCHANTS);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('M001');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('Hinglish');
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState<boolean>(false);

  // Active Merchant Profile
  const activeMerchant: Merchant = merchantsMap[selectedMerchantId] || Object.values(merchantsMap)[0] || SEEDED_MERCHANTS['M001'];

  // Handle Dynamic Merchant Onboarding
  const handleOnboardMerchant = (newMerchant: Merchant) => {
    setMerchantsMap((prev) => ({
      ...prev,
      [newMerchant.merchantId]: newMerchant,
    }));
    apiClient.registerMerchant(newMerchant);
    setSelectedMerchantId(newMerchant.merchantId);
    setSelectedLanguage(newMerchant.preferredLanguage);
    setCurrentView('merchant-dashboard');
  };

  // Applications & Active Loans
  const [applications, setApplications] = useState<LoanApplication[]>(SEEDED_APPLICATIONS);
  const [activeLoan, setActiveLoan] = useState<ActiveLoan | null>(SEEDED_ACTIVE_LOAN);

  // Sachet Insurance Suite State
  const [insuranceProducts, setInsuranceProducts] = useState<InsuranceProduct[]>(SEEDED_INSURANCE_PRODUCTS);
  const [insuranceClaims, setInsuranceClaims] = useState<InsuranceClaim[]>(SEEDED_INSURANCE_CLAIMS);

  // Voice Journey Workflow States
  type JourneyStep = 'INPUT' | 'INTENT_CONFIRMATION' | 'ELIGIBILITY' | 'OFFER' | 'KFS' | 'SUBMITTED';
  const [journeyStep, setJourneyStep] = useState<JourneyStep>('INPUT');
  const [isProcessingVoice, setIsProcessingVoice] = useState<boolean>(false);
  const [currentIntent, setCurrentIntent] = useState<LoanIntent | null>(null);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [currentOffer, setCurrentOffer] = useState<LoanOffer | null>(null);
  const [currentKFS, setCurrentKFS] = useState<KeyFactsStatement | null>(null);
  const [offerExplanation, setOfferExplanation] = useState<string>('');
  const [voiceKfsSummary, setVoiceKfsSummary] = useState<string>('');
  const [submittedApplication, setSubmittedApplication] = useState<LoanApplication | null>(null);

  // Auto Voice Playback State
  const [autoVoiceEnabled, setAutoVoiceEnabled] = useState<boolean>(true);
  const [currentlySpeakingText, setCurrentlySpeakingText] = useState<string | null>(null);
  const [activeAiEngine, setActiveAiEngine] = useState<'sarvam' | 'gemini' | 'deterministic'>('sarvam');

  const speakVoiceFeedback = (text: string, lang: SupportedLanguage) => {
    if (!autoVoiceEnabled || !text) return;
    setCurrentlySpeakingText(text);
    speechService.speak(text, lang, () => {
      setCurrentlySpeakingText(null);
    });
  };

  const stopVoiceFeedback = () => {
    speechService.stopSpeaking();
    setCurrentlySpeakingText(null);
  };

  // Modals
  const [isConsentModalOpen, setIsConsentModalOpen] = useState<boolean>(false);
  const [isTrustModalOpen, setIsTrustModalOpen] = useState<boolean>(false);
  const [isCapitalFlowModalOpen, setIsCapitalFlowModalOpen] = useState<boolean>(false);
  const [isSubmittingDossier, setIsSubmittingDossier] = useState<boolean>(false);

  // Fetch initial applications and active loans from server or fallback
  useEffect(() => {
    apiClient.getApplications().then((apps) => {
      if (apps && apps.length) setApplications(apps);
    });
    apiClient.getActiveLoan(selectedMerchantId).then((loan) => {
      if (loan) setActiveLoan(loan);
    });
    apiClient.getInsuranceProducts().then((prods) => {
      if (prods && prods.length) setInsuranceProducts(prods);
    });
    apiClient.getInsuranceClaims().then((claims) => {
      if (claims && claims.length) setInsuranceClaims(claims);
    });
  }, [selectedMerchantId]);

  // Handle Intent Extraction when Voice Transcript is ready
  const handleTranscriptReady = async (transcript: string, engine?: 'sarvam' | 'gemini' | 'deterministic') => {
    setIsProcessingVoice(true);
    const targetEngine = engine || activeAiEngine;
    try {
      const intent = await apiClient.extractIntent(transcript, selectedLanguage, targetEngine);
      setCurrentIntent(intent);
      setJourneyStep('INTENT_CONFIRMATION');

      // Instant conversational voice feedback in merchant's language
      if (autoVoiceEnabled) {
        const ack = getVoiceIntentAcknowledgement(
          intent.requested_amount || 150000,
          intent.use_case || intent.purpose,
          selectedLanguage
        );
        speakVoiceFeedback(ack, selectedLanguage);
      }
    } catch (err) {
      console.error('Error handling transcript:', err);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  // Handle Intent Confirmation -> Trigger Deterministic Underwriting
  const handleConfirmIntent = async (confirmedIntent: LoanIntent) => {
    setIsProcessingVoice(true);
    setCurrentIntent(confirmedIntent);

    try {
      // 1. Calculate deterministic eligibility
      const eligibility = await apiClient.getEligibility(
        activeMerchant.merchantId,
        confirmedIntent.requested_amount || 150000,
        12
      );
      setEligibilityResult(eligibility);

      // 2. Generate initial offer with daily QR auto-split default & bundled insurance
      const enrolledInsurance = insuranceProducts.filter((p) => p.enrolled);
      const offer = await apiClient.getLoanOffer(
        activeMerchant.merchantId,
        eligibility.recommendedAmount || 150000,
        12,
        'daily',
        enrolledInsurance
      );
      setCurrentOffer(offer);

      // 3. Generate natural language explanation via Gemini
      const explanation = await apiClient.explainOffer(eligibility, offer, selectedLanguage);
      setOfferExplanation(explanation);

      // 4. Generate KFS in background
      const kfs = await apiClient.getKFS(activeMerchant.merchantId, offer);
      setCurrentKFS(kfs);

      const kfsSpeech = await apiClient.explainKFS(kfs, selectedLanguage);
      setVoiceKfsSummary(kfsSpeech);

      setJourneyStep('ELIGIBILITY');

      // Automatically speak explanation in merchant's native tongue
      if (autoVoiceEnabled && explanation) {
        speakVoiceFeedback(explanation, selectedLanguage);
      }
    } catch (e) {
      console.error('Underwriting calculation error:', e);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  // Handle Offer adjustments & Continue to KFS
  const handleContinueToKFS = async (finalOffer: LoanOffer) => {
    setCurrentOffer(finalOffer);
    const kfs = await apiClient.getKFS(activeMerchant.merchantId, finalOffer);
    setCurrentKFS(kfs);
    const kfsSpeech = await apiClient.explainKFS(kfs, selectedLanguage);
    setVoiceKfsSummary(kfsSpeech);
    setJourneyStep('KFS');

    // Automatically speak KFS terms in merchant's language
    if (autoVoiceEnabled && kfsSpeech) {
      speakVoiceFeedback(kfsSpeech, selectedLanguage);
    }
  };

  // Final Application Submission to Lender Core
  const handleFinalSubmit = async () => {
    if (!currentOffer) return;
    setIsSubmittingDossier(true);

    try {
      const newApp = await apiClient.submitApplication({
        merchantId: activeMerchant.merchantId,
        requestedAmount: currentIntent?.requested_amount || currentOffer.loanAmount,
        approvedAmount: currentOffer.loanAmount,
        purpose: currentIntent?.use_case || currentIntent?.purpose || 'Working capital',
        tenureMonths: currentOffer.tenureMonths,
        interestRate: currentOffer.annualInterestRate,
        monthlyEMI: currentOffer.monthlyEMI,
      });

      setSubmittedApplication(newApp);
      setApplications((prev) => [newApp, ...prev.filter((a) => a.applicationId !== newApp.applicationId)]);
      setIsConsentModalOpen(false);
      setJourneyStep('SUBMITTED');

      // Congratulatory spoken announcement
      if (autoVoiceEnabled) {
        const subVoice = getVoiceSubmissionAcknowledgement(
          newApp.applicationId,
          newApp.approvedAmount,
          selectedLanguage
        );
        speakVoiceFeedback(subVoice, selectedLanguage);
      }
    } catch (e) {
      console.error('Submission error:', e);
    } finally {
      setIsSubmittingDossier(false);
    }
  };

  // Start fresh voice journey
  const handleStartVoiceLoan = (initialPrompt?: string) => {
    stopVoiceFeedback();
    setCurrentView('merchant-voice');
    setJourneyStep('INPUT');
    setCurrentIntent(null);
    setEligibilityResult(null);
    setCurrentOffer(null);
    setCurrentKFS(null);
    setSubmittedApplication(null);

    if (initialPrompt) {
      setTimeout(() => {
        handleTranscriptReady(initialPrompt);
      }, 200);
    }
  };

  // Toggle Insurance Product Enrollment
  const handleToggleInsurance = async (productId: string, enrolled: boolean) => {
    setInsuranceProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, enrolled } : p))
    );
    await apiClient.toggleInsuranceEnrollment(productId, enrolled);
  };

  // Add newly filed insurance claim
  const handleClaimFiled = (claim: InsuranceClaim) => {
    setInsuranceClaims((prev) => [claim, ...prev]);
  };

  // Automated 1-Click Demo Execution for Hackathon Judges
  const handleRunFullDemo = () => {
    setSelectedMerchantId('M001');
    setSelectedLanguage('Hinglish');
    setCurrentView('merchant-voice');
    setJourneyStep('INPUT');
    setIsProcessingVoice(true);

    const demoPhrase = 'Mujhe 2 lakh chahiye Diwali ke liye stock kharidne.';

    setTimeout(async () => {
      const intent: LoanIntent = {
        intent: 'loan_request',
        requested_amount: 200000,
        currency: 'INR',
        purpose: 'inventory_purchase',
        use_case: 'Diwali Festive Stock',
        business_context: 'Festive retail inventory surge',
        language: 'Hinglish',
        confidence: 0.98,
        missing_information: [],
        raw_transcript: demoPhrase,
      };
      setCurrentIntent(intent);
      setJourneyStep('INTENT_CONFIRMATION');
      setIsProcessingVoice(false);

      // Auto confirm intent after 1.5s
      setTimeout(async () => {
        const merchant = SEEDED_MERCHANTS['M001'];
        const eligibility = calculateEligibility(merchant, 200000, 12);
        const enrolledInsurance = SEEDED_INSURANCE_PRODUCTS.filter((p) => p.enrolled);
        const offer = generateLoanOffer(merchant, 150000, 12, undefined, 'daily', enrolledInsurance);
        const kfs = generateKFS(merchant, offer);

        setEligibilityResult(eligibility);
        setCurrentOffer(offer);
        setCurrentKFS(kfs);
        setOfferExplanation(
          `Aapki dukaan ki regular bikri ke aadhar par ₹1,50,000 ka working capital offer tayar hai. Rozana chhota kist ₹458/day sham ke UPI QR settlement se auto-deduct hoga.`
        );
        setVoiceKfsSummary(
          `Aap ₹1,50,000 ke RBI-compliant Key Facts Statement ki samiksha kar rahe hain. Isme rozana ₹458/day QR auto-split hai aur byaaj dar 18% p.a. hai. Raashi seedhe Regulated Lender Escrow se jama hogi.`
        );
        setJourneyStep('ELIGIBILITY');
      }, 1600);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* 1. Top Hackathon Demo Control Bar */}
      <DemoBanner
        currentView={currentView}
        onNavigate={(v) => {
          stopVoiceFeedback();
          setCurrentView(v);
        }}
        selectedMerchantId={selectedMerchantId}
        onSelectMerchant={(id) => {
          stopVoiceFeedback();
          setSelectedMerchantId(id);
          const m = merchantsMap[id];
          if (m) setSelectedLanguage(m.preferredLanguage);
        }}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(lang) => {
          stopVoiceFeedback();
          setSelectedLanguage(lang);
        }}
        onRunFullDemo={handleRunFullDemo}
        onOpenTrustModal={() => setIsTrustModalOpen(true)}
        autoVoiceEnabled={autoVoiceEnabled}
        onToggleAutoVoice={() => {
          stopVoiceFeedback();
          setAutoVoiceEnabled((prev) => !prev);
        }}
        merchants={merchantsMap}
      />

      {/* 2. Main Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={(v) => {
          stopVoiceFeedback();
          setCurrentView(v);
        }}
        activeMerchant={activeMerchant}
        language={selectedLanguage}
        onOpenCapitalFlow={() => setIsCapitalFlowModalOpen(true)}
      />

      {/* 2.1 Prominent Merchant Persona Perspective Bar */}
      <PersonaPerspectiveBar
        merchants={merchantsMap}
        activeMerchantId={selectedMerchantId}
        onSelectMerchant={(id) => {
          stopVoiceFeedback();
          setSelectedMerchantId(id);
          const m = merchantsMap[id];
          if (m) setSelectedLanguage(m.preferredLanguage);
        }}
        onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
      />

      {/* 3. Main Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* VIEW 1: LANDING OVERVIEW */}
        {currentView === 'landing' && (
          <LandingPageView
            onStartDemo={(prompt, lang) => {
              if (lang) setSelectedLanguage(lang);
              handleStartVoiceLoan(prompt);
            }}
            onSelectLanguage={setSelectedLanguage}
            onOpenTrustCenter={() => setIsTrustModalOpen(true)}
          />
        )}

        {/* VIEW 2: MERCHANT DASHBOARD */}
        {currentView === 'merchant-dashboard' && (
          <MerchantDashboardView
            merchant={activeMerchant}
            language={selectedLanguage}
            activeLoan={activeLoan}
            recentApplications={applications}
            onStartVoiceLoan={handleStartVoiceLoan}
            onViewMyLoans={() => setCurrentView('merchant-loans')}
            onViewBusinessHealth={() => setCurrentView('merchant-health')}
            onViewInsurance={() => setCurrentView('insurance')}
          />
        )}

        {/* VIEW 3: VOICE LOAN WORKFLOW */}
        {currentView === 'merchant-voice' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Real-time 6-Stage Journey Breadcrumb */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs p-3.5">
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
                {[
                  { step: 'INPUT', label: '1. Voice Request' },
                  { step: 'INTENT_CONFIRMATION', label: '2. Intent Slotting' },
                  { step: 'ELIGIBILITY', label: '3. Financial Engine' },
                  { step: 'OFFER', label: '4. Offer Customizer' },
                  { step: 'KFS', label: '5. Voice KFS & Consent' },
                  { step: 'SUBMITTED', label: '6. Sanctioned' },
                ].map((s, idx) => {
                  const stepIndex = ['INPUT', 'INTENT_CONFIRMATION', 'ELIGIBILITY', 'OFFER', 'KFS', 'SUBMITTED'].indexOf(journeyStep);
                  const isCurrent = journeyStep === s.step;
                  const isDone = stepIndex > idx;
                  return (
                    <div
                      key={s.step}
                      className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                        isCurrent
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                          : isDone
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/90 dark:border-emerald-800'
                          : 'text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-950'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isCurrent ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
                      )}
                      <span>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 1: Voice Recorder Input */}
            {journeyStep === 'INPUT' && (
              <VoiceRecorder
                language={selectedLanguage}
                journeyState="LISTENING"
                onTranscriptReady={handleTranscriptReady}
                isProcessing={isProcessingVoice}
                autoVoiceEnabled={autoVoiceEnabled}
                onToggleAutoVoice={() => {
                  stopVoiceFeedback();
                  setAutoVoiceEnabled((prev) => !prev);
                }}
                engine={activeAiEngine}
                onChangeEngine={setActiveAiEngine}
              />
            )}

            {/* Step 2: Intent Understanding Card */}
            {journeyStep === 'INTENT_CONFIRMATION' && currentIntent && (
              <div className="space-y-6">
                <IntentCard
                  intent={currentIntent}
                  language={selectedLanguage}
                  onConfirm={handleConfirmIntent}
                  onReRecord={() => setJourneyStep('INPUT')}
                />
                <MerchantContextCard
                  merchant={activeMerchant}
                  language={selectedLanguage}
                />
              </div>
            )}

            {/* Step 3: Eligibility & Explainability */}
            {journeyStep === 'ELIGIBILITY' && eligibilityResult && currentOffer && (
              <div className="space-y-6">
                <EligibilityCard
                  eligibility={eligibilityResult}
                  offer={currentOffer}
                  language={selectedLanguage}
                  explanationText={offerExplanation}
                  onProceedToOffer={() => setJourneyStep('OFFER')}
                />
                <MerchantContextCard
                  merchant={activeMerchant}
                  language={selectedLanguage}
                />
              </div>
            )}

            {/* Step 4: Loan Offer & Tenure Adjustment */}
            {journeyStep === 'OFFER' && currentOffer && (
              <LoanOfferCard
                initialOffer={currentOffer}
                merchant={activeMerchant}
                language={selectedLanguage}
                onContinueToKFS={handleContinueToKFS}
                onSpeakExplanation={() => speakVoiceFeedback(offerExplanation, selectedLanguage)}
              />
            )}

            {/* Step 5: Key Facts Statement (KFS) & Consent */}
            {journeyStep === 'KFS' && currentKFS && (
              <KFSCard
                kfs={currentKFS}
                language={selectedLanguage}
                voiceKfsSummary={voiceKfsSummary}
                onConfirmConsent={() => setIsConsentModalOpen(true)}
                onBackToOffer={() => setJourneyStep('OFFER')}
              />
            )}

            {/* Step 6: Application Status & Timeline */}
            {journeyStep === 'SUBMITTED' && submittedApplication && (
              <ApplicationStatusView
                application={submittedApplication}
                language={selectedLanguage}
                onStartNewVoiceLoan={() => setJourneyStep('INPUT')}
                onViewInLenderPortal={(appId) => {
                  setCurrentView('admin-dashboard');
                }}
                onViewMyLoans={() => setCurrentView('merchant-loans')}
              />
            )}
          </div>
        )}

        {/* VIEW 4: EMBEDDED MICRO-INSURANCE SUITE */}
        {currentView === 'insurance' && (
          <EmbeddedInsuranceView
            merchant={activeMerchant}
            selectedLanguage={selectedLanguage}
            insuranceProducts={insuranceProducts}
            insuranceClaims={insuranceClaims}
            onToggleEnrollment={handleToggleInsurance}
            onClaimFiled={handleClaimFiled}
            onOpenVoiceLoan={() => handleStartVoiceLoan()}
          />
        )}

        {/* VIEW 5: MY LOANS & REPAYMENT SCHEDULE */}
        {currentView === 'merchant-loans' && (
          <MyLoansView
            activeLoan={activeLoan}
            applications={applications}
            language={selectedLanguage}
            onStartVoiceLoan={() => handleStartVoiceLoan()}
            onUpdateActiveLoan={(updated) => setActiveLoan(updated)}
          />
        )}

        {/* VIEW 6: BUSINESS HEALTH & ANALYTICS */}
        {currentView === 'merchant-health' && (
          <BusinessHealthView
            merchant={activeMerchant}
            language={selectedLanguage}
            onStartVoiceLoan={() => handleStartVoiceLoan()}
          />
        )}

        {/* VIEW 7: LENDER ADMIN & UNDERWRITING MONITOR */}
        {currentView === 'admin-dashboard' && (
          <AdminDashboardView
            applications={applications}
            selectedAppId={submittedApplication?.applicationId}
            onUpdateStatus={(appId, status) => {
              apiClient.updateApplicationStatus(appId, status);
              setApplications((prev) =>
                prev.map((a) => (a.applicationId === appId ? { ...a, status } : a))
              );
            }}
          />
        )}

        {/* VIEW 8: ENTERPRISE INTEGRATIONS & MCP TOOLS */}
        {currentView === 'enterprise-integrations' && (
          <EnterpriseIntegrationsView
            onOpenCapitalFlow={() => setIsCapitalFlowModalOpen(true)}
          />
        )}
      </main>

      {/* Consent Modal */}
      {currentOffer && (
        <ConsentModal
          isOpen={isConsentModalOpen}
          offer={currentOffer}
          merchant={activeMerchant}
          language={selectedLanguage}
          onCancel={() => setIsConsentModalOpen(false)}
          onConfirm={handleFinalSubmit}
          isSubmitting={isSubmittingDossier}
        />
      )}

      {/* Capital Flow & Regulated Lender Architecture Modal */}
      <CapitalFlowModal
        isOpen={isCapitalFlowModalOpen}
        onClose={() => setIsCapitalFlowModalOpen(false)}
      />

      {/* Trust & Architecture Modal */}
      <TrustModal
        isOpen={isTrustModalOpen}
        onClose={() => setIsTrustModalOpen(false)}
      />

      {/* Dynamic Merchant Onboarding Modal */}
      <MerchantOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onMerchantCreated={handleOnboardMerchant}
      />

      {/* Real-time Floating Auto-Voice Audio Output Indicator */}
      {currentlySpeakingText && (
        <aside
          aria-label="Active voice playback"
          id="active-voice-floating-bar"
          className="fixed bottom-6 right-4 sm:right-6 z-50 bg-slate-950/95 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-emerald-500/40 backdrop-blur-md flex items-center gap-3.5 max-w-sm sm:max-w-md animate-in slide-in-from-bottom-3 duration-300"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Auto Voice Feedback • {selectedLanguage}</span>
              </span>
              <button
                id="btn-stop-audio-feedback"
                onClick={stopVoiceFeedback}
                className="text-[11px] text-slate-400 hover:text-white font-bold flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded transition-colors cursor-pointer"
                title="Stop audio playback"
              >
                <X className="w-3 h-3" />
                <span>Stop</span>
              </button>
            </div>
            <p className="text-xs text-slate-200 mt-1 line-clamp-2 italic leading-relaxed">
              "{currentlySpeakingText}"
            </p>
          </div>
        </aside>
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-slate-800 dark:text-slate-200">VoiceLend</span>
            <span>• From Voice to Working Capital &amp; Embedded FinTech</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button onClick={() => setIsCapitalFlowModalOpen(true)} className="hover:text-slate-900 dark:hover:text-white transition-colors text-emerald-600 dark:text-emerald-400">
              Capital Rails
            </button>
            <button onClick={() => setIsTrustModalOpen(true)} className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Trust &amp; Architecture
            </button>
            <button onClick={() => setCurrentView('insurance')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Sachet Insurance
            </button>
            <button onClick={() => setCurrentView('enterprise-integrations')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
              MCP Tools
            </button>
            <button onClick={() => setCurrentView('admin-dashboard')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Lender Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
