import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
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
  const { settings } = useApp();
  const lang = settings.language;

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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm shadow-sky-900/5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {lang === 'as'
              ? 'তেজ পৰীক্ষা আৰু লেব ৰিপৰ্টৰ সহজ ব্যাখ্যা'
              : lang === 'hi'
              ? 'AI लैब रिपोर्ट सरल भाषा अनुवादक'
              : 'AI Lab Report Plain Language Translator'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
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
        />
      </div>

      {/* Action Upload Card */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm shadow-sky-900/5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-100 text-teal-700 rounded-2xl">
              <FileText size={28} />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900">
                {lang === 'as'
                  ? 'তিতাবৰ স্বাস্থ্য কেন্দ্ৰৰ শেহতীয়া তেজ পৰীক্ষা ৰিপৰ্ট'
                  : lang === 'hi'
                  ? 'तीताबर प्राथमिक स्वास्थ्य केंद्र रक्त परीक्षण रिपोर्ट (मरीज: बिपिन गोगोई)'
                  : 'PHC Titabor Blood Panel Report (Patient: Bipin Gogoi)'}
              </h4>
              <p className="text-xs text-slate-500 font-mono">
                Sample File: blood_metabolic_panel_sep2026.pdf (1.2 MB)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
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
          <div className="p-6 rounded-3xl bg-teal-50 border-2 border-teal-500 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
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
              />
            </div>
            <p className="text-base font-bold text-teal-950 leading-relaxed">
              {lang === 'as'
                ? reportResult.plainLanguageSummaryAs
                : lang === 'hi'
                ? (reportResult.plainLanguageSummaryHi || reportResult.plainLanguageSummary)
                : reportResult.plainLanguageSummary}
            </p>
          </div>

          {/* Parameters Table */}
          <div className="bg-white rounded-3xl border border-sky-100 overflow-hidden shadow-sm shadow-sky-900/5">
            <div className="p-5 border-b border-sky-100">
              <h4 className="font-extrabold text-base text-slate-900">
                {lang === 'as'
                  ? 'পৰীক্ষা কৰা সূচকসমূহৰ সৰল ব্যাখ্যা'
                  : lang === 'hi'
                  ? 'परीक्षण किए गए बायोमार्कर व सरल व्याख्या'
                  : 'Tested Biomarkers & Plain Explanations'}
              </h4>
            </div>

            <div className="divide-y divide-sky-100">
              {reportResult.keyFindings.map((finding, idx) => {
                const isNormal = finding.status === 'normal';
                return (
                  <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {lang === 'as'
                            ? finding.parameterAs
                            : lang === 'hi'
                            ? (finding.parameterHi || finding.parameter)
                            : finding.parameter}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            isNormal
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {finding.status === 'normal'
                            ? getTranslation('statusNormal', lang)
                            : getTranslation('statusElevated', lang)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {lang === 'as'
                          ? finding.explanationAs
                          : lang === 'hi'
                          ? (finding.explanationHi || finding.explanation)
                          : finding.explanation}
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-lg font-mono font-bold text-teal-800 block">
                        {finding.value}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Ref: {finding.referenceRange}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Doctor Recommendation */}
          <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 flex items-start gap-3">
            <Stethoscope size={24} className="text-teal-700 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-sm text-slate-900">
                {lang === 'as'
                  ? 'চিকিৎসকৰ পৰামৰ্শ (Clinical Care Note)'
                  : lang === 'hi'
                  ? 'चिकित्सक की सामान्य सलाह (Clinical Note)'
                  : 'Physician Routine Guidance'}
              </h5>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
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
