import React from 'react';
import {
  Heart,
  Brain,
  Pill,
  ShieldCheck,
  MessageSquare,
  Users,
  Stethoscope,
  Activity,
  User,
  LayoutDashboard,
  Compass,
  SlidersHorizontal,
  Wifi,
  WifiOff,
  AlertOctagon,
  ChevronRight,
  UserCheck,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';

export type PatientTab = 'dashboard' | 'routine' | 'games' | 'journal' | 'safety' | 'chat';

interface SidebarProps {
  activeTab: PatientTab;
  onSelectTab: (tab: PatientTab) => void;
  showLanding: boolean;
  onToggleLanding: (show: boolean) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  showLanding,
  onToggleLanding,
  isOpenMobile,
  onCloseMobile,
}) => {
  const {
    currentRole,
    setRole,
    settings,
    setA11yOpen,
    setSosOpen,
    toggleSimulatedOffline,
    activePatient,
    setProfileModalOpen,
  } = useApp();

  const lang = settings.language;

  // Role Definitions matching Frosted Glass Purple & Blue aesthetic
  const roles: {
    id: Role;
    labelEn: string;
    labelHi: string;
    labelAs: string;
    subtitleEn: string;
    subtitleHi: string;
    subtitleAs: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'patient',
      labelEn: 'Senior / Patient',
      labelHi: 'वरिष्ठ / मरीज',
      labelAs: 'জ্যেষ্ঠ নাগৰিক',
      subtitleEn: 'Daily Care & Memory',
      subtitleHi: 'दवा व स्मरण',
      subtitleAs: 'দৈনিক যত্ন ও স্মৃতি',
      icon: <User size={18} />,
      color: 'text-[#c084fc] bg-purple-500/15',
    },
    {
      id: 'caregiver',
      labelEn: 'Family Caregiver',
      labelHi: 'देखभालकर्ता',
      labelAs: 'পৰিয়ালৰ তত্ত্বাৱধায়ক',
      subtitleEn: 'Adherence & 7D Trends',
      subtitleHi: 'दवा ट्रैकिंग व रुझान',
      subtitleAs: 'ঔষধ অনুসৰণ ও ধাৰা',
      icon: <Users size={18} />,
      color: 'text-sky-300 bg-sky-500/15',
    },
    {
      id: 'clinician',
      labelEn: 'Clinician / Doctor',
      labelHi: 'चिकित्सक / डॉक्टर',
      labelAs: 'চিকিৎসক পৰ্টেল',
      subtitleEn: 'Cognitive Radar & PDF',
      subtitleHi: 'रडार व मेडिकल रिपोर्ट',
      subtitleAs: 'কগনিটিভ ৰাডাৰ ও ৰিপোৰ্ট',
      icon: <Stethoscope size={18} />,
      color: 'text-purple-300 bg-purple-500/15',
    },
    {
      id: 'asha',
      labelEn: 'ASHA Health Worker',
      labelHi: 'आशा कार्यकर्ता',
      labelAs: 'আশা স্বাস্থ্য কৰ্মী',
      subtitleEn: 'Field Triage & Visits',
      subtitleHi: 'फील्ड स्क्रीनिंग व भेंट',
      subtitleAs: 'ফিল্ড স্ক্ৰীনিং ও সাক্ষাৎ',
      icon: <Activity size={18} />,
      color: 'text-amber-300 bg-amber-500/15',
    },
  ];

  // Navigation Items for Patient Role
  const navItems: {
    id: PatientTab;
    labelEn: string;
    labelHi: string;
    labelAs: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'dashboard',
      labelEn: 'Home Dashboard',
      labelHi: 'मुख्य डैशबोर्ड',
      labelAs: 'মূল ডেচবৰ্ড',
      icon: <LayoutDashboard size={19} />,
    },
    {
      id: 'routine',
      labelEn: 'Medicines & Routine',
      labelHi: 'दैनिक दिनचर्या व दवा',
      labelAs: 'দৈনিক ঔষধ ও নিয়ম',
      icon: <Pill size={19} />,
      badge: 'Daily',
    },
    {
      id: 'games',
      labelEn: '6 Memory Games',
      labelHi: '6 दिमागी स्वास्थ्य खेल',
      labelAs: 'মগজুৰ ৬ টা খেল',
      icon: <Brain size={19} />,
      badge: '6 Games',
    },
    {
      id: 'journal',
      labelEn: 'Family Photo Album',
      labelHi: 'पारिवारिक स्मृति एल्बम',
      labelAs: 'পৰিয়াল স্মৃতি এলবাম',
      icon: <Heart size={19} />,
    },
    {
      id: 'safety',
      labelEn: 'Medicine & Lab Safety',
      labelHi: 'दवा पैकेट व लैब सुरक्षा',
      labelAs: 'ঔষধ ও লেব সুৰক্ষা',
      icon: <ShieldCheck size={19} />,
      badge: 'AI Vision',
    },
    {
      id: 'chat',
      labelEn: 'Smriti Sathi (AI Chat)',
      labelHi: 'स्मृति साथी (AI साथी)',
      labelAs: 'স্মৃতি সাথী (AI কথা)',
      icon: <MessageSquare size={19} />,
      badge: 'Voice',
    },
  ];

  const getRoleLabel = (r: typeof roles[0]) => {
    if (lang === 'as') return r.labelAs;
    if (lang === 'hi') return r.labelHi;
    return r.labelEn;
  };

  const getRoleSubtitle = (r: typeof roles[0]) => {
    if (lang === 'as') return r.subtitleAs;
    if (lang === 'hi') return r.subtitleHi;
    return r.subtitleEn;
  };

  const getNavLabel = (item: typeof navItems[0]) => {
    if (lang === 'as') return item.labelAs;
    if (lang === 'hi') return item.labelHi;
    return item.labelEn;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Container matching Dark Frosted Glass theme */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0c1427]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 text-white ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:static lg:shadow-none'
        }`}
      >
        {/* Top Header / Logo Section */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div
            onClick={() => {
              onToggleLanding(false);
              onSelectTab('dashboard');
              onCloseMobile();
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-indigo-600/30 p-1 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform border border-purple-400/40 backdrop-blur-md">
              <img
                src="/smriti-logo.png"
                alt="SmritiCare Logo"
                className="w-full h-full object-contain filter drop-shadow"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('26027-removebg-preview.png')) {
                    target.src = '/26027-removebg-preview.png';
                  }
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">
                  {lang === 'as' ? 'স্মৃতি কেয়াৰ' : lang === 'hi' ? 'स्मृति केयर' : 'SmritiCare'}
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-400/30">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-sky-200/70 font-medium">
                {lang === 'as'
                  ? 'জ্ঞানীয় যত্ন আৰু ঔষধ সুৰক্ষা'
                  : lang === 'hi'
                  ? 'संज्ञानात्मक देखभाल व सुरक्षा'
                  : 'Cognitive Care & Safety'}
              </p>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-xl text-sky-200 hover:text-white hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 no-scrollbar">
          {/* SECTION 1: ROLE PORTALS */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-200/60">
                {lang === 'as'
                  ? 'ভূমিকা প’ৰ্টেলসমূহ'
                  : lang === 'hi'
                  ? 'भूमिका पोर्टल'
                  : 'Stakeholder Portals'}
              </span>
              <span className="text-[9px] font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded-full border border-purple-400/30">
                4 Roles
              </span>
            </div>

            <div className="space-y-1">
              {roles.map(r => {
                const isActiveRole = currentRole === r.id && !showLanding;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRole(r.id);
                      onToggleLanding(false);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                      isActiveRole
                        ? 'bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] text-white font-black shadow-lg shadow-purple-600/35 border border-purple-400/40'
                        : 'text-stone-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors border ${
                          isActiveRole ? 'bg-white/20 text-white border-white/30' : r.color + ' border-white/10'
                        }`}
                      >
                        {r.icon}
                      </div>
                      <div>
                        <p
                          className={`text-xs font-bold leading-tight ${
                            isActiveRole ? 'text-white' : 'text-stone-200'
                          }`}
                        >
                          {getRoleLabel(r)}
                        </p>
                        <p
                          className={`text-[10px] leading-tight ${
                            isActiveRole ? 'text-purple-100' : 'text-sky-200/60'
                          }`}
                        >
                          {getRoleSubtitle(r)}
                        </p>
                      </div>
                    </div>

                    {isActiveRole ? (
                      <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
                    ) : (
                      <ChevronRight size={14} className="text-sky-200/40" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: PATIENT CARE MODULES */}
          {currentRole === 'patient' && !showLanding && (
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-200/60 px-2 block mb-2">
                {lang === 'as'
                  ? 'দৈনিক যত্ন আৰু মডিউল'
                  : lang === 'hi'
                  ? 'दैनिक देखभाल मॉड्यूल'
                  : 'Daily Care Modules'}
              </span>

              <div className="space-y-1">
                {navItems.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-purple-500/20 text-white font-black border border-purple-400/40 shadow-md backdrop-blur-md shadow-purple-900/30'
                          : 'text-stone-300 hover:bg-white/10 hover:text-white font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-[#c084fc]' : 'text-sky-200/70'}>
                          {item.icon}
                        </span>
                        <span className="text-xs">{getNavLabel(item)}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-[#a855f7] text-white shadow-xs'
                              : 'bg-white/10 text-sky-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: SYSTEM & ARCHITECTURE EXPLORER */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-200/60 px-2 block mb-2">
              {lang === 'as'
                ? 'প্ৰকল্প আৰু সংহতি'
                : lang === 'hi'
                ? 'परियोजना एवं सेटिंग्स'
                : 'Project & System'}
            </span>

            {/* Architecture / Overview Explorer */}
            <button
              onClick={() => {
                onToggleLanding(!showLanding);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                showLanding
                  ? 'bg-purple-500/20 text-white font-black border border-purple-400/40'
                  : 'text-stone-300 hover:bg-white/10 hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass
                  size={19}
                  className={showLanding ? 'text-[#c084fc]' : 'text-sky-200/70'}
                />
                <span className="text-xs">
                  {lang === 'as'
                    ? 'প্ৰকল্প পৰিচয় ও আৰ্ট'
                    : lang === 'hi'
                    ? 'परियोजना परिचय व 3D आर्ट'
                    : 'Hero Showcase & 3D Art'}
                </span>
              </div>
              <span className="text-[9px] font-bold bg-purple-500/30 text-purple-200 border border-purple-400/40 px-1.5 py-0.5 rounded">
                Hero
              </span>
            </button>

            {/* Accessibility Settings Shortcut */}
            <button
              onClick={() => {
                setA11yOpen(true);
                onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left text-stone-300 hover:bg-white/10 hover:text-white font-medium transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal size={19} className="text-sky-200/70" />
                <span className="text-xs">
                  {lang === 'as'
                    ? 'দৃষ্টি আৰু ফন্ট সুবিধা'
                    : lang === 'hi'
                    ? 'डिस्प्ले व सुगमता (A11y)'
                    : 'Display & Accessibility'}
                </span>
              </div>
            </button>

            {/* Simulated Offline Mode Toggle */}
            <button
              onClick={toggleSimulatedOffline}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                settings.isSimulatedOffline
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                {settings.isSimulatedOffline ? (
                  <WifiOff size={19} className="text-amber-400" />
                ) : (
                  <Wifi size={19} className="text-[#c084fc]" />
                )}
                <span className="text-xs font-medium">
                  {settings.isSimulatedOffline
                    ? (lang === 'hi' ? 'ऑफ़लाइन मोड (सक्रिय)' : lang === 'as' ? 'অফলাইন মোড (সক্ৰিয়)' : 'Offline Mode (Active)')
                    : (lang === 'hi' ? 'स्थानीय सिंक (ऑनलाइन)' : lang === 'as' ? 'লোকেল সিংঙ্ক (অনলাইন)' : 'Local Sync (Online)')}
                </span>
              </div>
              <span
                className={`w-2 h-2 rounded-full ${
                  settings.isSimulatedOffline ? 'bg-amber-400 animate-pulse' : 'bg-[#c084fc]'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Bottom User Profile Card with Dynamic Switcher Trigger */}
        <div className="p-4 border-t border-white/10 bg-[#080e1c]/70">
          <div
            onClick={() => setProfileModalOpen(true)}
            className="group bg-white/10 hover:bg-white/15 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/15 hover:border-purple-400/50 shadow-sm flex items-center justify-between gap-2.5 cursor-pointer transition-all active:scale-98"
            title="Click to Switch Profile or Add New Patient"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${
                    currentRole === 'patient'
                      ? activePatient.avatarColor || 'from-purple-600 to-indigo-500'
                      : currentRole === 'caregiver'
                      ? 'from-indigo-600 to-blue-500'
                      : currentRole === 'clinician'
                      ? 'from-teal-600 to-emerald-500'
                      : 'from-amber-600 to-orange-500'
                  } text-white flex items-center justify-center font-black text-xs shadow-xs border border-white/20`}
                >
                  {currentRole === 'patient'
                    ? activePatient.avatarInitials || 'AJ'
                    : currentRole === 'caregiver'
                    ? 'PG'
                    : currentRole === 'clinician'
                    ? 'DR'
                    : 'MD'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#c084fc] border-2 border-[#080e1c]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-200 transition-colors">
                    {currentRole === 'patient'
                      ? `${
                          lang === 'as' && activePatient.nameAs
                            ? activePatient.nameAs
                            : lang === 'hi' && activePatient.nameHi
                            ? activePatient.nameHi
                            : activePatient.name
                        } (${activePatient.age}y)`
                      : currentRole === 'caregiver'
                      ? 'Priyanka Gogoi'
                      : currentRole === 'clinician'
                      ? 'Dr. A. Sarma (MD)'
                      : 'Minoti Das (ASHA)'}
                  </h4>
                </div>
                <p className="text-[10px] text-sky-200/60 truncate flex items-center gap-1">
                  <span>
                    {currentRole === 'patient'
                      ? lang === 'as' && activePatient.locationAs
                        ? activePatient.locationAs
                        : lang === 'hi' && activePatient.locationHi
                        ? activePatient.locationHi
                        : activePatient.location
                      : currentRole === 'caregiver'
                      ? 'Family Caregiver'
                      : currentRole === 'clinician'
                      ? 'Neurology PHC'
                      : 'Titabor Sub-Centre'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-[#c084fc] border border-purple-400/30 group-hover:bg-purple-500/30 transition-all">
                Switch
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSosOpen(true);
                }}
                title="Emergency SOS"
                className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-400/30 flex items-center justify-center transition-colors cursor-pointer"
              >
                <AlertOctagon size={14} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
