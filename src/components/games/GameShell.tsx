import React, { useState, useEffect } from 'react';
import { ArrowLeft, Timer, Award, RotateCcw, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { GameId, GameScoreRecord } from '../../types';
import { calculateAdaptiveDifficulty, AdaptiveTierConfig } from '../../lib/adaptiveDifficulty';
import { getTranslation } from '../../lib/i18n';
import { VoiceNarratorButton } from '../common/VoiceNarratorButton';

interface GameShellProps {
  gameId: GameId;
  title: string;
  titleAs: string;
  instructions: string;
  instructionsAs: string;
  onBack: () => void;
  children: (props: {
    tierConfig: AdaptiveTierConfig;
    onGameOver: (score: number, maxScore: number, accuracy: number, reactionTimeMs: number) => void;
    isGameActive: boolean;
    onGameStart: () => void;
  }) => React.ReactNode;
}

export const GameShell: React.FC<GameShellProps> = ({
  gameId,
  title,
  titleAs,
  instructions,
  instructionsAs,
  onBack,
  children,
}) => {
  const { settings, gameScores, saveGameScore, narrate } = useApp();
  const lang = settings.language;

  const [tierConfig, setTierConfig] = useState<AdaptiveTierConfig>(() =>
    calculateAdaptiveDifficulty(gameId, gameScores)
  );

  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [latestScore, setLatestScore] = useState<GameScoreRecord | null>(null);

  useEffect(() => {
    setTierConfig(calculateAdaptiveDifficulty(gameId, gameScores));
  }, [gameId, gameScores]);

  // Timer
  useEffect(() => {
    let interval: any = null;
    if (isGameActive && !isFinished) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive, isFinished]);

  const handleStartGame = () => {
    setIsGameActive(true);
    setIsFinished(false);
    setSecondsElapsed(0);
    setLatestScore(null);
  };

  const handleGameOver = (
    score: number,
    maxScore: number,
    accuracy: number,
    reactionTimeMs: number
  ) => {
    setIsGameActive(false);
    setIsFinished(true);

    const record: Omit<GameScoreRecord, 'id'> = {
      gameId,
      date: new Date().toISOString().split('T')[0],
      score,
      maxScore,
      accuracy,
      reactionTimeMs,
      difficultyTier: tierConfig.tier,
      durationSeconds: secondsElapsed,
    };

    saveGameScore(record);
    setLatestScore(record as GameScoreRecord);

    // Fire celebration confetti with Purple/Cyan palette
    try {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#38bdf8', '#c084fc', '#818cf8'],
      });
    } catch {
      // Ignore if unavailable
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white animate-in fade-in">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/15 font-bold text-sm cursor-pointer transition-all active:scale-95 shadow-xs backdrop-blur-md"
        >
          <ArrowLeft size={18} />
          <span>{getTranslation('actionBack', lang)}</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Adaptive Tier Badge */}
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-200 border border-purple-400/40 shadow-xs">
            {lang === 'as' ? tierConfig.tierLabelAs : tierConfig.tierLabel}
          </span>

          {/* Active Timer */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/10 border border-white/15 text-white font-mono text-sm font-bold backdrop-blur-md">
            <Timer size={16} className="text-[#c084fc]" />
            <span>{secondsElapsed}s</span>
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="glass-card-dark p-6 sm:p-8 rounded-[2rem] border border-white/12 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {lang === 'as' ? titleAs : title}
          </h1>
          <p className="text-sm text-sky-200/80 mt-1 max-w-2xl font-medium leading-relaxed">
            {lang === 'as' ? instructionsAs : instructions}
          </p>
        </div>

        <VoiceNarratorButton
          textToRead={
            lang === 'as'
              ? `${titleAs}. ${instructionsAs}`
              : `${title}. ${instructions}`
          }
          size="md"
          label={getTranslation('actionListen', lang)}
          className="bg-purple-500/20 hover:bg-purple-500/30 text-white border border-purple-400/30"
        />
      </div>

      {/* Game Content Box */}
      <div className="glass-card-dark rounded-[2.5rem] p-6 sm:p-8 border border-white/12 min-h-[440px] flex flex-col justify-center items-center relative overflow-hidden">
        {/* Background glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {!isGameActive && !isFinished && (
          <div className="text-center max-w-md space-y-6 py-8 relative z-10">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-500/20 text-[#c084fc] border border-purple-400/40 flex items-center justify-center shadow-lg shadow-purple-600/25">
              <Sparkles size={40} />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white mb-2">
                {lang === 'as' ? 'খেলিবলৈ প্ৰস্তুত নে?' : 'Ready to begin?'}
              </h3>
              <p className="text-sm text-sky-200/80 font-medium leading-relaxed">
                {lang === 'as' ? tierConfig.feedbackMessageAs : tierConfig.feedbackMessage}
              </p>
            </div>

            <button
              onClick={handleStartGame}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white font-extrabold text-lg shadow-xl shadow-purple-600/35 cursor-pointer transition-all active:scale-95 border border-purple-400/30"
            >
              {getTranslation('actionPlay', lang)}
            </button>
          </div>
        )}

        {/* Finished Result Summary */}
        {isFinished && latestScore && (
          <div className="text-center max-w-md space-y-6 py-6 animate-in fade-in zoom-in-95 relative z-10">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-500/20 text-[#c084fc] border border-purple-400/40 flex items-center justify-center shadow-xl shadow-purple-600/25">
              <Award size={44} />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">
                {lang === 'as' ? 'বঢ়িয়া প্ৰদৰ্শন!' : 'Wonderful Exercise!'}
              </h3>
              <p className="text-sm text-sky-200/80 mt-1 font-medium">
                {lang === 'as'
                  ? 'আপোনাৰ মগজুৰ সক্ৰিয়তা আৰু মনোযোগ অতি প্ৰশংসনীয়।'
                  : 'Your cognitive engagement has been recorded to your daily baseline.'}
              </p>
            </div>

            {/* Score Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <p className="text-xs text-sky-200/60 uppercase font-bold tracking-wider">Score</p>
                <p className="text-xl font-extrabold text-white">
                  {latestScore.score}/{latestScore.maxScore}
                </p>
              </div>
              <div>
                <p className="text-xs text-sky-200/60 uppercase font-bold tracking-wider">Accuracy</p>
                <p className="text-xl font-extrabold text-purple-300">
                  {latestScore.accuracy}%
                </p>
              </div>
              <div>
                <p className="text-xs text-sky-200/60 uppercase font-bold tracking-wider">Time</p>
                <p className="text-xl font-extrabold text-sky-300">
                  {latestScore.durationSeconds}s
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStartGame}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white font-bold cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 border border-purple-400/30"
              >
                <RotateCcw size={18} />
                <span>{lang === 'as' ? 'পুনৰ খেলক' : 'Play Again'}</span>
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer transition-all border border-white/15"
              >
                {getTranslation('actionBack', lang)}
              </button>
            </div>
          </div>
        )}

        {/* Active Game Child Rendering */}
        {isGameActive &&
          children({
            tierConfig,
            onGameOver: handleGameOver,
            isGameActive,
            onGameStart: handleStartGame,
          })}
      </div>
    </div>
  );
};
