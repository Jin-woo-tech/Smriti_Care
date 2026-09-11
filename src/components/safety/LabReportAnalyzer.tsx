import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Stethoscope,
  RefreshCw,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LabReportResult } from '../../types';
import { analyzeLabReport } from '../../lib/aiClient';
import { getTranslation } from '../../lib/i18n';
import { VoiceNarratorButton } from '../common/VoiceNarratorButton';

export const LabReportAnalyzer: React.FC = () => {
  const { settings, activePatient } = useApp();
  const lang = settings.language;
  const patientName =
    lang === 'as' && activePatient.nameAs
      ? activePatient.nameAs
      : lang === 'hi' && activePatient.nameHi
      ? activePatient.nameHi
      : activePatient.name;

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [reportResult, setReportResult] = useState<LabReportResult | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setReportResult(null);

    try {
      const res = await analyzeLabReport('sample-data', settings.apiKey);
      setReportResult(res);
    } catch (err) {
      console.error('Lab analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/14 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold mb-3 shadow-inner">
            <FileText size={14} className="text-[#c084fc]" />
            <span>Biomarker Translation Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {lang === 'as'
              ? 'তেজ পৰীক্ষা আৰু লেব ৰিপৰ্টৰ সহজ ব্যাখ্যা'
              : lang === 'hi'
              ? 'AI लैब रिपोर्ट सरल भाषा अनुवादक'
              : 'AI Lab Report Plain Language Translator'}
          </h2>
          <p className="text-xs sm:text-sm text-sky-200/80 max-w-2xl mt-1 leading-relaxed">
            {lang === 'as'
              ? 'ডাক্তৰৰ লেব ৰিপৰ্ট আপলোড কৰি জটিল চিকিৎসা শব্দৰ পৰিৱৰ্তে সহজ আৰু বুজিব পৰা ভাষাত পৰামৰ্শ লাভ কৰক।'
              : lang === 'hi'
              ? 'डॉक्टर की लैब रिपोर्ट अपलोड करके जटिल मेडिकल रिपोर्ट को बुजुर्गों और परिवारों के लिए सरल भाषा में समझें।'
              : 'Translates complex medical blood parameters into reassuring, non-alarming everyday language for elders and families.'}
          </p>
        </div>

        <VoiceNarratorButton
          textToRead={
            lang === 'as'
              ? 'তেজ পৰীক্ষাৰ ৰিপৰ্ট আপলোড কৰি সহজ ভাষাত ফলাফল আৰু পৰামৰ্শ চাওক।'
              : lang === 'hi'
              ? 'ब्लड टेस्ट और लैब रिपोर्ट अपलोड करके सरल शब्दों में रिपोर्ट और डॉक्टर की सलाह सुनें।'
              : 'Upload your medical lab report to receive plain-language summaries and supportive doctor recommendations.'
          }
          size="md"
          label={getTranslation('actionListen', lang)}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg font-bold"
        />
      </div>

      {/* Engine Status Banner */}
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
                ? lang === 'as' ? 'লাইভ ক্লদ ৩.৫ মেডিকেল ডায়গনষ্টিক ইঞ্জিন সক্ৰিয়' : lang === 'hi' ? 'लाइव क्लॉड 3.5 डायग्नोस्टिक इंजन सक्रिय' : 'Live Claude 3.5 Diagnostic Translation Active'
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
              ? lang === 'as' ? 'প্ৰকৃত ক্লদ AI দ্বাৰা তেজৰ সূচকসমূহ সহজ ভাষাত ব্যাখ্যা কৰা হৈছে।' : lang === 'hi' ? 'वास्तविक क्लॉड AI द्वारा रक्त रिपोर्ट बायोमार्कर का सरल भाषा में अनुवाद किया जा रहा है।' : 'Real-time Anthropic Claude model translates complex lab markers.'
              : getTranslation('aiStubBadgeDesc', lang)}
          </p>
        </div>
      </div>

      {/* Action Upload Card */}
      <div className="glass-card-dark p-6 rounded-3xl border border-white/12 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/20 text-[#c084fc] rounded-2xl border border-purple-400/30 shadow-xs">
              <FileText size={28} />
            </div>
            <div>
              <h4 className="font-black text-base sm:text-lg text-white">
                {lang === 'as'
                  ? `তিতাবৰ স্বাস্থ্য কেন্দ্ৰৰ শেহতীয়া তেজ পৰীক্ষা ৰিপৰ্ট (ৰোগী: ${patientName})`
                  : lang === 'hi'
                  ? `तीताबर प्राथमिक स्वास्थ्य केंद्र रक्त परीक्षण रिपोर्ट (मरीज: ${patientName})`
                  : `PHC Titabor Blood Panel Report (Patient: ${patientName})`}
              </h4>
              <p className="text-xs text-purple-300 font-mono mt-0.5">
                Sample File: blood_metabolic_panel_sep2026.pdf (1.2 MB)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-600/35 transition-all cursor-pointer disabled:opacity-50 border border-purple-400/30"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={16} className="animate-spin text-[#c084fc]" />
                  <span>
                    {lang === 'as'
                      ? 'বিশ্লেষণ চলি আছে...'
                      : lang === 'hi'
                      ? 'रिपोर्ट का अनुवाद हो रहा है...'
                      : 'Translating Lab Terms...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>{getTranslation('actionExplain', lang)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Result */}
      {reportResult && (
        <div className="space-y-6 animate-in fade-in">
          {/* Plain Summary Banner */}
          <div className="glass-card-dark p-6 sm:p-7 rounded-3xl border border-purple-400/50 bg-purple-950/40 space-y-3 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c084fc] flex items-center gap-1.5">
                <Heart size={16} />{' '}
                {lang === 'hi'
                  ? 'सरल भाषा में स्वास्थ्य सारांश'
                  : lang === 'as'
                  ? 'সহজ ভাষাত স্বাস্থ্য সাৰাংশ'
                  : 'Plain Language Health Summary'}
              </span>
              <VoiceNarratorButton
                textToRead={
                  lang === 'as'
                    ? reportResult.plainLanguageSummaryAs
                    : lang === 'hi'
                    ? (reportResult.plainLanguageSummaryHi || reportResult.plainLanguageSummary)
                    : reportResult.plainLanguageSummary
                }
                size="sm"
                label={getTranslation('actionListen', lang)}
                className="bg-purple-500/20 hover:bg-purple-500/30 text-white border border-purple-400/30"
              />
            </div>
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {lang === 'as'
                ? reportResult.plainLanguageSummaryAs
                : lang === 'hi'
                ? (reportResult.plainLanguageSummaryHi || reportResult.plainLanguageSummary)
                : reportResult.plainLanguageSummary}
            </p>
          </div>

          {/* Parameters Table */}
          <div className="glass-card-dark rounded-3xl border border-white/12 overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/10">
              <h4 className="font-black text-base text-white">
                {lang === 'as'
                  ? 'পৰীক্ষা কৰা সূচকসমূহৰ সৰল ব্যাখ্যা'
                  : lang === 'hi'
                  ? 'परीक्षण किए गए बायोमार्कर व सरल व्याख्या'
                  : 'Tested Biomarkers & Plain Explanations'}
              </h4>
            </div>

            <div className="divide-y divide-white/10">
              {reportResult.keyFindings.map((finding, idx) => {
                const isNormal = finding.status === 'normal';
                return (
                  <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">
                          {lang === 'as'
                            ? finding.parameterAs
                            : lang === 'hi'
                            ? (finding.parameterHi || finding.parameter)
                            : finding.parameter}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                            isNormal
                              ? 'bg-purple-500/20 text-purple-200 border border-purple-400/40'
                              : 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
                          }`}
                        >
                          {finding.status === 'normal'
                            ? getTranslation('statusNormal', lang)
                            : getTranslation('statusElevated', lang)}
                        </span>
                      </div>
                      <p className="text-xs text-sky-200/80 leading-relaxed font-medium">
                        {lang === 'as'
                          ? finding.explanationAs
                          : lang === 'hi'
                          ? (finding.explanationHi || finding.explanation)
                          : finding.explanation}
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-lg font-mono font-black text-purple-300 block">
                        {finding.value}
                      </span>
                      <span className="text-[11px] text-sky-200/50 font-mono">
                        Ref: {finding.referenceRange}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Doctor Recommendation */}
          <div className="p-5 rounded-2xl bg-purple-500/15 border border-purple-400/30 flex items-start gap-3.5 backdrop-blur-md shadow-md">
            <Stethoscope size={24} className="text-[#c084fc] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-sm text-white">
                {lang === 'as'
                  ? 'চিকিৎসকৰ পৰামৰ্শ (Clinical Care Note)'
                  : lang === 'hi'
                  ? 'चिकित्सक की सामान्य सलाह (Clinical Note)'
                  : 'Physician Routine Guidance'}
              </h5>
              <p className="text-xs text-sky-200/90 mt-1 leading-relaxed font-medium">
                {lang === 'as'
                  ? reportResult.doctorRecommendationAs
                  : lang === 'hi'
                  ? (reportResult.doctorRecommendationHi || reportResult.doctorRecommendation)
                  : reportResult.doctorRecommendation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
