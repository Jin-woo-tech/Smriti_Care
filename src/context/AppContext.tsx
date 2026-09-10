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
  addToSyncQueue,
  clearSyncQueue,
} from '../lib/storage';
import { speakText, stopSpeech } from '../lib/speech';

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

  // Reminders
  reminders: Reminder[];
  toggleReminderTaken: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;

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

  // Sync state to LocalStorage and root HTML attributes
  useEffect(() => {
    setStoredData(STORAGE_KEYS.SETTINGS, settings);

    // Apply class for high contrast
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply class for text scaling
    document.documentElement.classList.remove('text-scale-normal', 'text-scale-large', 'text-scale-xl');
    document.documentElement.classList.add(`text-scale-${settings.textScale}`);

    // Apply reduced motion
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [settings]);

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

  const toggleReminderTaken = (id: string) => {
    setReminders(prev =>
      prev.map(rem => {
        if (rem.id === id) {
          const nextTaken = !rem.taken;
          if (settings.isSimulatedOffline) {
            addToSyncQueue('update_reminder', { id, taken: nextTaken });
            setSyncQueue(getStoredData(STORAGE_KEYS.SYNC_QUEUE, []));
          }
          return {
            ...rem,
            taken: nextTaken,
            takenAt: nextTaken ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          };
        }
        return rem;
      })
    );
  };

  const addReminder = (newRem: Omit<Reminder, 'id'>) => {
    const item: Reminder = { ...newRem, id: `rem-${Date.now()}` };
    setReminders(prev => [item, ...prev]);
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
  };

  const addWaterGlass = () => {
    setWaterGlasses(prev => Math.min(prev + 1, 12));
  };

  const resetWaterGlasses = () => {
    setWaterGlasses(0);
  };

  const triggerSync = async () => {
    if (syncQueue.length === 0) return;
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    clearSyncQueue();
    setSyncQueue([]);
    setIsSyncing(false);
  };

  const narrate = (text: string) => {
    if (!settings.voiceAssistanceEnabled) return;
    setIsSpeaking(true);
    speakText(text, settings.language);
    // Auto-reset state after estimate
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
        reminders,
        toggleReminderTaken,
        addReminder,
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
