import React, { useState } from 'react';
import {
  LayoutDashboard,
  Pill,
  Brain,
  Heart,
  ShieldCheck,
  MessageSquare,
  PhoneCall,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';
import { useApp } from './context/AppContext';
import { Sidebar, PatientTab } from './components/common/Sidebar';
import { TopHeader } from './components/common/TopHeader';
import { OfflineBanner } from './components/common/OfflineBanner';
import { EmergencyModal } from './components/common/EmergencyModal';
import { A11yModal } from './components/common/A11yModal';
import { LandingPage } from './components/landing/LandingPage';
import { PatientDashboard } from './components/dashboards/PatientDashboard';
import { CaregiverDashboard } from './components/dashboards/CaregiverDashboard';
import { ClinicianDashboard } from './components/dashboards/ClinicianDashboard';
import { AshaDashboard } from './components/dashboards/AshaDashboard';
import { DailyRoutine } from './components/routine/DailyRoutine';
import { GameHub } from './components/games/GameHub';
import { MemoryJournal } from './components/journal/MemoryJournal';
import { SafetyHub } from './components/safety/SafetyHub';
import { AIChatCompanion } from './components/chat/AIChatCompanion';

export const App: React.FC = () => {
  const { currentRole, setRole, settings, setSosOpen, setA11yOpen } = useApp();
  const lang = settings.language;

  const [activeTab, setActiveTab] = useState<PatientTab>('dashboard');
  const [showLanding, setShowLanding] = useState<boolean>(true); // Default to Landing Showcase matching Image #10
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Tab definitions for Patient Mode
  const patientTabs: { id: PatientTab; labelEn: string; labelHi: string; labelAs: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      labelEn: 'Dashboard',
      labelHi: 'डैशबोर्ड',
      labelAs: 'ডেচবৰ্ড',
      icon: <LayoutDashboard size={17} />,
    },
    {
      id: 'routine',
      labelEn: 'Medicines & Routine',
      labelHi: 'दैनिक दिनचर्या',
      labelAs: 'দৈনিক ঔষধ',
      icon: <Pill size={17} />,
    },
    {
      id: 'games',
      labelEn: 'Memory Games',
      labelHi: 'दिमागी खेल',
      labelAs: 'মগজুৰ খেল',
      icon: <Brain size={17} />,
    },
    {
      id: 'journal',
      labelEn: 'Family Album',
      labelHi: 'स्मृति एल्बम',
      labelAs: 'পৰিয়াল এলবাম',
      icon: <Heart size={17} />,
    },
    {
      id: 'safety',
      labelEn: 'Medicine & Lab',
      labelHi: 'दवा व लैब सुरक्षा',
      labelAs: 'ঔষধ সুৰক্ষা',
      icon: <ShieldCheck size={17} />,
    },
    {
      id: 'chat',
      labelEn: 'Smriti Sathi (AI)',
      labelHi: 'स्मृति साथी (AI)',
      labelAs: 'স্মৃতি সাথী',
      icon: <MessageSquare size={17} />,
    },
  ];

  const getTabLabel = (tab: typeof patientTabs[0]) => {
    if (lang === 'as') return tab.labelAs;
    if (lang === 'hi') return tab.labelHi;
    return tab.labelEn;
  };

  return (
    <div className="relative min-h-screen bg-[#0b1c30] text-white flex font-sans transition-colors duration-200 antialiased selection:bg-[#c5f82a] selection:text-slate-950 overflow-x-hidden">
      {/* Ambient Luminous Frosted Glow Orbs matching Image #12 */}
      <div className="fixed -top-40 -left-40 w-[28rem] h-[28rem] bg-cyan-400/20 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="fixed top-1/4 -right-40 w-[32rem] h-[32rem] bg-[#c5f82a]/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-10 left-1/4 w-[30rem] h-[30rem] bg-sky-500/18 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed -bottom-20 -right-20 w-[24rem] h-[24rem] bg-emerald-400/15 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setShowLanding(false);
        }}
        showLanding={showLanding}
        onToggleLanding={(show) => setShowLanding(show)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden min-h-screen">
        {/* Top Offline Notification Banner */}
        <OfflineBanner />

        {/* Modern Top Header matching Image #10 */}
        <TopHeader
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        />

        {/* Landing / Architecture Overview Banner */}
        {showLanding ? (
          <div className="bg-[#c5f82a]/15 border-b border-[#c5f82a]/30 py-2.5 px-4 text-center backdrop-blur-md flex items-center justify-center gap-2">
            <button
              onClick={() => setShowLanding(false)}
              className="inline-flex items-center gap-2 text-xs font-black text-[#c5f82a] hover:text-white cursor-pointer transition-colors"
            >
              <Compass size={14} className="text-[#c5f82a]" />
              <span>
                {lang === 'as'
                  ? 'প্ৰত্যক্ষ প’ৰ্টেললৈ উভতি যাওক (Return to Active Role Portal)'
                  : lang === 'hi'
                  ? 'सक्रिय पोर्टल पर वापस जाएं (Return to Active Role Portal)'
                  : 'Return to Active Role Portal'}
              </span>
            </button>
          </div>
        ) : (
          /* Horizontal quick-pill tab selector for Patient role on desktop & tablet */
          currentRole === 'patient' && (
            <div className="bg-[#14263d]/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-2.5 z-10 sticky top-[61px]">
              <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
                {patientTabs.map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#c5f82a] text-slate-950 font-black shadow-md shadow-[#c5f82a]/25'
                          : 'text-sky-200/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {tab.icon}
                      <span>{getTabLabel(tab)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )
        )}

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
          {showLanding ? (
            <LandingPage
              onSelectRole={(role) => {
                setRole(role);
                setShowLanding(false);
                setActiveTab('dashboard');
              }}
            />
          ) : (
            <>
              {currentRole === 'patient' && (
                <div className="animate-in fade-in duration-200">
                  {activeTab === 'dashboard' && (
                    <PatientDashboard
                      onNavigateTab={(tab) => setActiveTab(tab)}
                      onOpenEmergency={() => setSosOpen(true)}
                    />
                  )}
                  {activeTab === 'routine' && <DailyRoutine />}
                  {activeTab === 'games' && <GameHub />}
                  {activeTab === 'journal' && <MemoryJournal />}
                  {activeTab === 'safety' && <SafetyHub />}
                  {activeTab === 'chat' && <AIChatCompanion />}
                </div>
              )}

              {currentRole === 'caregiver' && <CaregiverDashboard />}
              {currentRole === 'clinician' && <ClinicianDashboard />}
              {currentRole === 'asha' && (
                <AshaDashboard
                  onStartScreening={() => {
                    setRole('patient');
                    setActiveTab('games');
                  }}
                />
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-[#101e30]/90 backdrop-blur-xl border-t border-white/10 mt-12 py-8 px-4 sm:px-8 text-white">
          <div className="max-w-7xl mx-auto text-center space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-sky-200">
              <span className="text-[#c5f82a] font-extrabold">SmritiCare (স্মৃতি কেয়াৰ / स्मृति केयर)</span>
              <span>•</span>
              <span>Smart India Hackathon SIH 2026</span>
              <span>•</span>
              <span>Titabor, Jorhat, Assam</span>
            </div>

            <p className="text-[11px] text-sky-200/50 max-w-2xl mx-auto leading-relaxed">
              Clinical Safety Notice: SmritiCare is a supportive cognitive stimulation and medication adherence companion. It does not provide medical diagnoses of Alzheimer's Disease or related cognitive conditions. In case of acute medical emergencies, contact Assam Emergency Services (108) or your primary healthcare centre immediately.
            </p>
          </div>
        </footer>
      </div>

      {/* Floating Emergency & Accessibility Triggers */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5">
        <button
          onClick={() => setA11yOpen(true)}
          title="Display & Font Accessibility"
          className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-xl shadow-xl flex items-center justify-center text-white hover:text-[#c5f82a] cursor-pointer transition-all active:scale-95"
        >
          <SlidersHorizontal size={20} />
        </button>

        <button
          onClick={() => setSosOpen(true)}
          title="Emergency SOS Call"
          className="w-12 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/30 flex items-center justify-center cursor-pointer transition-all active:scale-95 animate-pulse"
        >
          <PhoneCall size={20} />
        </button>
      </div>

      {/* Modals */}
      <EmergencyModal />
      <A11yModal />
    </div>
  );
};

export default App;
