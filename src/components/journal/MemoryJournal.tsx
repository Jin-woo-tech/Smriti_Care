import React, { useState } from 'react';
import {
  Heart,
  Plus,
  Volume2,
  Calendar,
  Sparkles,
  Smile,
  Meh,
  Frown,
  Coffee,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../lib/i18n';
import { VoiceNarratorButton } from '../common/VoiceNarratorButton';

export const MemoryJournal: React.FC = () => {
  const { settings, photos, journal, addJournalEntry } = useApp();
  const lang = settings.language;

  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [newNote, setNewNote] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<'happy' | 'peaceful' | 'nostalgic' | 'tired' | 'confused'>('peaceful');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const activePhoto = photos[activePhotoIdx] || photos[0];
  const isRevealed = revealedIds.includes(activePhoto?.id);

  const toggleReveal = (id: string) => {
    if (!revealedIds.includes(id)) {
      setRevealedIds(prev => [...prev, id]);
    }
  };

  const handleSaveNote = () => {
    if (!newNote.trim()) return;
    addJournalEntry({
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: selectedMood,
      text: newNote,
      textAs: newNote,
    });
    setNewNote('');
    setShowAddForm(false);
  };

  const moodIcons = {
    happy: '😊 Happy & Energetic',
    peaceful: '🕊️ Peaceful & Calm',
    nostalgic: '🍂 Nostalgic & Fond',
    tired: '😴 A bit Tired',
    confused: '💭 Thoughtful / Resting',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-sky-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-teal-900/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-teal-100 text-xs font-bold mb-2 backdrop-blur-xs">
            <Heart size={14} className="text-teal-200" />
            <span>Family Photo & Nostalgia Therapy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {lang === 'as'
              ? 'পৰিয়াল আৰু স্মৃতি এলবাম'
              : lang === 'hi'
              ? 'पारिवारिक स्मृति एल्बम एवं कहानियां'
              : 'Family Album & Memory Reflections'}
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed max-w-2xl mt-1">
            {lang === 'as'
              ? 'চিনাকি মুখ, পুৰণি তিথি-উৎসৱ আৰু সোণোৱালী স্মৃতিসমূহ পুনৰ উপভোগ কৰক।'
              : lang === 'hi'
              ? 'अपनों के चेहरे, पुराने त्योहार और सुनहरी यादों को याद करके मन प्रसन्न रखें।'
              : 'Reminisce through family milestones, tea gardens, and festivals with voice memory narrations.'}
          </p>
        </div>

        <VoiceNarratorButton
          textToRead={
            lang === 'as'
              ? 'পৰিয়াল আৰু স্মৃতি এলবাম। আপোনাৰ প্ৰিয়জনৰ ফটো আৰু স্মৃতিৰ কাহিনী শুনক।'
              : lang === 'hi'
              ? 'पारिवारिक स्मृति एल्बम। अपनी पारिवारिक तस्वीरों और कहानियों को सुनकर पुरानी यादें ताजा करें।'
              : 'Family Album and Memory Reflections. Relive precious memories and listen to family stories.'
          }
          size="lg"
          className="bg-white text-teal-950 border-0 shadow-md font-bold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Photo Recognition Exercise */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm shadow-sky-900/5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900">
                {lang === 'as'
                  ? 'স্মৃতি ফটো পৰীক্ষা (Memory Cue)'
                  : lang === 'hi'
                  ? 'यह फोटो किसकी है? (स्मृति स्मरण)'
                  : 'Who is in this photo?'}
              </h3>
              <span className="text-xs font-mono font-bold text-slate-400">
                {activePhotoIdx + 1} of {photos.length}
              </span>
            </div>

            {/* Photo Card */}
            <div className="relative rounded-2xl overflow-hidden bg-sky-50 border border-sky-200 shadow-md h-72 sm:h-80">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-xs text-white rounded-full text-xs font-bold">
                {activePhoto.year}
              </div>
            </div>

            {/* Reveal Interaction */}
            {!isRevealed ? (
              <div className="text-center p-6 bg-sky-50/70 border-2 border-dashed border-sky-300 rounded-2xl space-y-3">
                <p className="text-sm font-bold text-sky-950">
                  {lang === 'as'
                    ? 'ফটোখন চিনাকি লাগিছে নে? মনত পেলাই চাওকচোন!'
                    : lang === 'hi'
                    ? 'क्या आप इस तस्वीर या अवसर को पहचान पा रहे हैं? याद करने का प्रयास करें!'
                    : 'Take a moment to recall this moment or person.'}
                </p>
                <button
                  onClick={() => toggleReveal(activePhoto.id)}
                  className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm shadow-md cursor-pointer transition-all active:scale-95"
                >
                  {lang === 'as'
                    ? 'স্মৃতি কাহিনী শুনক'
                    : lang === 'hi'
                    ? 'पारिवारिक कहानी व विवरण देखें'
                    : 'Reveal Family Story & Details'}
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-teal-50 border-2 border-teal-500 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-lg text-teal-950">
                      {lang === 'as'
                        ? activePhoto.titleAs
                        : lang === 'hi'
                        ? (activePhoto.titleHi || activePhoto.title)
                        : activePhoto.title}
                    </h4>
                    <p className="text-xs font-bold text-teal-700">
                      {lang === 'as'
                        ? activePhoto.relationAs
                        : lang === 'hi'
                        ? (activePhoto.relationHi || activePhoto.relation)
                        : activePhoto.relation}
                    </p>
                  </div>

                  <VoiceNarratorButton
                    textToRead={
                      lang === 'as'
                        ? `${activePhoto.titleAs}. ${activePhoto.voiceNoteTextAs || activePhoto.descriptionAs}`
                        : lang === 'hi'
                        ? `${activePhoto.titleHi || activePhoto.title}. ${activePhoto.voiceNoteTextHi || activePhoto.descriptionHi || activePhoto.description}`
                        : `${activePhoto.title}. ${activePhoto.voiceNoteText || activePhoto.description}`
                    }
                    size="md"
                  />
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {lang === 'as'
                    ? activePhoto.descriptionAs
                    : lang === 'hi'
                    ? (activePhoto.descriptionHi || activePhoto.description)
                    : activePhoto.description}
                </p>
              </div>
            )}

            {/* Thumbnails Navigator */}
            <div className="flex gap-3 overflow-x-auto pt-2">
              {photos.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activePhotoIdx === idx
                      ? 'border-teal-600 ring-2 ring-teal-400'
                      : 'border-sky-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Daily Mood Log & Journal Reflections */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm shadow-sky-900/5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900">
                {lang === 'as'
                  ? 'দৈনিক অনুভৱ আৰু টোকা'
                  : lang === 'hi'
                  ? 'दैनिक मनोभाव एवं डायरी'
                  : 'Daily Feelings & Notes'}
              </h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-xl border border-sky-200 cursor-pointer"
              >
                <Plus size={14} />
                <span>
                  {lang === 'as' ? 'লিখক' : lang === 'hi' ? 'नोट लिखें' : 'Write Note'}
                </span>
              </button>
            </div>

            {/* Add Entry Form */}
            {showAddForm && (
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-3 animate-in fade-in">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  {lang === 'as'
                    ? 'আজি আপোনাৰ মন কেনে?'
                    : lang === 'hi'
                    ? 'आज आप कैसा महसूस कर रहे हैं?'
                    : 'How are you feeling today?'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['peaceful', 'happy', 'nostalgic', 'tired'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setSelectedMood(m)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer truncate ${
                        selectedMood === m
                          ? 'border-teal-600 bg-teal-50 text-teal-900'
                          : 'border-sky-200 bg-white text-slate-700'
                      }`}
                    >
                      {moodIcons[m]}
                    </button>
                  ))}
                </div>

                <textarea
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder={
                    lang === 'as'
                      ? 'আজিৰ কোনো ভাল লগা মুহূৰ্ত বা কথা লিখক...'
                      : lang === 'hi'
                      ? 'आज के दिन के बारे में कोई सुखद विचार या बात लिखें...'
                      : 'Write a few words about your day, breakfast, or memories...'
                  }
                  rows={3}
                  className="w-full p-3 rounded-xl border border-sky-200 bg-white text-sm focus:outline-teal-600"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 cursor-pointer"
                  >
                    {getTranslation('actionCancel', lang)}
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white cursor-pointer"
                  >
                    {getTranslation('actionSave', lang)}
                  </button>
                </div>
              </div>
            )}

            {/* Journal Entries List */}
            <div className="space-y-3">
              {journal.map(entry => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-teal-700 flex items-center gap-1">
                      <Calendar size={13} /> {entry.date}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200">
                      {moodIcons[entry.mood]}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {lang === 'as' ? entry.textAs || entry.text : lang === 'hi' ? (entry.textHi || entry.text) : entry.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
