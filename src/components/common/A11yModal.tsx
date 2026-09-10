import React from 'react';
import { X, Type, Eye, Zap, Volume2, Key, WifiOff, Globe, Sparkles, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../lib/i18n';

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

  if (!isA11yOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-gradient-to-b from-[#181635] via-[#0e1628] to-[#0a101f] p-6 sm:p-8 shadow-2xl shadow-purple-950/60 border border-purple-500/30 text-white animate-in zoom-in-95 duration-200">
        {/* Glow ambient spots */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setA11yOpen(false)}
          className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-sky-200 hover:text-white cursor-pointer transition-all active:scale-95"
          aria-label="Close settings"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-white/10">
          <div className="w-13 h-13 bg-purple-500/20 text-[#c084fc] rounded-2xl border border-purple-400/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <SlidersHorizontal size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">{getTranslation('a11yTitle', lang)}</h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-[#c084fc] text-[10px] font-black border border-purple-400/30">
                A11Y
              </span>
            </div>
            <p className="text-xs text-sky-200/70 font-medium mt-0.5">
              {lang === 'as'
                ? 'আপোনাৰ সুবিধা অনুসৰি দৃশ্যমানতা আৰু ভাষা সলনি কৰক'
                : lang === 'hi'
                ? 'अपनी पसंद के अनुसार फॉन्ट का आकार, कंट्रास्ट और भाषा बदलें।'
                : 'Personalize font sizes, contrast, language, and AI keys.'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Language Selection */}
          <div>
            <label className="flex items-center gap-2 font-black text-sm text-sky-200 mb-2.5">
              <Globe size={16} className="text-[#c084fc]" />
              <span>
                {lang === 'as'
                  ? 'ভাষা নিৰ্বাচন (Language Selection)'
                  : lang === 'hi'
                  ? 'भाषा चयन (Language Selection)'
                  : 'Language Selection (भाषा)'}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                onClick={() => setLanguage('en')}
                className={`py-3 px-2 sm:px-3 rounded-2xl font-black border transition-all text-center cursor-pointer text-xs sm:text-sm active:scale-95 ${
                  settings.language === 'en'
                    ? 'border-purple-400/80 bg-gradient-to-r from-purple-600/40 to-indigo-600/40 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/40'
                    : 'border-white/10 bg-white/5 text-sky-200/80 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`py-3 px-2 sm:px-3 rounded-2xl font-black border transition-all text-center cursor-pointer text-xs sm:text-sm active:scale-95 ${
                  settings.language === 'hi'
                    ? 'border-purple-400/80 bg-gradient-to-r from-purple-600/40 to-indigo-600/40 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/40'
                    : 'border-white/10 bg-white/5 text-sky-200/80 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                हिन्दी (Hindi)
              </button>
              <button
                onClick={() => setLanguage('as')}
                className={`py-3 px-2 sm:px-3 rounded-2xl font-black border transition-all text-center cursor-pointer text-xs sm:text-sm active:scale-95 ${
                  settings.language === 'as'
                    ? 'border-purple-400/80 bg-gradient-to-r from-purple-600/40 to-indigo-600/40 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/40'
                    : 'border-white/10 bg-white/5 text-sky-200/80 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                অসমীয়া (Assamese)
              </button>
            </div>
          </div>

          {/* Text Scaling */}
          <div>
            <label className="flex items-center gap-2 font-black text-sm text-sky-200 mb-2.5">
              <Type size={16} className="text-[#c084fc]" />
              <span>{getTranslation('a11yTextSize', lang)}</span>
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                onClick={() => setTextScale('normal')}
                className={`py-3 px-2 rounded-2xl font-black border transition-all text-xs sm:text-sm cursor-pointer active:scale-95 ${
                  settings.textScale === 'normal'
                    ? 'border-purple-400/80 bg-gradient-to-r from-purple-600/40 to-indigo-600/40 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/40'
                    : 'border-white/10 bg-white/5 text-sky-200/80 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                Aa {getTranslation('a11yNormal', lang)}
              </button>
              <button
                onClick={() => setTextScale('large')}
                className={`py-3 px-2 rounded-2xl font-black border transition-all text-sm sm:text-base cursor-pointer active:scale-95 ${
                  settings.textScale === 'large'
                    ? 'border-purple-400/80 bg-gradient-to-r from-purple-600/40 to-indigo-600/40 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/40'
                    : 'border-white/10 bg-white/5 text-sky-200/80 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                Aa {getTranslation('a11yLarge', lang)}
              </button>
              <button
                onClick={() => setTextScale('xl')}
                className={`py-3 px-2 rounded-2xl font-black border transition-all text-base sm:text-lg cursor-pointer active:scale-95 ${
                  settings.textScale === 'xl'
                    ? 'border-purple-400/80 bg-gradient-to-r from-purple-600/40 to-indigo-600/40 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/40'
                    : 'border-white/10 bg-white/5 text-sky-200/80 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                Aa {getTranslation('a11yXLarge', lang)}
              </button>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-2">
            {/* High Contrast */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.07] backdrop-blur-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-[#c084fc] flex items-center justify-center border border-purple-400/30">
                  <Eye size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{getTranslation('a11yContrast', lang)}</p>
                  <p className="text-xs text-sky-200/60 font-medium">
                    {lang === 'as'
                      ? 'আখৰ আৰু বুটাম স্পষ্টকৈ চাবলৈ'
                      : lang === 'hi'
                      ? 'गहरे काले और स्पष्ट बॉर्डर वाला उच्च कंट्रास्ट मोड'
                      : 'Deep black & high-contrast yellow/teal borders'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleHighContrast}
                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  settings.highContrast ? 'bg-gradient-to-r from-purple-500 to-indigo-500 justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.07] backdrop-blur-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/30">
                  <Zap size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{getTranslation('a11yReducedMotion', lang)}</p>
                  <p className="text-xs text-sky-200/60 font-medium">
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
                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  settings.reducedMotion ? 'bg-gradient-to-r from-cyan-500 to-blue-500 justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Voice Assistance */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.07] backdrop-blur-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center border border-pink-400/30">
                  <Volume2 size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{getTranslation('a11yVoice', lang)}</p>
                  <p className="text-xs text-sky-200/60 font-medium">
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
                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  settings.voiceAssistanceEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-500 justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Simulated Offline Mode Toggle (Hackathon Demo Feature) */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15 backdrop-blur-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <WifiOff size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm text-amber-200">
                    {lang === 'as'
                      ? 'অফলাইন মোড পৰীক্ষা (Simulate Offline)'
                      : lang === 'hi'
                      ? 'ऑफलाइन मोड सिमुलेशन (Demo)'
                      : 'Simulate Offline Mode (Demo)'}
                  </p>
                  <p className="text-xs text-amber-300/70 font-medium">
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
                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  settings.isSimulatedOffline ? 'bg-gradient-to-r from-amber-500 to-orange-500 justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md" />
              </button>
            </div>
          </div>

          {/* Optional Live Anthropic API Key Input */}
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2 font-bold mb-1.5 text-xs text-sky-200">
              <Key size={14} className="text-[#c084fc]" />
              <span>Anthropic Claude API Key (Optional Live Vision)</span>
            </div>
            <p className="text-[11px] text-sky-200/60 mb-2.5 leading-relaxed font-medium">
              By default, SmritiCare runs on an instant, offline-capable demo AI engine. If you wish to test live Claude 3.5 Sonnet Vision calls, enter your key below (stored safely in local browser memory only).
            </p>
            <input
              type="password"
              placeholder="sk-ant-api03-..."
              value={settings.apiKey}
              onChange={e => updateSettings({ apiKey: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/15 bg-white/10 font-mono text-white placeholder-sky-200/40 focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={() => setA11yOpen(false)}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white font-black text-xs cursor-pointer transition-all shadow-lg shadow-purple-600/30 border border-purple-400/40 active:scale-95"
          >
            {getTranslation('actionSave', lang)}
          </button>
        </div>
      </div>
    </div>
  );
};
