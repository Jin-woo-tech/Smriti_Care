import React, { useState } from 'react';
import {
  X,
  Type,
  Eye,
  EyeOff,
  Zap,
  Volume2,
  Key,
  WifiOff,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../lib/i18n';
import { verifyApiKey } from '../../lib/aiClient';

export const A11yModal: React.FC = () => {
  const {
    isA11yOpen,
    setA11yOpen,
    settings,
    setTextScale,
    toggleHighContrast,
    toggleReducedMotion,
    updateSettings,
    toggleSimulatedOffline,
    setLanguage,
  } = useApp();

  const lang = settings.language;

  const [inputKey, setInputKey] = useState<string>(settings.apiKey || '');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  if (!isA11yOpen) return null;

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationError(null);

    const cleanKey = inputKey.trim();
    updateSettings({ apiKey: cleanKey });

    try {
      const result = await verifyApiKey(cleanKey);
      if (result.valid) {
        updateSettings({ apiKey: cleanKey, apiKeyStatus: 'valid' });
        setVerificationError(null);
      } else {
        updateSettings({ apiKey: cleanKey, apiKeyStatus: 'invalid' });
        setVerificationError(result.errorDetail || 'Invalid Anthropic API Key.');
      }
    } catch (err: any) {
      updateSettings({ apiKey: cleanKey, apiKeyStatus: 'invalid' });
      setVerificationError(err?.message || 'Verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const status = settings.apiKeyStatus || 'untested';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] bg-slate-900/90 p-6 sm:p-8 shadow-2xl border border-white/15 text-white backdrop-blur-xl animate-in fade-in zoom-in-95">
        {/* Ambient background glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setA11yOpen(false)}
          className="absolute right-5 top-5 rounded-full p-2 text-sky-200/70 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
          aria-label="Close settings"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-[#c084fc] flex items-center justify-center shadow-lg shadow-purple-600/25">
            <Eye size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{getTranslation('a11yTitle', lang)}</h2>
            <p className="text-xs sm:text-sm text-sky-200/75 font-medium mt-0.5">
              {lang === 'as'
                ? 'আপোনাৰ সুবিধা অনুসৰি দৃশ্যমানতা, ভাষা আৰু AI ছেটিংছ সলনি কৰক'
                : lang === 'hi'
                ? 'अपनी पसंद के अनुसार फॉन्ट आकार, कंट्रास्ट, भाषा और AI सेटिंग्स बदलें।'
                : 'Personalize font sizes, contrast, language, and AI verification.'}
            </p>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          {/* Language Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-bold text-sm text-purple-200">
              <Globe size={16} className="text-[#c084fc]" />
              {lang === 'as'
                ? 'ভাষা নিৰ্বাচন (Language Selection)'
                : lang === 'hi'
                ? 'भाषा चयन (Language Selection)'
                : 'Language Selection (भाषा)'}
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                onClick={() => setLanguage('en')}
                className={`py-3 px-2 sm:px-3 rounded-2xl font-bold border transition-all text-center cursor-pointer text-xs sm:text-sm ${
                  settings.language === 'en'
                    ? 'bg-purple-950/70 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                    : 'border-white/12 bg-white/5 text-sky-200/80 hover:border-purple-400/40 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`py-3 px-2 sm:px-3 rounded-2xl font-bold border transition-all text-center cursor-pointer text-xs sm:text-sm ${
                  settings.language === 'hi'
                    ? 'bg-purple-950/70 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                    : 'border-white/12 bg-white/5 text-sky-200/80 hover:border-purple-400/40 hover:text-white'
                }`}
              >
                हिन्दी (Hindi)
              </button>
              <button
                onClick={() => setLanguage('as')}
                className={`py-3 px-2 sm:px-3 rounded-2xl font-bold border transition-all text-center cursor-pointer text-xs sm:text-sm ${
                  settings.language === 'as'
                    ? 'bg-purple-950/70 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                    : 'border-white/12 bg-white/5 text-sky-200/80 hover:border-purple-400/40 hover:text-white'
                }`}
              >
                অসমীয়া (Assamese)
              </button>
            </div>
          </div>

          {/* Text Scaling */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-bold text-sm text-purple-200">
              <Type size={16} className="text-[#c084fc]" />
              {getTranslation('a11yTextSize', lang)}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTextScale('normal')}
                className={`py-3 px-2 rounded-2xl border transition-all text-xs sm:text-sm cursor-pointer ${
                  settings.textScale === 'normal'
                    ? 'bg-purple-950/70 border-purple-400 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                    : 'border-white/12 bg-white/5 text-sky-200/80 hover:border-purple-400/40 hover:text-white'
                }`}
              >
                Aa {getTranslation('a11yNormal', lang)}
              </button>
              <button
                onClick={() => setTextScale('large')}
                className={`py-3 px-2 rounded-2xl border transition-all text-sm sm:text-base cursor-pointer ${
                  settings.textScale === 'large'
                    ? 'bg-purple-950/70 border-purple-400 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                    : 'border-white/12 bg-white/5 text-sky-200/80 hover:border-purple-400/40 hover:text-white'
                }`}
              >
                Aa {getTranslation('a11yLarge', lang)}
              </button>
              <button
                onClick={() => setTextScale('xl')}
                className={`py-3 px-2 rounded-2xl border transition-all text-base sm:text-lg cursor-pointer ${
                  settings.textScale === 'xl'
                    ? 'bg-purple-950/70 border-purple-400 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                    : 'border-white/12 bg-white/5 text-sky-200/80 hover:border-purple-400/40 hover:text-white'
                }`}
              >
                Aa {getTranslation('a11yXLarge', lang)}
              </button>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-1">
            {/* High Contrast */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/12 bg-white/5">
              <div className="flex items-center gap-3">
                <Eye size={18} className="text-[#c084fc]" />
                <div>
                  <p className="font-bold text-sm text-white">{getTranslation('a11yContrast', lang)}</p>
                  <p className="text-xs text-sky-200/70">
                    {lang === 'as'
                      ? 'আখৰ আৰু বুটাম স্পষ্টকৈ চাবলৈ'
                      : lang === 'hi'
                      ? 'गहरे काले और स्पष्ट बॉर्डर वाला उच्च कंट्रास्ट मोड'
                      : 'Deep black & high-contrast bright borders'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleHighContrast}
                className={`w-13 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  settings.highContrast ? 'bg-purple-600 justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/12 bg-white/5">
              <div className="flex items-center gap-3">
                <Zap size={18} className="text-[#c084fc]" />
                <div>
                  <p className="font-bold text-sm text-white">{getTranslation('a11yReducedMotion', lang)}</p>
                  <p className="text-xs text-sky-200/70">
                    {lang === 'as'
                      ? 'ঘূৰ্ণন বা দ্ৰুত এনিমেশ্যন বন্ধ কৰক'
                      : lang === 'hi'
                      ? 'वरिष्ठ नागरिकों के आराम के लिए गतिशील ग्राफिक्स कम करें'
                      : 'Minimizes moving graphics for senior comfort'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleReducedMotion}
                className={`w-13 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  settings.reducedMotion ? 'bg-purple-600 justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Voice Assistance */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/12 bg-white/5">
              <div className="flex items-center gap-3">
                <Volume2 size={18} className="text-[#c084fc]" />
                <div>
                  <p className="font-bold text-sm text-white">{getTranslation('a11yVoice', lang)}</p>
                  <p className="text-xs text-sky-200/70">
                    {lang === 'as'
                      ? 'বাৰ্তা আৰু নিৰ্দেশনা পঢ়ি শুনোৱা সেৱা'
                      : lang === 'hi'
                      ? 'कार्ड और निर्देशों को बोलकर सुनाने की ध्वनि सेवा'
                      : 'Enable audio narrators on cards and prompts'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ voiceAssistanceEnabled: !settings.voiceAssistanceEnabled })}
                className={`w-13 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  settings.voiceAssistanceEnabled ? 'bg-purple-600 justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Simulated Offline Mode Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-amber-400/30 bg-amber-500/10">
              <div className="flex items-center gap-3">
                <WifiOff size={18} className="text-amber-400" />
                <div>
                  <p className="font-bold text-sm text-amber-200">
                    {lang === 'as'
                      ? 'অফলাইন মোড পৰীক্ষা (Simulate Offline)'
                      : lang === 'hi'
                      ? 'ऑफलाइन मोड सिमुलेशन (Demo)'
                      : 'Simulate Offline Mode (Demo)'}
                  </p>
                  <p className="text-xs text-amber-300/80">
                    {lang === 'as'
                      ? 'ইন্টাৰনেট নথকাৰ অৱস্থাত পৰীক্ষা কৰিবলৈ'
                      : lang === 'hi'
                      ? 'बिना इंटरनेट के लोकल स्टोरेज और म्यूटेशन सिंक का परीक्षण करें'
                      : 'Test offline mutation queues and local storage sync'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleSimulatedOffline}
                className={`w-13 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  settings.isSimulatedOffline ? 'bg-amber-500 justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md" />
              </button>
            </div>
          </div>

          {/* Anthropic Claude API Key Section with Live Verification */}
          <div className="p-5 rounded-3xl border border-purple-400/30 bg-purple-950/30 space-y-4 backdrop-blur-md shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-[#c084fc] border border-purple-400/30">
                  <Key size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {getTranslation('apiKeySectionTitle', lang)}
                  </h4>
                  <p className="text-xs text-sky-200/75 mt-0.5 leading-relaxed">
                    {getTranslation('apiKeySectionDesc', lang)}
                  </p>
                </div>
              </div>
            </div>

            {/* Input & Verify Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <input
                  type={showKey ? 'text' : 'password'}
                  placeholder="sk-ant-api03-..."
                  value={inputKey}
                  onChange={e => {
                    setInputKey(e.target.value);
                    if (settings.apiKeyStatus !== 'untested') {
                      updateSettings({ apiKey: e.target.value, apiKeyStatus: 'untested' });
                    }
                  }}
                  className="w-full px-4 py-3 pr-11 text-xs sm:text-sm rounded-2xl border border-purple-400/30 bg-slate-950/60 font-mono focus:outline-none focus:border-purple-400 text-white placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sky-200/60 hover:text-white cursor-pointer"
                  aria-label={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                onClick={handleVerify}
                disabled={isVerifying || !inputKey.trim()}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-40 shadow-lg shadow-purple-600/30 border border-purple-400/30 shrink-0"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw size={15} className="animate-spin text-white" />
                    <span>{getTranslation('apiKeyVerifying', lang)}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    <span>{getTranslation('apiKeyVerifyBtn', lang)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Status Display Badge */}
            {status === 'valid' ? (
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-400/50 flex items-start gap-3 text-emerald-200 animate-in fade-in shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold uppercase tracking-wider text-emerald-300">
                      {getTranslation('apiKeyStatusValid', lang)}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 font-mono">
                      Claude 3.5 Sonnet / Haiku
                    </span>
                  </div>
                  <p className="text-emerald-100/90 leading-relaxed font-medium">
                    {getTranslation('apiKeyValidDetails', lang)}
                  </p>
                </div>
              </div>
            ) : status === 'invalid' ? (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-400/50 flex items-start gap-3 text-rose-200 animate-in fade-in shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                <AlertCircle size={20} className="text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-extrabold uppercase tracking-wider text-rose-300">
                    {getTranslation('apiKeyStatusInvalid', lang)}
                  </span>
                  <p className="text-rose-100/90 leading-relaxed font-medium">
                    {verificationError || getTranslation('apiKeyInvalidDetails', lang)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-sky-200/80">
                <ShieldCheck size={20} className="text-purple-300 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-purple-200">
                    {getTranslation('apiKeyStatusUntested', lang)}
                  </span>
                  <p className="text-sky-200/70 leading-relaxed">
                    {lang === 'as'
                      ? 'অফলাইন বুদ্ধিমত্তা ইঞ্জিন ব্যৱহৃত হৈছে। প্ৰকৃত ক্লাউড AI পৰীক্ষাৰ বাবে "Verify" বুটামত টিপক।'
                      : lang === 'hi'
                      ? 'लोकल ऑफलाइन इंटेलिजेंट इंजन सक्रिय है। लाइव क्लॉड AI कॉल के लिए "Verify" बटन दबाएं।'
                      : 'SmritiCare is utilizing the local intelligent engine. Verify your key above to enable real-time Claude 3.5 API calls.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end relative z-10">
          <button
            onClick={() => {
              updateSettings({ apiKey: inputKey.trim() });
              setA11yOpen(false);
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white font-black text-xs sm:text-sm cursor-pointer transition-all shadow-xl shadow-purple-600/35 border border-purple-400/30"
          >
            {getTranslation('actionSave', lang)}
          </button>
        </div>
      </div>
    </div>
  );
};
