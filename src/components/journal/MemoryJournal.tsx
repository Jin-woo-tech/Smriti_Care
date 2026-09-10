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
  CheckCircle2,
  Image as ImageIcon,
  BookOpen
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
    <div className="space-y-8 text-white">
      {/* Header Banner - Dark Frosted Glass with Purple / Indigo Ambient Glow */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/14 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
        {/* Ambient glow orbs */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold mb-3 shadow-inner">
            <Heart size={14} className="text-[#c084fc]" />
            <span>Family Photo & Reminiscence Therapy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {lang === 'as'
              ? 'পৰিয়াল আৰু স্মৃতি এলবাম'
              : lang === 'hi'
              ? 'पारिवारिक स्मृति एल्बम एवं कहानियां'
              : 'Family Album & Memory Reflections'}
          </h1>
          <p className="text-sm sm:text-base text-sky-200/80 leading-relaxed max-w-2xl mt-1.5">
            {lang === 'as'
              ? 'চিনাকি মুখ, পুৰণি তিথি-উৎসৱ আৰু সোণোৱালী স্মৃতিসমূহ পুনৰ উপভোগ কৰক।'
              : lang === 'hi'
              ? 'अपनों के चेहरे, पुराने त्योहार और सुनहरी यादों को याद करके मन प्रसन्न रखें।'
              : 'Reminisce through family milestones, tea gardens, and festivals with voice memory narrations.'}
          </p>
        </div>

        <div className="relative z-10">
          <VoiceNarratorButton
            textToRead={
              lang === 'as'
                ? 'পৰিয়াল আৰু স্মৃতি এলবাম। আপোনাৰ প্ৰিয়জনৰ ফটো আৰু স্মৃতিৰ কাহিনী শুনক।'
                : lang === 'hi'
                ? 'पारिवारिक स्मृति एल्बम। अपनी पारिवारिक तस्वीरों और कहानियों को सुनकर पुरानी यादें ताजा करें।'
                : 'Family Album and Memory Reflections. Relive precious memories and listen to family stories.'
            }
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Photo Recognition Exercise */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card-dark rounded-3xl border border-white/12 p-6 sm:p-7 shadow-2xl hover:border-purple-500/40 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
                <ImageIcon size={20} className="text-[#c084fc]" />
                <span>
                  {lang === 'as'
                    ? 'স্মৃতি ফটো পৰীক্ষা (Memory Cue)'
                    : lang === 'hi'
                    ? 'यह फोटो किसकी है? (स्मृति स्मरण)'
                    : 'Who is in this photo?'}
                </span>
              </h3>
              <span className="text-xs font-mono font-bold text-purple-300 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30">
                {activePhotoIdx + 1} of {photos.length}
              </span>
            </div>

            {/* Photo Card with Frosted Specular Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-[#070d1a] border border-white/15 shadow-xl h-72 sm:h-84 group">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1329]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 px-3.5 py-1 bg-black/60 backdrop-blur-md text-white rounded-full text-xs font-bold border border-white/20 shadow-md">
                🗓️ {activePhoto.year}
              </div>
            </div>

            {/* Reveal Interaction */}
            {!isRevealed ? (
              <div className="text-center p-6 sm:p-7 bg-purple-950/20 border-2 border-dashed border-purple-400/30 rounded-2xl space-y-3.5 backdrop-blur-md">
                <p className="text-sm font-bold text-sky-200">
                  {lang === 'as'
                    ? 'ফটোখন চিনাকি লাগিছে নে? মনত পেলাই চাওকচোন!'
                    : lang === 'hi'
                    ? 'क्या आप इस तस्वीर या अवसर को पहचान पा रहे हैं? याद करने का प्रयास करें!'
                    : 'Take a moment to recall this moment or person.'}
                </p>
                <button
                  onClick={() => toggleReveal(activePhoto.id)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white font-extrabold text-sm shadow-lg shadow-purple-600/35 cursor-pointer transition-all active:scale-95 border border-purple-400/30"
                >
                  {lang === 'as'
                    ? 'স্মৃতি কাহিনী শুনক'
                    : lang === 'hi'
                    ? 'पारिवारिक कहानी व विवरण देखें'
                    : 'Reveal Family Story & Details'}
                </button>
              </div>
            ) : (
              <div className="p-5 sm:p-6 rounded-2xl bg-purple-950/30 border border-purple-400/40 space-y-3.5 animate-in fade-in backdrop-blur-md shadow-lg shadow-purple-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-lg sm:text-xl text-white">
                      {lang === 'as'
                        ? activePhoto.titleAs
                        : lang === 'hi'
                        ? (activePhoto.titleHi || activePhoto.title)
                        : activePhoto.title}
                    </h4>
                    <p className="text-xs font-bold text-[#c084fc] mt-0.5">
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
                    className="bg-purple-500/20 hover:bg-purple-500/30 text-white border border-purple-400/30"
                  />
                </div>

                <p className="text-sm text-sky-100/90 leading-relaxed font-medium">
                  {lang === 'as'
                    ? activePhoto.descriptionAs
                    : lang === 'hi'
                    ? (activePhoto.descriptionHi || activePhoto.description)
                    : activePhoto.description}
                </p>
              </div>
            )}

            {/* Thumbnails Navigator */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-sky-200/60 uppercase tracking-wider">Select Photo:</span>
              <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                {photos.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`w-20 h-16 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activePhotoIdx === idx
                        ? 'border-[#a855f7] ring-4 ring-purple-500/40 scale-105 shadow-lg shadow-purple-500/30'
                        : 'border-white/15 opacity-60 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Mood Log & Journal Reflections */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card-dark rounded-3xl border border-white/12 p-6 sm:p-7 shadow-2xl hover:border-purple-500/40 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
                <BookOpen size={20} className="text-[#c084fc]" />
                <span>
                  {lang === 'as'
                    ? 'দৈনিক অনুভৱ আৰু টোকা'
                    : lang === 'hi'
                    ? 'दैनिक मनोभाव एवं डायरी'
                    : 'Daily Feelings & Notes'}
                </span>
              </h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 text-xs font-bold text-purple-200 hover:text-white bg-purple-500/20 hover:bg-purple-500/30 px-3.5 py-1.5 rounded-2xl border border-purple-400/30 cursor-pointer transition-all shadow-xs"
              >
                <Plus size={14} />
                <span>
                  {lang === 'as' ? 'লিখক' : lang === 'hi' ? 'नोट लिखें' : 'Write Note'}
                </span>
              </button>
            </div>

            {/* Add Entry Form - Dark Frosted Card */}
            {showAddForm && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0e172a]/80 border border-purple-500/30 space-y-3.5 animate-in fade-in backdrop-blur-xl">
                <label className="text-xs font-bold text-sky-200/80 uppercase tracking-wider block">
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
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer truncate ${
                        selectedMood === m
                          ? 'border-[#a855f7] bg-purple-500/25 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                          : 'border-white/10 bg-white/5 text-stone-300 hover:bg-white/10'
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
                  className="w-full p-3 rounded-2xl border border-white/15 bg-white/10 text-white placeholder-sky-200/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7] backdrop-blur-md"
                />

                <div className="flex justify-end gap-2.5">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-stone-300 cursor-pointer border border-white/10 transition-all"
                  >
                    {getTranslation('actionCancel', lang)}
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white cursor-pointer shadow-lg shadow-purple-600/30 border border-purple-400/30 transition-all"
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
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/8 border border-white/10 hover:border-purple-500/30 space-y-2 transition-all"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#c084fc] flex items-center gap-1.5">
                      <Calendar size={13} /> {entry.date}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-200 border border-purple-400/30">
                      {moodIcons[entry.mood]}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
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
