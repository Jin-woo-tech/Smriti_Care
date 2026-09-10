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
      <div className="flex bg-sky-100/80 p-1.5 rounded-2xl border border-sky-200 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('medicine')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'medicine'
              ? 'bg-white text-teal-900 shadow-sm border border-sky-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Pill size={18} className="text-teal-600" />
          <span>
            {lang === 'as'
              ? 'ঔষধৰ পেকেট স্কেন'
              : lang === 'hi'
              ? 'दवा पैकेट स्कैनर'
              : 'Medicine Packaging'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('lab')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'lab'
              ? 'bg-white text-teal-900 shadow-sm border border-sky-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText size={18} className="text-sky-600" />
          <span>
            {lang === 'as'
              ? 'লেব ৰিপৰ্ট ব্যাখ্যা'
              : lang === 'hi'
              ? 'लैब रिपोर्ट अनुवाद'
              : 'Lab Reports'}
          </span>
        </button>
      </div>

      {activeTab === 'medicine' ? <MedicineSafetyScanner /> : <LabReportAnalyzer />}
    </div>
  );
};
