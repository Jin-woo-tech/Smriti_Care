import React, { useState, useEffect } from 'react';
import { GameShell } from './GameShell';
import { AdaptiveTierConfig } from '../../lib/adaptiveDifficulty';
import { useApp } from '../../context/AppContext';

interface ColorPad {
  id: number;
  colorName: string;
  symbol: string;
  symbolHi: string;
  bgActive: string;
  bgInactive: string;
  borderActive: string;
  icon: string;
}

const PADS: ColorPad[] = [
  {
    id: 0,
    colorName: 'Electric Purple',
    symbol: 'Tea Leaf',
    symbolHi: 'चाय की पत्ती',
    bgActive: 'bg-[#a855f7] scale-105 shadow-[0_0_30px_rgba(168,85,247,0.8)]',
    bgInactive: 'bg-purple-900/60 hover:bg-purple-800/80 border border-purple-400/30',
    borderActive: 'border-white ring-4 ring-purple-400',
    icon: '🍃',
  },
  {
    id: 1,
    colorName: 'Indigo',
    symbol: 'Xorai Stand',
    symbolHi: 'शराई पात्र',
    bgActive: 'bg-indigo-500 scale-105 shadow-[0_0_30px_rgba(99,102,241,0.8)]',
    bgInactive: 'bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-400/30',
    borderActive: 'border-white ring-4 ring-indigo-400',
    icon: '🏆',
  },
  {
    id: 2,
    colorName: 'Cyan',
    symbol: 'River Wave',
    symbolHi: 'नदी की तरंग',
    bgActive: 'bg-sky-400 scale-105 shadow-[0_0_30px_rgba(56,189,248,0.8)]',
    bgInactive: 'bg-sky-950/70 hover:bg-sky-900/80 border border-sky-400/30',
    borderActive: 'border-white ring-4 ring-sky-400',
    icon: '🌊',
  },
  {
    id: 3,
    colorName: 'Fuchsia',
    symbol: 'Gamosa',
    symbolHi: 'गमोसा अंगवस्त्र',
    bgActive: 'bg-fuchsia-500 scale-105 shadow-[0_0_30px_rgba(217,70,239,0.8)]',
    bgInactive: 'bg-fuchsia-950/70 hover:bg-fuchsia-900/80 border border-fuchsia-400/30',
    borderActive: 'border-white ring-4 ring-fuchsia-400',
    icon: '🧣',
  },
];

export const SequenceRecallGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <GameShell
      gameId="sequence-recall"
      title="Sequence Recall"
      titleHi="ध्वनि व रंग अनुक्रम"
      instructions="Watch the glowing sequence of colors, then repeat it by tapping the same pads in order."
      instructionsHi="चमकते हुए रंगों और प्रतीकों के क्रम को ध्यान से देखें और उसी क्रम में टैप करें।"
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
  const { settings } = useApp();
  const lang = settings.language;
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
    <div className="w-full max-w-md space-y-6 text-white">
      {/* Status */}
      <div className="glass-card-dark text-center p-3.5 rounded-2xl border border-white/12">
        <p className="text-xs font-bold uppercase tracking-wider text-[#c084fc]">
          {isShowingSequence
            ? (lang === 'hi' ? '👀 चमकते हुए पैटर्न को ध्यान से देखें...' : '👀 Watch the glowing pattern...')
            : (lang === 'hi' ? '👉 आपकी बारी! उसी क्रम में पैड पर टैप करें' : '👉 Your Turn! Tap the pads in order')}
        </p>
        <p className="text-sm font-bold text-sky-200/80 mt-1">
          {lang === 'hi' ? 'राउंड:' : 'Round:'}{' '}
          <strong className="text-white font-mono">{currentRound}</strong> {lang === 'hi' ? 'का' : 'of'}{' '}
          <strong className="text-white font-mono">{targetLength - 1}</strong>
        </p>
      </div>

      {/* 2x2 Simon Pad Grid */}
      <div className="grid grid-cols-2 gap-4 p-5 rounded-3xl bg-purple-950/30 border border-purple-400/30 shadow-2xl backdrop-blur-md">
        {PADS.map(pad => {
          const isActive = activePad === pad.id;
          const padLabel = lang === 'hi' ? pad.symbolHi : pad.symbol;
          return (
            <button
              key={pad.id}
              disabled={isShowingSequence}
              onClick={() => handlePadClick(pad.id)}
              className={`h-36 sm:h-40 rounded-2xl flex flex-col items-center justify-center text-white transition-all transform cursor-pointer border-2 shadow-lg backdrop-blur-md ${
                isActive ? `${pad.bgActive} ${pad.borderActive} scale-105` : `${pad.bgInactive}`
              } disabled:cursor-not-allowed`}
            >
              <span className="text-4xl mb-2">{pad.icon}</span>
              <span className="font-extrabold text-sm">{padLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
