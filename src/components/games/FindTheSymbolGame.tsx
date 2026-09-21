import React, { useState, useEffect } from 'react';
import { GameShell } from './GameShell';
import { AdaptiveTierConfig } from '../../lib/adaptiveDifficulty';
import { useApp } from '../../context/AppContext';

interface SymbolItem {
  id: number;
  symbol: string;
  name: string;
  nameHi: string;
  icon: string;
  isTarget: boolean;
}

const ALL_SYMBOLS = [
  { symbol: 'rhino', name: 'One-Horned Rhino', nameHi: 'एक सींग वाला गैंडा', icon: '🦏' },
  { symbol: 'japi', name: 'Japi Hat', nameHi: 'पारंपरिक जापी टोपी', icon: '👒' },
  { symbol: 'tea', name: 'Tea Leaf', nameHi: 'चाय की पत्तियां', icon: '🍃' },
  { symbol: 'xorai', name: 'Xorai Stand', nameHi: 'शराई पीतल पात्र', icon: '🏆' },
  { symbol: 'fish', name: 'Chitol Fish', nameHi: 'चितल मछली', icon: '🐟' },
  { symbol: 'bird', name: 'Hornbill Bird', nameHi: 'धनेश पक्षी', icon: '🦜' },
  { symbol: 'lotus', name: 'Padma Lotus', nameHi: 'कमल का फूल', icon: '🪷' },
  { symbol: 'sun', name: 'Surya Sun', nameHi: 'सूर्य देव', icon: '☀️' },
];

export const FindTheSymbolGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <GameShell
      gameId="find-symbol"
      title="Find the Symbol"
      titleHi="चिह्न ढूंढें"
      instructions="Spot and tap all instances of the requested target symbol among the items on screen."
      instructionsHi="स्क्रीन पर दिखाई दे रहे प्रतीकों में से लक्षित प्रतीक को खोजें और उस पर टैप करें।"
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
  const { settings } = useApp();
  const lang = settings.language;

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

  const targetName = lang === 'hi' ? targetSymbol.nameHi : targetSymbol.name;

  return (
    <div className="w-full max-w-2xl space-y-6 text-white">
      {/* Target Banner */}
      <div className="glass-card-dark p-4 rounded-2xl border border-purple-400/40 bg-purple-950/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl p-2 bg-purple-500/20 rounded-xl shadow-xs border border-purple-400/30">
            {targetSymbol.icon}
          </span>
          <div>
            <p className="text-xs font-bold text-[#c084fc] uppercase tracking-wide">
              {lang === 'hi' ? 'यह चिह्न ढूंढें' : 'Find This Symbol'}
            </p>
            <h3 className="text-xl font-black text-white">
              {targetName}
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-sky-200/70 block font-bold">
            {lang === 'hi' ? 'शेष' : 'Remaining'}
          </span>
          <span className="text-2xl font-black text-purple-300">
            {targetCount - foundIds.length} {lang === 'hi' ? 'बाकी' : 'left'}
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
              className={`h-20 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all cursor-pointer border shadow-md ${
                isFound
                  ? 'bg-purple-950/60 border-purple-400 text-white scale-95 opacity-50 cursor-default shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-white/10 border-white/15 hover:border-purple-400 hover:bg-white/15 hover:scale-105 active:scale-95 text-white backdrop-blur-md'
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
