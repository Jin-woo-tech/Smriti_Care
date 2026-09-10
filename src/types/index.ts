export type Role = 'patient' | 'caregiver' | 'clinician' | 'asha';
export type Language = 'en' | 'hi' | 'as';
export type TextScale = 'normal' | 'large' | 'xl';

export type ReminderType = 'medicine' | 'hydration' | 'walking' | 'appointment';

export interface Reminder {
  id: string;
  type: ReminderType;
  title: string;
  titleAs: string;
  titleHi?: string;
  dose?: string;
  doseAs?: string;
  doseHi?: string;
  time: string; // e.g. "08:00 AM"
  frequency: string; // e.g. "Daily", "Twice a day", "Once a week"
  frequencyAs: string;
  frequencyHi?: string;
  taken: boolean;
  takenAt?: string;
  notes?: string;
  notesAs?: string;
  notesHi?: string;
  iconName?: string;
}

export interface PhotoMemory {
  id: string;
  imageUrl: string;
  title: string;
  titleAs: string;
  titleHi?: string;
  relation: string;
  relationAs: string;
  relationHi?: string;
  description: string;
  descriptionAs: string;
  descriptionHi?: string;
  year?: string;
  voiceNoteText?: string;
  voiceNoteTextAs?: string;
  voiceNoteTextHi?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: 'happy' | 'peaceful' | 'nostalgic' | 'tired' | 'confused';
  text: string;
  textAs?: string;
  textHi?: string;
  photoUrl?: string;
  audioDuration?: string;
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
  titleAs: string;
  titleHi?: string;
  description: string;
  descriptionAs: string;
  descriptionHi?: string;
  domain: string;
  domainAs: string;
  domainHi?: string;
  icon: string;
  estimatedMinutes: number;
}

export interface GameScoreRecord {
  id: string;
  gameId: GameId;
  date: string;
  score: number;
  maxScore: number;
  accuracy: number; // 0 - 100%
  reactionTimeMs: number;
  difficultyTier: 1 | 2 | 3;
  durationSeconds: number;
}

export interface CognitiveDomainTrend {
  domain: string;
  domainAs: string;
  domainHi?: string;
  score: number; // 0 - 100
  baselineScore: number;
  status: 'stable' | 'watch' | 'review';
  trendDirection: 'improving' | 'stable' | 'slight-decline';
  lastTestedDate: string;
}

export interface SafetyAnalysisResult {
  id: string;
  timestamp: string;
  medicineName: string;
  genericName: string;
  identifiedStrength: string;
  isRecognized: boolean;
  confidence: number;
  instructions: string;
  instructionsAs: string;
  instructionsHi?: string;
  matchesSchedule: boolean;
  scheduledTime?: string;
  safetyAlerts: string[];
  safetyAlertsAs: string[];
  safetyAlertsHi?: string[];
  source: 'demo' | 'live';
  summary: string;
  summaryAs: string;
  summaryHi?: string;
}

export interface LabReportResult {
  id: string;
  timestamp: string;
  patientName: string;
  testName: string;
  testNameAs: string;
  testNameHi?: string;
  keyFindings: {
    parameter: string;
    parameterAs: string;
    parameterHi?: string;
    value: string;
    referenceRange: string;
    status: 'normal' | 'elevated' | 'low';
    explanation: string;
    explanationAs: string;
    explanationHi?: string;
  }[];
  plainLanguageSummary: string;
  plainLanguageSummaryAs: string;
  plainLanguageSummaryHi?: string;
  doctorRecommendation: string;
  doctorRecommendationAs: string;
  doctorRecommendationHi?: string;
  source: 'demo' | 'live';
}

export interface SyncQueueItem {
  id: string;
  action: 'create_reminder' | 'update_reminder' | 'save_game_score' | 'add_journal' | 'asha_visit_log';
  payload: any;
  timestamp: string;
  synced: boolean;
}

export interface AshaPatientRecord {
  id: string;
  name: string;
  nameAs: string;
  nameHi?: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  village: string;
  villageAs: string;
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
  notesAs: string;
  notesHi?: string;
}

export interface AppSettings {
  role: Role;
  language: Language;
  textScale: TextScale;
  highContrast: boolean;
  reducedMotion: boolean;
  voiceAssistanceEnabled: boolean;
  apiKey: string;
  isSimulatedOffline: boolean;
}
