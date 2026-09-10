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

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0f766e', '#d97706', '#10b981', '#3b82f6'],
      });
    } catch {
      // Ignore if unavailable
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-bold text-sm cursor-pointer transition-colors"
        >
          <ArrowLeft size={18} />
          <span>{getTranslation('actionBack', lang)}</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Adaptive Tier Badge */}
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300">
            {lang === 'as' ? tierConfig.tierLabelAs : tierConfig.tierLabel}
          </span>

          {/* Active Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-slate-800 font-mono text-sm font-bold">
            <Timer size={16} className="text-teal-700" />
            <span>{secondsElapsed}s</span>
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm shadow-sky-900/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {lang === 'as' ? titleAs : title}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
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
        />
      </div>

      {/* Game Content Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm shadow-sky-900/5 min-h-[420px] flex flex-col justify-center items-center">
        {!isGameActive && !isFinished && (
          <div className="text-center max-w-md space-y-6 py-8">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-teal-100 flex items-center justify-center text-teal-700 shadow-inner">
              <Sparkles size={40} />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {lang === 'as' ? 'খেলিবলৈ প্ৰস্তুত নে?' : 'Ready to begin?'}
              </h3>
              <p className="text-sm text-slate-600">
                {lang === 'as' ? tierConfig.feedbackMessageAs : tierConfig.feedbackMessage}
              </p>
            </div>

            <button
              onClick={handleStartGame}
              className="w-full py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-lg shadow-lg shadow-teal-700/20 cursor-pointer transition-all active:scale-95"
            >
              {getTranslation('actionPlay', lang)}
            </button>
          </div>
        )}

        {/* Finished Result Summary */}
        {isFinished && latestScore && (
          <div className="text-center max-w-md space-y-6 py-6 animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-lg">
              <Award size={44} />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                {lang === 'as' ? 'বঢ়িয়া প্ৰদৰ্শন!' : 'Wonderful Exercise!'}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {lang === 'as'
                  ? 'আপোনাৰ মগজুৰ সক্ৰিয়তা আৰু মনোযোগ অতি প্ৰশংসনীয়।'
                  : 'Your cognitive engagement has been recorded to your daily baseline.'}
              </p>
            </div>

            {/* Score Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-sky-50 border border-sky-200">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Score</p>
                <p className="text-xl font-extrabold text-teal-700">
                  {latestScore.score}/{latestScore.maxScore}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Accuracy</p>
                <p className="text-xl font-extrabold text-emerald-600">
                  {latestScore.accuracy}%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Time</p>
                <p className="text-xl font-extrabold text-sky-700">
                  {latestScore.durationSeconds}s
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStartGame}
                className="flex-1 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <RotateCcw size={18} />
                <span>{lang === 'as' ? 'পুনৰ খেলক' : 'Play Again'}</span>
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-950 font-bold cursor-pointer transition-colors"
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
