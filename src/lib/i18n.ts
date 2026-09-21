import { Language } from '../types';

export const translations = {
  en: {
    // App header & brand
    appName: 'SmritiCare',
    appTagline: 'Cognitive Wellness & Medicine Safety',
    appSubtext: 'Supportive, offline-first care tailored for elders, families, clinicians, and community health workers.',

    // Roles
    rolePatient: 'Elder / Patient',
    roleCaregiver: 'Family Caregiver',
    roleClinician: 'Doctor / Clinician',
    roleAsha: 'ASHA / Health Worker',
    roleSwitch: 'Switch Role',

    // Auth & Account
    authTitle: 'Welcome to SmritiCare',
    authSubtitle: 'Sign in to access your personalized health & cognitive companion',
    loginTab: 'Sign In',
    registerTab: 'Create Account',
    fullName: 'Full Name',
    emailOrPhone: 'Email or Phone Number',
    password: 'Password',
    selectRole: 'Select Your Primary Role',
    dateOfBirth: 'Date of Birth',
    address: 'City / Village / Address',
    emergencyContactName: 'Emergency Contact Name',
    emergencyContactPhone: 'Emergency Contact Phone',
    preferredLanguage: 'Preferred Language',
    healthConditions: 'Known Health Conditions (e.g. Hypertension, Diabetes)',
    btnSignIn: 'Sign In',
    btnRegister: 'Complete Registration',
    btnSignOut: 'Sign Out',
    alreadyHaveAccount: 'Already have an account? Sign In',
    needAccount: "Don't have an account? Create one now",
    accountSetupStep1: 'Step 1: Account Info',
    accountSetupStep2: 'Step 2: Personal Profile',
    accountSetupStep3: 'Step 3: Health & Routine Setup',
    btnNext: 'Next Step',
    btnBack: 'Previous Step',

    // Navigation
    navHome: 'Home',
    navRoutine: 'Daily Routine',
    navGames: 'Brain Games',
    navSafety: 'Medicine & Lab AI',
    navJournal: 'Memory Album',
    navChat: 'Smriti Sathi (AI)',
    navDashboard: 'Dashboard',
    navAppointments: 'Doctor Consultations',
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
    actionSkipDose: 'Skip Dose',
    actionSnooze: 'Remind Later',
    actionAdd: 'Add New',
    actionUpload: 'Upload Photo / File',
    actionScan: 'Scan Packaging',
    actionExplain: 'Explain in Simple Words',
    actionDownloadPdf: 'Download Clinical Report (PDF)',
    actionSyncNow: 'Sync Pending Changes',
    actionEmergency: 'Emergency SOS',
    actionBookAppointment: 'Book Appointment',
    actionConfirm: 'Confirm & Save',

    // Status badges
    statusStable: 'Performance Trend: Stable',
    statusWatch: 'Performance Trend: Watch',
    statusReview: 'Performance Trend: Review Signal',
    statusTaken: 'Taken',
    statusScheduled: 'Scheduled',
    statusSkipped: 'Skipped',
    statusMissed: 'Missed',
    statusPending: 'Pending',
    statusConfirmed: 'Confirmed',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',
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

    // API Key & Live Verification
    apiKeySectionTitle: 'AI Gateway & Live Verification',
    apiKeySectionDesc: 'Configure and test the AI engine for real-time natural language reasoning, clinical summaries, and OCR validation.',
    apiKeyVerifying: 'Verifying...',
    apiKeyVerifyBtn: 'Verify Connection',
    apiKeyStatusValid: 'AI Gateway Verified & Active',
    apiKeyValidDetails: 'Secure connection established. All neural features are functioning with full capabilities.',
    apiKeyStatusInvalid: 'Verification Unsuccessful',
    apiKeyInvalidDetails: 'Could not connect to AI services. Please check credentials or network connectivity.',
    apiKeyStatusUntested: 'Standard Intelligent Engine Active',

    // Offline status
    onlineStatus: 'Online (Connected)',
    offlineStatus: 'Offline Mode Active',
    offlineSyncText: 'Changes are safely queued and will sync automatically when connectivity returns.',
    syncPendingCount: 'items queued for sync',

    // Disclaimer
    clinicalDisclaimerTitle: 'Important Health Notice',
    clinicalDisclaimer: 'SmritiCare tracks performance trends and assists with daily medication adherence. It is NOT a diagnostic tool and does NOT diagnose dementia, Alzheimer\'s, or medical conditions. Consult registered medical practitioners for clinical diagnosis.',

    // Games
    gameRememberMatch: 'Remember & Match',
    gameRememberMatchDesc: 'Find matching pairs of cultural items to train visual memory.',
    gameFindSymbol: 'Find the Symbol',
    gameFindSymbolDesc: 'Spot the target emblem among distractors to sharpen visual attention.',
    gameFollowPath: 'Follow the Path',
    gameFollowPathDesc: 'Connect numbers and letters in sequence to practice visual-spatial planning.',
    gameRememberRoutine: 'Remember the Routine',
    gameRememberRoutineDesc: 'Arrange daily healthy living steps in their correct sequence.',
    gameSequenceRecall: 'Sequence Recall',
    gameSequenceRecallDesc: 'Observe the flashing color patterns and repeat them accurately.',
    gameLocalMemory: 'Heritage Recall',
    gameLocalMemoryDesc: 'Recall famous cultural landmarks, festivals, and traditions.',

    // Adaptive difficulty
    difficultyTier1: 'Gentle Tier (Level 1)',
    difficultyTier2: 'Standard Tier (Level 2)',
    difficultyTier3: 'Challenge Tier (Level 3)',
    difficultyAdjustUp: 'Great focus! Difficulty tier adjusted up.',
    difficultyAdjustGentle: 'Adjusted to gentle tier for comfort.',

    // Routine & Reminders
    routineMorning: 'Morning Schedule',
    routineAfternoon: 'Afternoon Schedule',
    routineEvening: 'Evening Schedule',
    routineNight: 'Night Schedule',
    waterTracker: 'Daily Hydration Tracker',
    waterGoal: 'Goal: 8 glasses daily (water, warm herbal tea)',
    walkTracker: 'Daily Gentle Walking',
    walkGoal: 'Goal: 20-30 mins gentle stroll in courtyard or garden',
    addMedicineTitle: 'Add New Medication',
    medName: 'Medicine Name',
    medDose: 'Dosage / Strength',
    medTime: 'Time of Dose',
    medFreq: 'Frequency',
    medNotes: 'Special Instructions',

    // AI Chat
    chatGreeting: 'Namaste! I am Smriti Sathi, your caring wellness assistant. How may I assist you today?',
    chatPrompt1: 'What medicines do I have scheduled for today?',
    chatPrompt2: 'How was my cognitive game performance this week?',
    chatPrompt3: 'Explain my latest lab test report in simple words.',
    chatPrompt4: 'Give me gentle tips for sleeping peacefully tonight.',

    // Memory Journal
    journalTitle: 'Family Album & Memory Journal',
    journalSubtitle: 'Familiar faces, nostalgic memories, and joyful family moments.',
    whoIsThis: 'Who is this in the photo?',
    revealStory: 'Listen to Story & Voice Note',
    addMemoryTitle: 'Add New Family Memory',

    // Caregiver
    caregiverOverview: 'Caregiver Patient Overview',
    adherenceRateMed: 'Medication Adherence Rate',
    adherenceRateHydration: 'Hydration Target',
    adherenceRateActivity: 'Daily Physical Routine',
    cognitiveBaseline: 'Cognitive Domain Radar',
    caregiverNotesTitle: 'Caregiver Log & Observations',
    linkPatientTitle: 'Link Patient Account',
    linkPatientDesc: 'Enter the Patient ID or registered phone number to establish authorized caregiver monitoring.',

    // Clinician
    clinicianOverview: 'Clinician Cognitive Radar & Longitudinal Records',
    domainRadarTitle: 'Cognitive Domain Performance History',
    adherenceHistory: '30-Day Medication Log & Compliance',
    clinicalRecommendation: 'Doctor Observations & Clinical Notes',
    patientList: 'Patient Roster',

    // Doctor Appointments
    appointmentsTitle: 'Doctor Appointments & Consultations',
    findDoctor: 'Find Doctor / Specialist',
    selectSpecialty: 'Filter by Specialty',
    availableSlots: 'Available Time Slots',
    bookConsultation: 'Confirm Booking',
    myUpcomingAppointments: 'Upcoming Consultations',
    appointmentStatus: 'Status',

    // ASHA
    ashaTitle: 'ASHA & Community Health Portal',
    ashaSubtitle: 'Doorstep Screening & Elderly Wellness Records',
    rosterTitle: 'Assigned Village Patients',
    lastVisited: 'Last Visited',
    medicineStock: 'Medicine Stock Remaining',
    recordVisitTitle: 'Record Home Visit & Screening',
    vitalSigns: 'Blood Pressure & Vitals',
    screeningNotes: 'Screening Notes & Observations',
    addVillagePatient: 'Register Village Elder',
  },
  hi: {
    // App header & brand
    appName: 'स्मृति केयर (SmritiCare)',
    appTagline: 'संज्ञानात्मक स्वास्थ्य और सुरक्षित दवा प्रबंधन',
    appSubtext: 'बुजुर्गों, परिवारों, डॉक्टरों और आशा स्वास्थ्य कार्यकर्ताओं के लिए सरल और ऑफलाइन-सक्षम सेवा।',

    // Roles
    rolePatient: 'वरिष्ठ नागरिक / मरीज',
    roleCaregiver: 'पारिवारिक देखभालकर्ता',
    roleClinician: 'चिकित्सक / डॉक्टर',
    roleAsha: 'आशा / स्वास्थ्य कार्यकर्ता',
    roleSwitch: 'भूमिका बदलें',

    // Auth & Account
    authTitle: 'स्मृति केयर में आपका स्वागत है',
    authSubtitle: 'अपनी व्यक्तिगत स्वास्थ्य और संज्ञानात्मक सहायता के लिए साइन इन करें',
    loginTab: 'साइन इन',
    registerTab: 'नया खाता बनाएं',
    fullName: 'पूरा नाम',
    emailOrPhone: 'ईमेल या मोबाइल नंबर',
    password: 'पासवर्ड',
    selectRole: 'अपनी प्राथमिक भूमिका चुनें',
    dateOfBirth: 'जन्म तिथि',
    address: 'शहर / गाँव / पता',
    emergencyContactName: 'आपातकालीन संपर्क का नाम',
    emergencyContactPhone: 'आपातकालीन संपर्क नंबर',
    preferredLanguage: 'पसंदीदा भाषा',
    healthConditions: 'स्वास्थ्य स्थिति (जैसे उच्च रक्तचाप, मधुमेह)',
    btnSignIn: 'साइन इन करें',
    btnRegister: 'पंजीकरण पूर्ण करें',
    btnSignOut: 'लॉग आउट करें',
    alreadyHaveAccount: 'क्या आपके पास पहले से खाता है? साइन इन करें',
    needAccount: 'खाता नहीं है? नया बनाएं',
    accountSetupStep1: 'चरण 1: खाता जानकारी',
    accountSetupStep2: 'चरण 2: व्यक्तिगत प्रोफ़ाइल',
    accountSetupStep3: 'चरण 3: स्वास्थ्य व दवा सेटअप',
    btnNext: 'अगला कदम',
    btnBack: 'पिछला कदम',

    // Navigation
    navHome: 'मुख्य पृष्ठ',
    navRoutine: 'दैनिक दिनचर्या',
    navGames: 'दिमागी खेल',
    navSafety: 'दवा व लैब AI',
    navJournal: 'स्मृति एल्बम',
    navChat: 'स्मृति साथी (AI)',
    navDashboard: 'डैशबोर्ड',
    navAppointments: 'डॉक्टर परामर्श',
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
    actionSkipDose: 'छोड़ दी',
    actionSnooze: 'बाद में याद दिलाएं',
    actionAdd: 'नया जोड़ें',
    actionUpload: 'फोटो या फाइल अपलोड करें',
    actionScan: 'दवा का पैकेट स्कैन करें',
    actionExplain: 'सरल शब्दों में समझाएं',
    actionDownloadPdf: 'चिकित्सा रिपोर्ट डाउनलोड करें (PDF)',
    actionSyncNow: 'अभी सिंक करें',
    actionEmergency: 'आपातकालीन सहायता (SOS)',
    actionBookAppointment: 'अपॉइंटमेंट बुक करें',
    actionConfirm: 'पुष्टि करें और सहेजें',

    // Status badges
    statusStable: 'प्रदर्शन रुझान: स्थिर (Stable)',
    statusWatch: 'प्रदर्शन रुझान: निगरानी (Watch)',
    statusReview: 'प्रदर्शन रुझान: समीक्षा संकेत (Review)',
    statusTaken: 'ली गई',
    statusScheduled: 'निर्धारित',
    statusSkipped: 'छोड़ी गई',
    statusMissed: 'छूट गई',
    statusPending: 'बाकी',
    statusConfirmed: 'पुष्टि हो चुकी',
    statusCompleted: 'पूर्ण',
    statusCancelled: 'रद्द',
    statusNormal: 'सामान्य सीमा',
    statusElevated: 'हल्का बढ़ा हुआ',
    statusLow: 'सामान्य से कम',

    // Accessibility
    a11yTitle: 'पहुंच और दृश्यता (Accessibility)',
    a11yTextSize: 'अक्षर का आकार',
    a11yNormal: 'सामान्य (16px)',
    a11yLarge: 'बड़ा (19px)',
    a11yXLarge: 'बहुत बड़ा (22px)',
    a11yContrast: 'उच्च कंट्रास्ट मोड',
    a11yReducedMotion: 'एनीमेशन कम करें',
    a11yVoice: 'ध्वनि सहायता और बोलकर सुनाएं',

    // API Key & Live Verification
    apiKeySectionTitle: 'AI गेटवे एवं लाइव सत्यापन',
    apiKeySectionDesc: 'वास्तविक समय में प्राकृतिक भाषा समझ, नैदानिक सारांश और OCR सत्यापन के लिए AI इंजन को कॉन्फ़िगर और परीक्षण करें।',
    apiKeyVerifying: 'सत्यापन हो रहा है...',
    apiKeyVerifyBtn: 'कनेक्शन सत्यापित करें',
    apiKeyStatusValid: 'AI गेटवे सत्यापित और सक्रिय है',
    apiKeyValidDetails: 'सुरक्षित कनेक्शन स्थापित हो चुका है। सभी उन्नत AI सुविधाएं पूर्ण रूप से सक्रिय हैं।',
    apiKeyStatusInvalid: 'सत्यापन असफल रहा',
    apiKeyInvalidDetails: 'AI सेवाओं से कनेक्ट नहीं हो सका। कृपया अपनी क्रेडेंशियल्स या इंटरनेट जांचें।',
    apiKeyStatusUntested: 'मानक इंटेलिजेंट इंजन सक्रिय है',

    // Offline status
    onlineStatus: 'ऑनलाइन (इंटरनेट सक्रिय)',
    offlineStatus: 'ऑफलाइन मोड सक्रिय',
    offlineSyncText: 'बदलाव सुरक्षित हैं और इंटरनेट आते ही अपने आप सिंक हो जाएंगे।',
    syncPendingCount: 'आइटम सिंक के लिए कतार में हैं',

    // Disclaimer
    clinicalDisclaimerTitle: 'महत्वपूर्ण स्वास्थ्य सूचना',
    clinicalDisclaimer: 'स्मृति केयर मानसिक स्वास्थ्य रुझानों पर नज़र रखता है और दैनिक दवा लेने में मदद करता है। यह कोई नैदानिक उपकरण नहीं है और डिमेंशिया या अल्जाइमर का निदान नहीं करता है। किसी भी चिकित्सीय सलाह के लिए पंजीकृत चिकित्सक से परामर्श लें।',

    // Games
    gameRememberMatch: 'याद रखें और मिलाएं',
    gameRememberMatchDesc: 'सांस्कृतिक प्रतीकों के जोड़े मिलाकर स्मृति क्षमता का अभ्यास करें।',
    gameFindSymbol: 'प्रतीक खोजें',
    gameFindSymbolDesc: 'अन्य चित्रों के बीच से सही प्रतीक ढूंढकर दृश्य एकाग्रता बढ़ाएं।',
    gameFollowPath: 'क्रम अनुसार पथ चुनें',
    gameFollowPathDesc: 'संख्याओं और अक्षरों को सही क्रम में जोड़कर मानसिक योजना क्षमता बढ़ाएं।',
    gameRememberRoutine: 'दैनिक दिनचर्या याद रखें',
    gameRememberRoutineDesc: 'सुबह से रात तक की दैनिक स्वस्थ गतिविधियों को सही क्रम में व्यवस्थित करें।',
    gameSequenceRecall: 'रंग और संकेत का क्रम',
    gameSequenceRecallDesc: 'रोशनी और ध्वनि के पैटर्न को याद रखकर उसी क्रम में दोहराएं।',
    gameLocalMemory: 'धरोहर स्मृति',
    gameLocalMemoryDesc: 'संस्कृति, त्योहारों और ऐतिहासिक स्थलों से जुड़े सरल प्रश्नों के उत्तर दें।',

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
    addMedicineTitle: 'नई दवा जोड़ें',
    medName: 'दवा का नाम',
    medDose: 'खुराक / शक्ति',
    medTime: 'लेने का समय',
    medFreq: 'आवृत्ति (Frequency)',
    medNotes: 'विशेष निर्देश',

    // AI Chat
    chatGreeting: 'नमस्ते! मैं स्मृति साथी हूँ, आपकी देखभाल सहायक। आज मैं आपकी क्या मदद कर सकती हूँ?',
    chatPrompt1: 'आज मुझे कौन सी दवाएं लेनी हैं?',
    chatPrompt2: 'इस सप्ताह मेरे दिमागी खेल का प्रदर्शन कैसा रहा?',
    chatPrompt3: 'मेरी नवीनतम लैब रिपोर्ट को सरल शब्दों में समझाइए।',
    chatPrompt4: 'आज रात अच्छी नींद के लिए मुझे कुछ सुझाव दीजिए।',

    // Memory Journal
    journalTitle: 'परिवार और स्मृति एल्बम',
    journalSubtitle: 'पहचाने चेहरे, पुरानी यादें और सुखद पारिवारिक क्षण।',
    whoIsThis: 'इस फोटो में कौन है?',
    revealStory: 'इस स्मृति की कहानी सुनें',
    addMemoryTitle: 'नई पारिवारिक स्मृति जोड़ें',

    // Caregiver
    caregiverOverview: 'रोगी देखभाल अवलोकन',
    adherenceRateMed: 'नियमित दवा लेने की दर',
    adherenceRateHydration: 'पानी पीने का लक्ष्य',
    adherenceRateActivity: 'दैनिक शारीरिक गतिविधि',
    cognitiveBaseline: 'संज्ञानात्मक रुझान चार्ट',
    caregiverNotesTitle: 'देखभालकर्ता की टिप्पणियां',
    linkPatientTitle: 'मरीज का खाता लिंक करें',
    linkPatientDesc: 'मरीज का आईडी या पंजीकृत फोन नंबर दर्ज करें।',

    // Clinician
    clinicianOverview: 'चिकित्सक निगरानी पोर्टल और संज्ञानात्मक रडार',
    domainRadarTitle: 'मस्तिष्क के विभिन्न क्षेत्रों का प्रदर्शन',
    adherenceHistory: '30 दिनों का दवा इतिहास और अनुपालन',
    clinicalRecommendation: 'चिकित्सकीय अवलोकन और सलाह',
    patientList: 'मरीजों की सूची',

    // Doctor Appointments
    appointmentsTitle: 'डॉक्टर अपॉइंटमेंट और परामर्श',
    findDoctor: 'डॉक्टर / विशेषज्ञ खोजें',
    selectSpecialty: 'विशेषज्ञता अनुसार चुनें',
    availableSlots: 'उपलब्ध समय',
    bookConsultation: 'बुकिंग की पुष्टि करें',
    myUpcomingAppointments: 'आगामी परामर्श',
    appointmentStatus: 'स्थिति',

    // ASHA
    ashaTitle: 'आशा और स्वास्थ्य कार्यकर्ता पोर्टल',
    ashaSubtitle: 'सामुदायिक स्वास्थ्य सेवा और बुजुर्ग देखभाल',
    rosterTitle: 'सौंपे गए वरिष्ठ नागरिक',
    lastVisited: 'पिछली मुलाकात',
    medicineStock: 'दवा का शेष स्टॉक',
    recordVisitTitle: 'घर का दौरा और स्वास्थ्य जांच दर्ज करें',
    vitalSigns: 'रक्तचाप और वाइटल्स',
    screeningNotes: 'जांच नोट्स और टिप्पणियां',
    addVillagePatient: 'गाँव के बुजुर्ग को पंजीकृत करें',
  },
};

export type TranslationKey = keyof typeof translations['en'];

export function getTranslation(key: TranslationKey, lang?: Language): string;
export function getTranslation(lang: Language, key: TranslationKey): string;
export function getTranslation(arg1: TranslationKey | Language, arg2?: TranslationKey | Language): string {
  let lang: Language = 'en';
  let key: TranslationKey;

  if (arg1 === 'en' || arg1 === 'hi') {
    lang = arg1;
    key = arg2 as TranslationKey;
  } else {
    key = arg1 as TranslationKey;
    lang = (arg2 === 'hi' || arg2 === 'en') ? arg2 : 'en';
  }

  const selectedLang = lang === 'hi' ? 'hi' : 'en';
  return (translations[selectedLang] as any)?.[key] || (translations['en'] as any)?.[key] || (key as string) || '';
}

export const t = getTranslation;
