import React from 'react';
import { X, Type, Eye, Zap, Volume2, Key, WifiOff, Globe } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-sky-200 text-slate-900 animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={() => setA11yOpen(false)}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 cursor-pointer"
          aria-label="Close settings"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-sky-100">
          <div className="p-3 bg-teal-100 text-teal-800 rounded-2xl">
            <Eye size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{getTranslation('a11yTitle', lang)}</h2>
            <p className="text-sm text-slate-500">
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
            <label className="flex items-center gap-2 font-bold text-base mb-2">
              <Globe size={18} className="text-teal-600" />
              {lang === 'as'
                ? 'ভাষা নিৰ্বাচন (Language Selection)'
                : lang === 'hi'
                ? 'भाषा चयन (Language Selection)'
                : 'Language Selection (भाषा)'}
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                onClick={() => setLanguage('en')}
                className={`py-3 px-2 sm:px-3 rounded-xl font-bold border-2 transition-all text-center cursor-pointer text-xs sm:text-sm ${
                  settings.language === 'en'
                    ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs ring-2 ring-teal-200'
                    : 'border-sky-200 bg-white text-slate-700 hover:border-sky-300'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`py-3 px-2 sm:px-3 rounded-xl font-bold border-2 transition-all text-center cursor-pointer text-xs sm:text-sm ${
                  settings.language === 'hi'
                    ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs ring-2 ring-teal-200'
                    : 'border-sky-200 bg-white text-slate-700 hover:border-sky-300'
                }`}
              >
                हिन्दी (Hindi)
              </button>
              <button
                onClick={() => setLanguage('as')}
                className={`py-3 px-2 sm:px-3 rounded-xl font-bold border-2 transition-all text-center cursor-pointer text-xs sm:text-sm ${
                  settings.language === 'as'
                    ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs ring-2 ring-teal-200'
                    : 'border-sky-200 bg-white text-slate-700 hover:border-sky-300'
                }`}
              >
                অসমীয়া (Assamese)
              </button>
            </div>
          </div>

          {/* Text Scaling */}
          <div>
            <label className="flex items-center gap-2 font-bold text-base mb-2">
              <Type size={18} className="text-teal-600" />
              {getTranslation('a11yTextSize', lang)}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTextScale('normal')}
                className={`py-3 px-2 rounded-xl font-medium border-2 transition-all text-sm cursor-pointer ${
                  settings.textScale === 'normal'
                    ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold shadow-xs'
                    : 'border-sky-200 bg-white text-slate-700 hover:border-sky-300'
                }`}
              >
                Aa {getTranslation('a11yNormal', lang)}
              </button>
              <button
                onClick={() => setTextScale('large')}
                className={`py-3 px-2 rounded-xl font-medium border-2 transition-all text-base cursor-pointer ${
                  settings.textScale === 'large'
                    ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold shadow-xs'
                    : 'border-sky-200 bg-white text-slate-700 hover:border-sky-300'
                }`}
              >
                Aa {getTranslation('a11yLarge', lang)}
              </button>
              <button
                onClick={() => setTextScale('xl')}
                className={`py-3 px-2 rounded-xl font-medium border-2 transition-all text-lg cursor-pointer ${
                  settings.textScale === 'xl'
                    ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold shadow-xs'
                    : 'border-sky-200 bg-white text-slate-700 hover:border-sky-300'
                }`}
              >
                Aa {getTranslation('a11yXLarge', lang)}
              </button>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-2">
            {/* High Contrast */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-sky-200 bg-sky-50/60">
              <div className="flex items-center gap-3">
                <Eye size={20} className="text-teal-700" />
                <div>
                  <p className="font-bold text-base">{getTranslation('a11yContrast', lang)}</p>
                  <p className="text-xs text-slate-500">
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
                  settings.highContrast ? 'bg-teal-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-sky-200 bg-sky-50/60">
              <div className="flex items-center gap-3">
                <Zap size={20} className="text-teal-700" />
                <div>
                  <p className="font-bold text-base">{getTranslation('a11yReducedMotion', lang)}</p>
                  <p className="text-xs text-slate-500">
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
                  settings.reducedMotion ? 'bg-teal-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Voice Assistance */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-sky-200 bg-sky-50/60">
              <div className="flex items-center gap-3">
                <Volume2 size={20} className="text-teal-700" />
                <div>
                  <p className="font-bold text-base">{getTranslation('a11yVoice', lang)}</p>
                  <p className="text-xs text-slate-500">
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
                  settings.voiceAssistanceEnabled ? 'bg-teal-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Simulated Offline Mode Toggle (Hackathon Demo Feature) */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-amber-300 bg-amber-50">
              <div className="flex items-center gap-3">
                <WifiOff size={20} className="text-amber-600" />
                <div>
                  <p className="font-bold text-base text-amber-950">
                    {lang === 'as'
                      ? 'অফলাইন মোড পৰীক্ষা (Simulate Offline)'
                      : lang === 'hi'
                      ? 'ऑफलाइन मोड सिमुलेशन (Demo)'
                      : 'Simulate Offline Mode (Demo)'}
                  </p>
                  <p className="text-xs text-amber-800">
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
                  settings.isSimulatedOffline ? 'bg-amber-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md" />
              </button>
            </div>
          </div>

          {/* Optional Live Anthropic API Key Input */}
          <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/50">
            <div className="flex items-center gap-2 font-bold mb-1.5 text-sm text-slate-800">
              <Key size={16} className="text-teal-700" />
              <span>Anthropic Claude API Key (Optional Live Vision)</span>
            </div>
            <p className="text-xs text-slate-600 mb-2.5">
              By default, SmritiCare runs on an instant, offline-capable demo AI engine. If you wish to test live Claude 3.5 Sonnet Vision calls, enter your key below (stored safely in local browser memory only).
            </p>
            <input
              type="password"
              placeholder="sk-ant-api03-..."
              value={settings.apiKey}
              onChange={e => updateSettings({ apiKey: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-sky-300 bg-white font-mono focus:outline-teal-600 text-slate-900"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-sky-100 flex justify-end">
          <button
            onClick={() => setA11yOpen(false)}
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold cursor-pointer transition-colors shadow-sm"
          >
            {getTranslation('actionSave', lang)}
          </button>
        </div>
      </div>
    </div>
  );
};
