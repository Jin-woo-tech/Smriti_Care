import React, { useState } from 'react';
import {
  Pill,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Droplets,
  Footprints,
  Sun,
  Sunset,
  Sparkles,
  CalendarCheck,
  BellRing
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../lib/i18n';
import { ReminderType } from '../../types';
import { VoiceNarratorButton } from '../common/VoiceNarratorButton';

export const DailyRoutine: React.FC = () => {
  const { settings, reminders, toggleReminderTaken, addReminder, waterGlasses, addWaterGlass } = useApp();
  const lang = settings.language;

  const [walkDone, setWalkDone] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state
  const [title, setTitle] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('08:00 AM');
  const [type] = useState<ReminderType>('medicine');
  const [notes, setNotes] = useState('After Food');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addReminder({
      type,
      title,
      titleAs: title,
      titleHi: title,
      time,
      dose,
      doseAs: dose,
      doseHi: dose,
      frequency: 'Daily',
      frequencyAs: 'দৈনিক',
      frequencyHi: 'दैनिक',
      notes,
      notesAs: notes,
      notesHi: notes,
      taken: false,
    });

    setTitle('');
    setDose('');
    setShowAddModal(false);
  };

  const getTimeIcon = (timeStr: string) => {
    if (timeStr.toLowerCase().includes('am')) return <Sun size={18} className="text-amber-400" />;
    if (timeStr.includes('01:') || timeStr.includes('02:') || timeStr.includes('03:'))
      return <Sun size={18} className="text-orange-400" />;
    return <Sunset size={18} className="text-purple-400" />;
  };

  const completedCount = reminders.filter(r => r.taken).length;
  const progressPercent = Math.round((completedCount / (reminders.length || 1)) * 100);

  const getRemTitle = (rem: typeof reminders[0]) => {
    if (lang === 'as') return rem.titleAs;
    if (lang === 'hi') return rem.titleHi || rem.title;
    return rem.title;
  };

  return (
    <div className="space-y-8 text-white">
      {/* Header Banner - Frosted Glass with Purple/Blue Theme */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/14 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold mb-3 shadow-inner">
            <Clock size={14} className="text-[#c084fc]" />
            <span>Daily Schedule & Medication Adherence</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {lang === 'as'
              ? 'দৈনিক সময়সূচী আৰু ঔষধ সোঁৱৰণী'
              : lang === 'hi'
              ? 'दैनिक समय-सारणी और दवा अनुसूची'
              : 'Daily Routine & Pill Reminders'}
          </h1>
          <p className="text-sm sm:text-base text-sky-200/80 leading-relaxed max-w-2xl mt-1.5">
            {lang === 'as'
              ? 'সময়মতে ঔষধ খাওক, পানী খাওক আৰু শাৰীৰিক ব্যায়ামৰ নিয়ম মানি চলক।'
              : lang === 'hi'
              ? 'समय पर दवा लें, पर्याप्त पानी पिएं और हल्की सैर का नियम बनाए रखें।'
              : 'Clear, high-contrast dark frosted reminders with audio prompts for medicines, meals, and hydration.'}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <VoiceNarratorButton
            textToRead={
              lang === 'as'
                ? `আজিৰ ${reminders.length} টা সোঁৱৰণীৰ ভিতৰত ${completedCount} টা সম্পূৰ্ণ হৈছে।`
                : lang === 'hi'
                ? `आज के ${reminders.length} में से ${completedCount} कार्य पूरे हो चुके हैं।`
                : `You have completed ${completedCount} out of ${reminders.length} daily reminders today.`
            }
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg font-bold"
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white rounded-2xl font-black text-sm shadow-lg shadow-purple-600/35 cursor-pointer transition-all active:scale-95 border border-purple-400/30"
          >
            <Plus size={18} />
            <span>{getTranslation('actionAdd', lang)}</span>
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats - Dark Frosted Glass Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Adherence Card */}
        <div className="glass-card-dark p-6 rounded-3xl border border-white/12 hover:border-purple-500/40 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-sky-200/70 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <CalendarCheck size={16} className="text-[#c084fc]" />
              <span>
                {lang === 'as'
                  ? 'ঔষধ পালনৰ হাৰ'
                  : lang === 'hi'
                  ? 'आज का दवा अनुपालन'
                  : "Today's Adherence"}
              </span>
            </span>
            <span className="text-[#c084fc] font-mono text-base font-extrabold">{progressPercent}%</span>
          </div>

          {/* Glowing Purple/Cyan Progress Bar */}
          <div className="w-full h-3.5 bg-[#0a1224] rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#38bdf8] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-sky-200/70">
            <span>{completedCount} of {reminders.length} tasks completed today</span>
            <span className="text-purple-300 font-semibold">{reminders.length - completedCount} left</span>
          </div>
        </div>

        {/* Hydration Tracker */}
        <div className="glass-card-dark p-6 rounded-3xl border border-white/12 hover:border-sky-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-200/70 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets size={16} className="text-sky-400" />
              <span>{getTranslation('waterTracker', lang)}</span>
            </span>
            <span className="text-xs font-bold text-sky-300 font-mono">
              {waterGlasses} / 8 Glasses
            </span>
          </div>

          <div className="grid grid-cols-8 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(g => (
              <button
                key={g}
                onClick={addWaterGlass}
                className={`h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                  g <= waterGlasses
                    ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30 border border-sky-300/40 scale-105'
                    : 'bg-white/5 text-sky-300/40 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <p className="text-xs text-sky-200/60 flex items-center gap-1.5">
            <Sparkles size={12} className="text-sky-400" />
            <span>{getTranslation('waterGoal', lang)}</span>
          </p>
        </div>

        {/* Courtyard Walk Tracker */}
        <div className="glass-card-dark p-6 rounded-3xl border border-white/12 hover:border-purple-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-200/70 uppercase tracking-wider flex items-center gap-1.5">
              <Footprints size={16} className="text-[#c084fc]" />
              <span>{getTranslation('walkTracker', lang)}</span>
            </span>
            <span className={`text-xs font-bold ${walkDone ? 'text-purple-300' : 'text-amber-400'}`}>
              {walkDone ? 'Completed' : 'Pending'}
            </span>
          </div>

          <button
            onClick={() => setWalkDone(!walkDone)}
            className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer active:scale-98 ${
              walkDone
                ? 'bg-purple-950/40 border-purple-400/40 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-white/5 border-white/15 text-stone-300 hover:bg-white/10'
            }`}
          >
            {walkDone ? <CheckCircle2 size={16} className="text-[#c084fc]" /> : <Circle size={16} />}
            <span>
              {walkDone
                ? (lang === 'as' ? '২০ মিনিট খোজ কঢ়া সম্পূৰ্ণ' : lang === 'hi' ? '20 मिनट टहलना पूरा हुआ' : '20 Mins Walk Done')
                : (lang === 'as' ? '২০ মিনিট খোজ কঢ়া সম্পূৰ্ণ বুলি চিহ্নিত কৰক' : lang === 'hi' ? '20 मिनट टहलना पूरा मार्क करें' : 'Mark 20 Mins Walk Done')}
            </span>
          </button>

          <p className="text-xs text-sky-200/60">
            {getTranslation('walkGoal', lang)}
          </p>
        </div>
      </div>

      {/* Reminders List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-xl text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[#c084fc]">
              <Pill size={18} />
            </div>
            <span>
              {lang === 'as'
                ? 'আজিৰ ঔষধ আৰু কাৰ্যসূচী'
                : lang === 'hi'
                ? 'आज की दवाइयां और समय-सारणी'
                : "Today's Schedule & Medications"}
            </span>
          </h3>

          <span className="text-xs font-mono font-bold text-sky-200/60 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            {reminders.length} Scheduled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reminders.map(rem => {
            const isTaken = rem.taken;
            const remTitle = getRemTitle(rem);
            return (
              <div
                key={rem.id}
                className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between gap-5 relative overflow-hidden ${
                  isTaken
                    ? 'glass-card-dark bg-[#0f172a]/60 border-white/8 opacity-75'
                    : 'glass-card-dark border-white/14 hover:border-purple-400/50 hover:shadow-[0_12px_36px_rgba(0,0,0,0.4),0_0_20px_rgba(168,85,247,0.18)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                        isTaken
                          ? 'bg-white/5 border-white/10 text-stone-400'
                          : 'bg-purple-500/20 border-purple-400/30 text-[#c084fc] shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                      }`}
                    >
                      {rem.type === 'medicine' ? <Pill size={24} /> : <Clock size={24} />}
                    </div>

                    <div>
                      <h4
                        className={`text-lg font-extrabold ${
                          isTaken
                            ? 'line-through text-stone-400'
                            : 'text-white'
                        }`}
                      >
                        {remTitle}
                      </h4>
                      {rem.dose && (
                        <p className="text-xs font-bold text-sky-200/70 mt-0.5">
                          {rem.dose} • <span className="text-purple-300">{rem.notes}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <VoiceNarratorButton
                    textToRead={
                      lang === 'as'
                        ? `${rem.titleAs}. সময় ${rem.time}. ${rem.dose || ''}`
                        : lang === 'hi'
                        ? `${rem.titleHi || rem.title}. समय ${rem.time}. ${rem.dose || ''}`
                        : `${rem.title}. At ${rem.time}. ${rem.dose || ''}`
                    }
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md"
                  />
                </div>

                <div className="flex items-center justify-between pt-3.5 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-200/80">
                    {getTimeIcon(rem.time)}
                    <span className="font-mono">{rem.time}</span>
                  </div>

                  <button
                    onClick={() => toggleReminderTaken(rem.id)}
                    className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95 border ${
                      isTaken
                        ? 'bg-purple-950/50 hover:bg-purple-900/60 text-purple-200 border-purple-400/30 shadow-xs'
                        : 'bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white border-purple-400/30 shadow-lg shadow-purple-600/30'
                    }`}
                  >
                    {isTaken ? (
                      <>
                        <CheckCircle2 size={16} className="text-[#c084fc]" />
                        <span>
                          {lang === 'as'
                            ? 'খোৱা হ’ল (Taken)'
                            : lang === 'hi'
                            ? 'ले ली गई (Taken)'
                            : 'Taken'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Circle size={16} />
                        <span>
                          {lang === 'as'
                            ? 'খোৱা বুলি চিহ্নিত কৰক'
                            : lang === 'hi'
                            ? 'दवा ली मार्क करें'
                            : 'Mark as Taken'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Reminder Modal - Frosted Dark Glass */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#070d1a]/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setShowAddModal(false)}
          />
          <div className="glass-card-frosted bg-[#0f192d]/95 rounded-3xl border border-purple-500/30 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-6 relative z-10 animate-in zoom-in-95 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <BellRing size={20} className="text-[#c084fc]" />
                <span>
                  {lang === 'as'
                    ? 'নতুন সোঁৱৰণী যোগ কৰক'
                    : lang === 'hi'
                    ? 'नया रिमाइंडर जोड़ें'
                    : 'Add Daily Reminder'}
                </span>
              </h3>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-sky-200/80 uppercase mb-1.5">
                  {lang === 'as'
                    ? 'ঔষধ বা কাৰ্যৰ নাম'
                    : lang === 'hi'
                    ? 'दवा या कार्य का नाम'
                    : 'Medication / Task Name'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Telmisartan 40mg or Afternoon Tea"
                  className="w-full p-3 rounded-2xl border border-white/15 bg-white/10 text-white placeholder-sky-200/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7] backdrop-blur-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-sky-200/80 uppercase mb-1.5">
                    {lang === 'as' ? 'সময়' : lang === 'hi' ? 'समय' : 'Scheduled Time'}
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    placeholder="08:00 AM"
                    className="w-full p-3 rounded-2xl border border-white/15 bg-white/10 text-white placeholder-sky-200/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7] backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-sky-200/80 uppercase mb-1.5">
                    {lang === 'as' ? 'মাত্ৰা' : lang === 'hi' ? 'मात्रा' : 'Dose (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={dose}
                    onChange={e => setDose(e.target.value)}
                    placeholder="1 tablet"
                    className="w-full p-3 rounded-2xl border border-white/15 bg-white/10 text-white placeholder-sky-200/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7] backdrop-blur-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-200/80 uppercase mb-1.5">
                  {lang === 'as' ? 'খোৱাৰ নিয়ম' : lang === 'hi' ? 'लेने का समय / निर्देश' : 'Meal Timing / Note'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="After Food (भोजन के बाद)"
                  className="w-full p-3 rounded-2xl border border-white/15 bg-white/10 text-white placeholder-sky-200/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7] backdrop-blur-md"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-stone-300 cursor-pointer border border-white/10 transition-all"
                >
                  {getTranslation('actionCancel', lang)}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white cursor-pointer shadow-lg shadow-purple-600/30 border border-purple-400/30 transition-all active:scale-95"
                >
                  {getTranslation('actionSave', lang)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
