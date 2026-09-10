import {
  Reminder,
  JournalEntry,
  PhotoMemory,
  GameScoreRecord,
  CognitiveDomainTrend,
  AshaPatientRecord,
  SyncQueueItem,
  AppSettings,
  GameId
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'smritincare_settings',
  REMINDERS: 'smritincare_reminders',
  JOURNAL: 'smritincare_journal',
  PHOTOS: 'smritincare_photos',
  GAME_SCORES: 'smritincare_game_scores',
  COGNITIVE_TRENDS: 'smritincare_cognitive_trends',
  ASHA_PATIENTS: 'smritincare_asha_patients',
  SYNC_QUEUE: 'smritincare_sync_queue',
  WATER_INTAKE: 'smritincare_water_intake',
};

// Initial Seed Data tailored for North East India (Assam context)
export const initialSettings: AppSettings = {
  role: 'patient',
  language: 'en',
  textScale: 'large', // default large for elderly comfort
  highContrast: false,
  reducedMotion: false,
  voiceAssistanceEnabled: true,
  apiKey: '',
  isSimulatedOffline: false,
};

export const initialReminders: Reminder[] = [
  {
    id: 'rem-1',
    type: 'medicine',
    title: 'Telmisartan (Blood Pressure)',
    titleAs: 'টেলমিচাৰ্টান (উচ্চ ৰক্তচাপৰ ঔষধ)',
    dose: '40 mg - 1 Tablet',
    doseAs: '৪০ মি:গ্ৰা: - ১ টা টেবলেট',
    time: '08:00 AM',
    frequency: 'Daily with Morning Breakfast',
    frequencyAs: 'প্ৰতিদিনে ৰাতিপুৱাৰ আহাৰৰ সৈতে',
    taken: true,
    takenAt: '08:15 AM',
    notes: 'Take after tea & breakfast with a full glass of warm water.',
    notesAs: 'ৰাতিপুৱাৰ চাহ আৰু জলপান খাই কুহুমীয়া পানীৰে খাব।',
  },
  {
    id: 'rem-2',
    type: 'medicine',
    title: 'Metformin (Blood Sugar)',
    titleAs: 'মেটফৰ্মিন (মধুমেহ / চুগাৰৰ ঔষধ)',
    dose: '500 mg - 1 Tablet',
    doseAs: '৫০০ মি:গ্ৰা: - ১ টা টেবলেট',
    time: '01:30 PM',
    frequency: 'Twice daily with Lunch & Dinner',
    frequencyAs: 'দুপৰীয়া আৰু ৰাতিৰ আহাৰৰ লগত',
    taken: false,
    notes: 'Helps maintain healthy sugar levels.',
    notesAs: 'তেজৰ শৰ্কৰাৰ মাত্ৰা নিয়ন্ত্ৰণত ৰাখে।',
  },
  {
    id: 'rem-3',
    type: 'hydration',
    title: 'Warm Water & Lemon Tea',
    titleAs: 'কুহুমীয়া পানী বা লেমন চাহ',
    dose: '2 Glasses (500 ml)',
    doseAs: '২ গিলাচ (৫০০ মি:লি:)',
    time: '11:00 AM',
    frequency: 'Daily mid-morning',
    frequencyAs: 'প্ৰতিদিনে দুপৰীয়াৰ আগে আগে',
    taken: true,
    takenAt: '11:10 AM',
    notes: 'Staying hydrated helps mental alertness and kidney function.',
    notesAs: 'পৰ্যাপ্ত পানী খালে স্মৃতিশক্তি সতেজ থাকে।',
  },
  {
    id: 'rem-4',
    type: 'walking',
    title: 'Courtyard & Garden Gentle Walk',
    titleAs: 'চোতাল আৰু বাৰীত শান্তিপূৰ্ণ খোজ কঢ়া',
    dose: '20 Minutes',
    doseAs: '২০ মিনিট',
    time: '05:00 PM',
    frequency: 'Daily evening',
    frequencyAs: 'প্ৰতিদিনে গধূলি',
    taken: false,
    notes: 'Fresh air in the courtyard with walking stick if needed.',
    notesAs: 'বাৰীৰ মুকলি বতাহত লাহে লাহে খোজ কাঢ়ক।',
  },
  {
    id: 'rem-5',
    type: 'appointment',
    title: 'Dr. Baruah - Monthly Checkup (PHC Titabor)',
    titleAs: 'ডাঃ বৰুৱা - মাহেকীয়া স্বাস্থ্য পৰীক্ষা (তিতাবৰ প্ৰাথমিক স্বাস্থ্য কেন্দ্ৰ)',
    dose: 'BP & Sugar Check',
    doseAs: 'প্ৰেচাৰ আৰু চুগাৰ পৰীক্ষা',
    time: '10:00 AM, 15th Sept',
    frequency: 'Monthly',
    frequencyAs: 'মাহেকীয়া',
    taken: false,
    notes: 'ASHA worker Minoti Baideo will accompany to the clinic.',
    notesAs: 'আশা কৰ্মী মিনতি বাইদেউ লগত যাব।',
  },
];

export const initialPhotoMemories: PhotoMemory[] = [
  {
    id: 'photo-1',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    title: 'Daughter Priyanka & Grandson Aarav',
    titleAs: 'জীয়াৰী প্ৰিয়ংকা আৰু নাতি আৰভ',
    relation: 'Daughter and Grandson',
    relationAs: 'জীয়াৰী আৰু মৰমৰ নাতি',
    description: 'Visiting during last Bohag Bihu festival with handwoven Gamosa gifts.',
    descriptionAs: 'যোৱা বহাগ বিহুৰ সময়ত যোৰহাটৰ ঘৰলৈ আহিছিল আৰু হাতৰ বোৱা গামোচা দিছিল।',
    year: '2025',
    voiceNoteText: 'This is your daughter Priyanka and 8-year-old grandson Aarav who loves playing chess with you.',
    voiceNoteTextAs: 'এয়া আপোনাৰ জীয়াৰী প্ৰিয়ংকা আৰু ৮ বছৰীয়া নাতি আৰভ, যিয়ে আপোনাৰ লগত লুডু আৰু দবা খেলিবলৈ ভাল পায়।',
  },
  {
    id: 'photo-2',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    title: 'Ancestral Tea Garden in Titabor',
    titleAs: 'তিতাবৰৰ পৈতৃক চাহ বাগিচা',
    relation: 'Family Estate',
    relationAs: 'পৰিয়ালৰ পুৰণি চাহ বাগিচা',
    description: 'The green tea bushes planted by your father in 1968 near the foothills.',
    descriptionAs: '১৯৬৮ চনত দেউতাই ৰোপণ কৰা সেউজীয়া চাহ বাগিচা।',
    year: '1968 - Present',
    voiceNoteText: 'You spent over 35 years managing this serene tea estate with your brother Hemanta.',
    voiceNoteTextAs: 'আপুনি আপোনাৰ ককাইদেউ হেমন্তৰ লগত ৩৫ বছৰ এই সুন্দৰ বাগিচাখন পৰিচালনা কৰিছিল।',
  },
  {
    id: 'photo-3',
    imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80',
    title: 'Wife Nirmala at Kamakhya Temple',
    titleAs: 'ধৰ্মপত্নী নিৰ্মলাৰ সৈতে কামাখ্যা মন্দিৰ দৰ্শন',
    relation: 'Spouse',
    relationAs: 'ধৰ্মপত্নী নিৰ্মলা দেৱী',
    description: 'Golden 50th Wedding Anniversary blessing trip to Nilachal Hills, Guwahati.',
    descriptionAs: 'নীলাচল পাহাৰৰ কামাখ্যা মন্দিৰত ৫০তম বিবাহ বাৰ্ষিকীৰ আশীৰ্বাদ লোৱা সময়ৰ ফটো।',
    year: '2021',
    voiceNoteText: 'Your beloved wife Nirmala who has been by your side for over 52 years.',
    voiceNoteTextAs: 'আপোনাৰ মৰমৰ পত্নী নিৰ্মলা, যিয়ে বিগত ৫২ বছৰ ধৰি সুখ-দুখৰ সংগী হৈ আহিছে।',
  }
];

export const initialJournal: JournalEntry[] = [
  {
    id: 'j-1',
    date: 'Today, 09:30 AM',
    mood: 'peaceful',
    text: 'Enjoyed fresh ginger tea in the veranda. Spoke with Aarav on video call about his school drawing.',
    textAs: 'বাৰান্দাত বহি আদা চাহ খালোঁ। নাতি আৰভৰ লগত ভিডিঅ’ কলত কথা পাতিলোঁ।',
  },
  {
    id: 'j-2',
    date: 'Yesterday, 06:15 PM',
    mood: 'happy',
    text: 'Completed 20 minutes garden walk. Recognized all photos in the memory game with 100% score.',
    textAs: 'ফুলনিত ২০ মিনিট খোজ কাঢ়িলোঁ। স্মৃতি খেলত ১০০% শুদ্ধ উত্তৰ দিলোঁ।',
  },
  {
    id: 'j-3',
    date: '2 days ago',
    mood: 'nostalgic',
    text: 'Remembered the old Bihu songs we used to sing at the village field.',
    textAs: 'গাঁৱৰ পথাৰত গাই থকা পুৰণি বিহুগীতবোৰ মনত পৰিছিল।',
  }
];

export const initialCognitiveTrends: CognitiveDomainTrend[] = [
  {
    domain: 'Visual & Spatial Memory',
    domainAs: 'দৃষ্টি আৰু স্থানিক স্মৃতি',
    score: 84,
    baselineScore: 82,
    status: 'stable',
    trendDirection: 'improving',
    lastTestedDate: 'Today',
  },
  {
    domain: 'Attention & Visual Search',
    domainAs: 'মনোযোগ আৰু চিহ্ন অনুসন্ধান',
    score: 79,
    baselineScore: 80,
    status: 'stable',
    trendDirection: 'stable',
    lastTestedDate: 'Yesterday',
  },
  {
    domain: 'Executive Planning & Trail Making',
    domainAs: 'কাৰ্য্যকৰী পৰিকল্পনা আৰু পথ নিৰ্ধাৰণ',
    score: 73,
    baselineScore: 78,
    status: 'watch',
    trendDirection: 'slight-decline',
    lastTestedDate: 'Today',
  },
  {
    domain: 'Daily Routine Recall',
    domainAs: 'দৈনন্দিন ৰুটিন মনত ৰখাৰ ক্ষমতা',
    score: 88,
    baselineScore: 85,
    status: 'stable',
    trendDirection: 'improving',
    lastTestedDate: 'Today',
  },
  {
    domain: 'Working Memory (Sequence)',
    domainAs: 'স্বল্পম্যাদী ক্ৰমিক স্মৃতি',
    score: 71,
    baselineScore: 76,
    status: 'watch',
    trendDirection: 'slight-decline',
    lastTestedDate: '2 days ago',
  },
  {
    domain: 'Cultural & Semantic Memory',
    domainAs: 'সাংস্কৃতিক আৰু ঐতিহাসিক স্মৃতি',
    score: 94,
    baselineScore: 92,
    status: 'stable',
    trendDirection: 'improving',
    lastTestedDate: 'Today',
  },
];

export const initialGameScores: GameScoreRecord[] = [
  {
    id: 'gs-1',
    gameId: 'remember-match',
    date: '2026-09-10',
    score: 95,
    maxScore: 100,
    accuracy: 95,
    reactionTimeMs: 1420,
    difficultyTier: 2,
    durationSeconds: 48,
  },
  {
    id: 'gs-2',
    gameId: 'find-symbol',
    date: '2026-09-09',
    score: 80,
    maxScore: 100,
    accuracy: 88,
    reactionTimeMs: 1890,
    difficultyTier: 2,
    durationSeconds: 62,
  },
  {
    id: 'gs-3',
    gameId: 'remember-routine',
    date: '2026-09-09',
    score: 90,
    maxScore: 100,
    accuracy: 92,
    reactionTimeMs: 1650,
    difficultyTier: 2,
    durationSeconds: 55,
  },
  {
    id: 'gs-4',
    gameId: 'local-memory',
    date: '2026-09-08',
    score: 100,
    maxScore: 100,
    accuracy: 100,
    reactionTimeMs: 1210,
    difficultyTier: 2,
    durationSeconds: 40,
  },
  {
    id: 'gs-5',
    gameId: 'follow-path',
    date: '2026-09-07',
    score: 72,
    maxScore: 100,
    accuracy: 75,
    reactionTimeMs: 2450,
    difficultyTier: 1,
    durationSeconds: 78,
  },
];

export const initialAshaPatients: AshaPatientRecord[] = [
  {
    id: 'asha-p1',
    name: 'Bipin Gogoi',
    nameAs: 'বিপিন গগৈ',
    age: 72,
    gender: 'M',
    village: 'Titabor Borchapori',
    villageAs: 'তিতাবৰ বৰচাপৰি',
    phone: '+91 94350 12345',
    caregiverName: 'Priyanka Gogoi (Daughter)',
    caregiverPhone: '+91 98640 67890',
    lastVisitDate: '2026-09-06',
    adherenceRate: 92,
    cognitiveStatus: 'stable',
    medicationStockDays: 14,
    nextScheduledVisit: '2026-09-13',
    notes: 'Responsive, taking blood pressure medicine on time. Daughter monitors daily routine.',
    notesAs: 'স্বাস্থ্য ভালে আছে, নিয়মীয়াকৈ উচ্চ ৰক্তচাপৰ ঔষধ খাইছে।',
  },
  {
    id: 'asha-p2',
    name: 'Pratima Barua',
    nameAs: 'প্ৰতিমা বৰুৱা',
    age: 68,
    gender: 'F',
    village: 'Dulia Gaon, Titabor',
    villageAs: 'দুলীয়া গাঁও, তিতাবৰ',
    phone: '+91 94352 98765',
    caregiverName: 'Manoj Barua (Son)',
    caregiverPhone: '+91 94351 11223',
    lastVisitDate: '2026-09-04',
    adherenceRate: 74,
    cognitiveStatus: 'watch',
    medicationStockDays: 3,
    nextScheduledVisit: '2026-09-11',
    notes: 'Medication refill needed in 3 days. Occasional confusion with afternoon Metformin dosage.',
    notesAs: '৩ দিন পাছত ঔষধ শেষ হ’ব। দুপৰীয়াৰ মেটফৰ্মিন খাবলৈ কেতিয়াবা পাহৰে।',
  },
  {
    id: 'asha-p3',
    name: 'Hemanta Sarma',
    nameAs: 'হেমন্ত শৰ্মা',
    age: 77,
    gender: 'M',
    village: 'Chinnamara, Jorhat',
    villageAs: 'চিনামৰা, যোৰহাট',
    phone: '+91 98641 45678',
    caregiverName: 'Anita Sarma (Wife)',
    caregiverPhone: '+91 98642 99887',
    lastVisitDate: '2026-09-01',
    adherenceRate: 61,
    cognitiveStatus: 'review',
    medicationStockDays: 20,
    nextScheduledVisit: '2026-09-12',
    notes: 'Marked trail making delay. Advised PHC clinical review for memory checkup with Dr. Baruah.',
    notesAs: 'স্মৃতি আৰু মনোযোগৰ তাৰতম্য দেখা গৈছে। প্ৰাথমিক স্বাস্থ্য কেন্দ্ৰলৈ পৰীক্ষাৰ বাবে নিয়াৰ পৰামৰ্শ।',
  },
  {
    id: 'asha-p4',
    name: 'Bhabani Saikia',
    nameAs: 'ভৱানী শইকীয়া',
    age: 70,
    gender: 'F',
    village: 'Meleng Grant',
    villageAs: 'মেলেং গ্ৰাণ্ট',
    phone: '+91 94355 66778',
    caregiverName: 'Runu Saikia (Daughter-in-law)',
    caregiverPhone: '+91 94356 22334',
    lastVisitDate: '2026-09-08',
    adherenceRate: 88,
    cognitiveStatus: 'stable',
    medicationStockDays: 28,
    nextScheduledVisit: '2026-09-18',
    notes: 'Active in garden. Completed memory match game with high score. BP 128/82 normal.',
    notesAs: 'ফুলনিত কাম কৰি ভাল পায়। ৰক্তচাপ স্বাভাৱিক ১২৮/৮২।',
  }
];

// LocalStorage Helper functions with safe fallbacks
export function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// Queued offline synchronization helper
export function addToSyncQueue(action: SyncQueueItem['action'], payload: any): void {
  const queue = getStoredData<SyncQueueItem[]>(STORAGE_KEYS.SYNC_QUEUE, []);
  const newItem: SyncQueueItem = {
    id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    action,
    payload,
    timestamp: new Date().toISOString(),
    synced: false,
  };
  queue.push(newItem);
  setStoredData(STORAGE_KEYS.SYNC_QUEUE, queue);
}

export function getSyncQueue(): SyncQueueItem[] {
  return getStoredData<SyncQueueItem[]>(STORAGE_KEYS.SYNC_QUEUE, []);
}

export function clearSyncQueue(): void {
  setStoredData(STORAGE_KEYS.SYNC_QUEUE, []);
}

export { STORAGE_KEYS };
