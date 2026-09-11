import React, { useState } from 'react';
import {
  HeartHandshake,
  Users,
  Search,
  Plus,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  PhoneCall,
  Activity,
  Sparkles,
  WifiOff,
  UserCheck,
  ArrowUpRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../lib/i18n';
import { AshaPatientRecord } from '../../types';
import { VoiceNarratorButton } from '../common/VoiceNarratorButton';
import { maskPhoneNumber } from '../../lib/utils';

interface AshaDashboardProps {
  onStartScreening?: (patientId: string) => void;
}

export const AshaDashboard: React.FC<AshaDashboardProps> = ({ onStartScreening }) => {
  const { settings, ashaPatients, updateAshaPatient, addAshaPatient } = useApp();
  const lang = settings.language;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'stable' | 'watch' | 'review'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatientForVisit, setSelectedPatientForVisit] = useState<AshaPatientRecord | null>(null);
  const [visitNotes, setVisitNotes] = useState('');

  // New patient state
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState(70);
  const [newVillage, setNewVillage] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const filteredPatients = ashaPatients.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || p.cognitiveStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleRecordVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientForVisit) return;

    updateAshaPatient(selectedPatientForVisit.id, {
      lastVisitDate: 'Today',
      cognitiveStatus: 'stable',
      notes: visitNotes || 'Home visit conducted. Routine medicines checked.',
    });

    setSelectedPatientForVisit(null);
    setVisitNotes('');
  };

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newVillage.trim()) return;

    addAshaPatient({
      name: newName,
      nameAs: newName,
      age: newAge,
      gender: 'M',
      village: newVillage,
      villageAs: newVillage,
      lastVisitDate: 'Never',
      cognitiveStatus: 'stable',
      adherenceRate: 85,
      notes: 'Initial registration by ASHA Minoti Das.',
      notesAs: 'প্ৰাথমিক পঞ্জীয়ন সম্পন্ন।',
      phone: newPhone || '+91 94350 00000',
      caregiverName: 'Family Member',
      caregiverPhone: '+91 94350 11111',
      medicationStockDays: 14,
      nextScheduledVisit: 'Next Week',
    });

    setNewName('');
    setNewVillage('');
    setNewPhone('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-white">
      {/* Frosted Glass Header Banner - Purple & Blue Theme */}
      <div className="glass-panel p-6 sm:p-9 rounded-[2.5rem] border border-white/14 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
        {/* Ambient banner glows */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/30 text-xs font-bold mb-3 shadow-inner">
            <HeartHandshake size={15} className="text-[#c084fc]" />
            <span>Community Health Worker Portal • ASHA Minoti Das</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {lang === 'as'
              ? 'তিতাবৰ ব্লক গাঁও ৰষ্টাৰ (ASHA)'
              : lang === 'hi'
              ? 'तीताबर ब्लॉक ग्रामीण रोस्टर (आशा फील्ड पोर्टल)'
              : 'Titabor Block Village Roster'}
          </h1>

          <p className="text-sm sm:text-base text-sky-200/80 mt-2 leading-relaxed font-medium">
            {lang === 'as'
              ? 'গাঁওসমূহত জ্যেষ্ঠ নাগৰিকসকলৰ গৃহ পৰিদৰ্শন, ঔষধ পৰীক্ষা আৰু প্ৰাথমিক স্ক্ৰীনিং পৰিচালনা কৰক।'
              : lang === 'hi'
              ? 'ग्रामीण क्षेत्र में वरिष्ठ नागरिकों की घर-घर जांच, दवा स्टॉक सत्यापन और संज्ञानात्मक स्क्रीनिंग।'
              : 'Empowering frontline healthcare workers with offline field screening, home visit logs, and elder rosters.'}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <VoiceNarratorButton
            textToRead={
              lang === 'as'
                ? 'আশা কৰ্মী ফিল্ড পৰ্টেল। তিতাবৰ অঞ্চলৰ ৩ জন জ্যেষ্ঠ নাগৰিকৰ তালিকা আৰু গৃহ পৰিদৰ্শন লিপি চাওক।'
                : lang === 'hi'
                ? 'आशा फील्ड पोर्टल। तीताबर क्षेत्र के वरिष्ठ नागरिकों की सूची, घर-घर भेंट और त्वरित स्क्रीनिंग उपलब्ध है।'
                : 'ASHA frontline portal. Manage your elder cohort, record home visits, and conduct rapid field screenings.'
            }
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg font-bold"
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white rounded-2xl font-black text-sm shadow-xl shadow-purple-600/35 cursor-pointer transition-all active:scale-95 border border-purple-400/30"
          >
            <Plus size={18} className="stroke-[3]" />
            <span>
              {lang === 'as'
                ? 'নতুন জ্যেষ্ঠ পঞ্জীয়ন'
                : lang === 'hi'
                ? 'नया बुजुर्ग पंजीकृत करें'
                : 'Register Elder'}
            </span>
          </button>
        </div>
      </div>

      {/* Frosted Glass Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="glass-card-dark p-6 rounded-[2rem] border border-white/12 hover:border-purple-500/40 space-y-4 relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-200/70 uppercase tracking-wider">
              Total Village Cohort
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-[#c084fc] flex items-center justify-center font-bold border border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white tracking-tight">
              {ashaPatients.length}
            </span>
            <span className="text-xs font-bold text-sky-200/60">Elders Enrolled</span>
          </div>
          <p className="text-xs text-sky-200/60 font-medium">Across Titabor, Borhola & Meleng villages</p>
        </div>

        {/* Card 2 */}
        <div className="glass-card-dark p-6 rounded-[2rem] border border-white/12 hover:border-purple-500/40 space-y-4 relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-200/70 uppercase tracking-wider">
              Requires Follow-up
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold border border-amber-400/30 shadow-xs">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-300 tracking-tight">
              {ashaPatients.filter(p => p.cognitiveStatus === 'watch' || p.cognitiveStatus === 'review').length}
            </span>
            <span className="text-xs font-extrabold text-amber-200 bg-amber-500/20 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
              Review Signal
            </span>
          </div>
          <p className="text-xs text-sky-200/60 font-medium">Scheduled for doorstep check-in this week</p>
        </div>

        {/* Card 3 */}
        <div className="glass-card-dark p-6 rounded-[2rem] border border-white/12 hover:border-purple-500/40 space-y-4 relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-200/70 uppercase tracking-wider">
              Average Adherence Rate
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold border border-indigo-400/30 shadow-[0_0_12px_rgba(99,102,241,0.3)]">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-purple-300 tracking-tight">88.5%</span>
            <span className="text-xs font-extrabold text-purple-200 bg-purple-500/20 border border-purple-400/40 px-2.5 py-0.5 rounded-full">
              High Compliance
            </span>
          </div>
          <p className="text-xs text-sky-200/60 font-medium">Daily pill adherence across enrolled households</p>
        </div>
      </div>

      {/* Frosted Glass Filter & Search Bar */}
      <div className="glass-card-dark p-4 rounded-[2rem] border border-white/12 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'as'
                ? 'নাম বা গাঁও বিচাৰক (যেনে: বিপিন, তিতাবৰ)...'
                : lang === 'hi'
                ? 'बुजुर्ग का नाम या गांव खोजें (जैसे: बिपिन, तीताबर)...'
                : 'Search elder by name or village (e.g. Bipin, Titabor)...'
            }
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-sm text-white placeholder-sky-200/40 focus:outline-none focus:ring-2 focus:ring-[#a855f7] backdrop-blur-md transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'stable', 'watch', 'review'] as const).map(f => {
            const isSelected = filterStatus === f;
            return (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold capitalize transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] text-white border-purple-400/40 shadow-lg shadow-purple-600/30'
                    : 'bg-white/5 text-stone-300 hover:bg-white/10 border-white/10 hover:text-white'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Elder Cards Roster with Frosted Glass & Hover Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map(patient => {
          const isReview = patient.cognitiveStatus === 'watch' || patient.cognitiveStatus === 'review';
          return (
            <div
              key={patient.id}
              className={`glass-card-dark p-6 rounded-[2rem] border space-y-4 flex flex-col justify-between group relative overflow-hidden ${
                isReview
                  ? 'border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                  : 'border-white/12 hover:border-purple-400/50'
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-[#c084fc] transition-colors">
                      {lang === 'as' ? patient.nameAs : lang === 'hi' ? (patient.nameHi || patient.name) : patient.name}
                    </h3>
                    <p className="text-xs text-sky-200/70 font-medium flex items-center gap-1.5 mt-1">
                      <MapPin size={14} className="text-[#c084fc]" />
                      {lang === 'as' ? patient.villageAs : lang === 'hi' ? (patient.villageHi || patient.village) : patient.village} • {patient.age}{' '}
                      {lang === 'as' ? 'বছৰ' : lang === 'hi' ? 'वर्ष' : 'yrs'}
                    </p>
                  </div>

                  <span
                    className={`text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-xs border ${
                      isReview
                        ? 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                        : 'bg-purple-500/20 text-purple-200 border-purple-400/40'
                    }`}
                  >
                    {patient.cognitiveStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-sky-200/60 font-medium block text-[11px]">Stock Remaining</span>
                    <span className="font-extrabold text-white text-sm">
                      {patient.medicationStockDays} Days
                    </span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-sky-200/60 font-medium block text-[11px]">Med Adherence</span>
                    <span className="font-extrabold text-purple-300 text-sm">{patient.adherenceRate}%</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-sky-100/90 leading-relaxed font-medium">
                  <span className="font-extrabold block text-purple-300 mb-0.5">
                    {lang === 'as' ? 'আশা টোকা:' : lang === 'hi' ? 'आशा कार्यकर्ता नोट:' : 'ASHA Note:'}
                  </span>
                  {lang === 'as' ? patient.notesAs : lang === 'hi' ? (patient.notesHi || patient.notes) : patient.notes}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3.5 border-t border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-sky-200/60 pb-1">
                  <span className="font-medium">
                    {lang === 'as'
                      ? `অন্তিম সাক্ষাৎ: ${patient.lastVisitDate}`
                      : lang === 'hi'
                      ? `अंतिम भेंट: ${patient.lastVisitDate}`
                      : `Last Visit: ${patient.lastVisitDate}`}
                  </span>
                  <a
                    href={`tel:${patient.phone}`}
                    className="text-[#c084fc] font-black flex items-center gap-1 hover:text-purple-200 transition-colors"
                  >
                    <PhoneCall size={12} /> {lang === 'hi' ? 'कॉल' : lang === 'as' ? 'কল' : 'Call'} ({maskPhoneNumber(patient.phone)})
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedPatientForVisit(patient)}
                    className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/15 cursor-pointer transition-all shadow-xs"
                  >
                    {lang === 'as' ? 'সাক্ষাৎ লিপি' : lang === 'hi' ? 'भेंट दर्ज करें' : 'Log Visit'}
                  </button>

                  <button
                    onClick={() => onStartScreening && onStartScreening(patient.id)}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white font-extrabold text-xs cursor-pointer shadow-lg shadow-purple-600/30 transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-purple-400/30"
                  >
                    <span>{lang === 'as' ? 'স্ক্ৰীনিং খেল' : lang === 'hi' ? 'स्क्रीनिंग टेस्ट' : 'Screen Game'}</span>
                    <ArrowUpRight size={14} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Visit Modal */}
      {selectedPatientForVisit && (
        <div className="fixed inset-0 z-50 bg-[#070d1a]/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedPatientForVisit(null)}
          />
          <div className="glass-card-frosted bg-[#0f192d]/95 rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl border border-purple-500/30 relative z-10 animate-in zoom-in-95 text-white">
            <h3 className="text-xl font-black text-white">
              Log Doorstep Visit: {selectedPatientForVisit.name}
            </h3>

            <form onSubmit={handleRecordVisit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-sky-200/80 uppercase tracking-wider mb-1.5">
                  Field Observations & Medicine Check
                </label>
                <textarea
                  value={visitNotes}
                  onChange={e => setVisitNotes(e.target.value)}
                  placeholder="e.g. Verified blister pack intake, checked blood pressure, elder is cheerful..."
                  rows={4}
                  className="w-full p-3.5 rounded-2xl border border-white/15 bg-white/10 text-white placeholder-sky-200/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7] backdrop-blur-md"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedPatientForVisit(null)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-stone-300 cursor-pointer border border-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white shadow-lg shadow-purple-600/30 border border-purple-400/30 cursor-pointer transition-all active:scale-95"
                >
                  Save & Sync Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Elder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#070d1a]/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setShowAddModal(false)}
          />
          <div className="glass-card-frosted bg-[#0f192d]/95 rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl border border-purple-500/30 relative z-10 animate-in zoom-in-95 text-white">
            <h3 className="text-xl font-black text-white">
              Register New Village Elder
            </h3>

            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-sky-200/80 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Tarun Saikia"
                  className="w-full p-3.5 rounded-2xl border border-white/15 bg-white/10 text-white placeholder-sky-200/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7] backdrop-blur-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-sky-200/80 uppercase tracking-wider mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={e => setNewAge(Number(e.target.value))}
                    className="w-full p-3.5 rounded-2xl border border-white/15 bg-white/10 text-white placeholder-sky-200/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7] backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-sky-200/80 uppercase tracking-wider mb-1.5">
                    Village / Block
                  </label>
                  <input
                    type="text"
                    required
                    value={newVillage}
                    onChange={e => setNewVillage(e.target.value)}
                    placeholder="Titabor / Borhola"
                    className="w-full p-3.5 rounded-2xl border border-white/15 bg-white/10 text-white placeholder-sky-200/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7] backdrop-blur-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-sky-200/80 uppercase tracking-wider mb-1.5">
                  Family Contact Number
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="+91 94350 xxxxx"
                  className="w-full p-3.5 rounded-2xl border border-white/15 bg-white/10 text-white placeholder-sky-200/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7] backdrop-blur-md"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-stone-300 cursor-pointer border border-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white shadow-lg shadow-purple-600/30 border border-purple-400/30 cursor-pointer transition-all active:scale-95"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
