import React, { useState } from 'react';
import {
  Menu,
  Search,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  Check,
  PhoneCall,
  User,
  LogIn,
  LogOut,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';

interface TopHeaderProps {
  onToggleMobileSidebar: () => void;
  onOpenSearch?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onToggleMobileSidebar,
  onOpenSearch,
}) => {
  const {
    settings,
    setLanguage,
    setA11yOpen,
    setSosOpen,
    toggleSimulatedOffline,
    currentUser,
    logout,
    setAuthModalOpen,
    setAuthModalMode,
    patientProfiles,
    activePatientId,
    activePatient,
    setActivePatientId,
    setProfileModalOpen,
  } = useApp();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPatientMenuOpen, setIsPatientMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const lang = settings.language;

  // Strict Bilingual: English and Hindi
  const languages: { id: Language; label: string; subLabel: string }[] = [
    { id: 'en', label: 'English', subLabel: 'English (India)' },
    { id: 'hi', label: 'हिन्दी', subLabel: 'Hindi (National)' },
  ];

  const currentLangObj = languages.find(l => l.id === lang) || languages[0];

  return (
    <header className="sticky top-0 z-30 bg-[#0b1c30]/80 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 transition-colors text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Left Side: Mobile Menu Button + Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {/* Mobile Hamburger Button */}
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2.5 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 shadow-xs cursor-pointer"
            aria-label="Toggle Sidebar Menu"
          >
            <Menu size={20} />
          </button>

          {/* Search Pill Input */}
          <div className="relative w-full">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-200/60 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'दवाइयां, दिनचर्या, खेल, लैब रिपोर्ट खोजें...'
                  : 'Search medicines, routines, memory games, lab reports...'
              }
              className="w-full pl-11 pr-12 py-2.5 bg-white/10 border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder-sky-200/50 focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:border-transparent backdrop-blur-md shadow-inner transition-all"
            />
            <kbd className="hidden sm:inline-flex absolute right-3.5 top-1/2 -translate-y-1/2 items-center px-2 py-0.5 text-[10px] font-mono font-bold text-sky-200 bg-white/10 rounded-lg border border-white/20">
              /
            </kbd>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Patient Profile Quick Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsPatientMenuOpen(!isPatientMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-purple-500/15 border border-purple-400/40 text-white text-xs font-bold hover:bg-purple-500/25 transition-all shadow-xs cursor-pointer"
              title={lang === 'hi' ? 'सक्रिय मरीज प्रोफ़ाइल बदलें' : 'Switch Active Patient Profile'}
            >
              <div
                className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${
                  activePatient?.avatarColor || 'from-purple-600 to-indigo-600'
                } flex items-center justify-center text-[10px] font-extrabold text-white shadow-xs`}
              >
                {activePatient?.avatarInitials || 'P'}
              </div>
              <div className="text-left hidden lg:block max-w-[120px] truncate">
                <span className="font-semibold block truncate">
                  {lang === 'hi' && activePatient?.nameHi ? activePatient.nameHi : (activePatient?.name || 'Patient')}
                </span>
              </div>
              <ChevronDown size={13} className="text-purple-200" />
            </button>

            {isPatientMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsPatientMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#172c44] p-2.5 shadow-2xl border border-white/20 z-50 backdrop-blur-2xl text-white animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-1.5 border-b border-white/10 mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300">
                      {lang === 'hi' ? 'सक्रिय मरीज' : 'Active Patient'}
                    </span>
                    <button
                      onClick={() => {
                        setIsPatientMenuOpen(false);
                        setProfileModalOpen(true);
                      }}
                      className="text-[10px] font-bold text-sky-300 hover:text-white underline cursor-pointer"
                    >
                      {lang === 'hi' ? 'सभी प्रबंधित करें' : 'Manage All'}
                    </button>
                  </div>

                  <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                    {patientProfiles.map(p => {
                      const isSelected = p.id === activePatientId;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setActivePatientId(p.id);
                            setIsPatientMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                            isSelected
                              ? 'bg-purple-600/30 text-white border border-purple-400/40 shadow-xs'
                              : 'text-stone-200 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${
                                p.avatarColor || 'from-purple-600 to-indigo-600'
                              } flex items-center justify-center text-[10px] font-black text-white shrink-0`}
                            >
                              {p.avatarInitials}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold">
                                {lang === 'hi' && p.nameHi ? p.nameHi : p.name}
                              </p>
                              <p className="text-[10px] text-sky-300/70 font-normal truncate">
                                {p.age}y • {p.condition ? (lang === 'hi' && p.conditionHi ? p.conditionHi : p.condition) : 'Patient'}
                              </p>
                            </div>
                          </div>
                          {isSelected && <Check size={14} className="text-[#c084fc] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Account / Auth Indicator */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-purple-500/15 border border-purple-400/40 text-white text-xs font-bold hover:bg-purple-500/25 transition-all shadow-sm"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-[10px] font-extrabold text-white">
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline font-semibold">{currentUser.fullName?.split(' ')[0] || currentUser.username}</span>
                <span className="text-[9px] uppercase px-1.5 py-0.2 bg-purple-500/30 rounded text-purple-200 font-mono">
                  {currentUser.role}
                </span>
                <ChevronDown size={13} className="text-purple-200" />
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#172c44] p-2.5 shadow-2xl border border-white/20 z-50 backdrop-blur-2xl text-white animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-white/10 mb-1.5">
                      <p className="text-xs font-bold text-white">{currentUser.fullName}</p>
                      <p className="text-[10px] text-purple-300 capitalize">{currentUser.role} Account</p>
                      <p className="text-[10px] text-sky-300/70 font-mono truncate">{currentUser.email || currentUser.username}</p>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-all"
                    >
                      <LogOut size={14} />
                      <span>{lang === 'hi' ? 'लॉगआउट करें' : 'Sign Out'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode('login');
                setAuthModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border border-purple-400/40 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all"
            >
              <LogIn size={14} />
              <span>{lang === 'hi' ? 'साइन इन / रजिस्टर' : 'Sign In'}</span>
            </button>
          )}

          {/* Language Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/10 border border-white/20 text-white text-xs font-bold hover:bg-white/20 backdrop-blur-md shadow-xs cursor-pointer transition-all"
              title="Change Language"
            >
              <Globe size={15} className="text-[#c084fc]" />
              <span className="hidden md:inline">{currentLangObj.label}</span>
              <span className="md:hidden uppercase">{currentLangObj.id}</span>
              <ChevronDown size={13} className="text-sky-200" />
            </button>

            {isLangDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#172c44] p-2 shadow-2xl border border-white/20 z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 text-white">
                  <p className="px-3 py-1.5 text-[10px] font-extrabold text-sky-300 uppercase tracking-wider">
                    Language / भाषा
                  </p>
                  {languages.map(l => {
                    const isSelected = settings.language === l.id;
                    return (
                      <button
                        key={l.id}
                        onClick={() => {
                          setLanguage(l.id);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#a855f7] text-white font-black shadow-md shadow-purple-600/40'
                            : 'text-stone-200 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-left">
                          <p>{l.label}</p>
                          <p className={`text-[10px] font-normal ${isSelected ? 'text-purple-100' : 'text-sky-300'}`}>
                            {l.subLabel}
                          </p>
                        </div>
                        {isSelected && <Check size={15} className="text-white" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Sync Status Pill */}
          <button
            onClick={toggleSimulatedOffline}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-bold shadow-xs cursor-pointer backdrop-blur-md transition-all ${
              settings.isSimulatedOffline
                ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
            title="Toggle Simulated Offline Mode"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                settings.isSimulatedOffline ? 'bg-amber-400 animate-pulse' : 'bg-[#c084fc]'
              }`}
            />
            <span>{settings.isSimulatedOffline ? 'Offline' : 'Online'}</span>
          </button>

          {/* Accessibility Settings Pill */}
          <button
            onClick={() => setA11yOpen(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 shadow-xs cursor-pointer flex items-center gap-1.5 text-xs font-bold backdrop-blur-md transition-all"
            title="Display & Font Accessibility Settings"
          >
            <SlidersHorizontal size={15} className="text-sky-200" />
            <span className="hidden lg:inline">A11y</span>
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={() => setSosOpen(true)}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-rose-600/30 transition-all cursor-pointer active:scale-95 animate-pulse"
            title="Emergency SOS Support"
          >
            <PhoneCall size={15} />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
