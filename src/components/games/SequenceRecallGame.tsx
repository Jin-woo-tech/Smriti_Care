import React, { useState, useEffect } from 'react';
import { GameShell } from './GameShell';
import { AdaptiveTierConfig } from '../../lib/adaptiveDifficulty';

interface ColorPad {
  id: number;
  colorName: string;
  symbol: string;
  symbolAs: string;
  bgActive: string;
  bgInactive: string;
  borderActive: string;
  icon: string;
}

const PADS: ColorPad[] = [
  {
    id: 0,
    colorName: 'Green',
    symbol: 'Tea Leaf',
    symbolAs: 'চাহ পাত',
    bgActive: 'bg-emerald-400 scale-105 shadow-xl shadow-emerald-500/50',
    bgInactive: 'bg-emerald-700/80 hover:bg-emerald-600',
    borderActive: 'border-emerald-200 ring-4 ring-emerald-300',
    icon: '🍃',
  },
  {
    id: 1,
    colorName: 'Amber',
    symbol: 'Xorai Stand',
    symbolAs: 'শৰাই',
    bgActive: 'bg-amber-300 scale-105 shadow-xl shadow-amber-500/50',
    bgInactive: 'bg-amber-600/80 hover:bg-amber-500',
    borderActive: 'border-amber-100 ring-4 ring-amber-300',
    icon: '🏆',
  },
  {
    id: 2,
    colorName: 'Blue',
    symbol: 'Brahmaputra',
    symbolAs: 'ব্ৰহ্মপুত্ৰ',
    bgActive: 'bg-blue-400 scale-105 shadow-xl shadow-blue-500/50',
    bgInactive: 'bg-blue-700/80 hover:bg-blue-600',
    borderActive: 'border-blue-200 ring-4 ring-blue-300',
    icon: '🌊',
  },
  {
    id: 3,
    colorName: 'Red',
    symbol: 'Gamosa',
    symbolAs: 'গামোচা',
    bgActive: 'bg-rose-400 scale-105 shadow-xl shadow-rose-500/50',
    bgInactive: 'bg-rose-700/80 hover:bg-rose-600',
    borderActive: 'border-rose-200 ring-4 ring-rose-300',
    icon: '🧣',
  },
];

export const SequenceRecallGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <GameShell
      gameId="sequence-recall"
      title="Sequence Recall"
      titleAs="ৰং আৰু শব্দৰ ক্ৰম"
      instructions="Watch the glowing sequence of colors, then repeat it by tapping the same pads in order."
      instructionsAs="জ্বলি উঠা ৰং আৰু প্ৰতীকসমূহ লক্ষ্য কৰক আৰু সেই একে ক্ৰমত স্পৰ্শ কৰক।"
      onBack={onBack}
    >
      {({ tierConfig, onGameOver, isGameActive }) => (
        <SequenceBoard tierConfig={tierConfig} onGameOver={onGameOver} isGameActive={isGameActive} />
      )}
    </GameShell>
  );
};

const SequenceBoard: React.FC<{
  tierConfig: AdaptiveTierConfig;
  onGameOver: (score: number, maxScore: number, accuracy: number, reactionTimeMs: number) => void;
  isGameActive: boolean;
}> = ({ tierConfig, onGameOver }) => {
  const targetLength = tierConfig.sequenceLength || (tierConfig.tier === 1 ? 3 : tierConfig.tier === 2 ? 4 : 5);

  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [isShowingSequence, setIsShowingSequence] = useState<boolean>(true);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [startTime] = useState<number>(Date.now());

  // Generate sequence
  useEffect(() => {
    const seq: number[] = [];
    for (let i = 0; i < targetLength; i++) {
      seq.push(Math.floor(Math.random() * 4));
    }
    setSequence(seq);
    setCurrentRound(1);
    playSequence(seq.slice(0, 2));
  }, [targetLength]);

  const playSequence = async (seqToPlay: number[]) => {
    setIsShowingSequence(true);
    setPlayerInput([]);

    await new Promise(r => setTimeout(r, 600));

    for (let i = 0; i < seqToPlay.length; i++) {
      setActivePad(seqToPlay[i]);
      await new Promise(r => setTimeout(r, 650));
      setActivePad(null);
      await new Promise(r => setTimeout(r, 250));
    }

    setIsShowingSequence(false);
  };

  const handlePadClick = (padId: number) => {
    if (isShowingSequence) return;

    // Flash briefly
    setActivePad(padId);
    setTimeout(() => setActivePad(null), 200);

    const nextInput = [...playerInput, padId];
    setPlayerInput(nextInput);

    const checkIdx = nextInput.length - 1;
    const currentSubSeq = sequence.slice(0, currentRound + 1);

    if (nextInput[checkIdx] !== currentSubSeq[checkIdx]) {
      // Mistake, replay current sequence
      setTimeout(() => {
        playSequence(currentSubSeq);
      }, 700);
      return;
    }

    // Finished current round?
    if (nextInput.length === currentSubSeq.length) {
      if (currentSubSeq.length >= targetLength) {
        // Game win!
        const durationMs = Date.now() - startTime;
        setTimeout(() => {
          onGameOver(100, 100, 100, Math.round(durationMs / targetLength));
        }, 500);
      } else {
        // Step to next sequence length
        setCurrentRound(prev => prev + 1);
        setTimeout(() => {
          playSequence(sequence.slice(0, currentRound + 2));
        }, 800);
      }
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Status */}
      <div className="text-center p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-800">
          {isShowingSequence ? '👀 Watch the sequence...' : '👉 Your Turn! Tap the pads in order'}
        </p>
        <p className="text-sm font-bold text-slate-700 mt-1">
          Round: {currentRound} of {targetLength - 1}
        </p>
      </div>

      {/* 2x2 Simon Pad Grid */}
      <div className="grid grid-cols-2 gap-4 p-5 rounded-3xl bg-sky-100/60 border border-sky-200 shadow-inner">
        {PADS.map(pad => {
          const isActive = activePad === pad.id;
          return (
            <button
              key={pad.id}
              disabled={isShowingSequence}
              onClick={() => handlePadClick(pad.id)}
              className={`h-36 sm:h-40 rounded-2xl flex flex-col items-center justify-center text-white transition-all transform cursor-pointer border-4 shadow-md ${
                isActive ? `${pad.bgActive} ${pad.borderActive} scale-105 shadow-xl` : `${pad.bgInactive} border-transparent hover:opacity-90`
              } disabled:cursor-not-allowed`}
            >
              <span className="text-4xl mb-1">{pad.icon}</span>
              <span className="font-extrabold text-sm">{pad.symbolAs}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
