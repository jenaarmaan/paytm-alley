import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Keyboard,
  Volume2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { SupportedLanguage, LoanJourneyState } from '../types';
import { speechService, SpeechRecognitionResultState } from '../services/speechService';
import { TRANSLATIONS } from '../services/translations';
import { DEMO_SCENARIOS } from '../data/seedData';

interface VoiceRecorderProps {
  language: SupportedLanguage;
  journeyState: LoanJourneyState;
  onTranscriptReady: (transcript: string, engine?: 'sarvam' | 'gemini' | 'deterministic') => void;
  isProcessing: boolean;
  autoVoiceEnabled?: boolean;
  onToggleAutoVoice?: () => void;
  engine?: 'sarvam' | 'gemini' | 'deterministic';
  onChangeEngine?: (engine: 'sarvam' | 'gemini' | 'deterministic') => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  language,
  journeyState,
  onTranscriptReady,
  isProcessing,
  autoVoiceEnabled = true,
  onToggleAutoVoice,
  engine: controlledEngine,
  onChangeEngine,
}) => {
  const [internalEngine, setInternalEngine] = useState<'sarvam' | 'gemini' | 'deterministic'>('sarvam');
  const activeEngine = controlledEngine || internalEngine;

  const handleSetEngine = (e: 'sarvam' | 'gemini' | 'deterministic') => {
    setInternalEngine(e);
    onChangeEngine?.(e);
  };
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [waveBars, setWaveBars] = useState<number[]>([
    10, 14, 18, 22, 28, 34, 40, 48, 42, 36, 30, 24, 18, 14, 12, 10,
  ]);

  const t = TRANSLATIONS[language] || TRANSLATIONS['English'];

  // Animate audio waveform bars and recording timer when listening
  useEffect(() => {
    let waveInterval: any;
    let timerInterval: any;

    if (isListening) {
      setRecordingSeconds(0);
      timerInterval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      waveInterval = setInterval(() => {
        setWaveBars([
          Math.floor(Math.random() * 18) + 8,
          Math.floor(Math.random() * 26) + 12,
          Math.floor(Math.random() * 38) + 16,
          Math.floor(Math.random() * 52) + 20,
          Math.floor(Math.random() * 64) + 24,
          Math.floor(Math.random() * 72) + 28,
          Math.floor(Math.random() * 80) + 32,
          Math.floor(Math.random() * 88) + 36,
          Math.floor(Math.random() * 84) + 32,
          Math.floor(Math.random() * 74) + 28,
          Math.floor(Math.random() * 60) + 22,
          Math.floor(Math.random() * 48) + 18,
          Math.floor(Math.random() * 36) + 14,
          Math.floor(Math.random() * 24) + 10,
          Math.floor(Math.random() * 16) + 8,
          Math.floor(Math.random() * 12) + 6,
        ]);
      }, 90);
    } else {
      setWaveBars([10, 12, 15, 18, 22, 26, 30, 32, 30, 26, 22, 18, 15, 12, 10, 8]);
      setRecordingSeconds(0);
    }
    return () => {
      clearInterval(waveInterval);
      clearInterval(timerInterval);
    };
  }, [isListening]);

  const handleToggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      if (transcript.trim()) {
        onTranscriptReady(transcript.trim(), activeEngine);
      }
    } else {
      setErrorMsg(null);
      setTranscript('');
      speechService.startListening(
        language,
        (res: SpeechRecognitionResultState) => {
          setTranscript(res.transcript);
          if (res.isFinal && res.transcript.length > 5) {
            // Auto-advance after small pause
            setTimeout(() => {
              speechService.stopListening();
              setIsListening(false);
              onTranscriptReady(res.transcript, activeEngine);
            }, 800);
          }
        },
        (err: string) => {
          setErrorMsg(err);
          setIsListening(false);
          setShowManualInput(true);
        },
        () => {
          setIsListening(false);
        }
      );
      setIsListening(true);
    }
  };

  const handlePresetSelect = (spokenPrompt: string) => {
    setTranscript(spokenPrompt);
    setErrorMsg(null);
    onTranscriptReady(spokenPrompt, activeEngine);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    setTranscript(manualText.trim());
    onTranscriptReady(manualText.trim(), activeEngine);
  };

  return (
    <div id="voice-recorder-container" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 transition-all">
      
      {/* AI Engine Switcher Bar */}
      <div className="max-w-xl mx-auto mb-6 p-2 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-md">
        <div className="flex items-center gap-2 pl-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Core:</span>
          <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleSetEngine('sarvam')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeEngine === 'sarvam'
                  ? 'bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>⚡ Sarvam Indic LLM</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetEngine('gemini')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeEngine === 'gemini'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>✦ Gemini 2.5</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetEngine('deterministic')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeEngine === 'deterministic'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>⚙️ Rule-Engine</span>
            </button>
          </div>
        </div>

        {activeEngine === 'sarvam' && (
          <span className="text-[10px] text-amber-300 font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center gap-1 self-start sm:self-auto mr-1">
            <span>Powered by Sarvam AI Indic Sovereign Stack</span>
          </span>
        )}
      </div>

      {/* Top Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-2 flex-wrap mb-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Alley • Indic Voice Agent ({language})</span>
          </div>
          {onToggleAutoVoice && (
            <button
              id="btn-rec-toggle-auto-voice"
              onClick={onToggleAutoVoice}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                autoVoiceEnabled
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
              }`}
              title="Automatically speak back responses in your regional language"
            >
              <Volume2 className={`w-3 h-3 ${autoVoiceEnabled ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>Auto Spoken Feedback: {autoVoiceEnabled ? 'ON' : 'OFF'}</span>
            </button>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Talk to Alley — {t.tellUsWhatYouNeed}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Speak naturally in your preferred language. Tell Alley about your working capital, festive stock, or store expansion needs.
        </p>
      </div>

      {/* Main Microphone Interaction Stage */}
      <div className="flex flex-col items-center justify-center my-8">
        <div className="relative flex items-center justify-center">
          {/* Animated pulse ripples when active */}
          {isListening && (
            <>
              <div className="absolute w-40 h-40 rounded-full bg-rose-500/20 animate-ping pointer-events-none"></div>
              <div className="absolute w-48 h-48 rounded-full bg-rose-500/10 animate-pulse pointer-events-none"></div>
            </>
          )}

          {/* Microphone action button */}
          <button
            id="btn-voice-mic"
            onClick={handleToggleListening}
            disabled={isProcessing}
            aria-label={isListening ? t.stopListening : t.tapToSpeak}
            className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center shadow-xl transition-all transform active:scale-95 focus:outline-none ${
              isListening
                ? 'bg-rose-600 text-white shadow-rose-600/40 ring-4 ring-rose-200 animate-pulse'
                : isProcessing
                ? 'bg-slate-900 text-slate-400 cursor-not-allowed ring-4 ring-slate-200'
                : 'bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-900 text-white hover:shadow-emerald-900/30 hover:scale-105 ring-4 ring-emerald-500/20'
            }`}
          >
            {isProcessing ? (
              <RefreshCw className="w-10 h-10 animate-spin text-emerald-400" />
            ) : isListening ? (
              <Square className="w-9 h-9 fill-white" />
            ) : (
              <Mic className="w-11 h-11 text-white group-hover:scale-110 transition-transform" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1.5 text-slate-200">
              {isListening ? 'Stop' : isProcessing ? 'Processing' : 'Tap to Speak'}
            </span>
          </button>
        </div>

        {/* Dynamic Voice Waveform Visualizer */}
        <div className="flex items-center justify-center gap-1.5 h-16 mt-8 px-4 py-2 bg-slate-50/80 rounded-2xl border border-slate-100">
          {waveBars.map((height, idx) => (
            <div
              key={idx}
              className={`w-1.5 rounded-full transition-all duration-75 ${
                isListening
                  ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-xs'
                  : 'bg-slate-200'
              }`}
              style={{ height: `${height}px` }}
            />
          ))}
        </div>

        {/* Live Status indicator with Timer */}
        <div className="mt-4 text-center">
          {isListening ? (
            <div className="inline-flex items-center gap-2.5 text-xs font-semibold text-rose-700 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
              <span>{t.listening}... (00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds})</span>
            </div>
          ) : isProcessing ? (
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-700 bg-sky-50 px-4 py-1.5 rounded-full border border-sky-200">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
              <span>Analyzing speech & extracting loan parameters...</span>
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
              <span>{t.readyToListen}</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold">Web Speech API Active</span>
            </p>
          )}
        </div>
      </div>

      {/* Spoken Transcript Live Box */}
      {transcript && (
        <div className="max-w-2xl mx-auto mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Recognized Audio Transcript</span>
            <span className="text-[11px] bg-slate-200/80 text-slate-800 px-2 py-0.5 rounded font-mono font-semibold">{language}</span>
          </div>
          <p className="text-base font-medium text-slate-900 leading-relaxed italic">
            "{transcript}"
          </p>
        </div>
      )}

      {/* Permission / Error message if microphone is unavailable */}
      {errorMsg && (
        <div className="max-w-xl mx-auto mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-amber-900">Speech Recognition Notice</div>
            <div className="text-amber-800 mt-0.5 leading-relaxed">{errorMsg}</div>
            <div className="text-amber-700 font-medium mt-1">You can use the preset sample prompts below or type your request directly.</div>
          </div>
        </div>
      )}

      {/* Preset Demo Prompts */}
      <div className="max-w-2xl mx-auto pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Instant Judge Prompts (Click to Test)</span>
          </span>
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1.5 hover:underline"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>{showManualInput ? 'Hide keyboard input' : t.orTypeInstead}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEMO_SCENARIOS.map((item) => (
            <button
              key={item.id}
              id={`preset-${item.id.toLowerCase()}`}
              type="button"
              onClick={() => handlePresetSelect(item.spokenPrompt)}
              className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:bg-emerald-50/60 hover:border-emerald-300 text-left transition-all shadow-2xs hover:shadow-sm group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                    {item.title}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                    {item.language}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 italic line-clamp-2">
                  "{item.spokenPrompt}"
                </div>
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-2.5 flex items-center gap-1">
                <span>{item.subtitle}</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>

        {/* Text Input Fallback */}
        {showManualInput && (
          <form onSubmit={handleManualSubmit} className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              id="manual-loan-input"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder={t.typeYourRequest}
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              id="btn-manual-submit"
              disabled={!manualText.trim()}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <span>Process</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
