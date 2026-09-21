// Web Speech API wrapper with graceful fallback for English & Hindi
import { Language } from '../types';

export function speakText(text: string, lang: Language = 'en'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85; // slightly slower and clearer for elderly listeners
  utterance.pitch = 1.0;

  // Find appropriate Indian English or Hindi voice
  const voices = window.speechSynthesis.getVoices();
  if (lang === 'hi') {
    const hindiVoice = voices.find(v =>
      v.lang.includes('hi-IN') ||
      v.lang.includes('hi') ||
      v.lang.includes('en-IN')
    );
    if (hindiVoice) utterance.voice = hindiVoice;
    utterance.lang = 'hi-IN';
  } else {
    const indianEnglishVoice = voices.find(v =>
      v.lang.includes('en-IN') ||
      v.lang.includes('en-GB') ||
      v.lang.includes('en-US')
    );
    if (indianEnglishVoice) utterance.voice = indianEnglishVoice;
    utterance.lang = 'en-IN';
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
