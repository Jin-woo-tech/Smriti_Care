import React, { useState } from 'react';
import {
  User,
  Users,
  Stethoscope,
  Activity,
  Brain,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { getTranslation } from '../../lib/i18n';
import { VoiceNarratorButton } from '../common/VoiceNarratorButton';
import { Smriti3DLogoVisual } from './Smriti3DLogoVisual';
import { HologramGlobeVisual } from './HologramGlobeVisual';

interface LandingPageProps {
  onSelectRole: (role: Role) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  const { settings, setRole } = useApp();
  const lang = settings.language;
  const [activeNav, setActiveNav] = useState<'home' | 'about' | 'services' | 'portals' | 'safety' | 'contact'>('home');

  const handleRoleClick = (role: Role) => {
    setRole(role);
    onSelectRole(role);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const roleCards = [
    {
      role: 'patient' as Role,
      title: 'Elder / Senior Patient',
      titleHi: 'वरिष्ठ नागरिक / मरीज',
      titleAs: 'জ্যেষ্ঠ নাগৰিক / ৰোগী',
      desc: 'Simple large buttons, daily routine audio alerts, 6 cultural brain games, nostalgic photo album, and Smriti Sathi AI.',
      descHi: 'सरल और बड़े बटन वाला दैनिक दिनचर्या शेड्यूल, वॉयस अलर्ट, 6 दिमागी खेल, स्मृति एल्बम और स्नेही AI साथी।',
      descAs: 'সহজ আৰু ডাঙৰ বুটামৰ সৈতে দৈনিক ঔষধ খোৱাৰ সময়সূচী, ৬ টা মগজুৰ খেল, পুৰণি স্মৃতি আৰু AI সহায়িকা।',
      icon: <User size={26} className="text-[#c084fc]" />,
      badge: 'Senior Mode',
      badgeHi: 'वरिष्ठ मोड',
      badgeAs: 'সহজ জ্যেষ্ঠ মোড',
    },
    {
      role: 'caregiver' as Role,
      title: 'Family Caregiver',
      titleHi: 'पारिवारिक देखभालकर्ता',
      titleAs: 'পৰিয়ালৰ তত্ত্বাৱধায়ক',
      desc: 'Track 7-day cognitive performance trend, baseline stability, hydration & medication adherence, and urgent alerts.',
      descHi: '7-दिवसीय संज्ञानात्मक प्रदर्शन रुझान, दवा और जल सेवन ट्रैकिंग एवं महत्वपूर्ण अलर्ट।',
      descAs: 'বিগত ৭ দিনৰ স্মৃতি আৰু দক্ষতাৰ ধাৰা, ঔষধ আৰু পানী খোৱাৰ হিচাপ, আৰু প্ৰয়োজনীয় সতৰ্কবাৰ্তা।',
      icon: <Users size={26} className="text-sky-300" />,
      badge: 'Family Portal',
      badgeHi: 'परिवार पोर्टल',
      badgeAs: 'পৰিয়াল পোৰ্টেল',
    },
    {
      role: 'clinician' as Role,
      title: 'Doctor / PHC Clinician',
      titleHi: 'चिकित्सक / डॉक्टर',
      titleAs: 'চিকিৎসক / ডাক্তৰ',
      desc: 'Longitudinal cognitive domain radar, baseline deviations, adherence compliance, and 1-click Downloadable Clinical PDF.',
      descHi: 'संज्ञानात्मक डोमेन रडार चार्ट, दवा अनुपालन और 1-क्लिक डाउनलोड करने योग्य क्लिनिकल PDF रिपोर्ट।',
      descAs: 'মগজুৰ বিভিন্ন দিশৰ অগ্ৰগতি, ঔষধৰ নিয়মীয়া হিচাপ আৰু চিকিৎসা প্ৰতিবেদন (PDF) ডাউনল’ড।',
      icon: <Stethoscope size={26} className="text-purple-300" />,
      badge: 'Clinical Portal',
      badgeHi: 'क्लिनिकल पोर्टल',
      badgeAs: 'চিকিৎসক পোৰ্টেল',
    },
    {
      role: 'asha' as Role,
      title: 'ASHA / Health Worker',
      titleHi: 'आशा / स्वास्थ्य कार्यकर्ता',
      titleAs: 'আশা / স্বাস্থ্য কৰ্মী',
      desc: 'Village geriatric roster, offline screening test execution, home visit logging, and medicine stock tracking.',
      descHi: 'ग्रामीण बुजुर्ग सूची, ऑफलाइन स्क्रीनिंग परीक्षण, गृह भ्रमण लॉगिंग और दवा स्टॉक ट्रैकिंग।',
      descAs: 'গাঁও ভিত্তিক জ্যেষ্ঠ নাগৰিকৰ তালিকা, অফলাইন স্ক্ৰীনিং পৰীক্ষা, গৃহ পৰিদৰ্শন আৰু ঔষধৰ তথ্য।',
      icon: <Activity size={26} className="text-indigo-300" />,
      badge: 'Field Portal',
      badgeHi: 'फील्ड पोर्टल',
      badgeAs: 'ফিল্ড পোৰ্টেল',
    },
  ];

  const getCardTitle = (card: typeof roleCards[0]) => {
    if (lang === 'as') return card.titleAs;
    if (lang === 'hi') return card.titleHi;
    return card.title;
  };

  const getCardDesc = (card: typeof roleCards[0]) => {
    if (lang === 'as') return card.descAs;
    if (lang === 'hi') return card.descHi;
    return card.desc;
  };

  const getCardBadge = (card: typeof roleCards[0]) => {
    if (lang === 'as') return card.badgeAs;
    if (lang === 'hi') return card.badgeHi;
    return card.badge;
  };

  return (
    <div className="space-y-12 py-2 text-white">
      {/* ========================================================================= */}
      {/* HERO SHOWCASE CONTAINER IN PURPLE & DEEP BLUE */}
      {/* ========================================================================= */}
      <div className="relative rounded-[32px] sm:rounded-[44px] border-2 border-purple-400/20 bg-gradient-to-b from-[#1e1b4b]/80 via-[#0f172a]/90 to-[#0c1222] p-5 sm:p-8 md:p-10 shadow-2xl shadow-slate-950/40 text-white overflow-hidden">
        {/* Cybernetic grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(rgba(192, 132, 252, 0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Ambient Top & Bottom Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-purple-500/15 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-indigo-600/15 blur-[120px] pointer-events-none rounded-full" />

        {/* TOP INNER NAVIGATION BAR */}
        <header className="relative z-20 flex items-center justify-between pb-6 sm:pb-8 border-b border-white/10">
          {/* Logo Brand: SmritiCare with Official Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-indigo-600/30 border border-purple-400/40 p-1 flex items-center justify-center shadow-lg shadow-purple-600/30 backdrop-blur-md">
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
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              <span>SmritiCare</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-400/30 hidden sm:inline-block">
                SIH 2026
              </span>
            </span>
          </div>

          {/* Centered Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold text-stone-300">
            <button
              onClick={() => {
                setActiveNav('home');
                scrollToSection('hero-main');
              }}
              className={`transition-colors cursor-pointer ${
                activeNav === 'home'
                  ? 'text-[#c084fc] font-black border-b-2 border-[#c084fc] pb-1'
                  : 'hover:text-white'
              }`}
            >
              {lang === 'as' ? 'ঘৰ (Home)' : lang === 'hi' ? 'होम (Home)' : 'Home'}
            </button>
            <button
              onClick={() => {
                setActiveNav('about');
                scrollToSection('portals-section');
              }}
              className={`transition-colors cursor-pointer ${
                activeNav === 'about'
                  ? 'text-[#c084fc] font-black border-b-2 border-[#c084fc] pb-1'
                  : 'hover:text-white'
              }`}
            >
              {lang === 'as' ? 'প’ৰ্টেলসমূহ (Portals)' : lang === 'hi' ? 'पोर्टल (Portals)' : 'Portals'}
            </button>
            <button
              onClick={() => {
                setActiveNav('services');
                scrollToSection('games-section');
              }}
              className={`transition-colors cursor-pointer ${
                activeNav === 'services'
                  ? 'text-[#c084fc] font-black border-b-2 border-[#c084fc] pb-1'
                  : 'hover:text-white'
              }`}
            >
              {lang === 'as' ? 'স্মৃতি খেল (Games)' : lang === 'hi' ? 'स्मृति खेल (Games)' : 'Memory Games'}
            </button>
            <button
              onClick={() => {
                setActiveNav('safety');
                scrollToSection('safety-section');
              }}
              className={`transition-colors cursor-pointer ${
                activeNav === 'safety'
                  ? 'text-[#c084fc] font-black border-b-2 border-[#c084fc] pb-1'
                  : 'hover:text-white'
              }`}
            >
              {lang === 'as' ? 'ঔষধ সুৰক্ষা (Safety)' : lang === 'hi' ? 'दवा सुरक्षा (Safety)' : 'Safety AI'}
            </button>
          </nav>

          {/* Right Action Button: Join Now / Enter Portal Pill */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleRoleClick('patient')}
              className="px-5 sm:px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all shadow-lg hover:border-purple-400/50 cursor-pointer"
            >
              {lang === 'as' ? 'প্ৰৱেশ কৰক' : lang === 'hi' ? 'शुरू करें' : 'Join Now'}
            </button>
          </div>
        </header>

        {/* CENTER MAIN HERO WITH 3D HEART & GIANT TYPOGRAPHY */}
        <div id="hero-main" className="relative pt-6 sm:pt-10 pb-4">
          {/* Giant Typography Background */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none select-none z-0 px-2 sm:px-6 opacity-80">
            <span className="text-5xl sm:text-7xl md:text-9xl lg:text-[140px] font-black tracking-tighter text-white/90 leading-none drop-shadow-md">
              SMRITI
            </span>
            <span className="text-5xl sm:text-7xl md:text-9xl lg:text-[140px] font-black tracking-tighter text-white/90 leading-none drop-shadow-md">
              CARE
            </span>
          </div>

          {/* Subtitles & Badges on the sides of typography */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-2 text-xs sm:text-sm text-sky-100/90 font-medium">
            <p className="max-w-xs leading-relaxed">
              {lang === 'as'
                ? 'জ্যেষ্ঠ নাগৰিকৰ মগজুৰ সতেজতা আৰু স্বাস্থ্য যত্ন।'
                : lang === 'hi'
                ? 'स्वस्थ जीवन के लिए व्यक्तिगत संज्ञानात्मक देखभाल।'
                : 'Personalized care for healthier living.'}
            </p>
            <div className="flex items-center gap-2 font-mono text-xs text-sky-200">
              <span>Since</span>
              <span className="text-[#c084fc] font-bold">⚡ 2026</span>
              <span>• Titabor, Assam</span>
            </div>
          </div>

          {/* Central 3D Glossy SmritiCare Logo Artwork with Purple 'Explore Services' Button */}
          <div className="relative z-10 my-2 sm:my-4">
            <Smriti3DLogoVisual
              onExplore={() => scrollToSection('portals-section')}
              exploreLabel={
                lang === 'as'
                  ? 'সেৱা আৰু প’ৰ্টেলসমূহ চাওক'
                  : lang === 'hi'
                  ? 'देखभाल सेवाएं देखें'
                  : 'Explore Services'
              }
            />
          </div>

          {/* BOTTOM FLOATING FROSTED GLASS CARDS */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-end pt-4">
            {/* 1. Left Section: User Avatars + 3k+ Rating + Connector Line + Pill */}
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-[#1e1b4b] flex items-center justify-center text-xs font-bold text-slate-900">
                    👵
                  </div>
                  <div className="w-8 h-8 rounded-full bg-sky-400 border-2 border-[#1e1b4b] flex items-center justify-center text-xs font-bold text-slate-900">
                    👴
                  </div>
                  <div className="w-8 h-8 rounded-full bg-indigo-400 border-2 border-[#1e1b4b] flex items-center justify-center text-xs font-bold text-slate-900">
                    👩⚕️
                  </div>
                  <div className="w-8 h-8 rounded-full bg-fuchsia-400 border-2 border-[#1e1b4b] flex items-center justify-center text-xs font-bold text-slate-900">
                    🩺
                  </div>
                </div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>3k+</span>
                  <span className="text-amber-300">★</span>
                  <span className="text-sky-200 text-[11px]">(4.9)</span>
                </div>
              </div>

              {/* Vertical connector line with glowing dot */}
              <div className="flex flex-col items-center pl-4 py-1">
                <div className="w-0.5 h-6 bg-purple-300/40" />
                <div className="w-2 h-2 rounded-full bg-[#c084fc] shadow-sm shadow-purple-400" />
              </div>

              {/* Pill badge */}
              <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-sky-100 shadow-md">
                {lang === 'as'
                  ? 'আপোনাৰ স্বাস্থ্য আপোনাৰ হাতত।'
                  : lang === 'hi'
                  ? 'आपका स्वास्थ्य आपके हाथों में।'
                  : 'Your health in your hands.'}
              </div>
            </div>

            {/* 2. Center Feature Card: Doctor Spotlight + 92% Satisfaction */}
            <div className="glass-card-dark rounded-3xl p-4 sm:p-5 shadow-2xl flex items-center gap-4 hover:border-purple-400/40 transition-all">
              {/* Doctor Avatar */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-purple-600 to-indigo-500 shrink-0 border border-white/30">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
                  alt="Dr. Emma Roberts / Dr. Priyam Baruah"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    92%
                  </span>
                  <span className="text-[11px] font-bold text-purple-200 leading-tight">
                    {lang === 'as' ? 'ৰোগী সন্তুষ্টি হাৰ' : lang === 'hi' ? 'मरीज संतुष्टि दर' : 'Patient Satisfaction Rate'}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {lang === 'as' ? 'ডাঃ প্ৰিয়ম বৰুৱা (MD)' : lang === 'hi' ? 'डॉ. प्रियम बरुआ (MD)' : 'Dr. Emma Roberts (MD)'}
                </h4>
                <p className="text-[10px] font-extrabold text-[#c084fc] tracking-wider uppercase">
                  15+ YEARS EXPERIENCE
                </p>
              </div>
            </div>

            {/* 3. Right Card: Regional Outreach & Glowing 3D Hologram Globe */}
            <div className="flex flex-col items-start md:items-end justify-between gap-3 text-left md:text-right">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  {lang === 'as'
                    ? '২৫+ জিলাত জ্যেষ্ঠ নাগৰিকৰ সেৱাত নিয়োজিত'
                    : lang === 'hi'
                    ? '25+ जिलों में बुजुर्गों की सेवा में समर्पित'
                    : 'Serving patients across 25+ districts'}
                </h3>
              </div>

              {/* Glowing Holographic Globe */}
              <div className="flex items-center gap-3">
                <HologramGlobeVisual />
              </div>

              <button
                onClick={() => scrollToSection('portals-section')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c084fc] hover:underline cursor-pointer"
              >
                <span>{lang === 'as' ? 'অধিক জানক' : lang === 'hi' ? 'और जानें' : 'Learn More'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: STAKEHOLDER CARE PORTALS */}
      {/* ========================================================================= */}
      <section id="portals-section" className="space-y-6 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold backdrop-blur-md">
            <Sparkles size={14} className="text-[#c084fc]" />
            <span>4 Dedicated Stakeholder Interfaces</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {lang === 'as'
              ? 'আপোনাৰ প্ৰৱেশ ভূমিকা বাছক'
              : lang === 'hi'
              ? 'अपना देखभाल पोर्टल चुनें'
              : 'Choose Your Care Portal'}
          </h2>
          <p className="text-xs sm:text-sm text-sky-200/80 font-medium">
            {lang === 'as'
              ? 'প্ৰতিটো ভূমিকাৰ বাবে বিশেষভাৱে নিৰ্মাণ কৰা আধুনিক পৰ্টেল'
              : lang === 'hi'
              ? 'प्रत्येक हितधारक के लिए विशेष रूप से डिज़ाइन किया गया इंटरफ़ेस।'
              : 'Select one of four specialized interfaces tailored for each stakeholder.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roleCards.map(card => (
            <div
              key={card.role}
              onClick={() => handleRoleClick(card.role)}
              className="glass-card-dark rounded-[2.5rem] p-7 hover:border-purple-400/60 shadow-xl cursor-pointer group flex flex-col justify-between glass-hover-shine"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-xs font-extrabold tracking-wider uppercase px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 shadow-xs">
                    {getCardBadge(card)}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white mb-2 group-hover:text-[#c084fc] transition-colors">
                  {getCardTitle(card)}
                </h3>
                <p className="text-xs sm:text-sm text-sky-100/80 leading-relaxed mb-6 font-medium">
                  {getCardDesc(card)}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs font-bold text-[#c084fc] flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform">
                  {lang === 'as' ? 'প’ৰ্টেলত প্ৰৱেশ কৰক' : lang === 'hi' ? 'पोर्टल में प्रवेश करें' : 'Enter Portal'}
                  <ArrowRight size={16} />
                </span>
                <VoiceNarratorButton
                  textToRead={`${getCardTitle(card)}. ${getCardDesc(card)}`}
                  size="sm"
                  className="bg-purple-500/20 hover:bg-purple-500/30 text-white border-purple-400/30"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: KEY PLATFORM CAPABILITIES & BIOMARKERS */}
      {/* ========================================================================= */}
      <section id="games-section" className="rounded-[2.5rem] bg-gradient-to-br from-[#1e1b4b]/80 via-[#111827]/90 to-[#0c1222]/90 backdrop-blur-2xl border border-white/15 p-6 sm:p-9 shadow-2xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <ShieldCheck className="text-[#c084fc]" size={26} />
            <span>
              {lang === 'as'
                ? 'স্মৃতি কেয়াৰৰ মুখ্য বৈশিষ্ট্য আৰু ডায়গনষ্টিকছ'
                : lang === 'hi'
                ? 'मुख्य मंच विशेषताएं एवं बायोमार्कर'
                : 'Key Platform Capabilities & Biomarkers'}
            </span>
          </h3>

          <span className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] text-white px-3.5 py-1 rounded-full shadow-md shadow-purple-600/30">
            Digital Health Stack
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {/* Card 1 */}
          <div className="p-6 rounded-[2rem] glass-card-dark border border-white/15 hover:border-purple-400/50 transition-all group glass-hover-shine">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Brain size={24} />
            </div>
            <h4 className="font-black text-base text-white group-hover:text-[#c084fc] transition-colors">
              {lang === 'as' ? '৬ টা অভিযোজিত খেল' : lang === 'hi' ? '6 अनुकूलनीय खेल' : '6 Adaptive Memory Games'}
            </h4>
            <p className="text-xs text-sky-200/80 mt-2 leading-relaxed font-medium">
              {lang === 'as'
                ? 'জাপি মিলোৱা, পথ অনুসৰণ, দৈনন্দিন ৰুটিন আৰু থলুৱা স্মৃতি খেল যিয়ে স্বয়ংক্ৰিয়ভাৱে কাঠিন্য নিয়ন্ত্ৰণ কৰে।'
                : lang === 'hi'
                ? 'सांस्कृतिक प्रतीक, पैटर्न मिलान और अनुक्रम खेल जो कठिनाई स्तर को अनुकूलित करते हैं।'
                : 'Culturally localized games with 3-tier dynamic adaptive difficulty based on reaction time and accuracy.'}
            </p>
          </div>

          {/* Card 2 */}
          <div id="safety-section" className="p-6 rounded-[2rem] glass-card-dark border border-white/15 hover:border-sky-400/50 transition-all group glass-hover-shine">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <h4 className="font-black text-base text-white group-hover:text-sky-300 transition-colors">
              {lang === 'as' ? 'AI ঔষধ আৰু লেব সুৰক্ষা' : lang === 'hi' ? 'AI दवा व लैब सुरक्षा' : 'AI Medicine & Lab Safety'}
            </h4>
            <p className="text-xs text-sky-200/80 mt-2 leading-relaxed font-medium">
              {lang === 'as'
                ? 'AI Vision ঔষধৰ পেকেট চিনাক্তকৰণ, প্ৰেচক্ৰিপশ্বনৰ সৈতে সময় মিলোৱা আৰু সহজ লেব ৰিপৰ্ট ব্যাখ্যা।'
                : lang === 'hi'
                ? 'AI विजन दवा पैकेजिंग पहचान, समय सत्यापन और लैब रिपोर्ट का सरल हिंदी अनुवाद।'
                : 'AI Vision strip identification, cross-verification against prescription times, and simplified lab report translation.'}
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-[2rem] glass-card-dark border border-white/15 hover:border-purple-400/50 transition-all group glass-hover-shine">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-[#c084fc] border border-purple-400/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HeartHandshake size={24} />
            </div>
            <h4 className="font-black text-base text-white group-hover:text-[#c084fc] transition-colors">
              {lang === 'as' ? 'পৰিয়ালৰ স্মৃতি এলবাম' : lang === 'hi' ? 'स्मृति एल्बम' : 'Memory Journal & Sathi'}
            </h4>
            <p className="text-xs text-sky-200/80 mt-2 leading-relaxed font-medium">
              {lang === 'as'
                ? 'পাৰিবাৰিক ফটো কাহিনী, অডিঅ’ স্মৃতি সংকেত আৰু Smriti Sathi AI সংগী।'
                : lang === 'hi'
                ? 'पारिवारिक फोटो कहानियां, ऑडियो स्मृति संकेत और भावनात्मक जुड़ाव के लिए AI साथी।'
                : 'Interactive family photo stories, audio reminiscence cues, and empathetic Smriti Sathi conversational AI.'}
            </p>
          </div>
        </div>
      </section>

      {/* Safety Notice & Medical Disclaimer */}
      <section className="rounded-2xl bg-purple-950/40 border border-purple-400/30 p-5 text-purple-200 text-xs sm:text-sm leading-relaxed backdrop-blur-md">
        <p className="font-bold mb-1 flex items-center gap-1.5 text-purple-300">
          <span>⚠️</span> {getTranslation('clinicalDisclaimerTitle', lang)}
        </p>
        <p className="text-sky-200/80 font-medium">{getTranslation('clinicalDisclaimer', lang)}</p>
      </section>
    </div>
  );
};
