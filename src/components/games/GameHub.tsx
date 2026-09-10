import React, { useState } from 'react';
import { Brain, Sparkles, Play, Award, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
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
    titleHi?: string;
    titleAs: string;
    desc: string;
    descHi?: string;
    descAs: string;
    domain: string;
    domainHi?: string;
    domainAs: string;
    icon: string;
    color: string;
  }[] = [
    {
      id: 'remember-match',
      title: 'Remember & Match',
      titleHi: 'याद रखें और मिलान करें',
      titleAs: 'মনত ৰাখক আৰু মিলাওক',
      desc: 'Match pairs of traditional Assamese heritage symbols like Japi, Gamosa, and Rhino.',
      descHi: 'जापी, गमोसा और एक सींग वाले गैंडे जैसे सांस्कृतिक प्रतीकों के जोड़े मिलाकर याददाश्त तेज करें।',
      descAs: 'জাপি, গামোচা, শৰাই আদি অসমীয়া প্ৰতীকৰ যোৰ মিলাই স্মৃতিশক্তি জোখক।',
      domain: 'Visual & Spatial Memory',
      domainHi: 'दृश्य एवं स्थानिक स्मृति',
      domainAs: 'দৃষ্টি আৰু স্থানিক স্মৃতি',
      icon: '👒',
      color: 'border-teal-200 bg-white hover:border-teal-400',
    },
    {
      id: 'find-symbol',
      title: 'Find the Symbol',
      titleHi: 'चिह्न ढूंढें',
      titleAs: 'চিহ্ন বিচাৰি উলিয়াওক',
      desc: 'Spot the target cultural emblem among distractors to train attention and visual search.',
      descHi: 'अन्य आकृतियों के बीच से सही सांस्कृतिक चिह्न खोजकर एकाग्रता और ध्यान बढ़ाएं।',
      descAs: 'অন্যান্য ছবিৰ মাজৰ পৰা সঠিক অসমীয়া চিহ্ন বিচাৰি মনোযোগ বৃদ্ধি কৰক।',
      domain: 'Attention & Visual Search',
      domainHi: 'ध्यान एवं दृश्य खोज',
      domainAs: 'মনোযোগ আৰু চিহ্ন অনুসন্ধান',
      icon: '🦏',
      color: 'border-sky-200 bg-white hover:border-sky-400',
    },
    {
      id: 'follow-path',
      title: 'Follow the Path',
      titleHi: 'क्रमबद्ध पथ अनुसरण',
      titleAs: 'ক্ৰম অনুসৰি পথ বাছক',
      desc: 'Trail making test connecting numbers and letters in sequence (1-2-3 / 1-A-2-B).',
      descHi: 'संख्याओं और अक्षरों को सही क्रम में जोड़कर मानसिक योजना और लचीलापन मजबूत करें।',
      descAs: 'ক্ৰম অনুসাৰে সংখ্যা আৰু আখৰ সংযোগ কৰি মগজুৰ পৰিকল্পনা ক্ষমতা বৃদ্ধি কৰক।',
      domain: 'Executive Trail Making',
      domainHi: 'कार्यकारी योजना एवं समन्वय',
      domainAs: 'কাৰ্য্যকৰী পৰিকল্পনা',
      icon: '🔢',
      color: 'border-indigo-200 bg-white hover:border-indigo-400',
    },
    {
      id: 'remember-routine',
      title: 'Remember the Routine',
      titleHi: 'दैनिक दिनचर्या स्मरण',
      titleAs: 'দৈনন্দিন ৰুটিন মনত পেলাওক',
      desc: 'Order everyday morning-to-night tasks in their natural daily sequence.',
      descHi: 'सुबह से रात तक के दैनिक कार्यों को उनके सही स्वाभाविक क्रम में व्यवस्थित करें।',
      descAs: 'পুৱাৰ পৰা ৰাতিলৈকে কৰিবলগীয়া কামসমূহ শুদ্ধ ক্ৰমত সজাওক।',
      domain: 'Daily Procedural Recall',
      domainHi: 'दैनिक प्रक्रियात्मक स्मरण',
      domainAs: 'দৈনন্দিন ৰুটিন স্মৃতি',
      icon: '🌅',
      color: 'border-amber-200 bg-white hover:border-amber-400',
    },
    {
      id: 'sequence-recall',
      title: 'Sequence Recall',
      titleHi: 'ध्वनि व रंग अनुक्रम',
      titleAs: 'ৰং আৰু শব্দৰ ক্ৰম',
      desc: 'Remember and repeat the glowing sound and color patterns to stimulate working memory.',
      descHi: 'चमकती रोशनी और ध्वनि के पैटर्न को याद रखकर दोहराएं और कार्यशील स्मृति बढ़ाएं।',
      descAs: 'ৰং আৰু সংকেতৰ ক্ৰম মনত ৰাখি পুনৰাবৃত্তি কৰক।',
      domain: 'Short-term Working Memory',
      domainHi: 'अल्पकालिक कार्यशील स्मृति',
      domainAs: 'স্বল্পম্যাদী ক্ৰমিক স্মৃতি',
      icon: '✨',
      color: 'border-rose-200 bg-white hover:border-rose-400',
    },
    {
      id: 'local-memory',
      title: 'Local Heritage Memory',
      titleHi: 'स्थानीय सांस्कृतिक धरोहर',
      titleAs: 'থলুৱা ঐতিহ্য স্মৃতি',
      desc: 'Engaging trivia celebrating Assam’s folklore, Majuli island, Kaziranga, and Bihu festivals.',
      descHi: 'माजुली, काजीरंगा और बिहू उत्सव जैसे पूर्वोत्तर की समृद्ध संस्कृति से जुड़े रोचक प्रश्न।',
      descAs: 'অসমৰ উৎসৱ, ইতিহাস আৰু ঐতিহ্য সম্পৰ্কীয় স্মৃতি প্ৰশ্ন।',
      domain: 'Episodic & Semantic Memory',
      domainHi: 'प्रासंगिक एवं अर्थगत स्मृति',
      domainAs: 'সাংস্কৃতিক স্মৃতি',
      icon: '🏝️',
      color: 'border-emerald-200 bg-white hover:border-emerald-400',
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-teal-800 via-teal-700 to-sky-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-teal-900/10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-teal-100 text-xs font-bold backdrop-blur-xs">
            <Brain size={14} className="text-amber-300" />
            <span>AI Adaptive Cognitive Training</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {lang === 'as'
              ? 'মগজুৰ ৬ টা সক্ৰিয় খেল'
              : lang === 'hi'
              ? '6 दैनिक संज्ञानात्मक देखभाल खेल'
              : '6 Daily Cognitive Care Games'}
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed">
            {lang === 'as'
              ? 'প্ৰতিটো খেল আপোনাৰ ব্যক্তিগত দক্ষতা আৰু আৰাম অনুসৰি স্বয়ংক্রিয়ভাৱে সহজ বা মধ্যম হৈ পৰে।'
              : lang === 'hi'
              ? 'पूर्वोत्तर की सांस्कृतिक धरोहर पर आधारित वैज्ञानिक खेल। आपकी गति और सटीकता के अनुसार कठिनाई स्वतः अनुकूलित होती है।'
              : 'Scientifically validated neuro-cognitive modules rooted in Assam heritage. Automatically adjusts tier based on your reaction time and accuracy.'}
          </p>
        </div>

        <VoiceNarratorButton
          textToRead={
            lang === 'as'
              ? 'মগজুৰ ৬ টা সক্ৰিয় খেল। আপোনাৰ পচন্দৰ খেলটো বাছি লৈ খেলক।'
              : lang === 'hi'
              ? '6 दैनिक संज्ञानात्मक स्वास्थ्य खेल। शुरुआत करने के लिए नीचे दिए गए किसी भी खेल पर टैप करें।'
              : 'Six daily cognitive care games. Select any game below to begin your exercise.'
          }
          size="lg"
          label={getTranslation('actionListen', lang)}
          className="bg-white text-teal-950 border-0 shadow-md font-bold"
        />
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
              className={`rounded-3xl p-6 border-2 ${game.color} shadow-sm shadow-sky-900/5 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl p-2.5 bg-sky-50 rounded-2xl shadow-xs border border-sky-100 group-hover:scale-110 transition-transform">
                    {game.icon}
                  </span>
                  <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200">
                    {lang === 'as'
                      ? tier.tierLabelAs
                      : lang === 'hi'
                      ? (tier.tierLabelHi || tier.tierLabel)
                      : tier.tierLabel}
                  </span>
                </div>

                <p className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                  {lang === 'as' ? game.domainAs : lang === 'hi' ? (game.domainHi || game.domain) : game.domain}
                </p>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                  {lang === 'as' ? game.titleAs : lang === 'hi' ? (game.titleHi || game.title) : game.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'as' ? game.descAs : lang === 'hi' ? (game.descHi || game.desc) : game.desc}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-sky-100 flex items-center justify-between">
                {bestScore !== null ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Award size={14} /> Best: {bestScore}/100
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">
                    {lang === 'hi' ? 'खेलने के लिए तैयार' : lang === 'as' ? 'খেলিবলৈ সাজু' : 'Ready to play'}
                  </span>
                )}

                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer">
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
