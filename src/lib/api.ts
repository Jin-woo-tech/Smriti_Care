// SmritiCare Client API & Offline Resilient Synchronizer
import { Language, UserRole } from '../types';

const API_BASE = '/api';

export interface OfflineAction {
  id: string;
  type: 'LOG_MEDICATION' | 'GAME_SESSION' | 'ASHA_VISIT';
  payload: any;
  timestamp: number;
}

class ApiClient {
  private token: string | null = null;
  private offlineQueueKey = 'smriticare_offline_sync_queue';

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('smriticare_jwt_token');
      window.addEventListener('online', () => {
        this.processOfflineQueue();
      });
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('smriticare_jwt_token', token);
      } else {
        localStorage.removeItem('smriticare_jwt_token');
      }
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('smriticare_jwt_token');
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errMessage = 'Request failed';
        try {
          const errData = await response.json();
          errMessage = errData.error || errData.message || errMessage;
        } catch {
          errMessage = `HTTP error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errMessage);
      }

      return await response.json();
    } catch (err: any) {
      // If network is offline or server unreachable, check if we can queue offline mutations
      if (options.method && options.method !== 'GET' && typeof window !== 'undefined') {
        if (!navigator.onLine || err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          this.enqueueOfflineMutation(endpoint, options);
        }
      }
      throw err;
    }
  }

  private enqueueOfflineMutation(endpoint: string, options: RequestInit) {
    if (!options.body) return;
    try {
      const payload = JSON.parse(options.body as string);
      let type: OfflineAction['type'] | null = null;

      if (endpoint === '/medications/log') type = 'LOG_MEDICATION';
      else if (endpoint === '/games/sessions') type = 'GAME_SESSION';
      else if (endpoint === '/asha/visits') type = 'ASHA_VISIT';

      if (type) {
        const queue: OfflineAction[] = this.getOfflineQueue();
        queue.push({
          id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          type,
          payload,
          timestamp: Date.now(),
        });
        localStorage.setItem(this.offlineQueueKey, JSON.stringify(queue));
      }
    } catch (e) {
      console.error('Failed to enqueue offline action:', e);
    }
  }

  public getOfflineQueue(): OfflineAction[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.offlineQueueKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public async processOfflineQueue(): Promise<void> {
    const queue = this.getOfflineQueue();
    if (queue.length === 0) return;

    try {
      const result: any = await this.sync.batch(queue);
      if (result && result.results) {
        localStorage.removeItem(this.offlineQueueKey);
        console.log(`Successfully synced ${result.results.length} offline actions.`);
      }
    } catch (err) {
      console.warn('Sync attempt failed, queue preserved for next retry:', err);
    }
  }

  // Auth APIs
  public auth = {
    login: (usernameOrEmail: string, password: string) =>
      this.request<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ usernameOrEmail, password }),
      }),

    register: (payload: any) =>
      this.request<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    getMe: () => this.request<{ user: any }>('/auth/me'),

    updateProfile: (profileData: any) =>
      this.request<{ message: string }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),

    demoSwitch: (role: UserRole) =>
      this.request<{ token: string; user: any }>('/auth/demo-switch', {
        method: 'POST',
        body: JSON.stringify({ role }),
      }),
  };

  // Medications APIs
  public medications = {
    getAll: (patientId?: string) =>
      this.request<any[]>(`/medications${patientId ? `?patientId=${patientId}` : ''}`),

    getToday: (patientId?: string) =>
      this.request<any[]>(`/medications/today${patientId ? `?patientId=${patientId}` : ''}`),

    getAdherence: (patientId?: string) =>
      this.request<{
        overallAdherence: number;
        takenDoses: number;
        skippedDoses: number;
        totalTracked: number;
        recentHistory: any[];
      }>(`/medications/adherence${patientId ? `?patientId=${patientId}` : ''}`),

    add: (medData: any) =>
      this.request<any>('/medications', {
        method: 'POST',
        body: JSON.stringify(medData),
      }),

    update: (id: string, medData: any) =>
      this.request<any>(`/medications/${id}`, {
        method: 'PUT',
        body: JSON.stringify(medData),
      }),

    delete: (id: string) =>
      this.request<{ message: string }>(`/medications/${id}`, {
        method: 'DELETE',
      }),

    logDose: (data: { medicationId: string; scheduledTime: string; status: 'taken' | 'skipped'; notes?: string }) =>
      this.request<{ message: string; id: string; status: string }>('/medications/log', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };

  // Games & Cognitive Metrics APIs
  public games = {
    getMetrics: (patientId?: string) =>
      this.request<{ overallScore: number; metrics: any[] }>(`/games/metrics${patientId ? `?patientId=${patientId}` : ''}`),

    getHistory: (patientId?: string, limit = 20) =>
      this.request<any[]>(`/games/history?limit=${limit}${patientId ? `&patientId=${patientId}` : ''}`),

    submitSession: (data: {
      gameType: string;
      domain: string;
      score: number;
      maxScore?: number;
      levelReached?: number;
      durationSeconds?: number;
      reactionTimeMs?: number;
      errorsCount?: number;
    }) =>
      this.request<{ message: string; sessionId: string; domain: string; normalizedScore: number }>('/games/sessions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };

  // Doctors Catalog & Teleconsultation APIs
  public doctors = {
    getAll: (specialization?: string, search?: string) => {
      const params = new URLSearchParams();
      if (specialization) params.append('specialization', specialization);
      if (search) params.append('search', search);
      return this.request<any[]>(`/doctors?${params.toString()}`);
    },

    getById: (id: string) => this.request<any>(`/doctors/${id}`),
  };

  // Appointments APIs
  public appointments = {
    getAll: () => this.request<any[]>('/appointments'),

    book: (data: {
      doctorId: string;
      appointmentDate: string;
      appointmentTime: string;
      reason?: string;
      consultationType?: 'video' | 'in-person' | 'phone';
    }) =>
      this.request<{ message: string; appointment: any }>('/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    updateStatus: (id: string, data: { status: string; clinicalNotes?: string; prescription?: string }) =>
      this.request<{ message: string }>(`/appointments/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  };

  // Caregiver APIs
  public caregivers = {
    getPatients: () => this.request<any[]>('/caregivers/patients'),

    linkPatient: (patientIdentifier: string, relationshipType = 'Family Member', isPrimary = true) =>
      this.request<{ message: string; patientId: string; patientName: string }>('/caregivers/link', {
        method: 'POST',
        body: JSON.stringify({ patientIdentifier, relationshipType, isPrimary }),
      }),

    getPatientSummary: (patientId: string) =>
      this.request<{
        patient: any;
        cognitiveMetrics: any[];
        medications: any[];
        todayLogs: any[];
        recentGames: any[];
      }>(`/caregivers/summary/${patientId}`),
  };

  // ASHA Rural Health Worker APIs
  public asha = {
    getPatients: (village?: string, riskCategory?: string) => {
      const params = new URLSearchParams();
      if (village) params.append('village', village);
      if (riskCategory) params.append('riskCategory', riskCategory);
      return this.request<any[]>(`/asha/patients?${params.toString()}`);
    },

    registerPatient: (data: any) =>
      this.request<{ message: string; patient: any }>('/asha/patients', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getVisits: (recordId?: string) =>
      this.request<any[]>(`/asha/visits${recordId ? `?recordId=${recordId}` : ''}`),

    recordVisit: (data: any) =>
      this.request<{ message: string; visitId: string }>('/asha/visits', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };

  // Memories APIs
  public memories = {
    getAll: (patientId?: string, tag?: string) => {
      const params = new URLSearchParams();
      if (patientId) params.append('patientId', patientId);
      if (tag) params.append('tag', tag);
      return this.request<any[]>(`/memories?${params.toString()}`);
    },

    add: (memoryData: any) =>
      this.request<any>('/memories', {
        method: 'POST',
        body: JSON.stringify(memoryData),
      }),

    delete: (id: string) =>
      this.request<{ message: string }>(`/memories/${id}`, {
        method: 'DELETE',
      }),
  };

  // Lab Reports APIs
  public labReports = {
    getAll: (patientId?: string) =>
      this.request<any[]>(`/lab-reports${patientId ? `?patientId=${patientId}` : ''}`),

    save: (reportData: any) =>
      this.request<any>('/lab-reports', {
        method: 'POST',
        body: JSON.stringify(reportData),
      }),
  };

  // OmniRoute AI Gateway APIs
  public ai = {
    verifyKey: (apiKey?: string) =>
      this.request<{
        valid: boolean;
        provider?: string;
        model?: string;
        latencyMs?: number;
        message: string;
        messageHi?: string;
        errorDetail?: string;
        isOfflineSafe?: boolean;
      }>('/ai/verify-key', {
        method: 'POST',
        body: JSON.stringify({ apiKey }),
        headers: apiKey ? { 'x-api-key': apiKey } : {},
      }),

    chat: (message: string, language: Language = 'en', conversationHistory: any[] = [], apiKey?: string) =>
      this.request<{ reply: string; language: string; disclaimer: string }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, language, conversationHistory, apiKey }),
        headers: apiKey ? { 'x-api-key': apiKey } : {},
      }),

    medicineOcr: (payload: { imageBase64?: string; ocrText?: string }, apiKey?: string) =>
      this.request<{
        medication: {
          name: string;
          genericName: string;
          dosage: string;
          frequency: string;
          recommendedTimes: string[];
          duration: string;
          instructions: string;
          precautions: string;
          confidenceScore: number;
        };
        requiresConfirmation: boolean;
        disclaimer: string;
      }>('/ai/medicine-ocr', {
        method: 'POST',
        body: JSON.stringify({ ...payload, apiKey }),
        headers: apiKey ? { 'x-api-key': apiKey } : {},
      }),

    analyzeLab: (payload: { reportText: string; testName?: string }, apiKey?: string) =>
      this.request<{
        testName: string;
        summaryEn: string;
        summaryHi: string;
        biomarkers: Array<{
          name: string;
          value: string;
          referenceRange: string;
          status: 'normal' | 'low' | 'high' | 'borderline';
          impactOnCognition: string;
        }>;
        clinicalRecommendations: string;
        disclaimer: string;
      }>('/ai/lab-analyzer', {
        method: 'POST',
        body: JSON.stringify({ ...payload, apiKey }),
        headers: apiKey ? { 'x-api-key': apiKey } : {},
      }),

    getCognitiveInsights: (patientId?: string) =>
      this.request<{
        overallStatus: string;
        compositeScore: number;
        primaryStrength: string;
        focusArea: string;
        clinicalSummary: string;
        clinicalSummaryHi: string;
        recommendations: string[];
        disclaimer: string;
      }>(`/ai/cognitive-insights${patientId ? `?patientId=${patientId}` : ''}`),
  };

  // Offline Sync API
  public sync = {
    batch: (actions: OfflineAction[]) =>
      this.request<{ message: string; totalReceived: number; results: any[] }>('/sync/batch', {
        method: 'POST',
        body: JSON.stringify({ actions }),
      }),
  };
}

export const api = new ApiClient();
