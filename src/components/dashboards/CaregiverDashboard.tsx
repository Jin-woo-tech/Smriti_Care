import React, { useState } from 'react';
import {
  Users,
  Pill,
  Brain,
  TrendingUp,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  Heart,
  FileText,
  Activity,
  PhoneCall,
  ArrowUpRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../lib/i18n';
import { maskPhoneNumber } from '../../lib/utils';
import { VoiceNarratorButton } from '../common/VoiceNarratorButton';
import { ThreeDParticleBackground } from '../common/ThreeDParticleBackground';

export const CaregiverDashboard: React.FC = () => {
  const { settings, reminders, cognitiveTrends, journal, addJournalEntry, activePatient } = useApp();
  const lang = settings.language;
  const patientName =
    lang === 'hi' && activePatient.nameHi
      ? activePatient.nameHi
      : activePatient.name;

  const [noteText, setNoteText] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);

  const completedPills = reminders.filter(r => r.taken).length;
  const pillPercent = Math.round((completedPills / (reminders.length || 1)) * 100);

  // 7-day historical trend data for recharts
  const trendDays = [
    { day: 'Mon', memory: 76, attention: 74, executive: 70 },
    { day: 'Tue', memory: 78, attention: 77, executive: 72 },
    { day: 'Wed', memory: 80, attention: 76, executive: 75 },
    { day: 'Thu', memory: 82, attention: 80, executive: 74 },
    { day: 'Fri', memory: 84, attention: 82, executive: 77 },
    { day: 'Sat', memory: 85, attention: 83, executive: 79 },
    { day: 'Sun', memory: 88, attention: 85, executive: 80 },
  ];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    addJournalEntry({
      date: 'Caregiver Note: ' + new Date().toLocaleDateString(),
      mood: 'peaceful',
      text: noteText,
      textHi: noteText,
    });

    setNoteText('');
    setShowNoteModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-white">
      {/* Frosted Glass Header Banner - Purple & Blue Aesthetic */}
      <div className="glass-panel p-6 sm:p-9 rounded-[2.5rem] border border-white/14 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
        {/* Dynamic Section 3D Particle Animation */}
        <ThreeDParticleBackground variant="section" particleCount={25} colorTheme="purple-indigo" />

        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/30 text-xs font-bold mb-3 shadow-inner">
            <Users size={15} className="text-[#c084fc]" />
            <span>Family Caregiver Portal • Priyanka Gogoi (Daughter)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {lang === 'hi'
              ? `देखभालकर्ता निगरानी पोर्टल: ${patientName} (${activePatient.age} वर्ष)`
              : `Caregiver Overview: ${patientName} (${activePatient.age} yrs)`}
          </h1>
          <p className="text-sm sm:text-base text-sky-200/80 mt-2 leading-relaxed font-medium">
            {lang === 'hi'
              ? 'दैनिक दवा अनुपालन, 7-दिवसीय संज्ञानात्मक स्वास्थ्य रुझान और पारिवारिक देखभाल नोट्स देखें।'
              : 'Real-time adherence monitoring, 7-day cognitive trend charts, and family coordination.'}
          </p>
        </div>

        <div className="relative z-10">
          <VoiceNarratorButton
            textToRead={
              lang === 'hi'
                ? `देखभालकर्ता पोर्टल। ${patientName} का आज का दवा अनुपालन और पिछले 7 दिनों का स्मृति रुझान सामान्य और स्थिर है।`
                : `Caregiver overview for ${patientName}. Medication adherence is on track with steady visual memory performance.`
            }
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg font-bold"
          />
        </div>
      </div>

      {/* Top 3 Frosted Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Medication Adherence */}
        <div className="glass-card-dark p-6 rounded-[2rem] border border-white/12 hover:border-purple-500/40 space-y-4 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-200/70 uppercase tracking-wider">
              {lang === 'hi'
                ? 'आज का दवा अनुपालन'
                : "Today's Pill Adherence"}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-[#c084fc] flex items-center justify-center font-bold border border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
              <Pill size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white tracking-tight">{pillPercent}%</span>
            <span className="text-xs font-bold text-sky-200/60">
              ({completedPills}/{reminders.length}{' '}
              {lang === 'hi' ? 'ली गईं' : 'taken'})
            </span>
          </div>
          <div className="w-full h-3 bg-[#091224] rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#38bdf8] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]"
              style={{ width: `${pillPercent}%` }}
            />
          </div>
        </div>

        {/* Cognitive Baseline Trend */}
        <div className="glass-card-dark p-6 rounded-[2rem] border border-white/12 hover:border-purple-500/40 space-y-4 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-200/70 uppercase tracking-wider">
              {lang === 'hi'
                ? 'संज्ञानात्मक आधार रेखा'
                : 'Cognitive Baseline'}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold border border-indigo-400/30 shadow-[0_0_12px_rgba(99,102,241,0.3)]">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-purple-300 tracking-tight">
              {lang === 'hi' ? 'स्थिर' : 'Stable'}
            </span>
            <span className="text-xs font-extrabold text-purple-200 bg-purple-500/20 border border-purple-400/40 px-2.5 py-0.5 rounded-full shadow-xs">
              +4% vs Baseline
            </span>
          </div>
          <p className="text-xs text-sky-200/70 font-medium leading-relaxed">
            {lang === 'hi'
              ? 'पिछले 14 दिनों के सत्रों में प्रदर्शन स्थिर और सकारात्मक बना हुआ है।'
              : 'Performance trend indicates steady engagement over the last 14 sessions.'}
          </p>
        </div>

        {/* Assigned ASHA Worker */}
        <div className="glass-card-dark p-6 rounded-[2rem] border border-white/12 hover:border-purple-500/40 space-y-4 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-200/70 uppercase tracking-wider">
              {lang === 'hi'
                ? 'नियुक्त आशा कार्यकर्ता'
                : 'Assigned ASHA Worker'}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold border border-sky-400/30 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
              <Heart size={18} />
            </div>
          </div>
          <div>
            <h4 className="font-black text-lg text-white">Minoti Das</h4>
            <p className="text-xs text-sky-200/60 font-medium mt-0.5">
              {lang === 'hi'
                ? 'तीताबर उप-स्वास्थ्य केंद्र • अंतिम भेंट: 3 दिन पहले'
                : 'Titabor Sub-centre • Last visit: 3 days ago'}
            </p>
          </div>
          <a
            href="tel:+919435012345"
            className="inline-flex items-center gap-2 text-xs font-black text-[#c084fc] hover:text-purple-200 transition-colors"
          >
            <PhoneCall size={14} />
            <span>Call Minoti ({maskPhoneNumber('+91 94350 12345')})</span>
          </a>
        </div>
      </div>

      {/* 7-Day Cognitive Domain Trend Line Chart */}
      <div className="glass-card-dark p-6 sm:p-8 rounded-[2.5rem] border border-white/12 hover:border-purple-500/40 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Brain size={22} className="text-[#c084fc]" />
              <span>
                {lang === 'hi'
                  ? '7-दिवसीय दीर्घकालिक संज्ञानात्मक रुझान (Longitudinal Performance)'
                  : '7-Day Longitudinal Domain Performance'}
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-sky-200/70 font-medium mt-1">
              {lang === 'hi'
                ? 'दृश्य स्मृति, ध्यान, प्रतिक्रिया गति और विज़ुओस्पेशियल क्षेत्रों में प्रदर्शन स्कोर।'
                : 'Tracks normalized scoring across Visual Memory, Attention, Reaction Speed, and Visuospatial domains.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-3.5 py-1.5 bg-purple-500/15 text-purple-200 rounded-full border border-purple-400/30">
              {lang === 'hi' ? 'व्यक्तिगत आधार रेखा:' : 'Personal Baseline:'} 78 pts
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendDays} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
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
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="memory"
                name="Visual Memory"
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ r: 4, fill: '#a855f7' }}
              />
              <Line
                type="monotone"
                dataKey="attention"
                name="Attention Filter"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ r: 3, fill: '#38bdf8' }}
              />
              <Line
                type="monotone"
                dataKey="executive"
                name="Executive Function"
                stroke="#c084fc"
                strokeWidth={2}
                dot={{ r: 3, fill: '#c084fc' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Caregiver Notes & Family Coordination */}
      <div className="glass-card-dark p-6 sm:p-8 rounded-[2.5rem] border border-white/12 hover:border-purple-500/40 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <FileText size={22} className="text-[#c084fc]" />
            <span>
              {lang === 'hi'
                ? 'पारिवारिक देखभाल नोट्स व अवलोकन'
                : 'Family Care Notes & Observations'}
            </span>
          </h3>

          <button
            onClick={() => setShowNoteModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white rounded-2xl text-xs font-black shadow-lg shadow-purple-600/30 cursor-pointer transition-all active:scale-95 border border-purple-400/30"
          >
            <Plus size={16} />
            <span>{lang === 'hi' ? 'नोट जोड़ें' : 'Add Note'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/30 shadow-xs space-y-2 transition-all">
            <div className="flex items-center justify-between text-xs text-sky-200/60">
              <span className="font-bold text-[#c084fc]">Priyanka Gogoi (Daughter)</span>
              <span>Today, 10:15 AM</span>
            </div>
            <p className="text-xs sm:text-sm text-sky-100/90 font-medium leading-relaxed">
              Father was very energetic during breakfast. Took blood pressure medicine smoothly. Played 2 rounds of the Bihu matching memory game.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/30 shadow-xs space-y-2 transition-all">
            <div className="flex items-center justify-between text-xs text-sky-200/60">
              <span className="font-bold text-[#c084fc]">Minoti Das (ASHA)</span>
              <span>Yesterday, 4:30 PM</span>
            </div>
            <p className="text-xs sm:text-sm text-sky-100/90 font-medium leading-relaxed">
              Conducted regular weekly visit. Checked Telmisartan and Metformin stock. All good for next 14 days.
            </p>
          </div>
        </div>
      </div>

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-[#070d1a]/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setShowNoteModal(false)}
          />
          <div className="glass-card-frosted bg-[#0f192d]/95 rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl border border-purple-500/30 relative z-10 animate-in zoom-in-95 text-white">
            <h3 className="text-xl font-black text-white">
              Add Caregiver Observation
            </h3>

            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-sky-200/80 uppercase tracking-wider mb-1.5">
                  Note Content
                </label>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Record mood, appetite, cognitive recall, or medication notes..."
                  rows={4}
                  className="w-full p-3.5 rounded-2xl border border-white/15 bg-white/10 text-white placeholder-sky-200/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7] backdrop-blur-md"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-stone-300 cursor-pointer border border-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white shadow-lg shadow-purple-600/30 border border-purple-400/30 cursor-pointer transition-all active:scale-95"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
