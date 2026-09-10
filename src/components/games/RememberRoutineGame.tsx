import React, { useState, useEffect } from 'react';
import { GameShell } from './GameShell';
import { AdaptiveTierConfig } from '../../lib/adaptiveDifficulty';
import { Check, ArrowDown } from 'lucide-react';

interface RoutineStep {
  id: number;
  correctIndex: number;
  title: string;
  titleAs: string;
  timeHint: string;
  icon: string;
}

const ALL_ROUTINE_STEPS: RoutineStep[] = [
  {
    id: 1,
    correctIndex: 0,
    title: '1. Wake up at 6:00 AM',
    titleAs: '১. পুৱা সোনকালে শোৱাৰ পৰা উঠা',
    timeHint: '06:00 AM',
    icon: '🌅',
  },
  {
    id: 2,
    correctIndex: 1,
    title: '2. Wash face & brush teeth',
    titleAs: '২. মুখ হাত ধোৱা আৰু দাঁত ঘঁহা',
    timeHint: '06:30 AM',
    icon: '🪥',
  },
  {
    id: 3,
    correctIndex: 2,
    title: '3. Warm water & morning red tea',
    titleAs: '৩. কুহুমীয়া পানী আৰু পুৱাৰ ৰঙা চাহ',
    timeHint: '07:15 AM',
    icon: '☕',
  },
  {
    id: 4,
    correctIndex: 3,
    title: '4. Take morning Blood Pressure pill',
    titleAs: '৪. ৰাতিপুৱাৰ ৰক্তচাপৰ ঔষধ (টেলমিচাৰ্টান)',
    timeHint: '08:00 AM',
    icon: '💊',
  },
  {
    id: 5,
    correctIndex: 4,
    title: '5. Gentle walk in the courtyard/garden',
    titleAs: '৫. বাৰীৰ মুকলি বতাহত খোজ কঢ়া',
    timeHint: '08:45 AM',
    icon: '🚶',
  },
  {
    id: 6,
    correctIndex: 5,
    title: '6. Afternoon balanced lunch',
    titleAs: '৬. দুপৰীয়াৰ আহাৰ গ্ৰহণ',
    timeHint: '01:00 PM',
    icon: '🍲',
  },
];

export const RememberRoutineGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <GameShell
      gameId="remember-routine"
      title="Remember the Routine"
      titleAs="দৈনন্দিন ৰুটিন মনত পেলাওক"
      instructions="Tap each daily routine activity in its natural chronological order from morning to night."
      instructionsAs="পুৱাৰ পৰা গধূলিলৈ কৰিবলগীয়া কামসমূহ শুদ্ধ ক্ৰমত এটা এটাকৈ স্পৰ্শ কৰক।"
      onBack={onBack}
    >
      {({ tierConfig, onGameOver, isGameActive }) => (
        <RoutineBoard tierConfig={tierConfig} onGameOver={onGameOver} isGameActive={isGameActive} />
      )}
    </GameShell>
  );
};

const RoutineBoard: React.FC<{
  tierConfig: AdaptiveTierConfig;
  onGameOver: (score: number, maxScore: number, accuracy: number, reactionTimeMs: number) => void;
  isGameActive: boolean;
}> = ({ tierConfig, onGameOver }) => {
  const stepCount = tierConfig.routineStepCount || (tierConfig.tier === 1 ? 4 : tierConfig.tier === 2 ? 5 : 6);

  const [availableSteps, setAvailableSteps] = useState<RoutineStep[]>([]);
  const [selectedSteps, setSelectedSteps] = useState<RoutineStep[]>([]);
  const [mistakes, setMistakes] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());

  useEffect(() => {
    const subset = ALL_ROUTINE_STEPS.slice(0, stepCount).map((s, idx) => ({
      ...s,
      correctIndex: idx,
    }));
    // Scramble
    setAvailableSteps([...subset].sort(() => Math.random() - 0.5));
    setSelectedSteps([]);
    setMistakes(0);
  }, [stepCount]);

  const handleStepClick = (step: RoutineStep) => {
    const nextExpectedIndex = selectedSteps.length;

    if (step.correctIndex === nextExpectedIndex) {
      const nextSelected = [...selectedSteps, step];
      setSelectedSteps(nextSelected);
      setAvailableSteps(prev => prev.filter(s => s.id !== step.id));

      if (nextSelected.length === stepCount) {
        const durationMs = Date.now() - startTime;
        const accuracy = Math.max(50, Math.round((stepCount / (stepCount + mistakes)) * 100));
        const score = Math.max(50, Math.round(100 - mistakes * 10));
        const avgReaction = Math.round(durationMs / stepCount);
        setTimeout(() => {
          onGameOver(score, 100, accuracy, avgReaction);
        }, 500);
      }
    } else {
      setMistakes(prev => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6 text-white">
      {/* Ordered Timeline */}
      {selectedSteps.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase text-[#c084fc] tracking-wider">
            Completed Sequence:
          </p>
          <div className="space-y-2">
            {selectedSteps.map((step, idx) => (
              <div
                key={step.id}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-purple-950/40 border border-purple-400/40 text-white animate-in fade-in backdrop-blur-md shadow-md"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
                  {idx + 1}
                </div>
                <span className="text-2xl">{step.icon}</span>
                <span className="font-bold text-sm text-white">{step.titleAs}</span>
                <span className="text-xs font-mono ml-auto text-sky-200/80">{step.timeHint}</span>
              </div>
            ))}
          </div>
          {availableSteps.length > 0 && (
            <div className="flex justify-center py-1">
              <ArrowDown size={20} className="animate-bounce text-[#c084fc]" />
            </div>
          )}
        </div>
      )}

      {/* Available choices to select */}
      <div>
        <p className="text-xs font-bold uppercase text-sky-200/70 mb-3 tracking-wider">
          Select what happens next ({availableSteps.length} steps remaining):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableSteps.map(step => (
            <button
              key={step.id}
              onClick={() => handleStepClick(step)}
              className="glass-card-dark flex items-center gap-3.5 p-4 rounded-2xl border border-white/12 hover:border-purple-400/60 hover:bg-white/10 text-left transition-all cursor-pointer shadow-md active:scale-95 text-white backdrop-blur-md"
            >
              <span className="text-3xl p-2 bg-purple-500/20 rounded-xl shadow-xs border border-purple-400/30">{step.icon}</span>
              <div>
                <p className="font-bold text-sm text-white">{step.titleAs}</p>
                <p className="text-xs text-sky-200/70 font-medium">{step.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
