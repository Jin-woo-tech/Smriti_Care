import React, { useState, useEffect } from 'react';
import { GameShell } from './GameShell';
import { AdaptiveTierConfig } from '../../lib/adaptiveDifficulty';
import { useApp } from '../../context/AppContext';

interface CardItem {
  id: number;
  symbol: string;
  name: string;
  nameHi: string;
  icon: string;
}

const SYMBOL_ITEMS: Omit<CardItem, 'id'>[] = [
  { symbol: 'japi', name: 'Japi Hat', nameHi: 'जापी टोपी', icon: '👒' },
  { symbol: 'gamosa', name: 'Gamosa Cloth', nameHi: 'गमोसा अंगवस्त्र', icon: '🧣' },
  { symbol: 'rhino', name: 'One-Horned Rhino', nameHi: 'एक सींग वाला गैंडा', icon: '🦏' },
  { symbol: 'xorai', name: 'Xorai Brass Stand', nameHi: 'शराई पीतल पात्र', icon: '🏆' },
  { symbol: 'tea', name: 'Tea Leaves', nameHi: 'चाय की पत्तियां', icon: '🍃' },
  { symbol: 'hornbill', name: 'Hornbill Bird', nameHi: 'धनेश पक्षी', icon: '🦜' },
  { symbol: 'flute', name: 'Traditional Flute', nameHi: 'बांसुरी', icon: '🎺' },
  { symbol: 'harvest', name: 'Harvest Grain', nameHi: 'अन्न की बाली', icon: '🌾' },
];

export const RememberMatchGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <GameShell
      gameId="remember-match"
      title="Remember & Match"
      titleHi="याद रखें और मिलान करें"
      instructions="Flip and match identical pairs of traditional cultural symbols."
      instructionsHi="सांस्कृतिक प्रतीकों के कार्ड पलटें और उनके सही जोड़ों का मिलान करें।"
      onBack={onBack}
    >
      {({ tierConfig, onGameOver, isGameActive }) => (
        <MatchBoard tierConfig={tierConfig} onGameOver={onGameOver} isGameActive={isGameActive} />
      )}
    </GameShell>
  );
};

const MatchBoard: React.FC<{
  tierConfig: AdaptiveTierConfig;
  onGameOver: (score: number, maxScore: number, accuracy: number, reactionTimeMs: number) => void;
  isGameActive: boolean;
}> = ({ tierConfig, onGameOver }) => {
  const { settings } = useApp();
  const lang = settings.language;
  const pairCount = tierConfig.tier === 1 ? 3 : tierConfig.tier === 2 ? 4 : 6;

  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedSymbols, setMatchedSymbols] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());

  // Initialize deck
  useEffect(() => {
    const selected = SYMBOL_ITEMS.slice(0, pairCount);
    const deck: CardItem[] = [];
    selected.forEach((item, index) => {
      deck.push({ ...item, id: index * 2 });
      deck.push({ ...item, id: index * 2 + 1 });
    });
    // Shuffle
    setCards(deck.sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setMatchedSymbols([]);
    setMoves(0);
  }, [pairCount]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedSymbols.includes(cards[index].symbol)) {
      return;
    }

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIdx, secondIdx] = nextFlipped;
      const cardA = cards[firstIdx];
      const cardB = cards[secondIdx];

      if (cardA.symbol === cardB.symbol) {
        // Match found!
        const nextMatched = [...matchedSymbols, cardA.symbol];
        setMatchedSymbols(nextMatched);
        setFlippedIndices([]);

        // Check if all matched
        if (nextMatched.length === pairCount) {
          const durationMs = Date.now() - startTime;
          const idealMoves = pairCount;
          const accuracy = Math.min(100, Math.round((idealMoves / Math.max(moves + 1, idealMoves)) * 100));
          const score = Math.max(50, Math.round(100 - (moves + 1 - idealMoves) * 5));
          const avgReactionTime = Math.round(durationMs / Math.max(1, moves + 1));
          setTimeout(() => {
            onGameOver(score, 100, accuracy, avgReactionTime);
          }, 600);
        }
      } else {
        // No match, flip back after brief pause
        setTimeout(() => {
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const gridColsClass =
    pairCount === 3
      ? 'grid-cols-3'
      : pairCount === 4
      ? 'grid-cols-4'
      : 'grid-cols-4 sm:grid-cols-6';

  return (
    <div className="w-full max-w-2xl space-y-6 text-white">
      <div className="flex justify-between items-center px-2 text-sm font-bold text-sky-200/80">
        <span>
          {lang === 'hi' ? 'कुल प्रयास:' : 'Moves Made:'}{' '}
          <strong className="text-[#c084fc] font-mono">{moves}</strong>
        </span>
        <span>
          {lang === 'hi' ? 'मिले जोड़े:' : 'Pairs Matched:'}{' '}
          <strong className="text-purple-300 font-mono">{matchedSymbols.length} / {pairCount}</strong>
        </span>
      </div>

      <div className={`grid ${gridColsClass} gap-3 sm:gap-4`}>
        {cards.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx) || matchedSymbols.includes(card.symbol);
          const isMatched = matchedSymbols.includes(card.symbol);
          const cardName = lang === 'hi' ? card.nameHi : card.name;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`h-24 sm:h-28 rounded-2xl flex flex-col items-center justify-center text-center p-2 transition-all duration-300 transform cursor-pointer border shadow-md ${
                isMatched
                  ? 'bg-purple-950/60 border-purple-400 text-white scale-95 shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                  : isFlipped
                  ? 'bg-purple-500/25 border-purple-400/80 text-white scale-100 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                  : 'bg-white/10 border-white/15 text-purple-300 hover:border-purple-400/60 hover:bg-white/15 hover:scale-102 backdrop-blur-md'
              }`}
            >
              {isFlipped ? (
                <>
                  <span className="text-3xl sm:text-4xl mb-1">{card.icon}</span>
                  <span className="text-[10px] sm:text-xs font-bold leading-tight line-clamp-1">{cardName}</span>
                </>
              ) : (
                <span className="text-2xl text-purple-300 font-black">?</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
