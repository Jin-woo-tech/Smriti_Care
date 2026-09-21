import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Role,
  Language,
  TextScale,
  AppSettings,
  Reminder,
  JournalEntry,
  PhotoMemory,
  GameScoreRecord,
  CognitiveDomainTrend,
  AshaPatientRecord,
  SyncQueueItem,
  PatientProfile,
  User,
} from '../types';
import {
  STORAGE_KEYS,
  getStoredData,
  setStoredData,
  initialSettings,
  initialReminders,
  initialPhotoMemories,
  initialJournal,
  initialCognitiveTrends,
  initialGameScores,
  initialAshaPatients,
  initialPatientProfiles,
  addToSyncQueue,
  clearSyncQueue,
} from '../lib/storage';
import { speakText, stopSpeech } from '../lib/speech';
import { api } from '../lib/api';

export interface AppContextType {
  settings: AppSettings;
  currentRole: Role;
  updateSettings: (partial: Partial<AppSettings>) => void;
  setRole: (role: Role) => void;
  setLanguage: (lang: Language) => void;
  setTextScale: (scale: TextScale) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleSimulatedOffline: () => void;

  // Authentication & Current User
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, pass: string) => Promise<boolean>;
  register: (payload: any) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => Promise<void>;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;

  // Patient Profiles
  patientProfiles: PatientProfile[];
  activePatientId: string;
  activePatient: PatientProfile;
  setActivePatientId: (id: string) => void;
  addPatientProfile: (profile: Omit<PatientProfile, 'id'>) => void;
  isProfileModalOpen: boolean;
  setProfileModalOpen: (open: boolean) => void;

  // Reminders
  reminders: Reminder[];
  toggleReminderTaken: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  refreshMedications: () => Promise<void>;

  // Journal & Photos
  journal: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  photos: PhotoMemory[];
  addPhotoMemory: (photo: Omit<PhotoMemory, 'id'>) => void;

  // Cognitive Games
  gameScores: GameScoreRecord[];
  saveGameScore: (score: Omit<GameScoreRecord, 'id'>) => void;
  cognitiveTrends: CognitiveDomainTrend[];

  // ASHA
  ashaPatients: AshaPatientRecord[];
  updateAshaPatient: (id: string, updates: Partial<AshaPatientRecord>) => void;
  addAshaPatient: (patient: Omit<AshaPatientRecord, 'id'>) => void;

  // Water / Hydration
  waterGlasses: number;
  addWaterGlasses: () => void;
  addWaterGlass: () => void;
  resetWaterGlasses: () => void;

  // Sync Queue
  syncQueue: SyncQueueItem[];
  triggerSync: () => Promise<void>;
  isSyncing: boolean;

  // Voice Narrator & Speech
  narrate: (text: string) => void;
  stopVoice: () => void;
  isSpeaking: boolean;

  // Modals
  isSosOpen: boolean;
  setSosOpen: (open: boolean) => void;
  isA11yOpen: boolean;
  setA11yOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() =>
    getStoredData<AppSettings>(STORAGE_KEYS.SETTINGS, initialSettings)
  );

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smriticare_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default initial user
    return {
      id: 'user_patient_demo',
      username: 'bipin.elder',
      email: 'bipin.gogoi@assamcare.in',
      role: 'patient',
      fullName: 'Bipin Gogoi',
      preferredLanguage: 'en',
      createdAt: '2026-01-10T00:00:00Z',
      profile: {
        userId: 'user_patient_demo',
        age: 74,
        gender: 'M',
        location: 'Guwahati, Assam',
        condition: 'Mild Cognitive Impairment (Early Stage)',
        avatarInitials: 'BG',
        avatarColor: '#8b5cf6',
      },
    };
  });

  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const [patientProfiles, setPatientProfiles] = useState<PatientProfile[]>(() =>
    getStoredData<PatientProfile[]>(STORAGE_KEYS.PATIENT_PROFILES, initialPatientProfiles)
  );

  const [activePatientId, setActivePatientIdState] = useState<string>(() =>
    getStoredData<string>(STORAGE_KEYS.ACTIVE_PATIENT_ID, 'pat-ananya-20')
  );

  const [reminders, setReminders] = useState<Reminder[]>(() =>
    getStoredData<Reminder[]>(STORAGE_KEYS.REMINDERS, initialReminders)
  );

  const [photos, setPhotos] = useState<PhotoMemory[]>(() =>
    getStoredData<PhotoMemory[]>(STORAGE_KEYS.PHOTOS, initialPhotoMemories)
  );

  const [journal, setJournal] = useState<JournalEntry[]>(() =>
    getStoredData<JournalEntry[]>(STORAGE_KEYS.JOURNAL, initialJournal)
  );

  const [gameScores, setGameScores] = useState<GameScoreRecord[]>(() =>
    getStoredData<GameScoreRecord[]>(STORAGE_KEYS.GAME_SCORES, initialGameScores)
  );

  const [cognitiveTrends, setCognitiveTrends] = useState<CognitiveDomainTrend[]>(() =>
    getStoredData<CognitiveDomainTrend[]>(STORAGE_KEYS.COGNITIVE_TRENDS, initialCognitiveTrends)
  );

  const [ashaPatients, setAshaPatients] = useState<AshaPatientRecord[]>(() =>
    getStoredData<AshaPatientRecord[]>(STORAGE_KEYS.ASHA_PATIENTS, initialAshaPatients)
  );

  const [waterGlasses, setWaterGlasses] = useState<number>(() =>
    getStoredData<number>(STORAGE_KEYS.WATER_INTAKE, 5)
  );

  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() =>
    getStoredData<SyncQueueItem[]>(STORAGE_KEYS.SYNC_QUEUE, [])
  );

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isSosOpen, setSosOpen] = useState<boolean>(false);
  const [isA11yOpen, setA11yOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState<boolean>(false);

  // Active patient object lookup
  const activePatient =
    patientProfiles.find(p => p.id === activePatientId) || patientProfiles[0] || initialPatientProfiles[0];

  // Try to load initial profile / session from server on startup
  useEffect(() => {
    async function loadServerUser() {
      try {
        const token = api.getToken();
        if (token) {
          const res = await api.auth.getMe();
          if (res && res.user) {
            setCurrentUser(res.user);
            localStorage.setItem('smriticare_user_session', JSON.stringify(res.user));
            if (res.user.role) {
              setSettings(s => ({ ...s, role: res.user.role }));
            }
          }
        }
      } catch (e) {
        console.log('Using local user session:', e);
      }
    }
    loadServerUser();
  }, []);

  // Fetch live medications from server
  const refreshMedications = async () => {
    try {
      const todaySchedule = await api.medications.getToday();
      if (Array.isArray(todaySchedule) && todaySchedule.length > 0) {
        const mappedReminders: Reminder[] = todaySchedule.map((item: any) => ({
          id: item.medicationId || item.id,
          type: 'medicine',
          title: item.medicationName || 'Prescribed Medicine',
          dose: item.dosage || '1 Tablet',
          time: item.scheduledTime || '08:00 AM',
          frequency: 'Daily',
          taken: item.status === 'taken',
          takenAt: item.actualTime || undefined,
          notes: item.instructions || undefined,
          status: item.status,
        }));
        setReminders(mappedReminders);
      }
    } catch (e) {
      console.log('Medications loaded from offline store');
    }
  };

  useEffect(() => {
    refreshMedications();
  }, [currentUser?.id]);

  // Sync state to LocalStorage and root HTML attributes
  useEffect(() => {
    setStoredData(STORAGE_KEYS.SETTINGS, settings);

    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    document.documentElement.classList.remove('text-scale-normal', 'text-scale-large', 'text-scale-xl');
    document.documentElement.classList.add(`text-scale-${settings.textScale}`);

    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [settings]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.PATIENT_PROFILES, patientProfiles);
  }, [patientProfiles]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.ACTIVE_PATIENT_ID, activePatientId);
  }, [activePatientId]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.REMINDERS, reminders);
  }, [reminders]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.PHOTOS, photos);
  }, [photos]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.JOURNAL, journal);
  }, [journal]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.GAME_SCORES, gameScores);
  }, [gameScores]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.COGNITIVE_TRENDS, cognitiveTrends);
  }, [cognitiveTrends]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.ASHA_PATIENTS, ashaPatients);
  }, [ashaPatients]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.WATER_INTAKE, waterGlasses);
  }, [waterGlasses]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const setRole = (role: Role) => updateSettings({ role });
  const setLanguage = (language: Language) => updateSettings({ language });
  const setTextScale = (textScale: TextScale) => updateSettings({ textScale });
  const toggleHighContrast = () => updateSettings({ highContrast: !settings.highContrast });
  const toggleReducedMotion = () => updateSettings({ reducedMotion: !settings.reducedMotion });
  const toggleSimulatedOffline = () => updateSettings({ isSimulatedOffline: !settings.isSimulatedOffline });

  const login = async (usernameOrEmail: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.auth.login(usernameOrEmail, pass);
      if (res && res.token && res.user) {
        api.setToken(res.token);
        setCurrentUser(res.user);
        localStorage.setItem('smriticare_user_session', JSON.stringify(res.user));
        setSettings(s => ({
          ...s,
          role: res.user.role,
          language: res.user.preferredLanguage || s.language,
        }));
        await refreshMedications();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const register = async (payload: any): Promise<boolean> => {
    try {
      const res = await api.auth.register(payload);
      if (res && res.token && res.user) {
        api.setToken(res.token);
        setCurrentUser(res.user);
        localStorage.setItem('smriticare_user_session', JSON.stringify(res.user));
        setSettings(s => ({
          ...s,
          role: res.user.role,
          language: res.user.preferredLanguage || s.language,
        }));
        await refreshMedications();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Registration error:', err);
      throw err;
    }
  };

  const logout = () => {
    api.setToken(null);
    localStorage.removeItem('smriticare_user_session');
    // Set fallback demo user
    setCurrentUser(null);
    setSettings(s => ({ ...s, role: 'patient' }));
  };

  const switchRole = async (role: Role) => {
    try {
      const res = await api.auth.demoSwitch(role);
      if (res && res.token && res.user) {
        api.setToken(res.token);
        setCurrentUser(res.user);
        localStorage.setItem('smriticare_user_session', JSON.stringify(res.user));
        setSettings(s => ({ ...s, role }));
        await refreshMedications();
      } else {
        setSettings(s => ({ ...s, role }));
      }
    } catch (e) {
      setSettings(s => ({ ...s, role }));
    }
  };

  const toggleReminderTaken = (id: string) => {
    const rem = reminders.find(r => r.id === id);
    if (!rem) return;
    const nextTaken = !rem.taken;
    const nextStatus = nextTaken ? 'taken' : 'skipped';

    setReminders(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            taken: nextTaken,
            status: nextStatus,
            takenAt: nextTaken ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          };
        }
        return item;
      })
    );

    // Call live API or queue offline
    api.medications.logDose({
      medicationId: id,
      scheduledTime: rem.time,
      status: nextStatus,
    }).catch(e => {
      console.log('Dose log offline fallback:', e);
    });

    if (settings.isSimulatedOffline) {
      addToSyncQueue('update_reminder', { id, taken: nextTaken });
      setSyncQueue(getStoredData(STORAGE_KEYS.SYNC_QUEUE, []));
    }
  };

  const addReminder = (newRem: Omit<Reminder, 'id'>) => {
    const item: Reminder = { ...newRem, id: `rem-${Date.now()}` };
    setReminders(prev => [item, ...prev]);

    // Persist to server
    api.medications.add({
      name: newRem.title,
      dosage: newRem.dose || '1 Tablet',
      times: [newRem.time || '08:00 AM'],
      instructions: newRem.notes || '',
    }).catch(e => console.log('Medication add offline fallback:', e));

    if (settings.isSimulatedOffline) {
      addToSyncQueue('create_reminder', item);
      setSyncQueue(getStoredData(STORAGE_KEYS.SYNC_QUEUE, []));
    }
  };

  const addJournalEntry = (newEntry: Omit<JournalEntry, 'id'>) => {
    const entry: JournalEntry = { ...newEntry, id: `j-${Date.now()}` };
    setJournal(prev => [entry, ...prev]);
    if (settings.isSimulatedOffline) {
      addToSyncQueue('add_journal', entry);
      setSyncQueue(getStoredData(STORAGE_KEYS.SYNC_QUEUE, []));
    }
  };

  const addPhotoMemory = (newPhoto: Omit<PhotoMemory, 'id'>) => {
    const photo: PhotoMemory = { ...newPhoto, id: `photo-${Date.now()}` };
    setPhotos(prev => [photo, ...prev]);

    // Persist to server
    api.memories.add({
      title: newPhoto.title,
      relationship: newPhoto.relation,
      tag: 'family',
      mediaUrl: newPhoto.imageUrl,
      memoryDate: newPhoto.createdAt || new Date().toISOString(),
    }).catch(e => console.log('Memory add offline fallback:', e));
  };

  const saveGameScore = (scoreData: Omit<GameScoreRecord, 'id'>) => {
    const record: GameScoreRecord = { ...scoreData, id: `gs-${Date.now()}` };
    setGameScores(prev => [record, ...prev]);

    // Recalculate and update the corresponding domain trend
    setCognitiveTrends(prev =>
      prev.map(trend => {
        if (
          (scoreData.gameId === 'remember-match' && trend.domain.includes('Spatial')) ||
          (scoreData.gameId === 'find-symbol' && trend.domain.includes('Attention')) ||
          (scoreData.gameId === 'follow-path' && trend.domain.includes('Executive')) ||
          (scoreData.gameId === 'remember-routine' && trend.domain.includes('Routine')) ||
          (scoreData.gameId === 'sequence-recall' && trend.domain.includes('Working')) ||
          (scoreData.gameId === 'local-memory' && trend.domain.includes('Cultural'))
        ) {
          const newScore = Math.round((trend.score * 3 + scoreData.accuracy) / 4);
          const deviation = newScore - trend.baselineScore;
          return {
            ...trend,
            score: newScore,
            status: deviation >= -4 ? 'stable' : deviation >= -10 ? 'watch' : 'review',
            trendDirection: deviation > 2 ? 'improving' : deviation < -2 ? 'slight-decline' : 'stable',
            lastTestedDate: 'Today',
          };
        }
        return trend;
      })
    );

    // Persist to server
    let domainName = 'Working Memory';
    if (scoreData.gameId === 'remember-match') domainName = 'Visual Memory';
    else if (scoreData.gameId === 'find-symbol') domainName = 'Sustained Attention';
    else if (scoreData.gameId === 'follow-path') domainName = 'Visual-Spatial Planning';
    else if (scoreData.gameId === 'remember-routine') domainName = 'Executive Function';

    api.games.submitSession({
      gameType: scoreData.gameId,
      domain: domainName,
      score: scoreData.score,
      maxScore: scoreData.maxScore || 100,
      levelReached: scoreData.difficultyTier || 1,
      durationSeconds: scoreData.durationSeconds || 60,
      reactionTimeMs: scoreData.reactionTimeMs || 450,
      errorsCount: 0,
    }).catch(e => console.log('Game score offline fallback:', e));

    if (settings.isSimulatedOffline) {
      addToSyncQueue('save_game_score', record);
      setSyncQueue(getStoredData(STORAGE_KEYS.SYNC_QUEUE, []));
    }
  };

  const updateAshaPatient = (id: string, updates: Partial<AshaPatientRecord>) => {
    setAshaPatients(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
    if (settings.isSimulatedOffline) {
      addToSyncQueue('asha_visit_log', { id, updates });
      setSyncQueue(getStoredData(STORAGE_KEYS.SYNC_QUEUE, []));
    }
  };

  const addAshaPatient = (patient: Omit<AshaPatientRecord, 'id'>) => {
    const newRecord: AshaPatientRecord = {
      ...patient,
      id: `p-${Date.now()}`,
    };
    setAshaPatients(prev => [newRecord, ...prev]);

    api.asha.registerPatient({
      fullName: patient.name,
      age: patient.age,
      village: patient.village,
      phone: patient.phone,
      primaryCaregiverName: patient.caregiverName,
      cognitiveRiskCategory: patient.cognitiveStatus,
    }).catch(e => console.log('ASHA patient register offline fallback:', e));
  };

  const addPatientProfile = (newProfile: Omit<PatientProfile, 'id'>) => {
    const id = `pat-${newProfile.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
    const initials = newProfile.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'PT';

    const profile: PatientProfile = {
      ...newProfile,
      id,
      avatarInitials: newProfile.avatarInitials || initials,
      avatarColor: newProfile.avatarColor || 'from-purple-600 to-indigo-500',
    };

    setPatientProfiles(prev => [profile, ...prev]);
    setActivePatientIdState(id);
  };

  const setActivePatientId = (id: string) => {
    setActivePatientIdState(id);
    updateSettings({ activePatientId: id });
  };

  const addWaterGlass = () => {
    setWaterGlasses(prev => Math.min(prev + 1, 12));
  };

  const addWaterGlasses = () => {
    setWaterGlasses(prev => Math.min(prev + 1, 12));
  };

  const resetWaterGlasses = () => {
    setWaterGlasses(0);
  };

  const triggerSync = async () => {
    if (syncQueue.length === 0) return;
    setIsSyncing(true);
    await api.processOfflineQueue();
    clearSyncQueue();
    setSyncQueue([]);
    setIsSyncing(false);
  };

  const narrate = (text: string) => {
    if (!settings.voiceAssistanceEnabled) return;
    setIsSpeaking(true);
    speakText(text, settings.language);
    setTimeout(() => setIsSpeaking(false), 4000);
  };

  const stopVoice = () => {
    setIsSpeaking(false);
    stopSpeech();
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        currentRole: settings.role,
        updateSettings,
        setRole,
        setLanguage,
        setTextScale,
        toggleHighContrast,
        toggleReducedMotion,
        toggleSimulatedOffline,
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        switchRole,
        isAuthModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        patientProfiles,
        activePatientId,
        activePatient,
        setActivePatientId,
        addPatientProfile,
        isProfileModalOpen,
        setProfileModalOpen,
        reminders,
        toggleReminderTaken,
        addReminder,
        refreshMedications,
        journal,
        addJournalEntry,
        photos,
        addPhotoMemory,
        gameScores,
        saveGameScore,
        cognitiveTrends,
        ashaPatients,
        updateAshaPatient,
        addAshaPatient,
        waterGlasses,
        addWaterGlasses,
        addWaterGlass,
        resetWaterGlasses,
        syncQueue,
        triggerSync,
        isSyncing,
        narrate,
        stopVoice,
        isSpeaking,
        isSosOpen,
        setSosOpen,
        isA11yOpen,
        setA11yOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
