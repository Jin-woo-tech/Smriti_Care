import React, { useState, useEffect } from 'react';
import { GameShell } from './GameShell';
import { AdaptiveTierConfig } from '../../lib/adaptiveDifficulty';

interface SymbolItem {
  id: number;
  symbol: string;
  name: string;
  nameAs: string;
  icon: string;
  isTarget: boolean;
}

const ALL_SYMBOLS = [
  { symbol: 'rhino', name: 'One-Horned Rhino', nameAs: 'এশিঙীয়া গঁড়', icon: '🦏' },
  { symbol: 'japi', name: 'Japi Hat', nameAs: 'জাপি', icon: '👒' },
  { symbol: 'tea', name: 'Tea Leaf', nameAs: 'চাহ পাত', icon: '🍃' },
  { symbol: 'xorai', name: 'Xorai Stand', nameAs: 'শৰাই', icon: '🏆' },
  { symbol: 'fish', name: 'Ilish / Chitol Fish', nameAs: 'চিতল মাছ', icon: '🐟' },
  { symbol: 'bird', name: 'Hornbill', nameAs: 'ধনেশ পক্ষী', icon: '🦜' },
  { symbol: 'lotus', name: 'Padma Lotus', nameAs: 'পদ্ম ফুল', icon: '🪷' },
  { symbol: 'sun', name: 'Surya Sun', nameAs: 'সূৰ্য্য', icon: '☀️' },
];

export const FindTheSymbolGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <GameShell
      gameId="find-symbol"
      title="Find the Symbol"
      titleAs="চিহ্ন বিচাৰি উলিয়াওক"
      instructions="Spot and tap all instances of the requested target symbol among the items on screen."
      instructionsAs="তলত দিয়া নিৰ্দিষ্ট চিহ্নটো বাকীবোৰ ছবিৰ মাজৰ পৰা বিচাৰি স্পৰ্শ কৰক।"
      onBack={onBack}
    >
      {({ tierConfig, onGameOver, isGameActive }) => (
        <SymbolBoard tierConfig={tierConfig} onGameOver={onGameOver} isGameActive={isGameActive} />
      )}
    </GameShell>
  );
};

const SymbolBoard: React.FC<{
  tierConfig: AdaptiveTierConfig;
  onGameOver: (score: number, maxScore: number, accuracy: number, reactionTimeMs: number) => void;
  isGameActive: boolean;
}> = ({ tierConfig, onGameOver }) => {
  const totalCount = tierConfig.symbolCount || (tierConfig.tier === 1 ? 8 : tierConfig.tier === 2 ? 15 : 24);
  const targetCount = tierConfig.tier === 1 ? 3 : tierConfig.tier === 2 ? 4 : 5;

  const [targetSymbol, setTargetSymbol] = useState(ALL_SYMBOLS[0]);
  const [gridItems, setGridItems] = useState<SymbolItem[]>([]);
  const [foundIds, setFoundIds] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());

  useEffect(() => {
    // Pick random target
    const target = ALL_SYMBOLS[Math.floor(Math.random() * ALL_SYMBOLS.length)];
    setTargetSymbol(target);

    const distractors = ALL_SYMBOLS.filter(s => s.symbol !== target.symbol);

    const items: SymbolItem[] = [];
    // Add targets
    for (let i = 0; i < targetCount; i++) {
      items.push({
        id: i,
        ...target,
        isTarget: true,
      });
    }

    // Add distractors
    for (let i = targetCount; i < totalCount; i++) {
      const dist = distractors[Math.floor(Math.random() * distractors.length)];
      items.push({
        id: i,
        ...dist,
        isTarget: false,
      });
    }

    // Shuffle
    setGridItems(items.sort(() => Math.random() - 0.5));
    setFoundIds([]);
    setMistakes(0);
  }, [totalCount, targetCount]);

  const handleItemClick = (item: SymbolItem) => {
    if (foundIds.includes(item.id)) return;

    if (item.isTarget) {
      const nextFound = [...foundIds, item.id];
      setFoundIds(nextFound);

      if (nextFound.length === targetCount) {
        const durationMs = Date.now() - startTime;
        const accuracy = Math.max(50, Math.round((targetCount / (targetCount + mistakes)) * 100));
        const score = Math.max(50, Math.round(100 - mistakes * 10));
        const avgReaction = Math.round(durationMs / targetCount);
        setTimeout(() => {
          onGameOver(score, 100, accuracy, avgReaction);
        }, 500);
      }
    } else {
      setMistakes(prev => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Target Banner */}
      <div className="p-4 rounded-2xl bg-teal-50 border-2 border-teal-500 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl p-2 bg-white rounded-xl shadow-xs border border-teal-200">
            {targetSymbol.icon}
          </span>
          <div>
            <p className="text-xs font-bold text-teal-700 uppercase tracking-wide">
              Find This Symbol
            </p>
            <h3 className="text-xl font-black text-teal-950">
              {targetSymbol.name} ({targetSymbol.nameAs})
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block font-bold">Remaining</span>
          <span className="text-2xl font-black text-teal-700">
            {targetCount - foundIds.length} left
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 sm:gap-4">
        {gridItems.map(item => {
          const isFound = foundIds.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`h-20 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all cursor-pointer border-2 shadow-xs ${
                isFound
                  ? 'bg-emerald-100 border-emerald-500 scale-95 opacity-50 cursor-default'
                  : 'bg-white border-sky-200 hover:border-teal-500 hover:scale-105 active:scale-95 text-slate-800'
              }`}
            >
              {item.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
};
