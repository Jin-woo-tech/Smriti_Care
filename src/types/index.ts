export type Role = 'patient' | 'caregiver' | 'clinician' | 'asha';
export type UserRole = Role;
export type Language = 'en' | 'hi';
export type TextScale = 'normal' | 'large' | 'xl';

export type ReminderType = 'medicine' | 'hydration' | 'walking' | 'appointment';
export type MedicationLogStatus = 'scheduled' | 'taken' | 'skipped' | 'missed';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  fullName: string;
  dateOfBirth?: string;
  phone?: string;
  preferredLanguage: Language;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  userId: string;
  age?: number;
  gender?: 'M' | 'F' | 'Other';
  location?: string;
  condition?: string;
  notes?: string;
  avatarInitials: string;
  avatarColor?: string;
  highContrast?: boolean;
  textScale?: TextScale;
  reducedMotion?: boolean;
  voiceAssistance?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Reminder {
  id: string;
  type: ReminderType;
  title: string;
  titleHi?: string;
  dose?: string;
  doseHi?: string;
  time: string; // e.g. "08:00 AM"
  frequency: string; // e.g. "Daily", "Twice a day", "Once a week"
  frequencyHi?: string;
  taken: boolean;
  takenAt?: string;
  notes?: string;
  notesHi?: string;
  iconName?: string;
  status?: MedicationLogStatus;
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  genericName?: string;
  dosage: string;
  dosageHi?: string;
  frequency: string;
  frequencyHi?: string;
  times: string[]; // e.g. ["08:00 AM", "08:00 PM"]
  duration?: string;
  instructions?: string;
  instructionsHi?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
}

export interface MedicationLog {
  id: string;
  userId: string;
  medicationId?: string;
  scheduledTime: string;
  actualTime?: string;
  status: MedicationLogStatus;
  date: string;
  notes?: string;
}

export interface MedicationAdherence {
  totalScheduled: number;
  totalTaken: number;
  totalSkipped: number;
  totalMissed: number;
  adherencePercentage: number;
  streakDays: number;
  recentLogs: MedicationLog[];
}

export interface PhotoMemory {
  id: string;
  imageUrl: string;
  title: string;
  titleHi?: string;
  relation: string;
  relationHi?: string;
  description: string;
  descriptionHi?: string;
  year?: string;
  voiceNoteText?: string;
  voiceNoteTextHi?: string;
  tags?: string[];
  createdAt?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: 'happy' | 'peaceful' | 'nostalgic' | 'tired' | 'confused';
  text: string;
  textHi?: string;
  photoUrl?: string;
  audioDuration?: string;
  createdAt?: string;
}

export type GameId =
  | 'remember-match'
  | 'find-symbol'
  | 'follow-path'
  | 'remember-routine'
  | 'sequence-recall'
  | 'local-memory';

export interface GameMetadata {
  id: GameId;
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  domain: string;
  domainHi?: string;
  icon: string;
  estimatedMinutes: number;
}

export interface GameScoreRecord {
  id: string;
  userId?: string;
  gameId: GameId;
  date: string;
  score: number;
  maxScore: number;
  accuracy: number; // 0 - 100%
  reactionTimeMs: number;
  difficultyTier: 1 | 2 | 3;
  durationSeconds: number;
  domain?: string;
}

export interface CognitiveDomainTrend {
  domain: string;
  domainHi?: string;
  score: number; // 0 - 100
  baselineScore: number;
  status: 'stable' | 'watch' | 'review';
  trendDirection: 'improving' | 'stable' | 'slight-decline';
  lastTestedDate: string;
  history?: { date: string; score: number }[];
}

export interface Doctor {
  id: string;
  name: string;
  nameHi?: string;
  specialty: string;
  specialtyHi?: string;
  hospital: string;
  hospitalHi?: string;
  phone?: string;
  email?: string;
  availableDays: string[];
  availableTimeSlots: string[];
  rating: number;
  location: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string;
  doctorId: string;
  doctorName?: string;
  doctorSpecialty?: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  doctorNotes?: string;
  createdAt: string;
}

export interface CaregiverRelationship {
  id: string;
  patientId: string;
  caregiverId: string;
  patientName?: string;
  patientPhone?: string;
  status: 'pending' | 'authorized' | 'revoked';
  permissions: string[];
  createdAt: string;
}

export interface CaregiverPatientSummary {
  patient: User;
  profile?: UserProfile;
  todayMedications: Reminder[];
  adherenceRate: number;
  cognitiveTrend: CognitiveDomainTrend[];
  upcomingAppointments: Appointment[];
  hydrationCount: number;
  recentActivity: { timestamp: string; action: string; status: string }[];
}

export interface SafetyAnalysisResult {
  id: string;
  timestamp: string;
  medicineName: string;
  genericName: string;
  identifiedStrength: string;
  dosageSchedule?: string;
  isRecognized: boolean;
  confidence: number;
  instructions: string;
  instructionsHi?: string;
  matchesSchedule: boolean;
  scheduledTime?: string;
  safetyAlerts: string[];
  safetyAlertsHi?: string[];
  source: 'demo' | 'live';
  summary: string;
  summaryHi?: string;
}

export interface LabReportResult {
  id: string;
  timestamp: string;
  patientName: string;
  testName: string;
  testNameHi?: string;
  keyFindings: {
    parameter: string;
    parameterHi?: string;
    value: string;
    referenceRange: string;
    status: 'normal' | 'elevated' | 'low';
    explanation: string;
    explanationHi?: string;
  }[];
  plainLanguageSummary: string;
  plainLanguageSummaryHi?: string;
  doctorRecommendation: string;
  doctorRecommendationHi?: string;
  source: 'demo' | 'live';
  fileUrl?: string;
}

export interface SyncQueueItem {
  id: string;
  action: 'create_reminder' | 'update_reminder' | 'save_game_score' | 'add_journal' | 'asha_visit_log' | 'save_medication_log';
  payload: any;
  timestamp: string;
  synced: boolean;
}

export interface AshaPatientRecord {
  id: string;
  ashaUserId?: string;
  name: string;
  nameHi?: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  village: string;
  villageHi?: string;
  phone: string;
  caregiverName: string;
  caregiverPhone: string;
  lastVisitDate: string;
  adherenceRate: number; // percentage
  cognitiveStatus: 'stable' | 'watch' | 'review';
  medicationStockDays: number;
  nextScheduledVisit: string;
  notes: string;
  notesHi?: string;
}

export interface AshaVisitRecord {
  id: string;
  ashaUserId: string;
  patientId: string;
  visitDate: string;
  bloodPressure?: string;
  bloodSugar?: string;
  medicationStockDays: number;
  adherenceStatus: string;
  notes: string;
  followUpDate?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  nameHi?: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  location: string;
  locationHi?: string;
  avatarInitials: string;
  avatarColor?: string;
  condition?: string;
  conditionHi?: string;
  adherenceRate?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface AppSettings {
  role: Role;
  language: Language;
  textScale: TextScale;
  highContrast: boolean;
  reducedMotion: boolean;
  voiceAssistanceEnabled: boolean;
  apiKey: string;
  apiKeyStatus?: 'valid' | 'invalid' | 'untested';
  isSimulatedOffline: boolean;
  activePatientId?: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  textHi?: string;
  timestamp: string;
  audioUrl?: string;
  suggestedActions?: { label: string; action: string }[];
}
