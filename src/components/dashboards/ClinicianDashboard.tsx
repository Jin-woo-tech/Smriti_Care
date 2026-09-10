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
import { maskPhoneNumber } from '../../lib/utils';

export const ClinicianDashboard: React.FC = () => {
  const { settings, cognitiveTrends, reminders, gameScores, ashaPatients, activePatient } = useApp();
  const lang = settings.language;
  const patientName =
    lang === 'as' && activePatient.nameAs
      ? activePatient.nameAs
      : lang === 'hi' && activePatient.nameHi
      ? activePatient.nameHi
      : activePatient.name;

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
      const targetPatient = {
        id: activePatient.id,
        name: activePatient.name,
        nameAs: activePatient.nameAs || activePatient.name,
        age: activePatient.age,
        gender: activePatient.gender,
        village: activePatient.location,
        villageAs: activePatient.locationAs || activePatient.location,
        phone: activePatient.emergencyContactPhone || '+91 94350 12345',
        caregiverName: activePatient.emergencyContactName || 'Family Caregiver',
        caregiverPhone: activePatient.emergencyContactPhone || '+91 98640 67890',
        lastVisitDate: 'Recent',
        adherenceRate: activePatient.adherenceRate || 95,
        cognitiveStatus: 'stable' as const,
        medicationStockDays: 18,
        nextScheduledVisit: 'Next Tuesday',
        notes: activePatient.condition || 'Regular clinical neuro-checkup completed.',
        notesAs: 'নিয়মীয়া স্বাস্থ্য পৰীক্ষা সম্পন্ন হৈছে।',
      };

      generateAndDownloadClinicalReport(targetPatient, cognitiveTrends, activePatient.adherenceRate || 95);
      setIsGeneratingPdf(false);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-white">
      {/* Frosted Glass Header Banner */}
      <div className="glass-panel p-6 sm:p-9 rounded-[2.5rem] border border-white/14 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/30 text-xs font-bold mb-3 shadow-inner">
            <Stethoscope size={15} className="text-[#c084fc]" />
            <span>Physician & Neurological Health Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {lang === 'as'
              ? 'চিকিৎসক পৰ্যবেক্ষণ আৰু ৰিপৰ্ট'
              : lang === 'hi'
              ? 'चिकित्सकीय संज्ञानात्मक मूल्यांकन पोर्टल'
              : 'Clinical Cognitive Assessment Portal'}
          </h1>
          <p className="text-sm sm:text-base text-sky-200/80 mt-2 leading-relaxed font-medium">
            {lang === 'as'
              ? 'ৰোগীৰ মগজুৰ সুস্থতাৰ মূল্যাংকন, দীৰ্ঘম্যাদী পৰীক্ষাৰ ৰেকৰ্ড আৰু চিকিৎসা প্ৰতিবেদন ডাউনল’ড কৰক।'
              : lang === 'hi'
              ? 'वस्तुनिष्ठ दीर्घकालिक डिजिटल बायोमार्कर, बहु-क्षेत्रीय संज्ञानात्मक मैट्रिक्स और 1-क्लिक क्लिनिकल रिपोर्ट।'
              : 'Objective longitudinal digital biomarkers, multi-domain cognitive metrics, and downloadable clinical reports.'}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <VoiceNarratorButton
            textToRead={
              lang === 'as'
                ? `চিকিৎসক পৰ্যবেক্ষণ ফলক। ${patientName}ৰ ঔষধ পালনৰ হাৰ ${activePatient.adherenceRate || 95} শতাংশ আৰু স্মৃতি শক্তি সন্তোষজনক।`
                : lang === 'hi'
                ? `चिकित्सक मूल्यांकन पोर्टल। ${patientName} की दवा अनुपालन दर ${activePatient.adherenceRate || 95}% है और बहु-क्षेत्रीय संज्ञानात्मक रडार स्थिर स्थिति दर्शाता है।`
                : `Clinician Cognitive Dashboard for ${patientName}. Adherence is ${activePatient.adherenceRate || 95}% and cognitive domain radar shows steady functioning.`
            }
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg font-bold"
          />

          <button
            onClick={handleDownloadReport}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white rounded-2xl font-black text-sm shadow-xl shadow-purple-600/35 cursor-pointer transition-all active:scale-95 disabled:opacity-50 border border-purple-400/30"
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

      {/* Patient Clinical Profile Card */}
      <div className="glass-card-dark p-6 sm:p-8 rounded-[2.5rem] border border-white/12 hover:border-purple-500/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${activePatient.avatarColor || 'from-purple-600 to-indigo-600'} text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-purple-600/30 border border-purple-400/30`}>
              {activePatient.avatarInitials || 'AJ'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-2xl font-black text-white">{patientName}</h3>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 font-extrabold border border-purple-400/30 shadow-xs">
                  ID: SMR-2026-{activePatient.age}
                </span>
              </div>
              <p className="text-xs text-sky-200/70 font-medium mt-1">
                {activePatient.age} Years • {activePatient.gender === 'F' ? 'Female' : activePatient.gender === 'M' ? 'Male' : 'Other'} • {activePatient.location} • Primary Contact: {activePatient.emergencyContactName || 'Family Caregiver'} ({maskPhoneNumber(activePatient.emergencyContactPhone || '+91 94350 12345')})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-xs text-sky-200/60 uppercase font-black block tracking-wider">Adherence Rate</span>
              <span className="text-3xl font-black text-purple-300">{activePatient.adherenceRate || 95}%</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-sky-200/60 uppercase font-black block tracking-wider">Overall Baseline</span>
              <span className="text-3xl font-black text-[#c084fc]">81.0 / 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Radar Chart & Domain Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Domain Radar Chart */}
        <div className="lg:col-span-6 glass-card-dark p-6 sm:p-8 rounded-[2.5rem] border border-white/12 hover:border-purple-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-base text-white flex items-center gap-2">
              <Brain size={20} className="text-[#c084fc]" />
              <span>Multi-Domain Cognitive Radar</span>
            </h4>
            <span className="text-xs text-sky-200/60 font-mono font-bold">Current vs Baseline</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.12)" strokeOpacity={0.8} />
                <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11, fill: '#cbd5e1' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" />
                <Radar
                  name="Current Score"
                  dataKey="score"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Baseline"
                  dataKey="baseline"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '1rem',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Domain Breakdown List */}
        <div className="lg:col-span-6 glass-card-dark p-6 sm:p-8 rounded-[2.5rem] border border-white/12 hover:border-purple-500/40 space-y-4">
          <h4 className="font-black text-base text-white flex items-center gap-2">
            <Activity size={20} className="text-[#c084fc]" />
            <span>Domain Diagnostics & Baseline Stability</span>
          </h4>

          <div className="space-y-3">
            {cognitiveTrends.map(trend => {
              const diff = trend.score - trend.baselineScore;
              return (
                <div
                  key={trend.domain}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/30 flex items-center justify-between transition-all"
                >
                  <div>
                    <span className="font-extrabold text-sm text-white block">
                      {trend.domain}
                    </span>
                    <span className="text-xs text-sky-200/60 font-medium">
                      Baseline: {trend.baselineScore} pts • Status: {trend.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-white block">
                      {trend.score} / 100
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        diff >= 0 ? 'text-purple-300' : 'text-amber-400'
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
