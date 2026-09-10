import React, { useState } from 'react';
import {
  Menu,
  Search,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  Check,
  PhoneCall,
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
  } = useApp();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const lang = settings.language;

  const languages: { id: Language; label: string; subLabel: string }[] = [
    { id: 'en', label: 'English', subLabel: 'English (India)' },
    { id: 'hi', label: 'हिन्दी', subLabel: 'Hindi' },
    { id: 'as', label: 'অসমীয়া', subLabel: 'Assamese' },
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

          {/* Search Pill Input matching Image #10 glass aesthetic */}
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
                lang === 'as'
                  ? 'ঔষধ, দিনচৰ্যা, মগজুৰ খেল, লেব ৰিপৰ্ট বিচাৰক...'
                  : lang === 'hi'
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
