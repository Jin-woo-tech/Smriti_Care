import React, { useState } from 'react';
import { Pill, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MedicineSafetyScanner } from './MedicineSafetyScanner';
import { LabReportAnalyzer } from './LabReportAnalyzer';

export const SafetyHub: React.FC = () => {
  const { settings } = useApp();
  const lang = settings.language;
  const [activeTab, setActiveTab] = useState<'medicine' | 'lab'>('medicine');

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex bg-white/10 p-1.5 rounded-2xl border border-white/15 max-w-md mx-auto backdrop-blur-md shadow-lg">
        <button
          onClick={() => setActiveTab('medicine')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'medicine'
              ? 'bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] text-white shadow-md border border-purple-400/30'
              : 'text-sky-200/70 hover:text-white'
          }`}
        >
          <Pill size={18} className={activeTab === 'medicine' ? 'text-white' : 'text-[#c084fc]'} />
          <span>
            {lang === 'hi'
              ? 'दवा पैकेट स्कैनर'
              : 'Medicine Packaging'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('lab')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'lab'
              ? 'bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] text-white shadow-md border border-purple-400/30'
              : 'text-sky-200/70 hover:text-white'
          }`}
        >
          <FileText size={18} className={activeTab === 'lab' ? 'text-white' : 'text-sky-300'} />
          <span>
            {lang === 'hi'
              ? 'लैब रिपोर्ट अनुवाद'
              : 'Lab Reports'}
          </span>
        </button>
      </div>

      {activeTab === 'medicine' ? <MedicineSafetyScanner /> : <LabReportAnalyzer />}
    </div>
  );
};
