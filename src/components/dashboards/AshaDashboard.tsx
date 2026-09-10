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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Frosted Glass Header Banner matching Image #12 style */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#123153]/95 via-[#184674]/90 to-[#0e2742]/95 border border-white/20 p-6 sm:p-9 shadow-2xl backdrop-blur-2xl">
        {/* Ambient banner glows */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-56 h-56 bg-[#c5f82a]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-cyan-200 border border-white/15 text-xs font-bold mb-3 backdrop-blur-md">
              <HeartHandshake size={15} className="text-[#c5f82a]" />
              <span>Community Health Worker Portal • ASHA Minoti Das</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {lang === 'as'
                ? 'তিতাবৰ ব্লক গাঁও ৰষ্টাৰ (ASHA)'
                : lang === 'hi'
                ? 'तीताबर ब्लॉक ग्रामीण रोस्टर (आशा फील्ड पोर्टल)'
                : 'Titabor Block Village Roster'}
            </h1>

            <p className="text-sm sm:text-base text-cyan-100/80 mt-2 leading-relaxed">
              {lang === 'as'
                ? 'গাঁওসমূহত জ্যেষ্ঠ নাগৰিকসকলৰ গৃহ পৰিদৰ্শন, ঔষধ পৰীক্ষা আৰু প্ৰাথমিক স্ক্ৰীনিং পৰিচালনা কৰক।'
                : lang === 'hi'
                ? 'ग्रामीण क्षेत्र में वरिष्ठ नागरिकों की घर-घर जांच, दवा स्टॉक सत्यापन और संज्ञानात्मक स्क्रीनिंग।'
                : 'Empowering frontline healthcare workers with offline field screening, home visit logs, and elder rosters.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <VoiceNarratorButton
              textToRead={
                lang === 'as'
                  ? 'আশা কৰ্মী ফিল্ড পৰ্টেল। তিতাবৰ অঞ্চলৰ ৩ জন জ্যেষ্ঠ নাগৰিকৰ তালিকা আৰু গৃহ পৰিদৰ্শন লিপি চাওক।'
                  : lang === 'hi'
                  ? 'आशा फील्ड पोर्टल। तीताबर क्षेत्र के वरिष्ठ नागरिकों की सूची, घर-घर भेंट और त्वरित स्क्रीनिंग उपलब्ध है।'
                  : 'ASHA frontline portal. Manage your elder cohort, record home visits, and conduct rapid field screenings.'
              }
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-md font-bold"
            />

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#c5f82a] hover:bg-[#b5e820] text-slate-950 rounded-2xl font-black text-sm shadow-xl shadow-[#c5f82a]/25 cursor-pointer transition-all active:scale-95"
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
      </div>

      {/* Frosted Glass Top 3 Metric Cards matching Image #12 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="glass-card-frosted p-6 rounded-[2rem] space-y-3 relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Total Village Cohort
            </span>
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold border border-sky-200/60 shadow-xs">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 tracking-tight">
              {ashaPatients.length}
            </span>
            <span className="text-xs font-bold text-slate-500">Elders Enrolled</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Across Titabor, Borhola & Meleng villages</p>
        </div>

        {/* Card 2 */}
        <div className="glass-card-frosted p-6 rounded-[2rem] space-y-3 relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Requires Follow-up
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold border border-amber-200/60 shadow-xs">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-600 tracking-tight">
              {ashaPatients.filter(p => p.cognitiveStatus === 'watch' || p.cognitiveStatus === 'review').length}
            </span>
            <span className="text-xs font-extrabold text-amber-900 bg-amber-100/90 border border-amber-300/50 px-2.5 py-0.5 rounded-full">
              Review Signal
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Scheduled for doorstep check-in this week</p>
        </div>

        {/* Card 3 */}
        <div className="glass-card-frosted p-6 rounded-[2rem] space-y-3 relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Average Adherence Rate
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200/60 shadow-xs">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-600 tracking-tight">88.5%</span>
            <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100/90 border border-emerald-300/50 px-2.5 py-0.5 rounded-full">
              High Compliance
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Daily pill adherence across enrolled households</p>
        </div>
      </div>

      {/* Frosted Glass Filter & Search Bar */}
      <div className="glass-card-frosted p-4 rounded-[2rem] flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" />
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
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/70 border border-sky-200/70 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:bg-white transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'stable', 'watch', 'review'] as const).map(f => {
            const isSelected = filterStatus === f;
            return (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold capitalize transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0f2b48] text-white shadow-md shadow-[#0f2b48]/20'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-sky-100'
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
              className={`glass-card-frosted p-6 rounded-[2rem] space-y-4 flex flex-col justify-between group relative overflow-hidden ${
                isReview
                  ? 'border-amber-300/80 ring-2 ring-amber-400/20'
                  : 'hover:border-sky-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-[#0284c7] transition-colors">
                      {lang === 'as' ? patient.nameAs : lang === 'hi' ? (patient.nameHi || patient.name) : patient.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                      <MapPin size={14} className="text-[#0284c7]" />
                      {lang === 'as' ? patient.villageAs : lang === 'hi' ? (patient.villageHi || patient.village) : patient.village} • {patient.age}{' '}
                      {lang === 'as' ? 'বছৰ' : lang === 'hi' ? 'वर्ष' : 'yrs'}
                    </p>
                  </div>

                  <span
                    className={`text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-xs border ${
                      isReview
                        ? 'bg-amber-100/90 text-amber-900 border-amber-300/60'
                        : 'bg-emerald-100/90 text-emerald-900 border-emerald-300/60'
                    }`}
                  >
                    {patient.cognitiveStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-sky-100 text-xs">
                  <div className="bg-white/60 p-2.5 rounded-xl border border-sky-100">
                    <span className="text-slate-400 font-medium block text-[11px]">Stock Remaining</span>
                    <span className="font-extrabold text-slate-800 text-sm">
                      {patient.medicationStockDays} Days
                    </span>
                  </div>
                  <div className="bg-white/60 p-2.5 rounded-xl border border-sky-100">
                    <span className="text-slate-400 font-medium block text-[11px]">Med Adherence</span>
                    <span className="font-extrabold text-emerald-600 text-sm">{patient.adherenceRate}%</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-100/80 text-xs text-slate-600 leading-relaxed font-medium">
                  <span className="font-extrabold block text-slate-800 mb-0.5">
                    {lang === 'as' ? 'আশা টোকা:' : lang === 'hi' ? 'आशा कार्यकर्ता नोट:' : 'ASHA Note:'}
                  </span>
                  {lang === 'as' ? patient.notesAs : lang === 'hi' ? (patient.notesHi || patient.notes) : patient.notes}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-sky-100 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1">
                  <span className="font-medium">
                    {lang === 'as'
                      ? `অন্তিম সাক্ষাৎ: ${patient.lastVisitDate}`
                      : lang === 'hi'
                      ? `अंतिम भेंट: ${patient.lastVisitDate}`
                      : `Last Visit: ${patient.lastVisitDate}`}
                  </span>
                  <a
                    href={`tel:${patient.phone}`}
                    className="text-[#0284c7] font-black flex items-center gap-1 hover:underline"
                  >
                    <PhoneCall size={12} /> {lang === 'hi' ? 'कॉल' : lang === 'as' ? 'কল' : 'Call'}
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedPatientForVisit(patient)}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-sky-50 text-slate-800 font-extrabold text-xs border border-sky-200 cursor-pointer transition-all shadow-xs"
                  >
                    {lang === 'as' ? 'সাক্ষাৎ লিপি' : lang === 'hi' ? 'भेंट दर्ज करें' : 'Log Visit'}
                  </button>

                  <button
                    onClick={() => onStartScreening && onStartScreening(patient.id)}
                    className="w-full py-2.5 rounded-xl bg-[#0f2b48] hover:bg-[#1a4470] text-white font-extrabold text-xs cursor-pointer shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span>{lang === 'as' ? 'স্ক্ৰীনিং খেল' : lang === 'hi' ? 'स्क्रीनिंग टेस्ट' : 'Screen Game'}</span>
                    <ArrowUpRight size={14} className="text-[#c5f82a]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Visit Modal */}
      {selectedPatientForVisit && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card-frosted rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl border border-white">
            <h3 className="text-xl font-black text-slate-900">
              Log Doorstep Visit: {selectedPatientForVisit.name}
            </h3>

            <form onSubmit={handleRecordVisit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Field Observations & Medicine Check
                </label>
                <textarea
                  value={visitNotes}
                  onChange={e => setVisitNotes(e.target.value)}
                  placeholder="e.g. Verified blister pack intake, checked blood pressure, elder is cheerful..."
                  rows={4}
                  className="w-full p-3.5 rounded-2xl border border-sky-200 bg-white/80 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => setSelectedPatientForVisit(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-[#0f2b48] hover:bg-[#1a4470] text-white shadow-md cursor-pointer transition-all"
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card-frosted rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl border border-white">
            <h3 className="text-xl font-black text-slate-900">
              Register New Village Elder
            </h3>

            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Tarun Saikia"
                  className="w-full p-3.5 rounded-2xl border border-sky-200 bg-white/80 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={e => setNewAge(Number(e.target.value))}
                    className="w-full p-3.5 rounded-2xl border border-sky-200 bg-white/80 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                    Village / Block
                  </label>
                  <input
                    type="text"
                    required
                    value={newVillage}
                    onChange={e => setNewVillage(e.target.value)}
                    placeholder="Titabor / Borhola"
                    className="w-full p-3.5 rounded-2xl border border-sky-200 bg-white/80 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Family Contact Number
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="+91 94350 xxxxx"
                  className="w-full p-3.5 rounded-2xl border border-sky-200 bg-white/80 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-[#0f2b48] hover:bg-[#1a4470] text-white shadow-md cursor-pointer transition-all"
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
