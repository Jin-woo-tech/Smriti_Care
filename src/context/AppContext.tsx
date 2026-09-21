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
  freshCognitiveTrends,
  initialGameScores,
  initialAshaPatients,
  initialPatientProfiles,
  addToSyncQueue,
  clearSyncQueue,
  getPatientScopedData,
  savePatientScopedData,
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
  deletePatientProfile: (id: string) => Promise<boolean>;
  deleteUserAccount: () => Promise<boolean>;
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

  const [patientProfiles, setPatientProfiles] = useState<PatientProfile[]>(() => {
    const saved = getStoredData<PatientProfile[]>(STORAGE_KEYS.PATIENT_PROFILES, initialPatientProfiles);
    const savedUser = localStorage.getItem('smriticare_user_session');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u && (u.id || u.username)) {
          const profileId = `pat-user-${u.id || u.username}`;
          const existing = saved.find(p => p.id === profileId);
          if (!existing) {
            const initials = (u.fullName || u.username || 'PT')
              .split(' ')
              .map((p: string) => p[0])
              .filter(Boolean)
              .join('')
              .toUpperCase()
              .slice(0, 2) || 'PT';
            const userProfile: PatientProfile = {
              id: profileId,
              name: u.fullName || u.username,
              nameHi: u.fullName || u.username,
              age: u.profile?.age || 65,
              gender: (u.profile?.gender as 'M' | 'F' | 'Other') || 'M',
              location: u.profile?.location || 'Jorhat, Assam',
              locationHi: u.profile?.location || 'जोरहाट, असम',
              avatarInitials: u.profile?.avatarInitials || initials,
              avatarColor: u.profile?.avatarColor || 'from-purple-600 to-indigo-500',
              condition: u.profile?.condition || 'Cognitive Wellness & Daily Routine',
              conditionHi: 'संज्ञानात्मक स्वास्थ्य एवं दैनिक दिनचर्या',
              adherenceRate: 100,
              emergencyContactName: 'Primary Caregiver',
              emergencyContactPhone: '+91 94350 00000',
            };
            return [userProfile, ...saved];
          }
        }
      } catch {}
    }
    return saved;
  });

  const [activePatientId, setActivePatientIdState] = useState<string>(() => {
    const savedUser = localStorage.getItem('smriticare_user_session');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u && (u.id || u.username)) {
          return `pat-user-${u.id || u.username}`;
        }
      } catch {}
    }
    return getStoredData<string>(STORAGE_KEYS.ACTIVE_PATIENT_ID, 'pat-ananya-20');
  });

  const initialScopedData = getPatientScopedData(
    (function () {
      const savedUser = localStorage.getItem('smriticare_user_session');
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser);
          if (u && (u.id || u.username)) {
            return `pat-user-${u.id || u.username}`;
          }
        } catch {}
      }
      return getStoredData<string>(STORAGE_KEYS.ACTIVE_PATIENT_ID, 'pat-ananya-20');
    })()
  );

  const [reminders, setReminders] = useState<Reminder[]>(initialScopedData.reminders);
  const [photos, setPhotos] = useState<PhotoMemory[]>(initialScopedData.photos);
  const [journal, setJournal] = useState<JournalEntry[]>(initialScopedData.journal);
  const [gameScores, setGameScores] = useState<GameScoreRecord[]>(initialScopedData.gameScores);
  const [cognitiveTrends, setCognitiveTrends] = useState<CognitiveDomainTrend[]>(initialScopedData.cognitiveTrends);
  const [ashaPatients, setAshaPatients] = useState<AshaPatientRecord[]>(() =>
    getStoredData<AshaPatientRecord[]>(STORAGE_KEYS.ASHA_PATIENTS, initialAshaPatients)
  );
  const [waterGlasses, setWaterGlasses] = useState<number>(initialScopedData.waterGlasses);

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

  // Dynamic synchronization of authenticated user to patient profile
  const syncUserToPatientProfile = (user: User, isNewRegistration: boolean = false) => {
    if (!user) return;
    const profileId = `pat-user-${user.id || user.username}`;
    const initials = (user.fullName || user.username || 'PT')
      .split(' ')
      .map(p => p[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'PT';

    const userProfile: PatientProfile = {
      id: profileId,
      name: user.fullName || user.username,
      nameHi: user.fullName || user.username,
      age: user.profile?.age || 65,
      gender: (user.profile?.gender as 'M' | 'F' | 'Other') || 'M',
      location: user.profile?.location || 'Jorhat, Assam',
      locationHi: user.profile?.location || 'जोरहाट, असम',
      avatarInitials: user.profile?.avatarInitials || initials,
      avatarColor: user.profile?.avatarColor || 'from-purple-600 to-indigo-500',
      condition: user.profile?.condition || 'Cognitive Wellness & Daily Routine',
      conditionHi: 'संज्ञानात्मक स्वास्थ्य एवं दैनिक दिनचर्या',
      adherenceRate: 100,
      emergencyContactName: 'Primary Caregiver',
      emergencyContactPhone: '+91 94350 00000',
    };

    setPatientProfiles(prev => {
      const filtered = prev.filter(p => p.id !== profileId);
      return [userProfile, ...filtered];
    });
    setActivePatientIdState(profileId);
    setStoredData(STORAGE_KEYS.ACTIVE_PATIENT_ID, profileId);

    if (isNewRegistration) {
      setWaterGlasses(0);
      setGameScores([]);
      setCognitiveTrends(freshCognitiveTrends);
      setReminders([]);
      savePatientScopedData(profileId, {
        reminders: [],
        cognitiveTrends: freshCognitiveTrends,
        gameScores: [],
        waterGlasses: 0,
        photos: [],
        journal: [],
      });
    }
  };

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
            syncUserToPatientProfile(res.user, false);
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
    savePatientScopedData(activePatientId, { reminders });
  }, [reminders, activePatientId]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.PHOTOS, photos);
    savePatientScopedData(activePatientId, { photos });
  }, [photos, activePatientId]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.JOURNAL, journal);
    savePatientScopedData(activePatientId, { journal });
  }, [journal, activePatientId]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.GAME_SCORES, gameScores);
    savePatientScopedData(activePatientId, { gameScores });
  }, [gameScores, activePatientId]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.COGNITIVE_TRENDS, cognitiveTrends);
    savePatientScopedData(activePatientId, { cognitiveTrends });
  }, [cognitiveTrends, activePatientId]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.ASHA_PATIENTS, ashaPatients);
  }, [ashaPatients]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.WATER_INTAKE, waterGlasses);
    savePatientScopedData(activePatientId, { waterGlasses });
  }, [waterGlasses, activePatientId]);

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
        syncUserToPatientProfile(res.user, false);
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
        syncUserToPatientProfile(res.user, true);
        await refreshMedications();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Registration error:', err);
      throw err;
    }
  };

  const setActivePatientId = (id: string) => {
    // 1. Save current active patient's dataset to their scoped storage
    savePatientScopedData(activePatientId, {
      reminders,
      cognitiveTrends,
      gameScores,
      waterGlasses,
      photos,
      journal,
    });

    // 2. Set new active patient
    setActivePatientIdState(id);
    setStoredData(STORAGE_KEYS.ACTIVE_PATIENT_ID, id);
    updateSettings({ activePatientId: id });

    // 3. Load target patient's scoped dataset
    const targetData = getPatientScopedData(id);
    setReminders(targetData.reminders);
    setCognitiveTrends(targetData.cognitiveTrends);
    setGameScores(targetData.gameScores);
    setWaterGlasses(targetData.waterGlasses);
    setPhotos(targetData.photos);
    setJournal(targetData.journal);
  };

  const logout = () => {
    api.setToken(null);
    localStorage.removeItem('smriticare_user_session');
    // Set fallback demo user
    setCurrentUser(null);
    setSettings(s => ({ ...s, role: 'patient' }));
    if (patientProfiles.length > 0) {
      setActivePatientId(patientProfiles[0].id);
    }
  };

  const switchRole = async (role: Role) => {
    try {
      const res = await api.auth.demoSwitch(role);
      if (res && res.token && res.user) {
        api.setToken(res.token);
        setCurrentUser(res.user);
        localStorage.setItem('smriticare_user_session', JSON.stringify(res.user));
        setSettings(s => ({ ...s, role }));
        syncUserToPatientProfile(res.user, false);
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

  const deletePatientProfile = async (id: string): Promise<boolean> => {
    try {
      // Check if this profile belongs to a server user or the current user
      const isCurrentServerUser = currentUser && (
        id === `pat-user-${currentUser.id}` ||
        id === `pat-user-${currentUser.username}` ||
        id === currentUser.id
      );

      // If user profile starts with pat-user-, extract possible user id
      if (id.startsWith('pat-user-')) {
        const rawUserId = id.replace('pat-user-', '');
        try {
          await api.auth.deleteUser(rawUserId);
        } catch (err) {
          console.warn('Backend user delete warning:', err);
        }
      }

      // If it was the logged-in user, clear user session
      if (isCurrentServerUser) {
        api.setToken(null);
        localStorage.removeItem('smriticare_user_session');
        setCurrentUser(null);
      }

      // Remove from patientProfiles
      const remainingProfiles = patientProfiles.filter(p => p.id !== id);
      setPatientProfiles(remainingProfiles);
      setStoredData(STORAGE_KEYS.PATIENT_PROFILES, remainingProfiles);

      // If active patient was deleted, switch to the first remaining profile
      if (activePatientId === id) {
        const nextActiveId = remainingProfiles.length > 0 ? remainingProfiles[0].id : 'pat-ananya-20';
        setActivePatientId(nextActiveId);
      }

      return true;
    } catch (err) {
      console.error('Failed to delete patient profile:', err);
      return false;
    }
  };

  const deleteUserAccount = async (): Promise<boolean> => {
    try {
      if (currentUser?.id) {
        await api.auth.deleteMe();
      }
      logout();
      return true;
    } catch (err) {
      console.error('Failed to delete account:', err);
      throw err;
    }
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
        deletePatientProfile,
        deleteUserAccount,
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
