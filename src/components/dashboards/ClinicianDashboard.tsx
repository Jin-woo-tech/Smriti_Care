import React, { useState } from 'react';
import {
  Stethoscope,
  Download,
  FileText,
  TrendingUp,
  Brain,
  ShieldCheck,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Activity,
  Award,
  ArrowUpRight
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../lib/i18n';
import { generateAndDownloadClinicalReport } from '../../lib/pdfReport';
import { VoiceNarratorButton } from '../common/VoiceNarratorButton';

export const ClinicianDashboard: React.FC = () => {
  const { settings, cognitiveTrends, reminders, gameScores, ashaPatients } = useApp();
  const lang = settings.language;

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Radar data for clinical domains
  const radarData = cognitiveTrends.map(t => ({
    domain: t.domain,
    score: t.score,
    baseline: t.baselineScore,
    fullMark: 100,
  }));

  const handleDownloadReport = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      const targetPatient = ashaPatients[0] || {
        id: 'p-1',
        name: 'Bipin Gogoi',
        nameAs: 'বিপিন গগৈ',
        age: 72,
        gender: 'M' as const,
        village: 'Titabor',
        villageAs: 'তিতাবৰ',
        phone: '+91 98640 12345',
        caregiverName: 'Priyanka Gogoi',
        caregiverPhone: '+91 98640 67890',
        lastVisitDate: '3 days ago',
        adherenceRate: 92,
        cognitiveStatus: 'stable' as const,
        medicationStockDays: 18,
        nextScheduledVisit: 'Next Tuesday',
        notes: 'Regular check-up conducted.',
        notesAs: 'নিয়মীয়া স্বাস্থ্য পৰীক্ষা সম্পন্ন হৈছে।',
      };

      generateAndDownloadClinicalReport(targetPatient, cognitiveTrends, 92);
      setIsGeneratingPdf(false);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Frosted Glass Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#123153]/95 via-[#184674]/90 to-[#0e2742]/95 border border-white/20 p-6 sm:p-9 shadow-2xl backdrop-blur-2xl">
        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-56 h-56 bg-[#c5f82a]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-cyan-200 border border-white/15 text-xs font-bold mb-3 backdrop-blur-md">
              <Stethoscope size={15} className="text-[#c5f82a]" />
              <span>Physician & Neurological Health Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {lang === 'as'
                ? 'চিকিৎসক পৰ্যবেক্ষণ আৰু ৰিপৰ্ট'
                : lang === 'hi'
                ? 'चिकित्सकीय संज्ञानात्मक मूल्यांकन पोर्टल'
                : 'Clinical Cognitive Assessment Portal'}
            </h1>
            <p className="text-sm sm:text-base text-cyan-100/80 mt-2 leading-relaxed">
              {lang === 'as'
                ? 'ৰোগীৰ মগজুৰ সুস্থতাৰ মূল্যাংকন, দীৰ্ঘম্যাদী পৰীক্ষাৰ ৰেকৰ্ড আৰু চিকিৎসা প্ৰতিবেদন ডাউনল’ড কৰক।'
                : lang === 'hi'
                ? 'वस्तुनिष्ठ दीर्घकालिक डिजिटल बायोमार्कर, बहु-क्षेत्रीय संज्ञानात्मक मैट्रिक्स और 1-क्लिक क्लिनिकल रिपोर्ट।'
                : 'Objective longitudinal digital biomarkers, multi-domain cognitive metrics, and downloadable clinical reports.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <VoiceNarratorButton
              textToRead={
                lang === 'as'
                  ? 'চিকিৎসক পৰ্যবেক্ষণ ফলক। বিপিন গগৈৰ যোৱা ৩০ দিনৰ ঔষধ পালনৰ হাৰ ৯২ শতাংশ আৰু স্মৃতি শক্তি সন্তোষজনক।'
                  : lang === 'hi'
                  ? 'चिकित्सक मूल्यांकन पोर्टल। बिपिन गोगोई की 30-दिवसीय दवा अनुपालन दर 92% है और बहु-क्षेत्रीय संज्ञानात्मक रडार स्थिर स्थिति दर्शाता है।'
                  : 'Clinician Cognitive Dashboard for Bipin Gogoi. 30-day adherence is 92% and cognitive domain radar shows stable functioning.'
              }
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-md font-bold"
            />

            <button
              onClick={handleDownloadReport}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#c5f82a] hover:bg-[#b5e820] text-slate-950 rounded-2xl font-black text-sm shadow-xl shadow-[#c5f82a]/25 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              <Download size={18} className="stroke-[3]" />
              <span>
                {isGeneratingPdf
                  ? (lang === 'hi' ? 'पीडीएफ तैयार हो रहा है...' : lang === 'as' ? 'PDF প্ৰস্তুত হৈ আছে...' : 'Generating PDF...')
                  : (lang === 'hi' ? 'क्लिनिकल रिपोर्ट PDF डाउनलोड करें' : lang === 'as' ? 'চিকিৎসা PDF ডাউনল’ড' : 'Download Clinical PDF')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Patient Clinical Profile Card */}
      <div className="glass-card-frosted p-6 sm:p-8 rounded-[2.5rem] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0f2b48] to-[#0284c7] text-[#c5f82a] flex items-center justify-center font-black text-2xl shadow-md">
              BG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-slate-900">Bipin Gogoi</h3>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-sky-100 text-[#0284c7] font-extrabold border border-sky-200">
                  ID: SMR-2026-084
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                72 Years • Male • Titabor, Jorhat, Assam • Primary Caregiver: Priyanka Gogoi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase font-black block">30-Day Adherence</span>
              <span className="text-3xl font-black text-emerald-600">92.4%</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase font-black block">Overall Baseline</span>
              <span className="text-3xl font-black text-[#0284c7]">81.0 / 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Radar Chart & Domain Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Domain Radar Chart */}
        <div className="lg:col-span-6 glass-card-frosted p-6 sm:p-8 rounded-[2.5rem] space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Brain size={20} className="text-[#0284c7]" />
              <span>Multi-Domain Cognitive Radar</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono font-bold">Current vs Baseline</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#bae6fd" strokeOpacity={0.6} />
                <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11, fill: '#475569' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Current Score"
                  dataKey="score"
                  stroke="#0284c7"
                  fill="#0284c7"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Baseline"
                  dataKey="baseline"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '1rem',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Domain Breakdown List */}
        <div className="lg:col-span-6 glass-card-frosted p-6 sm:p-8 rounded-[2.5rem] space-y-4">
          <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
            <Activity size={20} className="text-emerald-600" />
            <span>Domain Diagnostics & Baseline Stability</span>
          </h4>

          <div className="space-y-3">
            {cognitiveTrends.map(trend => {
              const diff = trend.score - trend.baselineScore;
              return (
                <div
                  key={trend.domain}
                  className="p-3.5 rounded-2xl bg-white/70 border border-sky-100 flex items-center justify-between"
                >
                  <div>
                    <span className="font-extrabold text-sm text-slate-800 block">
                      {trend.domain}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Baseline: {trend.baselineScore} pts • Status: {trend.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 block">
                      {trend.score} / 100
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        diff >= 0 ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {diff >= 0 ? `+${diff}` : diff} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
