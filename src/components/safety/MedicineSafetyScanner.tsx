import React, { useState } from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
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
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm shadow-sky-900/5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {lang === 'as'
                ? 'ঔষধৰ পেকেট চিনাক্তকৰণ আৰু সুৰক্ষা পৰীক্ষা'
                : lang === 'hi'
                ? 'दवा पैकेट स्कैनर और सुरक्षा सत्यापन'
                : 'AI Medicine Packaging Safety Scanner'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
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
        />
      </div>

      {/* AI Engine Status Badge */}
      <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-start gap-3">
        <Sparkles size={20} className="text-teal-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-teal-950">
            {getTranslation('aiStubBadgeTitle', lang)}
          </p>
          <p className="text-teal-800">
            {getTranslation('aiStubBadgeDesc', lang)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Selection & Capture */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm shadow-sky-900/5 space-y-4">
            <h3 className="font-bold text-sm text-slate-800">
              {lang === 'as'
                ? 'ছবি বাছক বা কেমেৰাৰে তোলক'
                : lang === 'hi'
                ? '1. दवा की फोटो चुनें या कैमरा से खींचें'
                : '1. Select or Upload Medicine Photo'}
            </h3>

            {/* Preview Box */}
            <div className="relative w-full h-56 rounded-2xl bg-sky-50 border-2 border-dashed border-sky-300 overflow-hidden flex items-center justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Selected medicine"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-slate-400 p-4">
                  <Camera size={36} className="mx-auto mb-2 opacity-50 text-sky-400" />
                  <p className="text-xs">
                    {lang === 'as'
                      ? 'কোনো ছবি বাছি লোৱা হোৱা নাই'
                      : lang === 'hi'
                      ? 'कोई फोटो नहीं चुनी गई'
                      : 'No image selected'}
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                  <RefreshCw size={32} className="animate-spin text-teal-300" />
                  <span className="text-xs font-bold uppercase tracking-wider">
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
              <label className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors">
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
                className="w-full py-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Camera size={16} />
                <span>{getTranslation('actionScan', lang)}</span>
              </button>
            </div>

            {/* Sample Presets */}
            <div className="pt-2 border-t border-sky-100">
              <p className="text-xs font-bold text-slate-500 mb-2">
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
                        ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                        : 'border-sky-200 bg-white hover:border-sky-300 text-slate-700'
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
          <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm shadow-sky-900/5 min-h-[420px] flex flex-col justify-between">
            {analysisResult ? (
              <div className="space-y-6 animate-in fade-in">
                {/* Result Top Banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-sky-100">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                      <ShieldCheck size={24} />
                    </span>
                    <div>
                      <h4 className="font-extrabold text-lg text-slate-900">
                        {analysisResult.medicineName}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono">
                        {analysisResult.genericName} • {analysisResult.identifiedStrength}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {lang === 'hi' ? 'सटीकता:' : lang === 'as' ? 'বিশ্বাসযোগ্যতা:' : 'Confidence:'} {Math.round(analysisResult.confidence * 100)}%
                  </span>
                </div>

                {/* Schedule Cross-Check Match Badge */}
                <div
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${
                    analysisResult.matchesSchedule
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                      : 'bg-amber-50 border-amber-500 text-amber-950'
                  }`}
                >
                  {analysisResult.matchesSchedule ? (
                    <CheckCircle2 size={24} className="text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle size={24} className="text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h5 className="font-bold text-sm">
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
                    <p className="text-xs mt-0.5 opacity-90">
                      {lang === 'as'
                        ? analysisResult.summaryAs
                        : lang === 'hi'
                        ? (analysisResult.summaryHi || analysisResult.summary)
                        : analysisResult.summary}
                    </p>
                  </div>
                </div>

                {/* Elderly-Friendly Instructions */}
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                    />
                  </div>
                  <p className="text-base font-bold text-slate-900 leading-relaxed">
                    {lang === 'as'
                      ? analysisResult.instructionsAs
                      : lang === 'hi'
                      ? (analysisResult.instructionsHi || analysisResult.instructions)
                      : analysisResult.instructions}
                  </p>
                </div>

                {/* Safety Alerts */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                        className="text-xs p-2.5 rounded-xl bg-sky-50 border border-sky-100 text-slate-700 font-medium"
                      >
                        {alert}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-4">
                <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-teal-600">
                  <FileText size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-700">
                    {lang === 'as'
                      ? 'স্কেন কৰিবলৈ প্ৰস্তুত'
                      : lang === 'hi'
                      ? 'दवा पैकेजिंग स्कैन के लिए तैयार'
                      : 'Ready to verify packaging'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
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
