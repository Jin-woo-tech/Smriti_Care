import React, { useState } from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafetyAnalysisResult } from '../../types';
import { analyzeMedicinePhoto } from '../../lib/aiClient';
import { getTranslation } from '../../lib/i18n';
import { VoiceNarratorButton } from '../common/VoiceNarratorButton';

const SAMPLE_MED_IMAGES = [
  {
    id: 'sample-1',
    label: 'Sample 1: Telmisartan 40mg (BP Strip)',
    labelHi: 'नमूना 1: टेलमिसार्टन 40mg (बीपी स्ट्रिप)',
    labelAs: 'নমুনা ১: টেলমিচাৰ্টান ৪০ মি:গ্ৰা: টেবলেট',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'sample-2',
    label: 'Sample 2: Metformin 500mg (Sugar Strip)',
    labelHi: 'नमूना 2: मेटफॉर्मिन 500mg (शुगर स्ट्रिप)',
    labelAs: 'নমুনা ২: মেটফৰ্মিন ৫০০ মি:গ্ৰা: টেবলেট',
    url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'sample-3',
    label: 'Sample 3: Vitamin B-Complex Syrup',
    labelHi: 'नमूना 3: विटामिन बी-कॉम्प्लेक्स सिरप',
    labelAs: 'নমুনা ৩: ভিটামিন বি-কমপ্লেক্স চিৰাপ',
    url: 'https://images.unsplash.com/photo-1550572017-edb79a838584?auto=format&fit=crop&w=400&q=80',
  },
];

export const MedicineSafetyScanner: React.FC = () => {
  const { settings, reminders } = useApp();
  const lang = settings.language;

  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_MED_IMAGES[0].url);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<SafetyAnalysisResult | null>(null);

  const handleScan = async (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await analyzeMedicinePhoto(imageUrl, reminders, settings.apiKey);
      setAnalysisResult(res);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          handleScan(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header Info */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/14 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold mb-3 shadow-inner">
            <ShieldCheck size={14} className="text-[#c084fc]" />
            <span>AI Vision Verification & Safety</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {lang === 'as'
              ? 'ঔষধৰ পেকেট চিনাক্তকৰণ আৰু সুৰক্ষা পৰীক্ষা'
              : lang === 'hi'
              ? 'दवा पैकेट स्कैनर और सुरक्षा सत्यापन'
              : 'AI Medicine Packaging Safety Scanner'}
          </h2>
          <p className="text-xs sm:text-sm text-sky-200/80 mt-1 leading-relaxed">
            {lang === 'as'
              ? 'ঔষধৰ পেকেট বা টেবলেটৰ ছবি স্কেন কৰি ঔষধৰ নাম, মাত্ৰা আৰু সময়সূচীৰ সৈতে মিলিছে নে নাই পৰীক্ষা কৰক।'
              : lang === 'hi'
              ? 'दवा के पैकेट या स्ट्रिप की फोटो स्कैन करके दवा का नाम, क्षमता और निर्धारित समय से मिलान करें।'
              : 'Scan medicine packaging to identify tablet strength, dosage instructions, and cross-check against daily prescribed reminder times.'}
          </p>
        </div>

        <VoiceNarratorButton
          textToRead={
            lang === 'as'
              ? 'ঔষধৰ পেকেট বা টেবলেটৰ ছবি স্কেন কৰি ঔষধৰ নাম, মাত্ৰা আৰু সময়সূচী পৰীক্ষা কৰক।'
              : lang === 'hi'
              ? 'दवा के पैकेट की फोटो स्कैन करके खुराक और समय-सारणी का मिलान जांचें।'
              : 'Scan your medicine packaging to verify dosage instructions and ensure it matches your prescribed daily schedule.'
          }
          size="md"
          label={getTranslation('actionListen', lang)}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg font-bold"
        />
      </div>

      {/* AI Engine Status Badge */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3 backdrop-blur-md ${
        settings.apiKeyStatus === 'valid'
          ? 'bg-emerald-950/40 border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.2)]'
          : 'bg-purple-500/15 border-purple-400/30'
      }`}>
        <Sparkles size={20} className={settings.apiKeyStatus === 'valid' ? 'text-emerald-400 shrink-0 mt-0.5' : 'text-[#c084fc] shrink-0 mt-0.5'} />
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-white">
              {settings.apiKeyStatus === 'valid'
                ? lang === 'as' ? 'লাইভ ক্লদ ৩.৫ ভিজন ইঞ্জিন সক্ৰিয়' : lang === 'hi' ? 'लाइव क्लॉड 3.5 विजन इंजन सक्रिय' : 'Live Claude 3.5 Sonnet Vision Active'
                : getTranslation('aiStubBadgeTitle', lang)}
            </p>
            {settings.apiKeyStatus === 'valid' && (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/40">
                Verified
              </span>
            )}
          </div>
          <p className={settings.apiKeyStatus === 'valid' ? 'text-emerald-100/90' : 'text-sky-200/80'}>
            {settings.apiKeyStatus === 'valid'
              ? lang === 'as' ? 'প্ৰকৃত ক্লদ AI দ্বাৰা পেকেট স্কেন আৰু নিৰ্দেশনা বিশ্লেষণ কৰা হৈছে।' : lang === 'hi' ? 'वास्तविक क्लॉड AI द्वारा पैकेट स्कैन और खुराक सत्यापन किया जा रहा है।' : 'Real-time multi-modal Anthropic Vision model verifies medication packaging.'
              : getTranslation('aiStubBadgeDesc', lang)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Selection & Capture */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card-dark p-5 rounded-3xl border border-white/12 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-white">
              {lang === 'as'
                ? 'ছবি বাছক বা কেমেৰাৰে তোলক'
                : lang === 'hi'
                ? '1. दवा की फोटो चुनें या कैमरा से खींचें'
                : '1. Select or Upload Medicine Photo'}
            </h3>

            {/* Preview Box */}
            <div className="relative w-full h-56 rounded-2xl bg-purple-950/30 border-2 border-dashed border-purple-400/30 overflow-hidden flex items-center justify-center backdrop-blur-md">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Selected medicine"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-sky-200/50 p-4">
                  <Camera size={36} className="mx-auto mb-2 opacity-50 text-purple-400" />
                  <p className="text-xs font-medium">
                    {lang === 'as'
                      ? 'কোনো ছবি বাছি লোৱা হোৱা নাই'
                      : lang === 'hi'
                      ? 'कोई फोटो नहीं चुनी गई'
                      : 'No image selected'}
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-2">
                  <RefreshCw size={32} className="animate-spin text-[#c084fc]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                    {lang === 'as'
                      ? 'AI বিশ্লেষণ চলি আছে...'
                      : lang === 'hi'
                      ? 'AI पैकेजिंग विश्लेषण जारी है...'
                      : 'AI Vision Analyzing Packaging...'}
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <label className="w-full py-3 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30 transition-all border border-purple-400/30">
                <Upload size={16} />
                <span>{getTranslation('actionUpload', lang)}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => handleScan(selectedImage)}
                disabled={isAnalyzing}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Camera size={16} />
                <span>{getTranslation('actionScan', lang)}</span>
              </button>
            </div>

            {/* Sample Presets */}
            <div className="pt-2 border-t border-white/10">
              <p className="text-xs font-bold text-sky-200/60 mb-2">
                {lang === 'as'
                  ? 'বা নমুনা ঔষধ বাছক:'
                  : lang === 'hi'
                  ? 'या वास्तविक दवा नमूनों से जांचें:'
                  : 'Or test with realistic samples:'}
              </p>
              <div className="space-y-1.5">
                {SAMPLE_MED_IMAGES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleScan(s.url)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer truncate ${
                      selectedImage === s.url
                        ? 'bg-purple-950/60 border-purple-400 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        : 'border-white/15 bg-white/5 hover:border-purple-400/40 text-sky-200/80 hover:text-white'
                    }`}
                  >
                    {lang === 'as' ? s.labelAs : lang === 'hi' ? (s.labelHi || s.label) : s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Result Output */}
        <div className="lg:col-span-7">
          <div className="glass-card-dark p-6 rounded-3xl border border-white/12 shadow-2xl min-h-[420px] flex flex-col justify-between">
            {analysisResult ? (
              <div className="space-y-6 animate-in fade-in">
                {/* Result Top Banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-purple-500/20 text-[#c084fc] rounded-2xl border border-purple-400/30">
                      <ShieldCheck size={24} />
                    </span>
                    <div>
                      <h4 className="font-black text-lg text-white">
                        {analysisResult.medicineName}
                      </h4>
                      <p className="text-xs text-purple-300 font-mono">
                        {analysisResult.genericName} • {analysisResult.identifiedStrength}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 shadow-xs">
                    {lang === 'hi' ? 'सटीकता:' : lang === 'as' ? 'বিশ্বাসযোগ্যতা:' : 'Confidence:'} {Math.round(analysisResult.confidence * 100)}%
                  </span>
                </div>

                {/* Schedule Cross-Check Match Badge */}
                <div
                  className={`p-4 rounded-2xl border flex items-start gap-3 backdrop-blur-md shadow-md ${
                    analysisResult.matchesSchedule
                      ? 'bg-purple-950/50 border-purple-400/80 text-white shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                      : 'bg-amber-950/50 border-amber-400/80 text-white'
                  }`}
                >
                  {analysisResult.matchesSchedule ? (
                    <CheckCircle2 size={24} className="text-[#c084fc] shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle size={24} className="text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h5 className="font-bold text-sm text-white">
                      {analysisResult.matchesSchedule
                        ? lang === 'as'
                          ? 'সময়সূচীৰ সৈতে মিলিছে (Scheduled Dose Verified)'
                          : lang === 'hi'
                          ? 'निर्धारित अनुसूची से मेल खाता है (Schedule Verified)'
                          : 'Matches Current Prescription Schedule'
                        : lang === 'as'
                        ? 'সময়সূচী সতৰ্কবাৰ্তা'
                        : lang === 'hi'
                        ? 'समय-सारणी चेतावनी'
                        : 'Schedule Verification Alert'}
                    </h5>
                    <p className="text-xs mt-1 text-sky-200/90 leading-relaxed font-medium">
                      {lang === 'as'
                        ? analysisResult.summaryAs
                        : lang === 'hi'
                        ? (analysisResult.summaryHi || analysisResult.summary)
                        : analysisResult.summary}
                    </p>
                  </div>
                </div>

                {/* Elderly-Friendly Instructions */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                      {lang === 'as'
                        ? 'সহজ ব্যৱহাৰ নিৰ্দেশনা'
                        : lang === 'hi'
                        ? 'बुजुर्गों के लिए सरल निर्देश'
                        : 'Elderly-Friendly Dosage Instructions'}
                    </p>
                    <VoiceNarratorButton
                      textToRead={
                        lang === 'as'
                          ? `${analysisResult.medicineName}. ${analysisResult.instructionsAs}`
                          : lang === 'hi'
                          ? `${analysisResult.medicineName}. ${analysisResult.instructionsHi || analysisResult.instructions}`
                          : `${analysisResult.medicineName}. ${analysisResult.instructions}`
                      }
                      size="sm"
                      label={getTranslation('actionListen', lang)}
                      className="bg-purple-500/20 hover:bg-purple-500/30 text-white border border-purple-400/30"
                    />
                  </div>
                  <p className="text-base font-bold text-white leading-relaxed">
                    {lang === 'as'
                      ? analysisResult.instructionsAs
                      : lang === 'hi'
                      ? (analysisResult.instructionsHi || analysisResult.instructions)
                      : analysisResult.instructions}
                  </p>
                </div>

                {/* Safety Alerts */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-sky-200/60 uppercase tracking-wider">
                    {lang === 'as'
                      ? 'সাৱধানতা আৰু সংৰক্ষণ টোকা'
                      : lang === 'hi'
                      ? 'महत्वपूर्ण सावधानियां'
                      : 'Key Safety Cautions'}
                  </p>
                  <div className="space-y-1.5">
                    {(lang === 'as'
                      ? analysisResult.safetyAlertsAs
                      : lang === 'hi'
                      ? (analysisResult.safetyAlertsHi || analysisResult.safetyAlerts)
                      : analysisResult.safetyAlerts
                    ).map((alert, i) => (
                      <div
                        key={i}
                        className="text-xs p-3 rounded-xl bg-white/5 border border-white/10 text-sky-200/90 font-medium leading-relaxed"
                      >
                        {alert}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-sky-200/50 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-[#c084fc] shadow-lg shadow-purple-600/25">
                  <FileText size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {lang === 'as'
                      ? 'স্কেন কৰিবলৈ প্ৰস্তুত'
                      : lang === 'hi'
                      ? 'दवा पैकेजिंग स्कैन के लिए तैयार'
                      : 'Ready to verify packaging'}
                  </h4>
                  <p className="text-xs text-sky-200/70 max-w-sm mt-1 leading-relaxed">
                    {lang === 'as'
                      ? 'বাওঁফালৰ পৰা ছবি বাছক বা আপলোড কৰি "স্কেন কৰক" বুটামত টিপক।'
                      : lang === 'hi'
                      ? 'बाईं ओर से दवा का नमूना चुनें या फोटो अपलोड करके "स्कैन करें" दबाएं।'
                      : 'Select a sample or upload a medicine blister pack to receive automated verification and schedule cross-checks.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
