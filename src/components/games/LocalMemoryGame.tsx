import React, { useState } from 'react';
import { GameShell } from './GameShell';
import { AdaptiveTierConfig } from '../../lib/adaptiveDifficulty';
import { CheckCircle2, HelpCircle } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  questionAs: string;
  imageHint: string;
  options: string[];
  optionsAs: string[];
  correctIndex: number;
  triviaFact: string;
  triviaFactAs: string;
}

const HERITAGE_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which world-famous National Park in Assam is home to the majestic One-Horned Rhinoceros?',
    questionAs: 'বিশ্বখ্যাত এশিঙীয়া গঁড়ৰ বাবে অসমৰ কোনখন ৰাষ্ট্ৰীয় উদ্যান বিখ্যাত?',
    imageHint: '🦏 🌿',
    options: ['Kaziranga', 'Manas', 'Dibru-Saikhowa', 'Nameri'],
    optionsAs: ['কাজিৰঙা ৰাষ্ট্ৰীয় উদ্যান', 'মানাহ ৰাষ্ট্ৰীয় উদ্যান', 'ডিব্ৰু-চৈখোৱা', 'নামেৰি'],
    correctIndex: 0,
    triviaFact: 'Kaziranga hosts two-thirds of the world\'s great one-horned rhinoceroses and is a UNESCO World Heritage Site.',
    triviaFactAs: 'কাজিৰঙা সমগ্ৰ বিশ্বৰ দুই-তৃতীয়াংশ এশিঙীয়া গঁড়ৰ বাসস্থান আৰু ই ইউনেস্ক’ৰ বিশ্ব ঐতিহ্য ক্ষেত্ৰ।',
  },
  {
    id: 2,
    question: 'Which traditional festival in Assam marks the arrival of spring, Bohag, and the Assamese New Year?',
    questionAs: 'বসন্তৰ আগমন আৰু অসমীয়া নৱবৰ্ষ উপলক্ষে কোনটো বিহু পালন কৰা হয়?',
    imageHint: '🌸 🥁',
    options: ['Rongali / Bohag Bihu', 'Kongali / Kati Bihu', 'Bhogali / Magh Bihu', 'Me-Dam-Me-Phi'],
    optionsAs: ['ৰঙালী / বহাগ বিহু', 'কঙালী / কাতি বিহু', 'ভোগালী / মাঘ বিহু', 'মে-ডাম-মে-ফি'],
    correctIndex: 0,
    triviaFact: 'Rongali Bihu is celebrated with vibrant Husori dancing, Pepa music, and gifting handwoven Gamosa to elders.',
    triviaFactAs: 'ৰঙালী বিহু হুঁচৰি, পেঁপা আৰু জ্যেষ্ঠজনক সন্মান জনাই গামোচা উপহাৰ দিয়াৰ উৎসৱ।',
  },
  {
    id: 3,
    question: 'What is the name of the world\'s largest inhabited river island located on the Brahmaputra?',
    questionAs: 'ব্ৰহ্মপুত্ৰৰ বুকুত অৱস্থিত বিশ্বৰ বৃহত্তম নদীদ্বীপ কোনটো?',
    imageHint: '🏝️ 🛶',
    options: ['Majuli', 'Umananda', 'Havelock', 'Divar'],
    optionsAs: ['মাজুলী', 'উমানন্দ', 'হেভলক', 'দিভাৰ'],
    correctIndex: 0,
    triviaFact: 'Majuli is the cultural capital of Neo-Vaishnavite Satra heritage founded by Mahapurush Srimanta Sankardev.',
    triviaFactAs: 'মাজুলী মহাপুৰুষ শ্ৰীমন্ত শংকৰদেৱৰ নৱবৈষ্ণৱ ধৰ্ম আৰু সত্ৰীয়া সংস্কৃতিৰ প্ৰাণকেন্দ্ৰ।',
  },
  {
    id: 4,
    question: 'Assam is globally celebrated for its rare golden silk. What is this silk traditionally called?',
    questionAs: 'সোণালী উজ্জ্বলতাৰ বাবে বিশ্ববিখ্যাত অসমৰ থলুৱা পাট-ৰেচমৰ নাম কি?',
    imageHint: '✨ 👘',
    options: ['Muga Silk', 'Mulberry Silk', 'Tussar Silk', 'Pashmina'],
    optionsAs: ['মুগা ৰেচম (Muga)', 'পাট ৰেচম', 'তচৰ ৰেচম', 'পশ্মিনা'],
    correctIndex: 0,
    triviaFact: 'Muga silk is known for its natural golden shimmer and durability, becoming more lustrous with every wash.',
    triviaFactAs: 'মুগা ৰেচমৰ উজ্জ্বলতা ধুলে অধিক বৃদ্ধি পায় আৰু ই অসমৰ এক অনন্য গৌৰৱ।',
  },
];

export const LocalMemoryGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <GameShell
      gameId="local-memory"
      title="Local Heritage Memory"
      titleAs="থলুৱা ঐতিহ্য স্মৃতি"
      instructions="Answer engaging trivia questions celebrating Assam's culture, festivals, and landmarks."
      instructionsAs="অসমৰ প্ৰাকৃতিক সৌন্দৰ্য, ইতিহাস আৰু বিহু উৎসৱৰ স্মৃতি সম্পৰ্কীয় সহজ প্ৰশ্নৰ উত্তৰ দিয়ক।"
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

  return (
    <div className="w-full max-w-xl space-y-6">
      {/* Progress */}
      <div className="flex justify-between items-center text-xs font-bold text-slate-500">
        <span>Question {currentIdx + 1} of {HERITAGE_QUESTIONS.length}</span>
        <span className="text-teal-700 font-bold">Heritage Recall</span>
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-3xl bg-teal-50 border-2 border-teal-500 text-center space-y-3">
        <div className="text-4xl">{currentQ.imageHint}</div>
        <h3 className="text-xl font-extrabold text-slate-900">
          {currentQ.questionAs}
        </h3>
        <p className="text-xs text-slate-600">
          {currentQ.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentQ.optionsAs.map((optText, optIdx) => {
          const isSelected = selectedOption === optIdx;
          const isCorrect = optIdx === currentQ.correctIndex;

          let btnStyle = 'bg-white border-sky-200 text-slate-900 hover:border-teal-500 hover:bg-teal-50/50';
          if (showExplanation) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
            } else if (isSelected) {
              btnStyle = 'bg-red-100 border-red-400 text-red-950';
            }
          }

          return (
            <button
              key={optIdx}
              disabled={selectedOption !== null}
              onClick={() => handleSelectOption(optIdx)}
              className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-base transition-all cursor-pointer flex items-center justify-between shadow-xs ${btnStyle}`}
            >
              <span>{optText}</span>
              {showExplanation && isCorrect && <CheckCircle2 size={20} className="text-emerald-600" />}
            </button>
          );
        })}
      </div>

      {/* Explanation Banner */}
      {showExplanation && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs sm:text-sm animate-in fade-in">
          <strong>💡 স্মৃতি টোকা:</strong> {currentQ.triviaFactAs}
        </div>
      )}
    </div>
  );
};
