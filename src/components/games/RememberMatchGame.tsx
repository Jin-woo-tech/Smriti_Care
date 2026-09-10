import React, { useState, useEffect } from 'react';
import { GameShell } from './GameShell';
import { AdaptiveTierConfig } from '../../lib/adaptiveDifficulty';

interface CardItem {
  id: number;
  symbol: string;
  name: string;
  nameAs: string;
  icon: string;
}

const SYMBOL_ITEMS: Omit<CardItem, 'id'>[] = [
  { symbol: 'japi', name: 'Japi (Assamese Hat)', nameAs: 'জাপি', icon: '👒' },
  { symbol: 'gamosa', name: 'Gamosa (Handwoven)', nameAs: 'গামোচা', icon: '🧣' },
  { symbol: 'rhino', name: 'One-Horned Rhino', nameAs: 'এশিঙীয়া গঁড়', icon: '🦏' },
  { symbol: 'xorai', name: 'Xorai (Brass Stand)', nameAs: 'শৰাই', icon: '🏆' },
  { symbol: 'tea', name: 'Assam Tea Leaves', nameAs: 'চাহ পাত', icon: '🍃' },
  { symbol: 'hornbill', name: 'Hornbill Bird', nameAs: 'ধনেশ পক্ষী', icon: '🦜' },
  { symbol: 'pepa', name: 'Bihu Pepa (Flute)', nameAs: 'পেঁপা', icon: '🎺' },
  { symbol: 'dheki', name: 'Dheki Rice Pounder', nameAs: 'ঢেঁকী', icon: '🌾' },
];

export const RememberMatchGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <GameShell
      gameId="remember-match"
      title="Remember & Match"
      titleAs="মনত ৰাখক আৰু মিলাওক"
      instructions="Flip and match identical pairs of traditional Assamese heritage symbols."
      instructionsAs="অসমৰ পৰম্পৰাগত প্ৰতীক যেনে জাপি, গামোচা আদিৰ যোৰ মিলাই স্মৃতিশক্তি পৰীক্ষা কৰক।"
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
    <div className="w-full max-w-2xl space-y-6">
      <div className="flex justify-between items-center px-2 text-sm font-semibold text-slate-600">
        <span>Moves Made: <strong className="text-teal-700">{moves}</strong></span>
        <span>Pairs Matched: <strong className="text-emerald-600">{matchedSymbols.length} / {pairCount}</strong></span>
      </div>

      <div className={`grid ${gridColsClass} gap-3 sm:gap-4`}>
        {cards.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx) || matchedSymbols.includes(card.symbol);
          const isMatched = matchedSymbols.includes(card.symbol);

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`h-24 sm:h-28 rounded-2xl flex flex-col items-center justify-center text-center p-2 transition-all duration-300 transform cursor-pointer border-2 shadow-xs ${
                isMatched
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 scale-95 opacity-90'
                  : isFlipped
                  ? 'bg-teal-50 border-teal-600 text-teal-950 scale-100 shadow-md'
                  : 'bg-sky-50 border-sky-200 text-sky-800 hover:border-teal-500 hover:bg-sky-100'
              }`}
            >
              {isFlipped ? (
                <>
                  <span className="text-3xl sm:text-4xl mb-1">{card.icon}</span>
                  <span className="text-[10px] sm:text-xs font-bold leading-tight line-clamp-1">{card.nameAs}</span>
                </>
              ) : (
                <span className="text-2xl text-sky-400 font-black">?</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
