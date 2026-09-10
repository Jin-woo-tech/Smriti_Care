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
    if (timeStr.toLowerCase().includes('am')) return <Sun size={18} className="text-amber-500" />;
    if (timeStr.includes('01:') || timeStr.includes('02:') || timeStr.includes('03:'))
      return <Sun size={18} className="text-orange-500" />;
    return <Sunset size={18} className="text-indigo-500" />;
  };

  const completedCount = reminders.filter(r => r.taken).length;
  const progressPercent = Math.round((completedCount / (reminders.length || 1)) * 100);

  const getRemTitle = (rem: typeof reminders[0]) => {
    if (lang === 'as') return rem.titleAs;
    if (lang === 'hi') return rem.titleHi || rem.title;
    return rem.title;
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-sky-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-teal-900/10 flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-teal-100 text-xs font-bold mb-2 backdrop-blur-xs">
            <Clock size={14} className="text-teal-200" />
            <span>Daily Schedule & Adherence</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {lang === 'as'
              ? 'দৈনিক সময়সূচী আৰু ঔষধ সোঁৱৰণী'
              : lang === 'hi'
              ? 'दैनिक समय-सारणी और दवा अनुसूची'
              : 'Daily Routine & Pill Reminders'}
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed max-w-2xl mt-1">
            {lang === 'as'
              ? 'সময়মতে ঔষধ খাওক, পানী খাওক আৰু শাৰীৰিক ব্যায়ামৰ নিয়ম মানি চলক।'
              : lang === 'hi'
              ? 'समय पर दवा लें, पर्याप्त पानी पिएं और हल्की सैर का नियम बनाए रखें।'
              : 'Clear, high-contrast reminders with audio prompts for medicines, meals, and hydration.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <VoiceNarratorButton
            textToRead={
              lang === 'as'
                ? `আজিৰ ${reminders.length} টা সোঁৱৰণীৰ ভিতৰত ${completedCount} টা সম্পূৰ্ণ হৈছে।`
                : lang === 'hi'
                ? `आज के ${reminders.length} में से ${completedCount} कार्य पूरे हो चुके हैं।`
                : `You have completed ${completedCount} out of ${reminders.length} daily reminders today.`
            }
            size="lg"
            className="bg-white text-teal-950 border-0 shadow-md font-bold"
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-3.5 bg-sky-300 hover:bg-sky-200 text-slate-950 rounded-2xl font-black text-sm shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>{getTranslation('actionAdd', lang)}</span>
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Adherence Card */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm shadow-sky-900/5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>
              {lang === 'as'
                ? 'ঔষধ পালনৰ হাৰ'
                : lang === 'hi'
                ? 'आज का दवा अनुपालन'
                : "Today's Adherence"}
            </span>
            <span className="text-teal-700 font-mono text-base">{progressPercent}%</span>
          </div>
          <div className="w-full h-3.5 bg-sky-100 rounded-full overflow-hidden p-0.5 border border-sky-200">
            <div
              className="h-full bg-gradient-to-r from-teal-600 to-sky-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-600">
            {completedCount} of {reminders.length} tasks completed today.
          </p>
        </div>

        {/* Hydration Tracker */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm shadow-sky-900/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets size={16} className="text-sky-500" />
              <span>{getTranslation('waterTracker', lang)}</span>
            </span>
            <span className="text-xs font-bold text-sky-700">
              {waterGlasses} / 8 Glasses
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(g => (
              <button
                key={g}
                onClick={addWaterGlass}
                className={`flex-1 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                  g <= waterGlasses
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-sky-50 text-slate-400 border border-sky-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-600">
            {getTranslation('waterGoal', lang)}
          </p>
        </div>

        {/* Courtyard Walk Tracker */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm shadow-sky-900/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Footprints size={16} className="text-emerald-500" />
              <span>{getTranslation('walkTracker', lang)}</span>
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {walkDone ? 'Completed' : 'Pending'}
            </span>
          </div>
          <button
            onClick={() => setWalkDone(!walkDone)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              walkDone
                ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                : 'bg-sky-50 border-sky-200 text-slate-700'
            }`}
          >
            {walkDone ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Circle size={16} />}
            <span>
              {walkDone
                ? (lang === 'as' ? '২০ মিনিট খোজ কঢ়া সম্পূৰ্ণ' : lang === 'hi' ? '20 मिनट टहलना पूरा हुआ' : '20 Mins Walk Done')
                : (lang === 'as' ? '২০ মিনিট খোজ কঢ়া সম্পূৰ্ণ বুলি চিহ্নিত কৰক' : lang === 'hi' ? '20 मिनट टहलना पूरा मार्क करें' : 'Mark 20 Mins Walk Done')}
            </span>
          </button>
          <p className="text-xs text-slate-600">
            {getTranslation('walkGoal', lang)}
          </p>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-xl text-slate-900 flex items-center gap-2">
          <Pill size={22} className="text-teal-600" />
          <span>
            {lang === 'as'
              ? 'আজিৰ ঔষধ আৰু কাৰ্যসূচী'
              : lang === 'hi'
              ? 'आज की दवाइयां और समय-सारणी'
              : "Today's Schedule & Medications"}
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reminders.map(rem => {
            const isTaken = rem.taken;
            const remTitle = getRemTitle(rem);
            return (
              <div
                key={rem.id}
                className={`p-6 rounded-3xl border-2 transition-all shadow-sm flex flex-col justify-between gap-4 ${
                  isTaken
                    ? 'bg-slate-50 border-sky-100 opacity-85'
                    : 'bg-white border-sky-200 shadow-md shadow-sky-900/5 hover:border-teal-400 ring-1 ring-sky-300/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        isTaken
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-teal-100 text-teal-700'
                      }`}
                    >
                      {rem.type === 'medicine' ? <Pill size={24} /> : <Clock size={24} />}
                    </div>

                    <div>
                      <h4
                        className={`text-lg font-extrabold ${
                          isTaken
                            ? 'line-through text-slate-400'
                            : 'text-slate-900'
                        }`}
                      >
                        {remTitle}
                      </h4>
                      {rem.dose && (
                        <p className="text-xs font-bold text-slate-500">
                          {rem.dose} • {rem.notes}
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
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-sky-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    {getTimeIcon(rem.time)}
                    <span>{rem.time}</span>
                  </div>

                  <button
                    onClick={() => toggleReminderTaken(rem.id)}
                    className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95 ${
                      isTaken
                        ? 'bg-sky-100 text-sky-900 hover:bg-sky-200'
                        : 'bg-teal-700 hover:bg-teal-800 text-white shadow-md'
                    }`}
                  >
                    {isTaken ? (
                      <>
                        <CheckCircle2 size={16} className="text-emerald-600" />
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

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-sky-200 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-6 animate-in fade-in">
            <h3 className="text-xl font-extrabold text-slate-900">
              {lang === 'as'
                ? 'নতুন সোঁৱৰণী যোগ কৰক'
                : lang === 'hi'
                ? 'नया रिमाइंडर जोड़ें'
                : 'Add Daily Reminder'}
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
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
                  className="w-full p-3 rounded-xl border border-sky-200 bg-sky-50/50 text-sm focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {lang === 'as' ? 'সময়' : lang === 'hi' ? 'समय' : 'Scheduled Time'}
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    placeholder="08:00 AM"
                    className="w-full p-3 rounded-xl border border-sky-200 bg-sky-50/50 text-sm focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {lang === 'as' ? 'মাত্ৰা' : lang === 'hi' ? 'मात्रा' : 'Dose (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={dose}
                    onChange={e => setDose(e.target.value)}
                    placeholder="1 tablet"
                    className="w-full p-3 rounded-xl border border-sky-200 bg-sky-50/50 text-sm focus:outline-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {lang === 'as' ? 'খোৱাৰ নিয়ম' : lang === 'hi' ? 'लेने का समय / निर्देश' : 'Meal Timing / Note'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="After Food (भोजन के बाद)"
                  className="w-full p-3 rounded-xl border border-sky-200 bg-sky-50/50 text-sm focus:outline-teal-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  {getTranslation('actionCancel', lang)}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-teal-700 hover:bg-teal-800 text-white cursor-pointer shadow-md"
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
