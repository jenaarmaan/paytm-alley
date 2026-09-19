import { SupportedLanguage } from '../types';

export interface SpeechRecognitionResultState {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onResultCallback?: (result: SpeechRecognitionResultState) => void;
  private onErrorCallback?: (error: string) => void;
  private onEndCallback?: () => void;

  constructor() {
    this.initRecognition();
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && (
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    );
  }

  private initRecognition() {
    if (!this.isSupported()) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const currentText = finalTranscript || interimTranscript;
      if (this.onResultCallback && currentText.trim()) {
        this.onResultCallback({
          transcript: currentText.trim(),
          isFinal: Boolean(finalTranscript),
          confidence: event.results[0]?.[0]?.confidence || 0.95,
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition warning/error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        this.onErrorCallback?.('Microphone access denied. You can type your request directly.');
      } else if (event.error !== 'no-speech') {
        this.onErrorCallback?.(`Speech recognition error: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onEndCallback?.();
    };
  }

  public startListening(
    language: SupportedLanguage,
    onResult: (result: SpeechRecognitionResultState) => void,
    onError?: (err: string) => void,
    onEnd?: () => void
  ) {
    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd;

    if (!this.isSupported() || !this.recognition) {
      onError('Speech recognition is not supported in this browser. Please use text input below.');
      return;
    }

    const langCodeMap: Record<SupportedLanguage, string> = {
      English: 'en-IN',
      Hindi: 'hi-IN',
      Kannada: 'kn-IN',
      Telugu: 'te-IN',
      Tamil: 'ta-IN',
      Malayalam: 'ml-IN',
      Hinglish: 'hi-IN', // standard Hindi recognition picks up Hinglish well
    };

    this.recognition.lang = langCodeMap[language] || 'en-IN';

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (err: any) {
      console.warn('Failed to start speech recognition, already active?', err);
      try {
        this.recognition.stop();
        setTimeout(() => {
          this.recognition.start();
          this.isListening = true;
        }, 150);
      } catch (e) {
        onError('Could not start microphone. Please try typing instead.');
      }
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  /**
   * Browser Text-to-Speech playback
   */
  public speak(text: string, language: SupportedLanguage = 'English', onComplete?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onComplete?.();
      return;
    }

    // Cancel existing
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langCodeMap: Record<SupportedLanguage, string> = {
      English: 'en-IN',
      Hindi: 'hi-IN',
      Kannada: 'kn-IN',
      Telugu: 'te-IN',
      Tamil: 'ta-IN',
      Malayalam: 'ml-IN',
      Hinglish: 'hi-IN',
    };

    utterance.lang = langCodeMap[language] || 'en-IN';
    utterance.rate = 0.95; // Clear pace for financial explanation
    utterance.pitch = 1.0;

    utterance.onend = () => onComplete?.();
    utterance.onerror = () => onComplete?.();

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechService = new SpeechService();

export function speak(text: string, language: SupportedLanguage = 'English', onComplete?: () => void) {
  speechService.speak(text, language, onComplete);
}
