import React, { useState } from 'react';
import { Brain, Play, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GameId } from '../../types';
import { getTranslation } from '../../lib/i18n';
import { VoiceNarratorButton } from '../common/VoiceNarratorButton';
import { RememberMatchGame } from './RememberMatchGame';
import { FindTheSymbolGame } from './FindTheSymbolGame';
import { FollowPathGame } from './FollowPathGame';
import { RememberRoutineGame } from './RememberRoutineGame';
import { SequenceRecallGame } from './SequenceRecallGame';
import { LocalMemoryGame } from './LocalMemoryGame';
import { calculateAdaptiveDifficulty } from '../../lib/adaptiveDifficulty';

export const GameHub: React.FC = () => {
  const { settings, gameScores } = useApp();
  const lang = settings.language;
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  if (activeGame === 'remember-match') {
    return <RememberMatchGame onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === 'find-symbol') {
    return <FindTheSymbolGame onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === 'follow-path') {
    return <FollowPathGame onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === 'remember-routine') {
    return <RememberRoutineGame onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === 'sequence-recall') {
    return <SequenceRecallGame onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === 'local-memory') {
    return <LocalMemoryGame onBack={() => setActiveGame(null)} />;
  }

  const gamesList: {
    id: GameId;
    title: string;
    titleHi: string;
    desc: string;
    descHi: string;
    domain: string;
    domainHi: string;
    icon: string;
  }[] = [
    {
      id: 'remember-match',
      title: 'Remember & Match',
      titleHi: 'याद रखें और मिलान करें',
      desc: 'Match pairs of traditional cultural symbols like Japi, Gamosa, and Rhino.',
      descHi: 'जापी, गमोसा और एक सींग वाले गैंडे जैसे सांस्कृतिक प्रतीकों के जोड़े मिलाकर याददाश्त तेज करें।',
      domain: 'Visual & Spatial Memory',
      domainHi: 'दृश्य एवं स्थानिक स्मृति',
      icon: '👒',
    },
    {
      id: 'find-symbol',
      title: 'Find the Symbol',
      titleHi: 'चिह्न ढूंढें',
      desc: 'Spot the target cultural emblem among distractors to train attention and visual search.',
      descHi: 'अन्य आकृतियों के बीच से सही सांस्कृतिक चिह्न खोजकर एकाग्रता और ध्यान बढ़ाएं।',
      domain: 'Attention & Visual Search',
      domainHi: 'ध्यान एवं दृश्य खोज',
      icon: '🦏',
    },
    {
      id: 'follow-path',
      title: 'Follow the Path',
      titleHi: 'क्रमबद्ध पथ अनुसरण',
      desc: 'Trail making test connecting numbers and letters in sequence (1-2-3 / 1-A-2-B).',
      descHi: 'संख्याओं और अक्षरों को सही क्रम में जोड़कर मानसिक योजना और लचीलापन मजबूत करें।',
      domain: 'Executive Trail Making',
      domainHi: 'कार्यकारी योजना एवं समन्वय',
      icon: '🔢',
    },
    {
      id: 'remember-routine',
      title: 'Remember the Routine',
      titleHi: 'दैनिक दिनचर्या स्मरण',
      desc: 'Order everyday morning-to-night tasks in their natural daily sequence.',
      descHi: 'सुबह से रात तक के दैनिक कार्यों को उनके सही स्वाभाविक क्रम में व्यवस्थित करें।',
      domain: 'Daily Procedural Recall',
      domainHi: 'दैनिक प्रक्रियात्मक स्मरण',
      icon: '🌅',
    },
    {
      id: 'sequence-recall',
      title: 'Sequence Recall',
      titleHi: 'ध्वनि व रंग अनुक्रम',
      desc: 'Remember and repeat the glowing sound and color patterns to stimulate working memory.',
      descHi: 'चमकती रोशनी और ध्वनि के पैटर्न को याद रखकर दोहराएं और कार्यशील स्मृति बढ़ाएं।',
      domain: 'Short-term Working Memory',
      domainHi: 'अल्पकालिक कार्यशील स्मृति',
      icon: '✨',
    },
    {
      id: 'local-memory',
      title: 'Local Heritage Memory',
      titleHi: 'स्थानीय सांस्कृतिक धरोहर',
      desc: 'Engaging trivia celebrating regional folklore, Majuli island, Kaziranga, and festivals.',
      descHi: 'माजुली, काजीरंगा और बिहू उत्सव जैसे पूर्वोत्तर की समृद्ध संस्कृति से जुड़े रोचक प्रश्न।',
      domain: 'Episodic & Semantic Memory',
      domainHi: 'प्रासंगिक एवं अर्थगत स्मृति',
      icon: '🏝️',
    },
  ];

  return (
    <div className="space-y-8 py-4 text-white">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/14 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold shadow-inner">
            <Brain size={14} className="text-[#c084fc]" />
            <span>AI Adaptive Cognitive Stimulation</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {lang === 'hi'
              ? '6 दैनिक संज्ञानात्मक देखभाल खेल'
              : '6 Daily Cognitive Care Games'}
          </h1>
          <p className="text-sm sm:text-base text-sky-200/80 leading-relaxed">
            {lang === 'hi'
              ? 'सांस्कृतिक धरोहर पर आधारित वैज्ञानिक खेल। आपकी गति और सटीकता के अनुसार कठिनाई स्वतः अनुकूलित होती है।'
              : 'Scientifically validated neuro-cognitive modules rooted in cultural heritage. Automatically adjusts tier based on your reaction time and accuracy.'}
          </p>
        </div>

        <div className="relative z-10">
          <VoiceNarratorButton
            textToRead={
              lang === 'hi'
                ? '6 दैनिक संज्ञानात्मक स्वास्थ्य खेल। शुरुआत करने के लिए नीचे दिए गए किसी भी खेल पर टैप करें।'
                : 'Six daily cognitive care games. Select any game below to begin your exercise.'
            }
            size="lg"
            label={getTranslation('actionListen', lang)}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg font-bold"
          />
        </div>
      </div>

      {/* Grid of Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gamesList.map(game => {
          const tier = calculateAdaptiveDifficulty(game.id, gameScores);
          const recentForGame = gameScores.filter(s => s.gameId === game.id);
          const bestScore = recentForGame.length > 0 ? Math.max(...recentForGame.map(s => s.score)) : null;

          return (
            <div
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className="glass-card-dark p-6 rounded-3xl border border-white/12 hover:border-purple-400/50 shadow-lg hover:shadow-[0_12px_36px_rgba(0,0,0,0.4),0_0_24px_rgba(168,85,247,0.2)] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl p-3 bg-white/10 rounded-2xl shadow-inner border border-white/15 group-hover:scale-110 transition-transform">
                    {game.icon}
                  </span>
                  <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
                    {lang === 'hi' ? (tier.tierLabelHi || tier.tierLabel) : tier.tierLabel}
                  </span>
                </div>

                <p className="text-xs font-bold text-[#c084fc] uppercase tracking-wider mb-1">
                  {lang === 'hi' ? (game.domainHi || game.domain) : game.domain}
                </p>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#c084fc] transition-colors">
                  {lang === 'hi' ? (game.titleHi || game.title) : game.title}
                </h3>
                <p className="text-xs text-sky-200/70 leading-relaxed font-medium">
                  {lang === 'hi' ? (game.descHi || game.desc) : game.desc}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between">
                {bestScore !== null ? (
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Award size={15} /> Best: {bestScore}/100
                  </span>
                ) : (
                  <span className="text-xs text-sky-200/50 font-medium">
                    {lang === 'hi' ? 'खेलने के लिए तैयार' : 'Ready to play'}
                  </span>
                )}

                <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all border border-purple-400/30 cursor-pointer">
                  <span>{getTranslation('actionPlay', lang)}</span>
                  <Play size={12} className="fill-white" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
