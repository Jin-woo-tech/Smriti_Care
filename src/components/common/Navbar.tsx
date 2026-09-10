import React, { useState } from 'react';
import {
  Heart,
  Globe,
  SlidersHorizontal,
  AlertOctagon,
  User,
  Users,
  Stethoscope,
  Activity,
  Wifi,
  WifiOff,
  ChevronDown,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language, Role } from '../../types';

interface NavbarProps {
  onOpenEmergency?: () => void;
  onOpenA11y?: () => void;
  onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenEmergency,
  onOpenA11y,
  onNavigateHome,
}) => {
  const {
    settings,
    setRole,
    setLanguage,
    setA11yOpen,
    setSosOpen,
    toggleSimulatedOffline,
  } = useApp();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const lang = settings.language;

  const roles: { id: Role; label: string; labelHi: string; labelAs: string; icon: React.ReactNode }[] = [
    {
      id: 'patient',
      label: 'Patient',
      labelHi: 'मरीज',
      labelAs: 'জ্যেষ্ঠ নাগৰিক',
      icon: <User size={16} />,
    },
    {
      id: 'caregiver',
      label: 'Caregiver',
      labelHi: 'देखभालकर्ता',
      labelAs: 'তত্ত্বাৱধায়ক',
      icon: <Users size={16} />,
    },
    {
      id: 'clinician',
      label: 'Clinician',
      labelHi: 'चिकित्सक',
      labelAs: 'চিকিৎসক',
      icon: <Stethoscope size={16} />,
    },
    {
      id: 'asha',
      label: 'ASHA Worker',
      labelHi: 'आशा कार्यकर्ता',
      labelAs: 'আশা কৰ্মী',
      icon: <Activity size={16} />,
    },
  ];

  const languages: { id: Language; label: string; subLabel: string }[] = [
    { id: 'en', label: 'English', subLabel: 'English' },
    { id: 'hi', label: 'हिन्दी', subLabel: 'Hindi' },
    { id: 'as', label: 'অসমীয়া', subLabel: 'Assamese' },
  ];

  const currentLangLabel = languages.find(l => l.id === lang)?.label || 'English';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigateHome && onNavigateHome()}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-sky-600 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
              <Heart size={26} className="text-teal-100 fill-teal-100/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-teal-900">
                  {lang === 'as' ? 'স্মৃতি কেয়াৰ' : lang === 'hi' ? 'स्मृति केयर' : 'SmritiCare'}
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest bg-sky-100 text-teal-800 px-2.5 py-0.5 rounded-full border border-sky-200">
                  SIH 2026 • NE India
                </span>
              </div>
              <p className="text-xs text-sky-800/80 font-medium truncate max-w-[240px] sm:max-w-none">
                {lang === 'as'
                  ? 'উত্তৰ-পূব ভাৰতৰ বাবে জ্ঞানীয় যত্ন আৰু ঔষধ সুৰক্ষা'
                  : lang === 'hi'
                  ? 'संज्ञानात्मक देखभाल एवं दवा सुरक्षा प्लेटफॉर्म'
                  : 'Cognitive Care & Medicine Safety Platform'}
              </p>
            </div>
          </div>

          {/* Role Switcher Pills */}
          <div className="hidden md:flex items-center bg-sky-50/80 p-1.5 rounded-2xl border border-sky-200/70 shadow-xs">
            {roles.map(r => {
              const isActive = settings.role === r.id;
              const roleLabel = lang === 'as' ? r.labelAs : lang === 'hi' ? r.labelHi : r.label;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-teal-900 shadow-sm border border-sky-200/80'
                      : 'text-slate-600 hover:text-teal-900 hover:bg-sky-100/60'
                  }`}
                >
                  {r.icon}
                  <span>{roleLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Top-Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-sky-200 bg-sky-50/80 text-sky-900 text-xs font-bold hover:bg-sky-100 transition-all cursor-pointer shadow-xs"
                title="Select Language (भाषा चुनें / ভাষা বাছক)"
              >
                <Globe size={16} className="text-teal-700" />
                <span>{currentLangLabel}</span>
                <ChevronDown size={14} className="text-slate-500" />
              </button>

              {isLangDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLangDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white p-2 shadow-xl border border-sky-200 z-50 animate-in fade-in zoom-in-95">
                    <p className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Language / भाषा / ভাষা
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
                              ? 'bg-teal-50 text-teal-900 font-extrabold'
                              : 'text-slate-700 hover:bg-sky-50'
                          }`}
                        >
                          <div className="text-left">
                            <p>{l.label}</p>
                            <p className="text-[10px] text-slate-400 font-normal">{l.subLabel}</p>
                          </div>
                          {isSelected && <Check size={16} className="text-teal-700" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Offline Simulation Toggle */}
            <button
              onClick={toggleSimulatedOffline}
              className={`p-2 sm:px-2.5 sm:py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                settings.isSimulatedOffline
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-teal-50 border-teal-200 text-teal-900 hover:bg-teal-100'
              }`}
              title="Toggle Simulated Offline Mode"
            >
              {settings.isSimulatedOffline ? (
                <>
                  <WifiOff size={16} className="text-amber-700" />
                  <span className="hidden lg:inline">Offline</span>
                </>
              ) : (
                <>
                  <Wifi size={16} className="text-teal-700" />
                  <span className="hidden lg:inline">Online</span>
                </>
              )}
            </button>

            {/* Accessibility Settings Trigger */}
            <button
              onClick={() => {
                if (onOpenA11y) onOpenA11y();
                else setA11yOpen(true);
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-sky-200 bg-sky-50/80 text-sky-900 text-xs font-bold hover:bg-sky-100 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Display & Accessibility Settings"
            >
              <SlidersHorizontal size={16} className="text-teal-700" />
              <span className="hidden lg:inline">
                {lang === 'as' ? 'সুবিধা' : lang === 'hi' ? 'सुविधा' : 'A11y'}
              </span>
            </button>

            {/* Emergency SOS Button */}
            <button
              onClick={() => {
                if (onOpenEmergency) onOpenEmergency();
                else setSosOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-rose-600/30 transition-all cursor-pointer active:scale-95 animate-pulse"
            >
              <AlertOctagon size={18} />
              <span>SOS</span>
            </button>
          </div>
        </div>

        {/* Mobile Role Switcher Bar */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-2 border-t border-sky-100">
          {roles.map(r => {
            const isActive = settings.role === r.id;
            const roleLabel = lang === 'as' ? r.labelAs : lang === 'hi' ? r.labelHi : r.label;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-sky-50 text-slate-700 border border-sky-200'
                }`}
              >
                {r.icon}
                <span>{roleLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
