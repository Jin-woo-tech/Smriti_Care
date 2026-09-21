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
  LogIn,
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
    currentUser,
    setProfileModalOpen,
    setAuthModalOpen,
    setAuthModalMode,
  } = useApp();

  const lang = settings.language;

  // Role Definitions (Bilingual: English & Hindi)
  const roles: {
    id: Role;
    labelEn: string;
    labelHi: string;
    subtitleEn: string;
    subtitleHi: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'patient',
      labelEn: 'Senior / Patient',
      labelHi: 'वरिष्ठ / मरीज',
      subtitleEn: 'Daily Care & Memory',
      subtitleHi: 'दवा व स्मरण',
      icon: <User size={18} />,
      color: 'text-[#c084fc] bg-purple-500/15',
    },
    {
      id: 'caregiver',
      labelEn: 'Family Caregiver',
      labelHi: 'देखभालकर्ता',
      subtitleEn: 'Adherence & 7D Trends',
      subtitleHi: 'दवा ट्रैकिंग व रुझान',
      icon: <Users size={18} />,
      color: 'text-sky-300 bg-sky-500/15',
    },
    {
      id: 'clinician',
      labelEn: 'Clinician / Doctor',
      labelHi: 'चिकित्सक / डॉक्टर',
      subtitleEn: 'Cognitive Radar & PDF',
      subtitleHi: 'रडार व मेडिकल रिपोर्ट',
      icon: <Stethoscope size={18} />,
      color: 'text-purple-300 bg-purple-500/15',
    },
    {
      id: 'asha',
      labelEn: 'ASHA Health Worker',
      labelHi: 'आशा कार्यकर्ता',
      subtitleEn: 'Field Triage & Visits',
      subtitleHi: 'फील्ड स्क्रीनिंग व भेंट',
      icon: <Activity size={18} />,
      color: 'text-amber-300 bg-amber-500/15',
    },
  ];

  // Navigation Items for Patient Role
  const navItems: {
    id: PatientTab;
    labelEn: string;
    labelHi: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'dashboard',
      labelEn: 'Home Dashboard',
      labelHi: 'मुख्य डैशबोर्ड',
      icon: <LayoutDashboard size={19} />,
    },
    {
      id: 'routine',
      labelEn: 'Medicines & Routine',
      labelHi: 'दैनिक दिनचर्या व दवा',
      icon: <Pill size={19} />,
      badge: 'Daily',
    },
    {
      id: 'games',
      labelEn: '6 Memory Games',
      labelHi: '6 दिमागी स्वास्थ्य खेल',
      icon: <Brain size={19} />,
      badge: '6 Games',
    },
    {
      id: 'journal',
      labelEn: 'Family Photo Album',
      labelHi: 'पारिवारिक स्मृति एल्बम',
      icon: <Heart size={19} />,
    },
    {
      id: 'safety',
      labelEn: 'Medicine & Lab Safety',
      labelHi: 'दवा पैकेट व लैब सुरक्षा',
      icon: <ShieldCheck size={19} />,
      badge: 'AI Vision',
    },
    {
      id: 'chat',
      labelEn: 'Smriti Sathi (AI Chat)',
      labelHi: 'स्मृति साथी (AI साथी)',
      icon: <MessageSquare size={19} />,
      badge: 'Voice',
    },
  ];

  const getRoleLabel = (r: typeof roles[0]) => {
    if (lang === 'hi') return r.labelHi;
    return r.labelEn;
  };

  const getRoleSubtitle = (r: typeof roles[0]) => {
    if (lang === 'hi') return r.subtitleHi;
    return r.subtitleEn;
  };

  const getNavLabel = (item: typeof navItems[0]) => {
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
                  {lang === 'hi' ? 'स्मृति केयर' : 'SmritiCare'}
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-400/30">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-sky-200/70 font-medium">
                {lang === 'hi'
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

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin">
          {/* Landing / Showcase Architecture Toggle */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-sky-200/60 uppercase tracking-wider px-2">
              {lang === 'hi' ? 'अवलोकन' : 'Overview'}
            </div>
            <button
              onClick={() => {
                onToggleLanding(true);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                showLanding
                  ? 'bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
                  : 'bg-white/5 hover:bg-white/10 text-sky-100 hover:text-white border border-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass size={17} className={showLanding ? 'text-white' : 'text-[#c084fc]'} />
                <span>
                  {lang === 'hi'
                    ? 'SIH 2026 प्रोजेक्ट डेमो'
                    : 'SIH 2026 Project Showcase'}
                </span>
              </div>
              <ChevronRight size={15} className="opacity-70" />
            </button>
          </div>

          {/* Active Role Switcher Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] font-bold text-sky-200/60 uppercase tracking-wider">
                {lang === 'hi' ? 'भूमिका चुनें' : 'Active Role Mode'}
              </span>
              <span className="text-[10px] text-[#c084fc] font-black bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-400/30">
                4 Portals
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {roles.map((r) => {
                const isSelected = currentRole === r.id && !showLanding;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRole(r.id);
                      onToggleLanding(false);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600/30 border border-purple-400/50 shadow-md shadow-purple-900/30 text-white'
                        : 'bg-white/5 hover:bg-white/10 border border-white/8 text-sky-100/90 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/10 ${
                          isSelected ? 'bg-gradient-to-tr from-[#a855f7] to-[#8b5cf6] text-white shadow-sm' : r.color
                        }`}
                      >
                        {r.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate flex items-center gap-1.5">
                          <span>{getRoleLabel(r)}</span>
                        </div>
                        <div className="text-[10px] text-sky-200/60 truncate font-medium">
                          {getRoleSubtitle(r)}
                        </div>
                      </div>
                    </div>
                    {isSelected && <UserCheck size={16} className="text-[#c084fc] shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Navigation for Senior / Patient Role */}
          {currentRole === 'patient' && !showLanding && (
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="text-[11px] font-bold text-sky-200/60 uppercase tracking-wider px-2">
                {lang === 'hi' ? 'रोगी सेवाएँ' : 'Senior Care Modules'}
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
                          : 'bg-white/5 hover:bg-white/10 text-sky-100 hover:text-white border border-white/6'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-white' : 'text-[#c084fc]'}>
                          {item.icon}
                        </span>
                        <span>{getNavLabel(item)}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white/25 text-white'
                              : 'bg-purple-500/20 text-[#c084fc] border border-purple-400/30'
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

          {/* Quick Utility Actions */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="text-[11px] font-bold text-sky-200/60 uppercase tracking-wider px-2">
              {lang === 'hi' ? 'उपकरण' : 'System Quick Toggles'}
            </div>

            {/* Offline Simulator Switch */}
            <button
              onClick={toggleSimulatedOffline}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                settings.isSimulatedOffline
                  ? 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                  : 'bg-white/5 hover:bg-white/10 text-sky-200 border-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                {settings.isSimulatedOffline ? <WifiOff size={16} /> : <Wifi size={16} />}
                <span>
                  {settings.isSimulatedOffline
                    ? (lang === 'hi' ? 'ऑफलाइन मोड सक्रिय' : 'Offline Mode Active')
                    : (lang === 'hi' ? 'ऑनलाइन नेटवर्क' : 'Network Online')}
                </span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  settings.isSimulatedOffline ? 'bg-amber-500/30 text-amber-100' : 'bg-white/10 text-sky-200'
                }`}
              >
                {settings.isSimulatedOffline ? 'Offline' : 'Online'}
              </span>
            </button>

            {/* Accessibility Modal Trigger */}
            <button
              onClick={() => {
                setA11yOpen(true);
                onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold bg-white/5 hover:bg-white/10 text-sky-200 border border-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#c084fc]" />
                <span>
                  {lang === 'hi'
                    ? 'भाषा व पहुंच सेटिंग्स'
                    : 'Display & Language'}
                </span>
              </div>
              <span
                className="w-2 h-2 rounded-full bg-[#c084fc]"
                title="Settings Available"
              />
            </button>
          </div>
        </div>

        {/* Bottom User Profile Card with Dynamic Switcher Trigger */}
        <div className="p-4 border-t border-white/10 bg-[#080e1c]/70">
          {currentUser ? (
            <div
              onClick={() => setProfileModalOpen(true)}
              className="group bg-white/10 hover:bg-white/15 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/15 hover:border-purple-400/50 shadow-sm flex items-center justify-between gap-2.5 cursor-pointer transition-all active:scale-98"
              title="Click to Switch Profile"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${
                      currentRole === 'patient'
                        ? 'from-purple-600 to-indigo-500'
                        : currentRole === 'caregiver'
                        ? 'from-indigo-600 to-blue-500'
                        : currentRole === 'clinician'
                        ? 'from-teal-600 to-emerald-500'
                        : 'from-amber-600 to-orange-500'
                    } text-white flex items-center justify-center font-black text-xs shadow-xs border border-white/20`}
                  >
                    {currentUser.fullName ? currentUser.fullName.substring(0, 2).toUpperCase() : 'SC'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#c084fc] border-2 border-[#080e1c]" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-200 transition-colors">
                      {currentUser.fullName || currentUser.username}
                    </h4>
                  </div>
                  <p className="text-[10px] text-sky-200/60 truncate capitalize">
                    {currentUser.role} Account
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-[#c084fc] border border-purple-400/30 group-hover:bg-purple-500/30 transition-all">
                  Profile
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode('login');
                setAuthModalOpen(true);
                onCloseMobile();
              }}
              className="w-full bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-bold p-3 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-lg transition-all"
            >
              <LogIn size={15} />
              <span>{lang === 'hi' ? 'लॉगिन / रजिस्टर' : 'Sign In / Register'}</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
