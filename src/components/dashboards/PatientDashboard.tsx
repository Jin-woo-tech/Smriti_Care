import React from 'react';
import {
  Pill,
  Brain,
  Heart,
  MessageSquare,
  Sun,
  ChevronRight,
  PhoneCall,
  Sparkles,
  Droplets,
  Footprints,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../lib/i18n';
import { VoiceNarratorButton } from '../common/VoiceNarratorButton';
import { BrainCrystalVisual } from '../visuals/BrainCrystalVisual';
import { LungsCrystalVisual } from '../visuals/LungsCrystalVisual';
import { LiverCrystalVisual } from '../visuals/LiverCrystalVisual';
import { KidneyCrystalVisual } from '../visuals/KidneyCrystalVisual';

interface PatientDashboardProps {
  onNavigateTab: (tab: 'routine' | 'games' | 'journal' | 'chat' | 'safety') => void;
  onOpenEmergency: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  onNavigateTab,
  onOpenEmergency,
}) => {
  const { settings, reminders, photos, waterGlasses, activePatient } = useApp();
  const lang = settings.language;
  const patientName =
    lang === 'hi' && activePatient.nameHi
      ? activePatient.nameHi
      : activePatient.name;

  const pendingReminders = reminders.filter(r => !r.taken);
  const nextReminder = pendingReminders[0] || reminders[0];
  const completedTodayCount = reminders.filter(r => r.taken).length;
  const pillPercent = Math.round((completedTodayCount / (reminders.length || 1)) * 100);

  const getReminderTitle = (rem: typeof nextReminder) => {
    if (!rem) return '';
    if (lang === 'hi') return rem.titleHi || rem.title;
    return rem.title;
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-white animate-in fade-in duration-300">
      {/* Hero Banner with Frosted Glass Panels & Purple Ambient Glow */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#161233]/95 via-[#1a1c48]/90 to-[#0e172e]/95 p-6 sm:p-9 rounded-[2.5rem] border border-white/20 shadow-2xl backdrop-blur-2xl space-y-6">
        {/* Background glow accents */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-purple-500/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-bold backdrop-blur-md shadow-xs">
              <Sun size={14} className="text-[#c084fc]" />
              <span>
                {lang === 'hi'
                  ? 'तीताबर, जोरहाट • 26°C सुखद मौसम'
                  : 'Titabor, Jorhat • 26°C Pleasant'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {lang === 'hi'
                ? `नमस्ते, ${patientName} जी!`
                : `Namaskar, ${patientName}!`}
            </h1>
            <p className="text-xs sm:text-sm text-sky-100/80 font-medium max-w-xl">
              {lang === 'hi'
                ? 'आपका दिन मंगलमय हो। आपकी दैनिक दवाइयां, जल सेवन व स्मृति खेल तैयार हैं।'
                : 'Welcome to your SmritiCare home. Track your daily routine, play memory exercises, or speak with Sathi.'}
            </p>
          </div>

          <VoiceNarratorButton
            textToRead={
              lang === 'hi'
                ? `नमस्ते ${patientName} जी! आज आपकी 4 में से 2 दवाइयाँ ली जा चुकी हैं। मन को तरोताजा रखने के लिए दिमागी खेल खेलें।`
                : `Namaskar ${patientName}. Welcome to your SmritiCare daily board. Tap any tile below to check medicines, play memory games, or talk with Sathi.`
            }
            size="lg"
            className="bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white border-0 shadow-lg shadow-purple-600/35 font-black"
          />
        </div>

        {/* 4 Frosted Glass Metric Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* Metric 1: Medicines */}
          <div
            onClick={() => onNavigateTab('routine')}
            className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 hover:bg-white/20 hover:border-purple-400/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-purple-200 text-xs font-bold mb-1">
              <span className="flex items-center gap-1.5">
                <Pill size={15} className="text-[#c084fc]" />
                <span>{lang === 'hi' ? 'दवाइयां' : 'Medicines'}</span>
              </span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {completedTodayCount}/{reminders.length}
            </div>
            <p className="text-[11px] text-purple-300 font-semibold mt-0.5">
              {pillPercent}% {lang === 'hi' ? 'पूर्ण' : 'Completed'}
            </p>
          </div>

          {/* Metric 2: Hydration */}
          <div
            onClick={() => onNavigateTab('routine')}
            className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 hover:bg-white/20 hover:border-cyan-300/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-sky-200 text-xs font-bold mb-1">
              <span className="flex items-center gap-1.5">
                <Droplets size={15} className="text-cyan-300" />
                <span>{lang === 'hi' ? 'जल सेवन' : 'Hydration'}</span>
              </span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {waterGlasses}/8
            </div>
            <p className="text-[11px] text-cyan-300 font-semibold mt-0.5">
              {lang === 'hi' ? 'गिलास पानी' : 'Glasses recorded'}
            </p>
          </div>

          {/* Metric 3: Walk */}
          <div
            onClick={() => onNavigateTab('routine')}
            className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 hover:bg-white/20 hover:border-purple-300/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-purple-200 text-xs font-bold mb-1">
              <span className="flex items-center gap-1.5">
                <Footprints size={15} className="text-purple-300" />
                <span>{lang === 'hi' ? 'सैर' : 'Daily Walk'}</span>
              </span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-purple-300">
              20 Mins
            </div>
            <p className="text-[11px] text-purple-200 font-semibold mt-0.5">
              {lang === 'hi' ? 'सफलतापूर्वक पूर्ण' : 'Done today'}
            </p>
          </div>

          {/* Metric 4: Cognitive Health */}
          <div
            onClick={() => onNavigateTab('games')}
            className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 hover:bg-white/20 hover:border-indigo-300/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-indigo-200 text-xs font-bold mb-1">
              <span className="flex items-center gap-1.5">
                <Brain size={15} className="text-indigo-300" />
                <span>{lang === 'hi' ? 'स्मृति सूचकांक' : 'Brain Index'}</span>
              </span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-indigo-200">
              84%
            </div>
            <p className="text-[11px] text-indigo-300 font-semibold mt-0.5">
              {lang === 'hi' ? 'स्थिर व सकारात्मक' : 'Stable vs Baseline'}
            </p>
          </div>
        </div>
      </div>

      {/* Next Scheduled Pill Action Callout */}
      {nextReminder && (
        <div
          onClick={() => onNavigateTab('routine')}
          className="p-5 sm:p-6 rounded-[2rem] bg-gradient-to-r from-purple-950/40 via-[#101b38]/80 to-purple-950/40 backdrop-blur-2xl border border-purple-500/30 shadow-xl hover:border-purple-400/60 transition-all cursor-pointer flex flex-wrap items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-[#c084fc] border border-purple-400/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-lg shadow-purple-500/25">
              <Pill size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#a855f7] text-white px-2.5 py-0.5 rounded-full shadow-xs">
                  {lang === 'hi'
                    ? 'अगली निर्धारित दवा'
                    : 'Next Scheduled Pill'}
                </span>
                <span className="text-xs font-mono font-bold text-sky-200 flex items-center gap-1">
                  <Clock size={12} /> {nextReminder.time}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                {getReminderTitle(nextReminder)}
              </h3>
              <p className="text-xs font-medium text-purple-200/80">
                {nextReminder.dose || '1 tablet'} • {nextReminder.notes || 'Routine schedule'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white font-black text-xs sm:text-sm bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] px-5 py-2.5 rounded-2xl group-hover:from-[#9333ea] group-hover:to-[#7c3aed] transition-all shadow-lg shadow-purple-600/30 border border-purple-400/30">
            <span>
              {lang === 'hi' ? 'दवा सूची देखें' : 'View Schedule'}
            </span>
            <ChevronRight size={16} />
          </div>
        </div>
      )}

      {/* Modern Organ & Cognitive Health Bento Cards matching Dark Frosted Glass Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Bento 1: Brain Health Check */}
        <div
          onClick={() => onNavigateTab('games')}
          className="glass-card-dark p-6 rounded-[2rem] flex flex-col justify-between group cursor-pointer relative overflow-hidden"
        >
          <div>
            <div className="flex items-start justify-between mb-3">
              <BrainCrystalVisual size={75} />
              <div className="action-arrow-pill">
                <ArrowUpRight size={18} />
              </div>
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 bg-purple-950/60 border border-purple-800/60 px-2.5 py-0.5 rounded-full">
              Cognitive Scan
            </span>
            <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors mt-2">
              Brain Health Check
            </h3>
            <p className="text-xs text-sky-100/70 mt-1 font-medium leading-relaxed">
              6 scientifically graded neuro-cognitive memory exercises.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-purple-300">
            <span>6 Memory Games</span>
            <span className="text-white/60">3-Tier Adaptive</span>
          </div>
        </div>

        {/* Bento 2: Medicine Safety & Liver Metabolism */}
        <div
          onClick={() => onNavigateTab('safety')}
          className="glass-card-dark p-6 rounded-[2rem] flex flex-col justify-between group cursor-pointer relative overflow-hidden"
        >
          <div>
            <div className="flex items-start justify-between mb-3">
              <LiverCrystalVisual size={75} />
              <div className="action-arrow-pill">
                <ArrowUpRight size={18} />
              </div>
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-0.5 rounded-full">
              Medication Safety
            </span>
            <h3 className="text-xl font-black text-white group-hover:text-indigo-300 transition-colors mt-2">
              Medicine Packaging AI
            </h3>
            <p className="text-xs text-sky-100/70 mt-1 font-medium leading-relaxed">
              Instant strip photo scan with dosage & expiry verification.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-indigo-300">
            <span>Visual Scanner</span>
            <span className="text-white/60">Audio Feedback</span>
          </div>
        </div>

        {/* Bento 3: Hydration & Kidney Filtration Scan */}
        <div
          onClick={() => onNavigateTab('routine')}
          className="glass-card-dark p-6 rounded-[2rem] flex flex-col justify-between group cursor-pointer relative overflow-hidden"
        >
          <div>
            <div className="flex items-start justify-between mb-3">
              <KidneyCrystalVisual size={75} />
              <div className="action-arrow-pill">
                <ArrowUpRight size={18} />
              </div>
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider text-sky-300 bg-sky-950/60 border border-sky-800/60 px-2.5 py-0.5 rounded-full">
              Daily Schedule
            </span>
            <h3 className="text-xl font-black text-white group-hover:text-sky-300 transition-colors mt-2">
              Hydration & Vitals
            </h3>
            <p className="text-xs text-sky-100/70 mt-1 font-medium leading-relaxed">
              8-glass water intake tracking and walking timer logs.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-sky-300">
            <span>8-Glass Tracker</span>
            <span className="text-white/60">20m Walk</span>
          </div>
        </div>

        {/* Bento 4: Respiratory & Voice Companion */}
        <div
          onClick={() => onNavigateTab('chat')}
          className="glass-card-dark p-6 rounded-[2rem] flex flex-col justify-between group cursor-pointer relative overflow-hidden"
        >
          <div>
            <div className="flex items-start justify-between mb-3">
              <LungsCrystalVisual size={75} />
              <div className="action-arrow-pill">
                <ArrowUpRight size={18} />
              </div>
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 bg-purple-950/60 border border-purple-800/60 px-2.5 py-0.5 rounded-full">
              AI Voice Companion
            </span>
            <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors mt-2">
              Smriti Sathi (AI)
            </h3>
            <p className="text-xs text-sky-100/70 mt-1 font-medium leading-relaxed">
              Empathetic voice conversations in Assamese, Hindi, and English.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-purple-300">
            <span>Voice & Audio</span>
            <span className="text-white/60">Local Memory</span>
          </div>
        </div>
      </div>
    </div>
  );
};
