import React, { useState } from 'react';
import { GameShell } from './GameShell';
import { AdaptiveTierConfig } from '../../lib/adaptiveDifficulty';
import { CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QuizQuestion {
  id: number;
  question: string;
  questionHi: string;
  imageHint: string;
  options: string[];
  optionsHi: string[];
  correctIndex: number;
  triviaFact: string;
  triviaFactHi: string;
}

const HERITAGE_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which world-famous National Park is renowned for the majestic One-Horned Rhinoceros?',
    questionHi: 'विश्व प्रसिद्ध कौन सा राष्ट्रीय उद्यान एक सींग वाले गैंडे के लिए जाना जाता है?',
    imageHint: '🦏 🌿',
    options: ['Kaziranga', 'Manas', 'Jim Corbett', 'Sundarbans'],
    optionsHi: ['काजीरंगा राष्ट्रीय उद्यान', 'मानस राष्ट्रीय उद्यान', 'जिम कॉर्बेट', 'सुंदरबन'],
    correctIndex: 0,
    triviaFact: 'Kaziranga hosts two-thirds of the world\'s great one-horned rhinoceroses and is a UNESCO World Heritage Site.',
    triviaFactHi: 'काजीरंगा दुनिया के दो-तिहाई एक सींग वाले गैंडों का घर है और यह यूनेस्को की विश्व धरोहर स्थल है।',
  },
  {
    id: 2,
    question: 'Which traditional festival marks the arrival of spring and harvest season with joy and music?',
    questionHi: 'कौन सा पारंपरिक त्योहार वसंत ऋतु और नई फसल के आगमन पर हर्षोल्लास से मनाया जाता है?',
    imageHint: '🌸 🥁',
    options: ['Bihu / Baisakhi', 'Diwali', 'Holi', 'Pongal'],
    optionsHi: ['बिहू / बैसाखी', 'दीपावली', 'होली', 'पोंगल'],
    correctIndex: 0,
    triviaFact: 'Harvest festivals celebrate nature, agricultural prosperity, and sharing traditional sweets with loved ones.',
    triviaFactHi: 'फसल उत्सव प्रकृति, कृषि समृद्धि और प्रियजनों के साथ पारंपरिक मिठाइयां बांटने का उत्सव है।',
  },
  {
    id: 3,
    question: 'What is the name of the world\'s largest inhabited river island located on the Brahmaputra River?',
    questionHi: 'ब्रह्मपुत्र नदी पर स्थित विश्व का सबसे बड़ा आबाद नदी द्वीप कौन सा है?',
    imageHint: '🏝️ 🛶',
    options: ['Majuli', 'Umananda', 'Havelock', 'Munroe'],
    optionsHi: ['माजुली', 'उमानंद', 'हैवलॉक', 'मुनरो'],
    correctIndex: 0,
    triviaFact: 'Majuli is celebrated for its spiritual monasteries (Satras), mask-making traditions, and serene natural beauty.',
    triviaFactHi: 'माजुली अपने आध्यात्मिक सत्रों, मुखौटा निर्माण परंपराओं और शांत प्राकृतिक सुंदरता के लिए प्रसिद्ध है।',
  },
  {
    id: 4,
    question: 'Which natural shimmering golden silk is known for its durability and rich natural glow?',
    questionHi: 'प्राकृतिक चमक और मजबूती के लिए कौन सा दुर्लभ सुनहरा रेशम जाना जाता है?',
    imageHint: '✨ 👘',
    options: ['Muga Silk', 'Mulberry Silk', 'Tussar Silk', 'Pashmina'],
    optionsHi: ['मूगा रेशम (Muga)', 'शहतूत रेशम', 'तसर रेशम', 'पश्मीना'],
    correctIndex: 0,
    triviaFact: 'Muga silk is known for its natural golden sheen and longevity, becoming more lustrous with time and washing.',
    triviaFactHi: 'मूगा रेशम अपनी प्राकृतिक सुनहरी चमक और मजबूती के लिए प्रसिद्ध है, जो समय के साथ और निखरती है।',
  },
];

export const LocalMemoryGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <GameShell
      gameId="local-memory"
      title="Local Heritage Memory"
      titleHi="स्थानीय सांस्कृतिक धरोहर"
      instructions="Answer engaging trivia questions celebrating regional culture, festivals, and landmarks."
      instructionsHi="संस्कृति, प्रमुख धरोहरों और पारंपरिक त्योहारों से जुड़े रोचक प्रश्नों के उत्तर दें।"
      onBack={onBack}
    >
      {({ tierConfig, onGameOver, isGameActive }) => (
        <QuizBoard tierConfig={tierConfig} onGameOver={onGameOver} isGameActive={isGameActive} />
      )}
    </GameShell>
  );
};

const QuizBoard: React.FC<{
  tierConfig: AdaptiveTierConfig;
  onGameOver: (score: number, maxScore: number, accuracy: number, reactionTimeMs: number) => void;
  isGameActive: boolean;
}> = ({ tierConfig, onGameOver }) => {
  const { settings } = useApp();
  const lang = settings.language;

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());

  const currentQ = HERITAGE_QUESTIONS[currentIdx];

  const handleSelectOption = (optIndex: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(optIndex);
    setShowExplanation(true);

    const isCorrect = optIndex === currentQ.correctIndex;
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIdx + 1 < HERITAGE_QUESTIONS.length) {
        setCurrentIdx(prev => prev + 1);
        setSelectedOption(null);
        setShowExplanation(false);
      } else {
        // Finished
        const durationMs = Date.now() - startTime;
        const total = HERITAGE_QUESTIONS.length;
        const totalCorrect = isCorrect ? correctAnswers + 1 : correctAnswers;
        const accuracy = Math.round((totalCorrect / total) * 100);
        const score = accuracy;
        const avgReaction = Math.round(durationMs / total);
        onGameOver(score, 100, accuracy, avgReaction);
      }
    }, 2400);
  };

  const questionTitle = lang === 'hi' ? currentQ.questionHi : currentQ.question;
  const questionSubtitle = lang === 'hi' ? currentQ.question : currentQ.questionHi;
  const options = lang === 'hi' ? currentQ.optionsHi : currentQ.options;
  const triviaFact = lang === 'hi' ? currentQ.triviaFactHi : currentQ.triviaFact;

  return (
    <div className="w-full max-w-xl space-y-6 text-white">
      {/* Progress */}
      <div className="flex justify-between items-center text-xs font-bold text-sky-200/70">
        <span>
          {lang === 'hi' ? 'प्रश्न' : 'Question'} {currentIdx + 1} {lang === 'hi' ? 'का' : 'of'} {HERITAGE_QUESTIONS.length}
        </span>
        <span className="text-[#c084fc] font-bold">
          {lang === 'hi' ? 'सांस्कृतिक स्मृति' : 'Heritage Recall'}
        </span>
      </div>

      {/* Question Card */}
      <div className="glass-card-dark p-6 sm:p-7 rounded-3xl border border-purple-400/30 text-center space-y-3 shadow-2xl backdrop-blur-md">
        <div className="text-4xl">{currentQ.imageHint}</div>
        <h3 className="text-xl font-extrabold text-white">
          {questionTitle}
        </h3>
        <p className="text-xs text-sky-200/80 font-medium">
          {questionSubtitle}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((optText, optIdx) => {
          const isSelected = selectedOption === optIdx;
          const isCorrect = optIdx === currentQ.correctIndex;

          let btnStyle = 'glass-card-dark border-white/12 text-white hover:border-purple-400/60 hover:bg-white/10';
          if (showExplanation) {
            if (isCorrect) {
              btnStyle = 'bg-purple-900/80 border-purple-400 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)]';
            } else if (isSelected) {
              btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200';
            }
          }

          return (
            <button
              key={optIdx}
              disabled={selectedOption !== null}
              onClick={() => handleSelectOption(optIdx)}
              className={`w-full p-4 rounded-2xl border text-left font-bold text-base transition-all cursor-pointer flex items-center justify-between shadow-md backdrop-blur-md ${btnStyle}`}
            >
              <span>{optText}</span>
              {showExplanation && isCorrect && <CheckCircle2 size={20} className="text-[#c084fc]" />}
            </button>
          );
        })}
      </div>

      {/* Explanation Banner */}
      {showExplanation && (
        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-400/40 text-sky-100 text-xs sm:text-sm animate-in fade-in backdrop-blur-md">
          <strong className="text-purple-300">💡 {lang === 'hi' ? 'रोचक तथ्य:' : 'Trivia Fact:'}</strong> {triviaFact}
        </div>
      )}
    </div>
  );
};
