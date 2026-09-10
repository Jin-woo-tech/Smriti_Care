import React, { useState } from 'react';
import {
  X,
  User,
  UserPlus,
  Check,
  MapPin,
  Heart,
  Phone,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PatientProfile } from '../../types';

export const ProfileManagerModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setProfileModalOpen,
    patientProfiles,
    activePatientId,
    setActivePatientId,
    addPatientProfile,
    settings,
  } = useApp();

  const lang = settings.language;
  const [activeTab, setActiveTab] = useState<'switch' | 'add'>('switch');

  // Form State for Adding New Profile
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | 'Other'>('F');
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  if (!isProfileModalOpen) return null;

  const handleSelectProfile = (id: string) => {
    setActivePatientId(id);
    setProfileModalOpen(false);
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedAge = parseInt(age, 10) || 65;
    const colors = [
      'from-purple-600 to-indigo-500',
      'from-pink-600 to-rose-500',
      'from-emerald-600 to-teal-500',
      'from-blue-600 to-cyan-500',
      'from-amber-600 to-orange-500',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newProfile: Omit<PatientProfile, 'id'> = {
      name: name.trim(),
      age: parsedAge,
      gender,
      location: location.trim() || 'Jorhat, Assam',
      condition: condition.trim() || 'Cognitive Support & Daily Routine',
      avatarInitials: name
        .trim()
        .split(' ')
        .map(p => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      avatarColor: randomColor,
      adherenceRate: 95,
      emergencyContactName: emergencyName.trim() || 'Primary Caregiver',
      emergencyContactPhone: emergencyPhone.trim() || '+91 94350 00000',
    };

    addPatientProfile(newProfile);
    // Reset form & close
    setName('');
    setAge('');
    setLocation('');
    setCondition('');
    setEmergencyName('');
    setEmergencyPhone('');
    setActiveTab('switch');
    setProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#181635] via-[#0e1628] to-[#0a101f] border border-purple-500/30 rounded-[32px] p-6 sm:p-8 shadow-2xl shadow-purple-950/50 text-white overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow ambient spots */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between pb-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 border border-purple-400/40">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>
                  {lang === 'as'
                    ? 'ৰোগী প্ৰফাইল ব্যৱস্থাপনা'
                    : lang === 'hi'
                    ? 'मरीज़ प्रोफ़ाइल प्रबंधन'
                    : 'Patient Profile Manager'}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-[#c084fc] border border-purple-400/30">
                  {patientProfiles.length} Active
                </span>
              </h3>
              <p className="text-xs text-sky-200/70 font-medium">
                {lang === 'as'
                  ? 'সক্ৰিয় প্ৰফাইল সলনি কৰক বা নতুন পৰিয়ালৰ সদস্য যোগ কৰক'
                  : lang === 'hi'
                  ? 'सक्रिय प्रोफ़ाइल बदलें या नए रोगी/परिवार सदस्य को जोड़ें'
                  : 'Switch active profile or register a new patient profile'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setProfileModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="relative z-10 flex gap-2 pt-4 pb-2 shrink-0">
          <button
            onClick={() => setActiveTab('switch')}
            className={`flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'switch'
                ? 'bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
                : 'bg-white/5 hover:bg-white/10 text-sky-200/70 border border-white/10'
            }`}
          >
            <User size={16} />
            <span>
              {lang === 'as' ? 'প্ৰফাইল সলনি কৰক' : lang === 'hi' ? 'प्रोफ़ाइल बदलें' : 'Switch Profile'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'add'
                ? 'bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
                : 'bg-white/5 hover:bg-white/10 text-sky-200/70 border border-white/10'
            }`}
          >
            <UserPlus size={16} />
            <span>
              {lang === 'as' ? 'নতুন প্ৰফাইল যোগ কৰক' : lang === 'hi' ? 'नया प्रोफ़ाइल जोड़ें' : 'Add New Profile'}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 flex-1 overflow-y-auto py-3 space-y-3 pr-1 scrollbar-thin">
          {activeTab === 'switch' ? (
            <div className="space-y-3">
              {patientProfiles.map(profile => {
                const isActive = profile.id === activePatientId;
                return (
                  <div
                    key={profile.id}
                    onClick={() => handleSelectProfile(profile.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden backdrop-blur-md flex items-center justify-between gap-3 group ${
                      isActive
                        ? 'bg-purple-950/40 border-purple-400/60 shadow-lg shadow-purple-600/20'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-purple-400/30'
                    }`}
                  >
                    {/* Active Accent bar */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#c084fc] to-[#a855f7]" />
                    )}

                    <div className="flex items-center gap-3.5 min-w-0 pl-1">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${
                          profile.avatarColor || 'from-purple-600 to-indigo-500'
                        } flex items-center justify-center font-black text-sm text-white shadow-md border border-white/20 shrink-0`}
                      >
                        {profile.avatarInitials}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm sm:text-base text-white truncate">
                            {lang === 'as' && profile.nameAs ? profile.nameAs : lang === 'hi' && profile.nameHi ? profile.nameHi : profile.name}
                          </h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-sky-200 font-bold border border-white/15">
                            {profile.age}y • {profile.gender === 'F' ? 'Female' : profile.gender === 'M' ? 'Male' : 'Other'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-xs text-sky-200/70 font-medium truncate">
                          <span className="flex items-center gap-1 shrink-0">
                            <MapPin size={12} className="text-[#c084fc]" />
                            {lang === 'as' && profile.locationAs ? profile.locationAs : lang === 'hi' && profile.locationHi ? profile.locationHi : profile.location}
                          </span>
                          {profile.condition && (
                            <span className="truncate hidden sm:inline-block">
                              • {lang === 'as' && profile.conditionAs ? profile.conditionAs : lang === 'hi' && profile.conditionHi ? profile.conditionHi : profile.condition}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isActive ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/25 border border-purple-400/40 text-[#c084fc] text-xs font-black">
                          <Check size={14} />
                          <span>Active</span>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-purple-600/30 border border-white/10 flex items-center justify-center text-sky-200 group-hover:text-white transition-all">
                          <ChevronRight size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCreateProfile} className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-sky-200 mb-1">
                    {lang === 'as' ? 'সম্পূৰ্ণ নাম (Full Name)*' : lang === 'hi' ? 'पूरा नाम (Full Name)*' : 'Full Name*'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ananya Jain"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-sky-200/40 text-xs focus:outline-none focus:border-purple-400 backdrop-blur-md"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-sky-200 mb-1">
                    {lang === 'as' ? 'বয়স (Age)*' : lang === 'hi' ? 'आयु (Age)*' : 'Age*'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="e.g. 20 or 72"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-sky-200/40 text-xs focus:outline-none focus:border-purple-400 backdrop-blur-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-sky-200 mb-1">
                    {lang === 'as' ? 'লিংগ (Gender)' : lang === 'hi' ? 'लिंग (Gender)' : 'Gender'}
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131e34] border border-white/20 text-white text-xs focus:outline-none focus:border-purple-400"
                  >
                    <option value="F">Female / মহিলা</option>
                    <option value="M">Male / পুৰুষ</option>
                    <option value="Other">Other / অন্যান্য</option>
                  </select>
                </div>

                {/* Location / Village */}
                <div>
                  <label className="block text-xs font-bold text-sky-200 mb-1">
                    {lang === 'as' ? 'গাঁও / স্থান (Location)' : lang === 'hi' ? 'स्थान / गांव (Location)' : 'Location / Village'}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Titabor, Jorhat"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-sky-200/40 text-xs focus:outline-none focus:border-purple-400 backdrop-blur-md"
                  />
                </div>
              </div>

              {/* Health Focus / Primary Condition */}
              <div>
                <label className="block text-xs font-bold text-sky-200 mb-1">
                  {lang === 'as' ? 'স্বাস্থ্য লক্ষ্য / স্থিতি (Care Goal / Condition)' : lang === 'hi' ? 'स्वास्थ्य लक्ष्य / स्थिति (Care Goal / Condition)' : 'Care Goal / Primary Condition'}
                </label>
                <input
                  type="text"
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                  placeholder="e.g. Cognitive Training & Routine Reminders"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-sky-200/40 text-xs focus:outline-none focus:border-purple-400 backdrop-blur-md"
                />
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-sky-200 mb-1">
                    {lang === 'as' ? 'অভিভাৱক / জৰুৰীকালীন নাম' : lang === 'hi' ? 'अभिभावक / आपातकालीन नाम' : 'Guardian / Emergency Contact Name'}
                  </label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={e => setEmergencyName(e.target.value)}
                    placeholder="e.g. Rajesh Jain"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-sky-200/40 text-xs focus:outline-none focus:border-purple-400 backdrop-blur-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-sky-200 mb-1">
                    {lang === 'as' ? 'জৰুৰীকালীন ফোন' : lang === 'hi' ? 'आपातकालीन फोन' : 'Emergency Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={e => setEmergencyPhone(e.target.value)}
                    placeholder="+91 94350 77889"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-sky-200/40 text-xs focus:outline-none focus:border-purple-400 backdrop-blur-md"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white font-black text-sm shadow-xl shadow-purple-600/40 border border-purple-400/40 cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Sparkles size={16} />
                  <span>
                    {lang === 'as' ? 'প্ৰফাইল সংৰক্ষণ আৰু সক্ৰিয় কৰক' : lang === 'hi' ? 'प्रोफ़ाइल सहेजें एवं सक्रिय करें' : 'Save & Activate Profile'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
