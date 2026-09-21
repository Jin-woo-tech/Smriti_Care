import {
  Reminder,
  JournalEntry,
  PhotoMemory,
  GameScoreRecord,
  CognitiveDomainTrend,
  AshaPatientRecord,
  SyncQueueItem,
  AppSettings,
  PatientProfile,
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
  PATIENT_PROFILES: 'smritincare_patient_profiles',
  ACTIVE_PATIENT_ID: 'smritincare_active_patient_id',
};

// Seed Profiles for multi-patient switching
export const initialPatientProfiles: PatientProfile[] = [
  {
    id: 'pat-ananya-20',
    name: 'Ananya Jain',
    nameHi: 'अनन्या जैन',
    age: 20,
    gender: 'F',
    location: 'Titabor, Jorhat',
    locationHi: 'तिताबोर, जोरहाट',
    avatarInitials: 'AJ',
    avatarColor: 'from-purple-600 to-indigo-500',
    condition: 'Cognitive Wellness & Memory Training',
    conditionHi: 'संज्ञानात्मक स्वास्थ्य एवं स्मृति प्रशिक्षण',
    adherenceRate: 98,
    emergencyContactName: 'Rajesh Jain (Guardian)',
    emergencyContactPhone: '+91 94350 77889',
  },
  {
    id: 'pat-bipin-72',
    name: 'Bipin Gogoi',
    nameHi: 'बिपिन गोगोई',
    age: 72,
    gender: 'M',
    location: 'Titabor Borchapori',
    locationHi: 'तिताबोर बोरचापोरी',
    avatarInitials: 'BG',
    avatarColor: 'from-blue-600 to-cyan-500',
    condition: 'Hypertension & Mild Cognitive Care',
    conditionHi: 'उच्च रक्तचाप एवं प्रारंभिक स्मृति देखभाल',
    adherenceRate: 92,
    emergencyContactName: 'Priyanka Gogoi (Daughter)',
    emergencyContactPhone: '+91 98640 67890',
  },
  {
    id: 'pat-pratima-68',
    name: 'Pratima Barua',
    nameHi: 'प्रतिमा बरुआ',
    age: 68,
    gender: 'F',
    location: 'Dulia Gaon, Titabor',
    locationHi: 'दुलिया गांव, तिताबोर',
    avatarInitials: 'PB',
    avatarColor: 'from-emerald-600 to-teal-500',
    condition: 'Type 2 Diabetes & Routine Support',
    conditionHi: 'मधुमेह एवं दैनिक दिनचर्या सहायता',
    adherenceRate: 74,
    emergencyContactName: 'Manoj Barua (Son)',
    emergencyContactPhone: '+91 94351 11223',
  },
  {
    id: 'pat-hemanta-77',
    name: 'Hemanta Sarma',
    nameHi: 'हेमंत शर्मा',
    age: 77,
    gender: 'M',
    location: 'Chinnamara, Jorhat',
    locationHi: 'चिनामरा, जोरहाट',
    avatarInitials: 'HS',
    avatarColor: 'from-amber-600 to-orange-500',
    condition: 'Active Neuro-Care & Clinic Follow-up',
    conditionHi: 'न्यूरो देखभाल एवं क्लिनिक फॉलो-अप',
    adherenceRate: 61,
    emergencyContactName: 'Anita Sarma (Wife)',
    emergencyContactPhone: '+91 98642 99887',
  }
];

// Initial Seed Data tailored for bilingual support (English & Hindi)
export const initialSettings: AppSettings = {
  role: 'patient',
  language: 'en',
  textScale: 'large', // default large for elderly comfort
  highContrast: false,
  reducedMotion: false,
  voiceAssistanceEnabled: true,
  apiKey: '',
  apiKeyStatus: 'untested',
  isSimulatedOffline: false,
  activePatientId: 'pat-ananya-20',
};

export const initialReminders: Reminder[] = [
  {
    id: 'rem-1',
    type: 'medicine',
    title: 'Telmisartan (Blood Pressure)',
    titleHi: 'टेल्मीसार्टन (रक्तचाप की दवा)',
    dose: '40 mg - 1 Tablet',
    doseHi: '४० मि.ग्रा. - १ गोली',
    time: '08:00 AM',
    frequency: 'Daily with Morning Breakfast',
    frequencyHi: 'प्रतिदिन सुबह नाश्ते के साथ',
    taken: true,
    takenAt: '08:15 AM',
    notes: 'Take after tea & breakfast with a full glass of warm water.',
    notesHi: 'सुबह की चाय और नाश्ते के बाद एक गिलास गुनगुने पानी के साथ लें।',
  },
  {
    id: 'rem-2',
    type: 'medicine',
    title: 'Metformin (Blood Sugar)',
    titleHi: 'मेटफॉर्मिन (मधुमेह की दवा)',
    dose: '500 mg - 1 Tablet',
    doseHi: '५०० मि.ग्रा. - १ गोली',
    time: '01:30 PM',
    frequency: 'Twice daily with Lunch & Dinner',
    frequencyHi: 'दिन में दो बार दोपहर और रात के भोजन के साथ',
    taken: false,
    notes: 'Helps maintain healthy sugar levels.',
    notesHi: 'रक्त शर्करा के स्तर को संतुलित रखने में मदद करता है।',
  },
  {
    id: 'rem-3',
    type: 'hydration',
    title: 'Warm Water & Lemon Tea',
    titleHi: 'गुनगुना पानी या नींबू चाय',
    dose: '2 Glasses (500 ml)',
    doseHi: '२ गिलास (५०० मि.ली.)',
    time: '11:00 AM',
    frequency: 'Daily mid-morning',
    frequencyHi: 'प्रतिदिन दोपहर से पहले',
    taken: true,
    takenAt: '11:10 AM',
    notes: 'Staying hydrated helps mental alertness and kidney function.',
    notesHi: 'पर्याप्त पानी पीने से मानसिक सतर्कता और स्वास्थ्य बना रहता है।',
  },
  {
    id: 'rem-4',
    type: 'walking',
    title: 'Courtyard & Garden Gentle Walk',
    titleHi: 'बगीचे में हल्की सैर',
    dose: '20 Minutes',
    doseHi: '२० मिनट',
    time: '05:00 PM',
    frequency: 'Daily evening',
    frequencyHi: 'प्रतिदिन शाम को',
    taken: false,
    notes: 'Fresh air in the courtyard with walking stick if needed.',
    notesHi: 'खुली ताजी हवा में टहलें, आवश्यकता होने पर छड़ी का उपयोग करें।',
  },
  {
    id: 'rem-5',
    type: 'appointment',
    title: 'Dr. Baruah - Monthly Checkup (PHC Titabor)',
    titleHi: 'डॉ. बरुआ - मासिक स्वास्थ्य जांच (प्राथमिक स्वास्थ्य केंद्र)',
    dose: 'BP & Sugar Check',
    doseHi: 'बीपी व शुगर जांच',
    time: '10:00 AM, 15th Sept',
    frequency: 'Monthly',
    frequencyHi: 'मासिक',
    taken: false,
    notes: 'ASHA worker Minoti Baideo will accompany to the clinic.',
    notesHi: 'आशा कार्यकर्ता दीदी साथ में क्लिनिक जाएंगी।',
  },
];

export const initialPhotoMemories: PhotoMemory[] = [
  {
    id: 'photo-1',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    title: 'Daughter Priyanka & Grandson Aarav',
    titleHi: 'पुत्री प्रियंका और पोता आरव',
    relation: 'Daughter and Grandson',
    relationHi: 'पुत्री और प्रिय पोता',
    description: 'Visiting during last Bohag Bihu festival with handwoven Gamosa gifts.',
    descriptionHi: 'पिछले उत्सव के दौरान परिवार के साथ बिताए सुखद पल और भेंट।',
    year: '2025',
    voiceNoteText: 'This is your daughter Priyanka and 8-year-old grandson Aarav who loves playing chess with you.',
    voiceNoteTextHi: 'यह आपकी बेटी प्रियंका और ८ वर्षीय पोता आरव हैं, जिन्हें आपके साथ शतरंज खेलना पसंद है।',
  },
  {
    id: 'photo-2',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    title: 'Ancestral Tea Garden in Titabor',
    titleHi: 'तिताबोर का पैतृक चाय बागान',
    relation: 'Family Estate',
    relationHi: 'पारिवारिक धरोहर',
    description: 'The green tea bushes planted by your father in 1968 near the foothills.',
    descriptionHi: '१९६८ में आपके पिताजी द्वारा लगाए गए हरे-भरे चाय के बागान।',
    year: '1968 - Present',
    voiceNoteText: 'You spent over 35 years managing this serene tea estate with your brother Hemanta.',
    voiceNoteTextHi: 'आपने अपने भाई हेमंत के साथ ३५ से अधिक वर्षों तक इस सुंदर बागान का प्रबंधन किया।',
  },
  {
    id: 'photo-3',
    imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80',
    title: 'Wife Nirmala at Kamakhya Temple',
    titleHi: 'धर्मपत्नी निर्मला के साथ कामाख्या मंदिर दर्शन',
    relation: 'Spouse',
    relationHi: 'धर्मपत्नी निर्मला देवी',
    description: 'Golden 50th Wedding Anniversary blessing trip to Nilachal Hills, Guwahati.',
    descriptionHi: '५०वीं शादी की सालगिरह पर नीलांचल पर्वत के पावन मंदिर में आशीर्वाद यात्रा।',
    year: '2021',
    voiceNoteText: 'Your beloved wife Nirmala who has been by your side for over 52 years.',
    voiceNoteTextHi: 'आपकी धर्मपत्नी निर्मला, जो ५२ से अधिक वर्षों से सुख-दुख में आपके साथ हैं।',
  }
];

export const initialJournal: JournalEntry[] = [
  {
    id: 'j-1',
    date: 'Today, 09:30 AM',
    mood: 'peaceful',
    text: 'Enjoyed fresh ginger tea in the veranda. Spoke with Aarav on video call about his school drawing.',
    textHi: 'बरामदे में ताजी अदरक वाली चाय का आनंद लिया। आरव से वीडियो कॉल पर उसकी स्कूल ड्राइंग के बारे में बात की।',
  },
  {
    id: 'j-2',
    date: 'Yesterday, 06:15 PM',
    mood: 'happy',
    text: 'Completed 20 minutes garden walk. Recognized all photos in the memory game with 100% score.',
    textHi: 'बगीचे में २० मिनट की सैर पूरी की। स्मृति खेल में शत-प्रतिशत सही उत्तर दिए।',
  },
  {
    id: 'j-3',
    date: '2 days ago',
    mood: 'nostalgic',
    text: 'Remembered the old folk songs we used to sing at the village field.',
    textHi: 'गांव के खेतों में गाए जाने वाले पुराने लोकगीतों की मधुर यादें ताजा हुईं।',
  }
];

export const initialCognitiveTrends: CognitiveDomainTrend[] = [
  {
    domain: 'Visual & Spatial Memory',
    domainHi: 'दृश्य एवं स्थानिक स्मृति',
    score: 84,
    baselineScore: 82,
    status: 'stable',
    trendDirection: 'improving',
    lastTestedDate: 'Today',
  },
  {
    domain: 'Attention & Visual Search',
    domainHi: 'एकाग्रता एवं दृश्य खोज',
    score: 79,
    baselineScore: 80,
    status: 'stable',
    trendDirection: 'stable',
    lastTestedDate: 'Yesterday',
  },
  {
    domain: 'Executive Planning & Trail Making',
    domainHi: 'कार्यकारी योजना एवं पथ निर्धारण',
    score: 73,
    baselineScore: 78,
    status: 'watch',
    trendDirection: 'slight-decline',
    lastTestedDate: 'Today',
  },
  {
    domain: 'Daily Routine Recall',
    domainHi: 'दैनिक दिनचर्या स्मरण',
    score: 88,
    baselineScore: 85,
    status: 'stable',
    trendDirection: 'improving',
    lastTestedDate: 'Today',
  },
  {
    domain: 'Working Memory (Sequence)',
    domainHi: 'अल्पकालिक अनुक्रम स्मृति',
    score: 71,
    baselineScore: 76,
    status: 'watch',
    trendDirection: 'slight-decline',
    lastTestedDate: '2 days ago',
  },
  {
    domain: 'Cultural & Semantic Memory',
    domainHi: 'सांस्कृतिक एवं ज्ञान स्मृति',
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
    nameHi: 'बिपिन गोगोई',
    age: 72,
    gender: 'M',
    village: 'Titabor Borchapori',
    villageHi: 'तिताबोर बोरचापोरी',
    phone: '+91 94350 12345',
    caregiverName: 'Priyanka Gogoi (Daughter)',
    caregiverPhone: '+91 98640 67890',
    lastVisitDate: '2026-09-06',
    adherenceRate: 92,
    cognitiveStatus: 'stable',
    medicationStockDays: 14,
    nextScheduledVisit: '2026-09-13',
    notes: 'Responsive, taking blood pressure medicine on time. Daughter monitors daily routine.',
    notesHi: 'स्वास्थ्य अच्छा है, रक्तचाप की दवाएं समय पर ले रहे हैं। बेटी नियमित देखभाल करती है।',
  },
  {
    id: 'asha-p2',
    name: 'Pratima Barua',
    nameHi: 'प्रतिमा बरुआ',
    age: 68,
    gender: 'F',
    village: 'Dulia Gaon, Titabor',
    villageHi: 'दुलिया गांव, तिताबोर',
    phone: '+91 94352 98765',
    caregiverName: 'Manoj Barua (Son)',
    caregiverPhone: '+91 94351 11223',
    lastVisitDate: '2026-09-04',
    adherenceRate: 74,
    cognitiveStatus: 'watch',
    medicationStockDays: 3,
    nextScheduledVisit: '2026-09-11',
    notes: 'Medication refill needed in 3 days. Occasional confusion with afternoon Metformin dosage.',
    notesHi: '३ दिनों में दवा पुनः प्राप्त करने की आवश्यकता है। दोपहर की खुराक में कभी-कभी भूल हो जाती है।',
  },
  {
    id: 'asha-p3',
    name: 'Hemanta Sarma',
    nameHi: 'हेमंत शर्मा',
    age: 77,
    gender: 'M',
    village: 'Chinnamara, Jorhat',
    villageHi: 'चिनामरा, जोरहाट',
    phone: '+91 98641 45678',
    caregiverName: 'Anita Sarma (Wife)',
    caregiverPhone: '+91 98642 99887',
    lastVisitDate: '2026-09-01',
    adherenceRate: 61,
    cognitiveStatus: 'review',
    medicationStockDays: 20,
    nextScheduledVisit: '2026-09-12',
    notes: 'Marked trail making delay. Advised PHC clinical review for memory checkup with Dr. Baruah.',
    notesHi: 'स्मृति और ध्यान में देरी देखी गई। डॉ. बरुआ के साथ पीएचसी में क्लिनिकल समीक्षा की सलाह दी गई।',
  },
  {
    id: 'asha-p4',
    name: 'Bhabani Saikia',
    nameHi: 'भवानी सैकिया',
    age: 70,
    gender: 'F',
    village: 'Meleng Grant',
    villageHi: 'मेलेंग ग्रांट',
    phone: '+91 94355 66778',
    caregiverName: 'Runu Saikia (Daughter-in-law)',
    caregiverPhone: '+91 94356 22334',
    lastVisitDate: '2026-09-08',
    adherenceRate: 88,
    cognitiveStatus: 'stable',
    medicationStockDays: 28,
    nextScheduledVisit: '2026-09-18',
    notes: 'Active in garden. Completed memory match game with high score. BP 128/82 normal.',
    notesHi: 'बगीचे में सक्रिय। मेमोरी मैच खेल में उच्च स्कोर प्राप्त किया। बीपी १२८/८२ सामान्य है।',
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
