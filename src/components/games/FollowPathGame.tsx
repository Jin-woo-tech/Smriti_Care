import React, { useState, useEffect } from 'react';
import { GameShell } from './GameShell';
import { AdaptiveTierConfig } from '../../lib/adaptiveDifficulty';

interface PathNode {
  id: number;
  label: string;
  order: number;
  x: number; // percentage 10% to 90%
  y: number; // percentage 15% to 85%
}

export const FollowPathGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <GameShell
      gameId="follow-path"
      title="Follow the Path"
      titleAs="ক্ৰম অনুসৰি পথ বাছক"
      instructions="Tap each circle in ascending numerical/alphabetical sequence (1 → 2 → 3 or 1 → A → 2 → B)."
      instructionsAs="ক্ৰম অনুসৰি বৃত্তসমূহত স্পৰ্শ কৰক (১ → ২ → ৩ বা ১ → A → ২ → B)।"
      onBack={onBack}
    >
      {({ tierConfig, onGameOver, isGameActive }) => (
        <PathBoard tierConfig={tierConfig} onGameOver={onGameOver} isGameActive={isGameActive} />
      )}
    </GameShell>
  );
};

const PathBoard: React.FC<{
  tierConfig: AdaptiveTierConfig;
  onGameOver: (score: number, maxScore: number, accuracy: number, reactionTimeMs: number) => void;
  isGameActive: boolean;
}> = ({ tierConfig, onGameOver }) => {
  const nodeCount = tierConfig.pathNodesCount || (tierConfig.tier === 1 ? 5 : tierConfig.tier === 2 ? 8 : 10);

  const [nodes, setNodes] = useState<PathNode[]>([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());

  useEffect(() => {
    const sequenceLabels =
      tierConfig.tier === 1
        ? ['1', '2', '3', '4', '5', '6']
        : ['1', 'A', '2', 'B', '3', 'C', '4', 'D', '5', 'E'];

    const items: PathNode[] = [];
    const positions: { x: number; y: number }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      // Find a non-overlapping position
      let x = 0, y = 0, collision = true, attempts = 0;
      while (collision && attempts < 50) {
        x = Math.floor(Math.random() * 75) + 12; // 12% to 87%
        y = Math.floor(Math.random() * 70) + 15; // 15% to 85%
        collision = positions.some(p => Math.hypot(p.x - x, p.y - y) < 22);
        attempts++;
      }
      positions.push({ x, y });
      items.push({
        id: i,
        label: sequenceLabels[i] || `${i + 1}`,
        order: i,
        x,
        y,
      });
    }

    setNodes(items);
    setCurrentOrderIndex(0);
    setMistakes(0);
  }, [nodeCount, tierConfig.tier]);

  const handleNodeClick = (node: PathNode) => {
    if (node.order === currentOrderIndex) {
      const nextIdx = currentOrderIndex + 1;
      setCurrentOrderIndex(nextIdx);

      if (nextIdx === nodeCount) {
        const durationMs = Date.now() - startTime;
        const accuracy = Math.max(50, Math.round((nodeCount / (nodeCount + mistakes)) * 100));
        const score = Math.max(50, Math.round(100 - mistakes * 8));
        const avgReaction = Math.round(durationMs / nodeCount);
        setTimeout(() => {
          onGameOver(score, 100, accuracy, avgReaction);
        }, 500);
      }
    } else if (node.order > currentOrderIndex) {
      setMistakes(prev => prev + 1);
    }
  };

  const nextExpectedLabel = nodes[currentOrderIndex]?.label || 'Done';

  return (
    <div className="w-full max-w-2xl space-y-4 text-white">
      {/* Target prompt */}
      <div className="flex justify-between items-center glass-card-dark p-3.5 rounded-2xl border border-white/12">
        <span className="text-sm font-semibold text-sky-200/90">
          Next target to tap: <strong className="text-[#c084fc] text-lg ml-1 font-mono">[{nextExpectedLabel}]</strong>
        </span>
        <span className="text-sm text-sky-200/70 font-semibold">
          Progress: <strong className="text-white">{currentOrderIndex} / {nodeCount}</strong>
        </span>
      </div>

      {/* Play Canvas Container */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-purple-950/20 border-2 border-dashed border-purple-400/30 overflow-hidden shadow-inner backdrop-blur-md">
        {nodes.map(node => {
          const isCompleted = node.order < currentOrderIndex;
          const isNext = node.order === currentOrderIndex;

          return (
            <button
              key={node.id}
              onClick={() => handleNodeClick(node)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-extrabold text-lg sm:text-xl transition-all cursor-pointer shadow-md border-2 ${
                isCompleted
                  ? 'bg-purple-900/60 border-purple-400 text-purple-200 opacity-60 cursor-default scale-90'
                  : isNext
                  ? 'bg-gradient-to-tr from-[#a855f7] to-[#8b5cf6] border-purple-300 text-white animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.7)] scale-110'
                  : 'bg-white/10 border-white/20 text-white hover:border-purple-400 hover:bg-white/20 hover:scale-105 backdrop-blur-md'
              }`}
            >
              {node.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
