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
  ShieldCheck
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
import { VoiceNarratorButton } from '../common/VoiceNarratorButton';

export const CaregiverDashboard: React.FC = () => {
  const { settings, reminders, cognitiveTrends, journal, addJournalEntry } = useApp();
  const lang = settings.language;

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
      textAs: noteText,
    });

    setNoteText('');
    setShowNoteModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Frosted Glass Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#123153]/95 via-[#184674]/90 to-[#0e2742]/95 border border-white/20 p-6 sm:p-9 shadow-2xl backdrop-blur-2xl">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-56 h-56 bg-[#c5f82a]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-cyan-200 border border-white/15 text-xs font-bold mb-3 backdrop-blur-md">
              <Users size={15} className="text-[#c5f82a]" />
              <span>Family Caregiver Portal • Priyanka Gogoi (Daughter)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {lang === 'as'
                ? 'অভিভাৱক নিৰীক্ষণ ফলক: বিপিন গগৈ (৭২ বছৰ)'
                : lang === 'hi'
                ? 'देखभालकर्ता निगरानी पोर्टल: बिपिन गोगोई (72 वर्ष)'
                : 'Caregiver Overview: Bipin Gogoi (72 yrs)'}
            </h1>
            <p className="text-sm sm:text-base text-cyan-100/80 mt-2 leading-relaxed">
              {lang === 'as'
                ? 'দেউতাৰ দৈনিক ঔষধ পালন, মগজুৰ সুস্থতাৰ ধাৰা আৰু দৈনন্দিন টোকা পৰ্যবেক্ষণ কৰক।'
                : lang === 'hi'
                ? 'दैनिक दवा अनुपालन, 7-दिवसीय संज्ञानात्मक स्वास्थ्य रुझान और पारिवारिक देखभाल नोट्स देखें।'
                : 'Real-time adherence monitoring, 7-day cognitive trend charts, and family coordination.'}
            </p>
          </div>

          <VoiceNarratorButton
            textToRead={
              lang === 'as'
                ? 'অভিভাৱক ফলক। দেউতাৰ আজিৰ ঔষধ পালনৰ হাৰ আৰু বিগত ৭ দিনৰ স্মৃতি পৰীক্ষাৰ ধাৰা চাওক।'
                : lang === 'hi'
                ? 'देखभालकर्ता पोर्टल। आज का दवा अनुपालन और पिछले 7 दिनों का स्मृति रुझान सामान्य और स्थिर है।'
                : 'Caregiver overview for Bipin Gogoi. Medication adherence is on track with steady visual memory performance.'
            }
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-md font-bold"
          />
        </div>
      </div>

      {/* Top 3 Frosted Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Medication Adherence */}
        <div className="glass-card-frosted p-6 rounded-[2rem] space-y-3 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              {lang === 'as'
                ? 'আজিৰ ঔষধ পালন'
                : lang === 'hi'
                ? 'आज का दवा अनुपालन'
                : "Today's Pill Adherence"}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold border border-teal-200/60 shadow-xs">
              <Pill size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 tracking-tight">{pillPercent}%</span>
            <span className="text-xs font-bold text-slate-500">
              ({completedPills}/{reminders.length}{' '}
              {lang === 'as' ? 'লোৱা হ’ল' : lang === 'hi' ? 'ली गईं' : 'taken'})
            </span>
          </div>
          <div className="w-full h-3 bg-sky-100/80 rounded-full overflow-hidden p-0.5 border border-sky-200/50">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-[#0284c7] rounded-full transition-all duration-500"
              style={{ width: `${pillPercent}%` }}
            />
          </div>
        </div>

        {/* Cognitive Baseline Trend */}
        <div className="glass-card-frosted p-6 rounded-[2rem] space-y-3 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              {lang === 'as'
                ? 'মগজুৰ স্থিৰতা'
                : lang === 'hi'
                ? 'संज्ञानात्मक आधार रेखा'
                : 'Cognitive Baseline'}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200/60 shadow-xs">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-600 tracking-tight">
              {lang === 'hi' ? 'स्थिर' : lang === 'as' ? 'স্থিৰ' : 'Stable'}
            </span>
            <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100/90 border border-emerald-300/50 px-2.5 py-0.5 rounded-full">
              +4% vs Baseline
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {lang === 'as'
              ? 'বিগত ১৪ দিনৰ পৰীক্ষাত স্মৃতি শক্তি স্থিৰ ৰূপত আছে।'
              : lang === 'hi'
              ? 'पिछले 14 दिनों के सत्रों में प्रदर्शन स्थिर और सकारात्मक बना हुआ है।'
              : 'Performance trend indicates steady engagement over the last 14 sessions.'}
          </p>
        </div>

        {/* Assigned ASHA Worker */}
        <div className="glass-card-frosted p-6 rounded-[2rem] space-y-3 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              {lang === 'as'
                ? 'দায়িত্বপ্ৰাপ্ত আশা কৰ্মী'
                : lang === 'hi'
                ? 'नियुक्त आशा कार्यकर्ता'
                : 'Assigned ASHA Worker'}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold border border-cyan-200/60 shadow-xs">
              <Heart size={18} />
            </div>
          </div>
          <div>
            <h4 className="font-black text-lg text-slate-900">Minoti Das</h4>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'as'
                ? 'তিতাবৰ উপ-স্বাস্থ্য কেন্দ্ৰ • অন্তিম পৰিদৰ্শন: ৩ দিন পূৰ্বে'
                : lang === 'hi'
                ? 'तीताबर उप-स्वास्थ्य केंद्र • अंतिम भेंट: 3 दिन पहले'
                : 'Titabor Sub-centre • Last visit: 3 days ago'}
            </p>
          </div>
          <a
            href="tel:+919435012345"
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#0284c7] hover:underline"
          >
            <PhoneCall size={14} />
            <span>Call Minoti (+91 94350 12345)</span>
          </a>
        </div>
      </div>

      {/* 7-Day Cognitive Domain Trend Line Chart */}
      <div className="glass-card-frosted p-6 sm:p-8 rounded-[2.5rem] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Brain size={22} className="text-[#0284c7]" />
              <span>
                {lang === 'as'
                  ? 'বিগত ৭ দিনৰ স্মৃতি আৰু মনোযোগ ধাৰা'
                  : lang === 'hi'
                  ? '7-दिवसीय दीर्घकालिक संज्ञानात्मक रुझान (Longitudinal Performance)'
                  : '7-Day Longitudinal Domain Performance'}
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {lang === 'as'
                ? 'ভিজুৱেল মেমৰি, মনোযোগ আৰু সঁহাৰিৰ গতিৰ মূল্যাংকন।'
                : lang === 'hi'
                ? 'दृश्य स्मृति, ध्यान, प्रतिक्रिया गति और विज़ुओस्पेशियल क्षेत्रों में प्रदर्शन स्कोर।'
                : 'Tracks normalized scoring across Visual Memory, Attention, Reaction Speed, and Visuospatial domains.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-3.5 py-1.5 bg-sky-100 text-sky-900 rounded-full border border-sky-200">
              {lang === 'hi' ? 'व्यक्तिगत आधार रेखा:' : lang === 'as' ? 'ব্যক্তিগত বেচলাইন:' : 'Personal Baseline:'} 78 pts
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendDays} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" opacity={0.7} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '1rem',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="memory"
                name="Visual Memory"
                stroke="#0d9488"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="attention"
                name="Attention Filter"
                stroke="#0284c7"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="executive"
                name="Executive Function"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Caregiver Notes & Family Coordination */}
      <div className="glass-card-frosted p-6 sm:p-8 rounded-[2.5rem] space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <FileText size={22} className="text-[#0284c7]" />
            <span>
              {lang === 'as'
                ? 'দৈনন্দিন পাৰিবাৰিক টোকা'
                : lang === 'hi'
                ? 'पारिवारिक देखभाल नोट्स व अवलोकन'
                : 'Family Care Notes & Observations'}
            </span>
          </h3>

          <button
            onClick={() => setShowNoteModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0f2b48] hover:bg-[#184674] text-white rounded-xl text-xs font-extrabold shadow-md cursor-pointer transition-all"
          >
            <Plus size={16} />
            <span>{lang === 'as' ? 'টোকা যোগ কৰক' : lang === 'hi' ? 'नोट जोड़ें' : 'Add Note'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/70 border border-sky-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-slate-700">Priyanka Gogoi (Daughter)</span>
              <span>Today, 10:15 AM</span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Father was very energetic during breakfast. Took blood pressure medicine smoothly. Played 2 rounds of the Bihu matching memory game.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 border border-sky-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-slate-700">Minoti Das (ASHA)</span>
              <span>Yesterday, 4:30 PM</span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Conducted regular weekly visit. Checked Telmisartan and Metformin stock. All good for next 14 days.
            </p>
          </div>
        </div>
      </div>

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card-frosted rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl border border-white">
            <h3 className="text-xl font-black text-slate-900">
              Add Caregiver Observation
            </h3>

            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Note Content
                </label>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Record mood, appetite, cognitive recall, or medication notes..."
                  rows={4}
                  className="w-full p-3.5 rounded-2xl border border-sky-200 bg-white/80 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-[#0f2b48] hover:bg-[#184674] text-white shadow-md cursor-pointer transition-all"
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
