import React, { useState } from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  FileText,
  PlusCircle,
  Clock,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafetyAnalysisResult } from '../../types';
import { analyzeMedicinePhoto } from '../../lib/aiClient';
import { getTranslation } from '../../lib/i18n';
import { VoiceNarratorButton } from '../common/VoiceNarratorButton';

const SAMPLE_MED_IMAGES = [
  {
    id: 'sample-1',
    label: 'Sample 1: Telmisartan 40mg (Blood Pressure Strip)',
    labelHi: 'नमूना 1: टेलमिसार्टन 40mg (ब्लड प्रेशर स्ट्रिप)',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    defaultDose: '1 tablet (40mg)',
    defaultTime: '08:00 AM',
    defaultNotes: 'After Breakfast (नाश्ते के बाद)',
  },
  {
    id: 'sample-2',
    label: 'Sample 2: Metformin 500mg (Blood Sugar Strip)',
    labelHi: 'नमूना 2: मेटफॉर्मिन 500mg (शुगर स्ट्रिप)',
    url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80',
    defaultDose: '1 tablet (500mg)',
    defaultTime: '01:30 PM',
    defaultNotes: 'After Lunch (दोपहर के भोजन के बाद)',
  },
  {
    id: 'sample-3',
    label: 'Sample 3: Vitamin B-Complex Liquid Syrup',
    labelHi: 'नमूना 3: विटामिन बी-कॉम्प्लेक्स सिरप',
    url: 'https://images.unsplash.com/photo-1550572017-edb79a838584?auto=format&fit=crop&w=400&q=80',
    defaultDose: '5 ml syrup',
    defaultTime: '08:00 PM',
    defaultNotes: 'After Dinner (रात के खाने के बाद)',
  },
];

export const MedicineSafetyScanner: React.FC = () => {
  const { settings, reminders, addReminder } = useApp();
  const lang = settings.language;

  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_MED_IMAGES[0].url);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<SafetyAnalysisResult | null>(null);

  // Human Confirmation Modal / State for Adding to Daily Reminders
  const [showAddConfirm, setShowAddConfirm] = useState<boolean>(false);
  const [scheduleTime, setScheduleTime] = useState<string>('08:00 AM');
  const [scheduleDose, setScheduleDose] = useState<string>('');
  const [scheduleNotes, setScheduleNotes] = useState<string>('After Food');
  const [isAddedSuccessfully, setIsAddedSuccessfully] = useState<boolean>(false);

  const handleScan = async (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setIsAddedSuccessfully(false);
    setShowAddConfirm(false);

    try {
      const res = await analyzeMedicinePhoto(imageUrl, reminders, settings.apiKey);
      setAnalysisResult(res);

      // Prepopulate form values based on result
      setScheduleDose(res.identifiedStrength || '1 tablet');
      setScheduleTime(res.scheduledTime || '08:00 AM');
      setScheduleNotes('After Food (भोजन के बाद)');
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

  const handleConfirmAddToRoutine = () => {
    if (!analysisResult) return;

    addReminder({
      type: 'medicine',
      title: analysisResult.medicineName,
      titleHi: analysisResult.medicineName,
      time: scheduleTime,
      dose: scheduleDose,
      doseHi: scheduleDose,
      frequency: 'Daily',
      frequencyHi: 'दैनिक',
      notes: scheduleNotes,
      notesHi: scheduleNotes,
      taken: false,
    });

    setIsAddedSuccessfully(true);
    setShowAddConfirm(false);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header Info Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/14 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold mb-3 shadow-inner">
            <ShieldCheck size={14} className="text-[#c084fc]" />
            <span>AI Vision Verification & Safety</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {lang === 'hi'
              ? 'दवा पैकेट स्कैनर और सुरक्षा सत्यापन'
              : 'AI Medicine Packaging Safety Scanner'}
          </h2>
          <p className="text-xs sm:text-sm text-sky-200/80 mt-1 leading-relaxed">
            {lang === 'hi'
              ? 'दवा के पैकेट या स्ट्रिप की फोटो स्कैन करके दवा का नाम, क्षमता और निर्धारित समय से मिलान करें।'
              : 'Scan medicine packaging to identify tablet strength, dosage instructions, and cross-check against daily prescribed reminder times.'}
          </p>
        </div>

        <VoiceNarratorButton
          textToRead={
            lang === 'hi'
              ? 'दवा के पैकेट की फोटो स्कैन करके खुराक और समय-सारणी का मिलान जांचें।'
              : 'Scan your medicine packaging to verify dosage instructions and ensure it matches your prescribed daily schedule.'
          }
          size="md"
          label={getTranslation('actionListen', lang)}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg font-bold"
        />
      </div>

      {/* Clinical Pharmacovigilance Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-start gap-3 backdrop-blur-md">
        <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed font-medium">
          <span className="font-bold text-amber-200">
            {lang === 'hi' ? 'चिकित्सीय सुरक्षा सूचना: ' : 'Clinical Safety Notice: '}
          </span>
          {lang === 'hi'
            ? 'स्मृति केयर ओसीआर केवल सहायक पहचान प्रदान करता है और चिकित्सक के परामर्श का विकल्प नहीं है। दवा तालिका में जोड़ने से पहले हमेशा खुराक व समय की मानव पुष्टि आवश्यक है।'
            : 'SmritiCare OCR provides assistive recognition only and does not substitute professional medical consultation. Mandatory human confirmation is required before adding scanned items to daily schedules.'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Selection & Capture */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card-dark p-5 rounded-3xl border border-white/12 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-white">
              {lang === 'hi'
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
                    {lang === 'hi'
                      ? 'कोई फोटो नहीं चुनी गई'
                      : 'No image selected'}
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-2">
                  <RefreshCw size={32} className="animate-spin text-[#c084fc]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                    {lang === 'hi'
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
                {lang === 'hi'
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
                    {lang === 'hi' ? (s.labelHi || s.label) : s.label}
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
                    {lang === 'hi' ? 'सटीकता:' : 'Confidence:'} {Math.round(analysisResult.confidence * 100)}%
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
                        ? (lang === 'hi'
                          ? 'निर्धारित अनुसूची से मेल खाता है (Schedule Verified)'
                          : 'Matches Current Prescription Schedule')
                        : (lang === 'hi'
                          ? 'समय-सारणी सत्यापन चेतावनी'
                          : 'Schedule Verification Alert')}
                    </h5>
                    <p className="text-xs mt-1 text-sky-200/90 leading-relaxed font-medium">
                      {lang === 'hi'
                        ? (analysisResult.summaryHi || analysisResult.summary)
                        : analysisResult.summary}
                    </p>
                  </div>
                </div>

                {/* Elderly-Friendly Instructions */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                      {lang === 'hi'
                        ? 'बुजुर्गों के लिए सरल निर्देश'
                        : 'Elderly-Friendly Dosage Instructions'}
                    </p>
                    <VoiceNarratorButton
                      textToRead={
                        lang === 'hi'
                          ? `${analysisResult.medicineName}. ${analysisResult.instructionsHi || analysisResult.instructions}`
                          : `${analysisResult.medicineName}. ${analysisResult.instructions}`
                      }
                      size="sm"
                      label={getTranslation('actionListen', lang)}
                      className="bg-purple-500/20 hover:bg-purple-500/30 text-white border border-purple-400/30"
                    />
                  </div>
                  <p className="text-base font-bold text-white leading-relaxed">
                    {lang === 'hi'
                      ? (analysisResult.instructionsHi || analysisResult.instructions)
                      : analysisResult.instructions}
                  </p>
                </div>

                {/* Safety Alerts */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-sky-200/60 uppercase tracking-wider">
                    {lang === 'hi'
                      ? 'महत्वपूर्ण सावधानियां'
                      : 'Key Safety Cautions'}
                  </p>
                  <div className="space-y-1.5">
                    {(lang === 'hi'
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

                {/* Mandatory Human Confirmation Card to Add to Daily Schedule */}
                <div className="pt-4 border-t border-white/10">
                  {isAddedSuccessfully ? (
                    <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-400/50 text-emerald-200 flex items-center justify-between gap-3 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                      <div className="flex items-center gap-2.5">
                        <Check size={20} className="text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold">
                          {lang === 'hi'
                            ? `दवा "${analysisResult.medicineName}" दैनिक दिनचर्या में जोड़ी गई (${scheduleTime})`
                            : `Medication "${analysisResult.medicineName}" added to daily routine (${scheduleTime})`}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                        Confirmed
                      </span>
                    </div>
                  ) : showAddConfirm ? (
                    <div className="p-4 rounded-2xl bg-purple-950/50 border border-purple-400/50 space-y-3 shadow-lg animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                          <Clock size={15} className="text-[#c084fc]" />
                          {lang === 'hi' ? 'दैनिक अनुसूची में जोड़ने की पुष्टि करें' : 'Confirm Addition to Daily Schedule'}
                        </span>
                        <button
                          onClick={() => setShowAddConfirm(false)}
                          className="text-xs text-sky-200/60 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-sky-200/80 mb-1">
                            {lang === 'hi' ? 'निर्धारित समय' : 'Scheduled Time'}
                          </label>
                          <input
                            type="text"
                            value={scheduleTime}
                            onChange={e => setScheduleTime(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-white/15 bg-white/10 text-white font-mono text-xs focus:ring-2 focus:ring-[#a855f7]"
                            placeholder="08:00 AM"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-sky-200/80 mb-1">
                            {lang === 'hi' ? 'खुराक' : 'Dosage'}
                          </label>
                          <input
                            type="text"
                            value={scheduleDose}
                            onChange={e => setScheduleDose(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-white/15 bg-white/10 text-white text-xs focus:ring-2 focus:ring-[#a855f7]"
                            placeholder="1 tablet"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-sky-200/80 mb-1">
                            {lang === 'hi' ? 'निर्देश / समय' : 'Meal Instructions'}
                          </label>
                          <input
                            type="text"
                            value={scheduleNotes}
                            onChange={e => setScheduleNotes(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-white/15 bg-white/10 text-white text-xs focus:ring-2 focus:ring-[#a855f7]"
                            placeholder="After Food (भोजन के बाद)"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          onClick={() => setShowAddConfirm(false)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-sky-200 transition-all cursor-pointer"
                        >
                          {getTranslation('actionCancel', lang)}
                        </button>
                        <button
                          onClick={handleConfirmAddToRoutine}
                          className="px-5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white shadow-md shadow-purple-600/30 transition-all cursor-pointer border border-purple-400/30 active:scale-95"
                        >
                          {lang === 'hi' ? 'मानव पुष्टि व शेड्यूल में जोड़ें' : 'Confirm & Add to Schedule'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddConfirm(true)}
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer border border-purple-400/30 active:scale-98"
                    >
                      <PlusCircle size={18} />
                      <span>
                        {lang === 'hi'
                          ? 'मानव सत्यापन के साथ दैनिक दिनचर्या में जोड़ें'
                          : 'Verify & Add to Daily Medication Schedule'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-sky-200/50 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-[#c084fc] shadow-lg shadow-purple-600/25">
                  <FileText size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {lang === 'hi'
                      ? 'दवा पैकेजिंग स्कैन के लिए तैयार'
                      : 'Ready to verify packaging'}
                  </h4>
                  <p className="text-xs text-sky-200/70 max-w-sm mt-1 leading-relaxed">
                    {lang === 'hi'
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
