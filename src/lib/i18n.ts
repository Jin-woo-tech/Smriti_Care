import { Language } from '../types';

export const translations = {
  en: {
    // App header & brand
    appName: 'SmritiCare',
    appTagline: 'Cognitive Wellness & Medicine Safety for North East India',
    appSubtext: 'Supportive, offline-first care tailored for elders, families, and community health workers.',

    // Roles
    rolePatient: 'Elder / Patient',
    roleCaregiver: 'Family Caregiver',
    roleClinician: 'Doctor / Clinician',
    roleAsha: 'ASHA / Anganwadi Worker',
    roleSwitch: 'Switch Role',

    // Navigation
    navHome: 'Home',
    navRoutine: 'Daily Routine',
    navGames: 'Brain Games',
    navSafety: 'Medicine Safety',
    navJournal: 'Memory Album',
    navChat: 'Smriti Sathi (AI)',
    navDashboard: 'Dashboard',
    navVillage: 'Village Health',
    navSettings: 'Settings',

    // Common actions
    actionBack: 'Back',
    actionSave: 'Save',
    actionCancel: 'Cancel',
    actionPlay: 'Play Now',
    actionListen: 'Listen',
    actionStopVoice: 'Stop Voice',
    actionTakeDose: 'Mark Taken',
    actionSnooze: 'Remind Later',
    actionAdd: 'Add New',
    actionUpload: 'Upload Photo / File',
    actionScan: 'Scan Packaging',
    actionExplain: 'Explain in Simple Words',
    actionDownloadPdf: 'Download Clinical Report (PDF)',
    actionSyncNow: 'Sync Pending Changes',
    actionEmergency: 'Emergency SOS',

    // Status badges
    statusStable: 'Performance Trend: Stable',
    statusWatch: 'Performance Trend: Slight Deviation (Watch)',
    statusReview: 'Performance Trend: Early Review Signal',
    statusTaken: 'Taken',
    statusPending: 'Pending',
    statusNormal: 'Normal Range',
    statusElevated: 'Slightly Elevated',
    statusLow: 'Below Range',

    // Accessibility
    a11yTitle: 'Accessibility & Display',
    a11yTextSize: 'Text Size',
    a11yNormal: 'Normal (16px)',
    a11yLarge: 'Large (19px)',
    a11yXLarge: 'Extra Large (22px)',
    a11yContrast: 'High Contrast Mode',
    a11yReducedMotion: 'Reduce Animations',
    a11yVoice: 'Voice Assistance & Read Aloud',

    // Offline status
    onlineStatus: 'Online (Connected)',
    offlineStatus: 'Offline Mode Active',
    offlineSyncText: 'Changes will sync automatically when internet restores.',
    syncPendingCount: 'items queued for sync',

    // Disclaimer
    clinicalDisclaimerTitle: 'Important Health Notice',
    clinicalDisclaimer: 'SmritiCare tracks performance trends and assists with daily medication adherence. It is NOT a diagnostic tool and does NOT diagnose dementia, Alzheimer\'s, or medical conditions. Consult registered medical practitioners for clinical diagnosis.',

    // Safety & AI Stub badge
    aiStubBadgeTitle: 'AI Vision & Assistant Engine (DEMO / STUB MODE)',
    aiStubBadgeDesc: 'Showing simulated local intelligence for hackathon preview. Live Anthropic Claude Vision API can be enabled with an API key in Settings.',

    // Games
    gameRememberMatch: 'Remember & Match',
    gameRememberMatchDesc: 'Find pairs of traditional Assamese cultural items to train visual memory.',
    gameFindSymbol: 'Find the Symbol',
    gameFindSymbolDesc: 'Spot the target cultural emblem among distractors to sharpen visual attention.',
    gameFollowPath: 'Follow the Path',
    gameFollowPathDesc: 'Connect numbers and letters in sequence to practice visual-spatial planning.',
    gameRememberRoutine: 'Remember the Routine',
    gameRememberRoutineDesc: 'Arrange daily healthy living steps in their correct morning-to-night sequence.',
    gameSequenceRecall: 'Sequence Recall',
    gameSequenceRecallDesc: 'Remember and repeat the light and sound pattern to boost working memory.',
    gameLocalMemory: 'Local Heritage Memory',
    gameLocalMemoryDesc: 'Answer friendly questions celebrating Assam\'s heritage, festivals, and landmarks.',

    // Adaptive difficulty
    difficultyTier1: 'Gentle (Level 1)',
    difficultyTier2: 'Standard (Level 2)',
    difficultyTier3: 'Challenging (Level 3)',
    difficultyAdjustUp: 'Great focus! Difficulty adjusted upward.',
    difficultyAdjustGentle: 'Adjusted to a gentle pace for maximum comfort.',

    // Routine & Reminders
    routineMorning: 'Morning Schedule',
    routineAfternoon: 'Afternoon Schedule',
    routineEvening: 'Evening Schedule',
    routineNight: 'Night Schedule',
    waterTracker: 'Daily Hydration Tracker',
    waterGoal: 'Goal: 8 glasses daily (Tea, water, fresh lemon water)',
    walkTracker: 'Daily Gentle Movement',
    walkGoal: 'Goal: 20-30 min walk (Garden / courtyard)',

    // AI Chat
    chatGreeting: 'Namaskar! I am Smriti Sathi, your caring assistant. How can I help you today?',
    chatPrompt1: 'What medicine do I take with dinner tonight?',
    chatPrompt2: 'Remind me about the Rongali Bihu celebration.',
    chatPrompt3: 'I feel a bit forgetful today, what should I do?',
    chatPrompt4: 'Explain my fasting blood sugar report.',

    // Memory Journal
    journalTitle: 'Family & Heritage Memory Album',
    journalSubtitle: 'Familiar faces, ancestral memories, and joyful everyday reflections.',
    whoIsThis: 'Who is in this photo?',
    revealStory: 'Listen to the Family Memory Story',

    // Caregiver
    caregiverOverview: 'Patient Care Overview (Bipin Gogoi, Age 72)',
    adherenceRateMed: 'Medicine Adherence',
    adherenceRateHydration: 'Hydration Goal',
    adherenceRateActivity: 'Daily Activity',
    cognitiveBaseline: 'Personal Cognitive Baseline',
    caregiverNotesTitle: 'Caregiver Observation Log',

    // Clinician
    clinicianOverview: 'Clinical Longitudinal Monitoring Portal',
    domainRadarTitle: 'Cognitive Domain Breakdown',
    adherenceHistory: '30-Day Medication & Activity Adherence',
    clinicalRecommendation: 'Clinical Observation & Recommendation',

    // ASHA
    ashaTitle: 'ASHA & Anganwadi Village Care Portal',
    ashaSubtitle: 'Community Outreach • Titabor Block, Jorhat District',
    rosterTitle: 'Assigned Elderly Patients',
    lastVisited: 'Last Visited',
    medicineStock: 'Medicine Stock Left',
  },
  hi: {
    // App header & brand
    appName: 'स्मृति केयर (SmritiCare)',
    appTagline: 'पूर्वोत्तर भारत के वरिष्ठ नागरिकों के लिए संज्ञानात्मक देखभाल और दवा सुरक्षा',
    appSubtext: 'बुजुर्गों, परिवारों और आशा स्वास्थ्य कार्यकर्ताओं के लिए सरल और ऑफलाइन-सक्षम सेवा।',

    // Roles
    rolePatient: 'वरिष्ठ नागरिक / मरीज',
    roleCaregiver: 'पारिवारिक देखभालकर्ता',
    roleClinician: 'चिकित्सक / डॉक्टर',
    roleAsha: 'आशा / आंगनवाड़ी कार्यकर्ता',
    roleSwitch: 'भूमिका बदलें',

    // Navigation
    navHome: 'मुख्य पृष्ठ',
    navRoutine: 'दैनिक दिनचर्या',
    navGames: 'दिमागी खेल',
    navSafety: 'दवा सुरक्षा',
    navJournal: 'स्मृति एल्बम',
    navChat: 'स्मृति साथी (AI)',
    navDashboard: 'डैशबोर्ड',
    navVillage: 'ग्रामीण स्वास्थ्य',
    navSettings: 'सेटिंग्स',

    // Common actions
    actionBack: 'वापस जाएं',
    actionSave: 'सहेजें',
    actionCancel: 'रद्द करें',
    actionPlay: 'खेलें',
    actionListen: 'सुनें',
    actionStopVoice: 'आवाज बंद करें',
    actionTakeDose: 'दवा ले ली',
    actionSnooze: 'बाद में याद दिलाएं',
    actionAdd: 'नया जोड़ें',
    actionUpload: 'फोटो या फाइल अपलोड करें',
    actionScan: 'दवा का पैकेट स्कैन करें',
    actionExplain: 'सरल शब्दों में समझाएं',
    actionDownloadPdf: 'चिकित्सा रिपोर्ट डाउनलोड करें (PDF)',
    actionSyncNow: 'अभी सिंक करें',
    actionEmergency: 'आपातकालीन सहायता (SOS)',

    // Status badges
    statusStable: 'प्रदर्शन रुझान: स्थिर (Stable)',
    statusWatch: 'प्रदर्शन रुझान: हल्का बदलाव (Watch)',
    statusReview: 'प्रदर्शन रुझान: समीक्षा संकेत (Review)',
    statusTaken: 'ली गई',
    statusPending: 'बाकी',
    statusNormal: 'सामान्य सीमा',
    statusElevated: 'हल्का बढ़ा हुआ',
    statusLow: 'सामान्य से कम',

    // Accessibility
    a11yTitle: 'पहुंच और दृश्यता (Accessibility)',
    a11yTextSize: 'अक्षर का आकार',
    a11yNormal: 'सामान्य (16px)',
    a11yLarge: 'बड़ा (19px)',
    a11yXLarge: 'बहुत बड़ा (22px)',
    a11yContrast: 'उच्च कंट्रास्ट मोड (High Contrast)',
    a11yReducedMotion: 'एनीमेशन कम करें',
    a11yVoice: 'ध्वनि सहायता और बोलकर सुनाएं',

    // Offline status
    onlineStatus: 'ऑनलाइन (इंटरनेट सक्रिय)',
    offlineStatus: 'ऑफलाइन मोड सक्रिय',
    offlineSyncText: 'इंटरनेट आते ही सभी डेटा अपने आप सुरक्षित हो जाएगा।',
    syncPendingCount: 'आइटम सिंक के लिए कतार में हैं',

    // Disclaimer
    clinicalDisclaimerTitle: 'महत्वपूर्ण स्वास्थ्य सूचना',
    clinicalDisclaimer: 'स्मृति केयर मानसिक स्वास्थ्य रुझानों पर नज़र रखता है और दैनिक दवा लेने में मदद करता है। यह कोई नैदानिक उपकरण नहीं है और डिमेंशिया या अल्जाइमर का निदान नहीं करता है। किसी भी चिकित्सीय सलाह के लिए पंजीकृत चिकित्सक से परामर्श लें।',

    // Safety & AI Stub badge
    aiStubBadgeTitle: 'AI विजन और सहायक इंजन (डेमो मोड)',
    aiStubBadgeDesc: 'हैकथॉन पूर्वावलोकन के लिए स्थानीय डेमो प्रदर्शित है। वास्तविक क्लाउड विजन का उपयोग करने के लिए सेटिंग्स में API Key जोड़ें।',

    // Games
    gameRememberMatch: 'याद रखें और मिलाएं',
    gameRememberMatchDesc: 'पारंपरिक सांस्कृतिक प्रतीकों के जोड़े मिलाकर स्मृति क्षमता का अभ्यास करें।',
    gameFindSymbol: 'प्रतीक खोजें',
    gameFindSymbolDesc: 'अन्य चित्रों के बीच से सही प्रतीक ढूंढकर दृश्य एकाग्रता बढ़ाएं।',
    gameFollowPath: 'क्रम अनुसार पथ चुनें',
    gameFollowPathDesc: 'संख्याओं और अक्षरों को सही क्रम में जोड़कर मानसिक योजना क्षमता बढ़ाएं।',
    gameRememberRoutine: 'दैनिक दिनचर्या याद रखें',
    gameRememberRoutineDesc: 'सुबह से रात तक की दैनिक स्वस्थ गतिविधियों को सही क्रम में व्यवस्थित करें।',
    gameSequenceRecall: 'रंग और संकेत का क्रम',
    gameSequenceRecallDesc: 'रोशनी और ध्वनि के पैटर्न को याद रखकर उसी क्रम में दोहराएं।',
    gameLocalMemory: 'स्थानीय धरोहर स्मृति',
    gameLocalMemoryDesc: 'असम की संस्कृति, त्योहारों और ऐतिहासिक स्थलों से जुड़े सरल प्रश्नों के उत्तर दें।',

    // Adaptive difficulty
    difficultyTier1: 'सरल स्तर (Level 1)',
    difficultyTier2: 'मानक स्तर (Level 2)',
    difficultyTier3: 'चुनौतीपूर्ण स्तर (Level 3)',
    difficultyAdjustUp: 'शानदार एकाग्रता! स्तर उन्नत किया गया है।',
    difficultyAdjustGentle: 'आपकी सुविधा के लिए स्तर सरल किया गया है।',

    // Routine & Reminders
    routineMorning: 'सुबह की समय-सारणी',
    routineAfternoon: 'दोपहर की समय-सारणी',
    routineEvening: 'शाम की समय-सारणी',
    routineNight: 'रात की समय-सारणी',
    waterTracker: 'दैनिक जल सेवन ट्रैकर',
    waterGoal: 'लक्ष्य: प्रतिदिन 8 गिलास पानी (चाय, पानी, नींबू पानी)',
    walkTracker: 'दैनिक हल्का चलना',
    walkGoal: 'लक्ष्य: 20-30 मिनट बगीचे या आंगन में टहलना',

    // AI Chat
    chatGreeting: 'नमस्ते! मैं स्मृति साथी हूँ, आपकी देखभाल सहायक। आज मैं आपकी क्या मदद कर सकती हूँ?',
    chatPrompt1: 'आज रात के खाने के साथ मुझे कौन सी दवा लेनी है?',
    chatPrompt2: 'रोंगाली बिहू उत्सव के बारे में कुछ बताइए।',
    chatPrompt3: 'आज मुझे थोड़ा भूलने जैसा लग रहा है, मैं क्या करूँ?',
    chatPrompt4: 'मेरी ब्लड टेस्ट रिपोर्ट समझाइए।',

    // Memory Journal
    journalTitle: 'परिवार और स्मृति एल्बम',
    journalSubtitle: 'पहचाने चेहरे, पुरानी यादें और सुखद पारिवारिक क्षण।',
    whoIsThis: 'इस फोटो में कौन है?',
    revealStory: 'इस स्मृति की कहानी सुनें',

    // Caregiver
    caregiverOverview: 'रोगी देखभाल अवलोकन (बिपिन गोगोई, उम्र 72)',
    adherenceRateMed: 'नियमित दवा लेने की दर',
    adherenceRateHydration: 'पानी पीने का लक्ष्य',
    adherenceRateActivity: 'दैनिक चलने का लक्ष्य',
    cognitiveBaseline: 'व्यक्तिगत संज्ञानात्मक आधार',
    caregiverNotesTitle: 'देखभालकर्ता की टिप्पणियां',

    // Clinician
    clinicianOverview: 'चिकित्सक निगरानी पोर्टल',
    domainRadarTitle: 'मस्तिष्क के विभिन्न क्षेत्रों का प्रदर्शन',
    adherenceHistory: '30 दिनों की दवा और गतिविधि इतिहास',
    clinicalRecommendation: 'चिकित्सकीय अवलोकन और सलाह',

    // ASHA
    ashaTitle: 'आशा और आंगनवाड़ी कार्यकर्ता पोर्टल',
    ashaSubtitle: 'सामुदायिक स्वास्थ्य सेवा • तीताबर ब्लॉक, जोरहाट जिला',
    rosterTitle: 'सौंपे गए वरिष्ठ नागरिक',
    lastVisited: 'पिछली मुलाकात की तारीख',
    medicineStock: 'दवा का शेष स्टॉक',
  },
  as: {
    // App header & brand
    appName: 'স্মৃতি কেয়াৰ (SmritiCare)',
    appTagline: 'উত্তৰ-পূব ভাৰতৰ জ্যেষ্ঠ নাগৰিকসকলৰ বাবে স্মৃতি যত্ন আৰু ঔষধ সুৰক্ষা',
    appSubtext: 'জ্যেষ্ঠজন, পৰিয়াল আৰু স্বাস্থ্যকৰ্মীসকলৰ বাবে সহজ আৰু ইন্টাৰনেট নথকাকৈও চলিব পৰা সেৱা।',

    // Roles
    rolePatient: 'জ্যেষ্ঠ নাগৰিক / ৰোগী',
    roleCaregiver: 'পৰিয়ালৰ তত্ত্বাৱধায়ক',
    roleClinician: 'চিকিৎসক / ডাক্তৰ',
    roleAsha: 'আশা / অংগনৱাড়ী কৰ্মী',
    roleSwitch: 'ভূমিকা সলনি কৰক',

    // Navigation
    navHome: 'মূল পৃষ্ঠা',
    navRoutine: 'দৈনন্দিন ৰুটিন',
    navGames: 'মগজুৰ খেল',
    navSafety: 'ঔষধ সুৰক্ষা',
    navJournal: 'স্মৃতি এলবাম',
    navChat: 'স্মৃতি সাথী (AI)',
    navDashboard: 'ডেশ্ববৰ্ড',
    navVillage: 'গাঁৱৰ স্বাস্থ্য',
    navSettings: 'ছেটিংছ',

    // Common actions
    actionBack: 'উভতি যাওক',
    actionSave: 'সংৰক্ষণ কৰক',
    actionCancel: 'বাতিল কৰক',
    actionPlay: 'খেলক',
    actionListen: 'শুনক',
    actionStopVoice: 'কণ্ঠ বন্ধ কৰক',
    actionTakeDose: 'ঔষধ খালোঁ',
    actionSnooze: 'পাছত মনত পেলাব',
    actionAdd: 'নতুন যোগ কৰক',
    actionUpload: 'ফটো বা ফাইল আপলোড কৰক',
    actionScan: 'ঔষধৰ পেকেট স্কেন কৰক',
    actionExplain: 'সহজ ভাষাত বুজাই দিয়ক',
    actionDownloadPdf: 'চিকিৎসা প্ৰতিবেদন ডাউনল’ড কৰক (PDF)',
    actionSyncNow: 'এতিয়াই সংমিশ্ৰণ (Sync) কৰক',
    actionEmergency: 'জৰুৰীকালীন সহায় (SOS)',

    // Status badges
    statusStable: 'দক্ষতা ধাৰা: স্থিৰ (Stable)',
    statusWatch: 'দক্ষতা ধাৰা: সামান্য তাৰতম্য (Watch)',
    statusReview: 'দক্ষতা ধাৰা: পুনৰীক্ষণৰ সংকেত (Review)',
    statusTaken: 'খোৱা হ’ল',
    statusPending: 'বাকী আছে',
    statusNormal: 'স্বাভাৱিক সীমা',
    statusElevated: 'সামান্য বেছি',
    statusLow: 'স্বাভাৱিকতকৈ কম',

    // Accessibility
    a11yTitle: 'সহজ প্ৰৱেশাধিকাৰ আৰু দৃশ্যমানতা',
    a11yTextSize: 'আখৰৰ আকাৰ',
    a11yNormal: 'স্বাভাৱিক (16px)',
    a11yLarge: 'ডাঙৰ (19px)',
    a11yXLarge: 'অতি ডাঙৰ (22px)',
    a11yContrast: 'উচ্চ বৈসাদৃশ্য মোড (High Contrast)',
    a11yReducedMotion: 'এনিমেশ্যন কম কৰক',
    a11yVoice: 'কণ্ঠ সহায়ক আৰু পঢ়ি শুনোৱা সেৱা',

    // Offline status
    onlineStatus: 'অনলাইন (ইন্টাৰনেট সক্ৰিয়)',
    offlineStatus: 'অফলাইন মোড চলি আছে',
    offlineSyncText: 'ইন্টাৰনেট আহিলে সকলো তথ্য স্বয়ংক্ৰিয়ভাৱে সংৰক্ষিত হ’ব।',
    syncPendingCount: 'টা তথ্য সংমিশ্ৰণৰ বাবে বাকী আছে',

    // Disclaimer
    clinicalDisclaimerTitle: 'প্ৰয়োজনীয় স্বাস্থ্য সতৰ্কবাৰ্তা',
    clinicalDisclaimer: 'স্মৃতি কেয়াৰে স্মৃতিশক্তিৰ ধাৰা লক্ষ্য ৰাখে আৰু ঔষধ খোৱাৰ সময় মনত পেলায়। ই কোনো ৰোগ নিৰ্ণয়কাৰী সঁজুলি নহয়। কোনো চিকিৎসা সম্বন্ধীয় পৰামৰ্শৰ বাবে অনুগ্ৰহ কৰি পঞ্জীয়নভুক্ত চিকিৎসকৰ সৈতে যোগাযোগ কৰক।',

    // Safety & AI Stub badge
    aiStubBadgeTitle: 'AI দৃষ্টি আৰু সহায়ক ব্যৱস্থা (ডেমো / নমুনা অৱস্থা)',
    aiStubBadgeDesc: 'হেকাথন প্ৰদৰ্শনৰ বাবে স্থানীয় নমুনা প্ৰদৰ্শিত হৈছে। প্ৰকৃত Claude Vision ব্যৱহাৰ কৰিবলৈ ছেটিংছত API Key সংযোগ কৰিব পাৰিব।',

    // Games
    gameRememberMatch: 'মনত ৰাখক আৰু মিলাওক',
    gameRememberMatchDesc: 'অসমৰ পৰম্পৰাগত সামগ্ৰী যেনে জাপি, গামোচা, শৰাই আদিৰ যোৰ মিলাই স্মৃতিশক্তি পৰীক্ষা কৰক।',
    gameFindSymbol: 'চিহ্ন বিচাৰি উলিয়াওক',
    gameFindSymbolDesc: 'অন্যান্য ছবিৰ মাজৰ পৰা সঠিক অসমীয়া চিহ্ন বিচাৰি দৃষ্টিশক্তি আৰু মনোযোগ জোখক।',
    gameFollowPath: 'ক্ৰম অনুসৰি পথ বাছক',
    gameFollowPathDesc: 'ক্ৰম অনুসাৰে সংখ্যা আৰু আখৰ সংযোগ কৰি মগজুৰ পৰিকল্পনা ক্ষমতা বৃদ্ধি কৰক।',
    gameRememberRoutine: 'দৈনন্দিন ৰুটিন মনত পেলাওক',
    gameRememberRoutineDesc: 'পুৱাৰ পৰা ৰাতিলৈকে কৰিবলগীয়া দৈনন্দিন কামসমূহ শুদ্ধ ক্ৰমত সজাওক।',
    gameSequenceRecall: 'ৰং আৰু শব্দৰ ক্ৰম',
    gameSequenceRecallDesc: 'প্ৰদৰ্শিত ৰং আৰু সংকেতৰ ক্ৰম মনত ৰাখি পুনৰাবৃত্তি কৰক।',
    gameLocalMemory: 'থলুৱা ঐতিহ্য স্মৃতি',
    gameLocalMemoryDesc: 'অসমৰ উৎসৱ, ইতিহাস আৰু ঐতিহ্য সম্পৰ্কীয় প্ৰশ্নৰ উত্তৰ দি মন সতেজ ৰাখক।',

    // Adaptive difficulty
    difficultyTier1: 'সহজ স্তৰ (Level 1)',
    difficultyTier2: 'মধ্যম স্তৰ (Level 2)',
    difficultyTier3: 'উন্নত স্তৰ (Level 3)',
    difficultyAdjustUp: 'বঢ়িয়া! আপোনাৰ দক্ষতা অনুসৰি স্তৰ উন্নত কৰা হৈছে।',
    difficultyAdjustGentle: 'আপোনাৰ সুবিধাৰ্থে খেলৰ স্তৰ সহজ কৰা হৈছে।',

    // Routine & Reminders
    routineMorning: 'ৰাতিপুৱাৰ সময়সূচী',
    routineAfternoon: 'দুপৰীয়াৰ সময়সূচী',
    routineEvening: 'গধূলিৰ সময়সূচী',
    routineNight: 'ৰাতিৰ সময়সূচী',
    waterTracker: 'দৈনিক পানী খোৱাৰ হিচাপ',
    waterGoal: 'লক্ষ্য: দৈনিক ৮ গিলাচ পানী/চাহ/নেমুপানী',
    walkTracker: 'দৈনিক খোজ কঢ়া',
    walkGoal: 'লক্ষ্য: ২০-৩০ মিনিট চোতাল বা ফুলনিত খোজ কঢ়া',

    // AI Chat
    chatGreeting: 'নমস্কাৰ! মই আপোনাৰ সহায়ক স্মৃতি সাথী। আজি মই আপোনাক কেনেদৰে সহায় কৰিব পাৰোঁ?',
    chatPrompt1: 'আজি ৰাতি ভাত খাই কি ঔষধ খাব লাগিব?',
    chatPrompt2: 'ৰঙালী বিহুৰ বিষয়ে কিছু কথা কওকচোন।',
    chatPrompt3: 'আজি মোৰ অলপ পাহৰা যেন লাগিছে, মই কি কৰিম?',
    chatPrompt4: 'মোৰ তেজ পৰীক্ষাৰ ৰিপৰ্টখন বুজাই দিয়ক।',

    // Memory Journal
    journalTitle: 'পৰিয়াল আৰু স্মৃতি এলবাম',
    journalSubtitle: 'চিনাকি মুখ, পুৰণি স্মৃতি আৰু আনন্দদায়ক মুহূৰ্তসমূহ।',
    whoIsThis: 'এইখন কাৰ ফটো বাৰু?',
    revealStory: 'পৰিয়ালৰ এই স্মৃতিৰ কাহিনী শুনক',

    // Caregiver
    caregiverOverview: 'ৰোগীৰ যত্নৰ বুজ-বাজ (বিপিন গগৈ, বয়স ৭২)',
    adherenceRateMed: 'নিয়মীয়াকৈ ঔষধ খোৱাৰ হাৰ',
    adherenceRateHydration: 'পানী খোৱাৰ লক্ষ্য',
    adherenceRateActivity: 'দৈনিক খোজ কঢ়াৰ লক্ষ্য',
    cognitiveBaseline: 'ব্যক্তিগত স্মৃতি আৰু দক্ষতাৰ ভিত্তি',
    caregiverNotesTitle: 'তত্ত্বাৱধায়কৰ টোকা',

    // Clinician
    clinicianOverview: 'চিকিৎসকৰ নিৰীক্ষণ পোৰ্টেল',
    domainRadarTitle: 'মগজুৰ বিভিন্ন ক্ষেত্ৰৰ দক্ষতা',
    adherenceHistory: '৩০ দিনৰ ঔষধ আৰু কাৰ্যকলাপৰ ইতিহাস',
    clinicalRecommendation: 'চিকিৎসা সম্বন্ধীয় পৰ্যবেক্ষণ আৰু পৰামৰ্শ',

    // ASHA
    ashaTitle: 'আশা আৰু অংগনৱাড়ী কৰ্মী পোৰ্টেল',
    ashaSubtitle: 'সামূহিক স্বাস্থ্য সেৱা • তিতাবৰ ব্লক, যোৰহাট জিলা',
    rosterTitle: 'দায়িত্বত থকা জ্যেষ্ঠ নাগৰিকসকল',
    lastVisited: 'শেষবাৰৰ বাবে চোৱাৰ তাৰিখ',
    medicineStock: 'ঔষধ বাকী থকা দিন',
  }
};

export function getTranslation(key: keyof typeof translations['en'], lang: Language): string {
  const langDict = translations[lang] || translations.en;
  return langDict[key] || translations.en[key] || key;
}
