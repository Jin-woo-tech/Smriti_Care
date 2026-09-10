import { GameId, GameScoreRecord } from '../types';

export interface AdaptiveTierConfig {
  tier: 1 | 2 | 3;
  tierLabel: string;
  tierLabelAs: string;
  tierLabelHi?: string;
  gridSize?: { rows: number; cols: number };
  symbolCount?: number;
  distractorCount?: number;
  sequenceLength?: number;
  timeLimitSeconds?: number;
  pathNodesCount?: number;
  routineStepCount?: number;
  feedbackMessage: string;
  feedbackMessageAs: string;
  feedbackMessageHi?: string;
}

/**
 * Evaluates the player's recent game performance to recommend
 * an appropriate difficulty tier without causing anxiety or cognitive fatigue.
 */
export function calculateAdaptiveDifficulty(
  gameId: GameId,
  gameHistory: GameScoreRecord[]
): AdaptiveTierConfig {
  const filteredHistory = gameHistory
    .filter(record => record.gameId === gameId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Default to Tier 2 (Standard) if not enough history
  if (filteredHistory.length === 0) {
    return getTierConfig(
      gameId,
      2,
      'Welcome! Starting with a comfortable, balanced pace.',
      'নমস্কাৰ! আৰামদায়ক আৰু সন্তুলিত স্তৰেৰে আৰম্ভ কৰা হৈছে।',
      'नमस्ते! एक सुखद और संतुलित स्तर से शुरुआत की जा रही है।'
    );
  }

  const recent = filteredHistory.slice(0, 3);
  const avgAccuracy = recent.reduce((sum, r) => sum + r.accuracy, 0) / recent.length;
  const avgReactionTime = recent.reduce((sum, r) => sum + r.reactionTimeMs, 0) / recent.length;

  // Decision logic:
  // If player is scoring >= 90% consistently with fast reaction (< 2000ms), step up to Tier 3
  if (avgAccuracy >= 90 && avgReactionTime < 2200) {
    return getTierConfig(
      gameId,
      3,
      'Excellent performance! Challenge level increased to stimulate deeper focus.',
      'অসাধাৰণ দক্ষতা! মনোযোগ আৰু স্মৃতিশক্তি বৃদ্ধি কৰিবলৈ স্তৰ বঢ়োৱা হৈছে।',
      'उत्कृष्ट प्रदर्शन! एकाग्रता बढ़ाने के लिए चुनौती स्तर बढ़ाया गया है।'
    );
  }

  // If player is finding it challenging (< 65% accuracy or taking > 3500ms), gently step down to Tier 1
  if (avgAccuracy < 65 || avgReactionTime > 3500) {
    return getTierConfig(
      gameId,
      1,
      'Adjusted to a gentle, relaxed pace for comfortable play.',
      'আপোনাৰ আৰাম আৰু সুবিধাৰ বাবে সহজ স্তৰ নিৰ্ধাৰণ কৰা হৈছে।',
      'आपकी सुविधा और आराम के लिए एक सरल और शांत स्तर चुना गया है।'
    );
  }

  // Otherwise stay on Tier 2
  return getTierConfig(
    gameId,
    2,
    'Steady and comfortable pace matched to your personal baseline.',
    'আপোনাৰ স্বাভাৱিক দক্ষতাৰ সৈতে মিল থকা সন্তুলিত স্তৰ।',
    'आपकी व्यक्तिगत आधार रेखा के अनुकूल एक संतुलित स्तर।'
  );
}

function getTierConfig(
  gameId: GameId,
  tier: 1 | 2 | 3,
  feedbackMsg: string,
  feedbackMsgAs: string,
  feedbackMsgHi?: string
): AdaptiveTierConfig {
  const tierLabels = {
    1: { en: 'Tier 1: Gentle Pace', as: 'স্তৰ ১: সহজ আৰু শান্ত', hi: 'स्तर 1: सरल व शांत' },
    2: { en: 'Tier 2: Standard Pace', as: 'স্তৰ ২: মান্য স্তৰ', hi: 'स्तर 2: मानक स्तर' },
    3: { en: 'Tier 3: Active Challenge', as: 'স্তৰ ৩: সক্ৰিয় প্ৰত্যাহ্বান', hi: 'स्तर 3: सक्रिय चुनौती' },
  };

  const base: AdaptiveTierConfig = {
    tier,
    tierLabel: tierLabels[tier].en,
    tierLabelAs: tierLabels[tier].as,
    tierLabelHi: tierLabels[tier].hi,
    feedbackMessage: feedbackMsg,
    feedbackMessageAs: feedbackMsgAs,
    feedbackMessageHi: feedbackMsgHi || feedbackMsg,
  };

  switch (gameId) {
    case 'remember-match':
      return {
        ...base,
        gridSize: tier === 1 ? { rows: 2, cols: 3 } : tier === 2 ? { rows: 2, cols: 4 } : { rows: 3, cols: 4 },
        timeLimitSeconds: tier === 1 ? 90 : tier === 2 ? 60 : 45,
      };

    case 'find-symbol':
      return {
        ...base,
        symbolCount: tier === 1 ? 6 : tier === 2 ? 12 : 20,
        distractorCount: tier === 1 ? 5 : tier === 2 ? 11 : 19,
        timeLimitSeconds: tier === 1 ? 40 : tier === 2 ? 30 : 20,
      };

    case 'follow-path':
      return {
        ...base,
        pathNodesCount: tier === 1 ? 5 : tier === 2 ? 8 : 12,
        timeLimitSeconds: tier === 1 ? 60 : tier === 2 ? 45 : 30,
      };

    case 'remember-routine':
      return {
        ...base,
        routineStepCount: tier === 1 ? 4 : tier === 2 ? 5 : 7,
      };

    case 'sequence-recall':
      return {
        ...base,
        sequenceLength: tier === 1 ? 3 : tier === 2 ? 5 : 7,
      };

    case 'local-memory':
      return {
        ...base,
        symbolCount: tier === 1 ? 3 : tier === 2 ? 5 : 8,
      };

    default:
      return base;
  }
}
