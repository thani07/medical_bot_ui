import type {
  Session, Message, NewSessionResponse,
  SendMessageRequest, SendMessageResponse,
  VoiceMessageResponse, SymptomAnalysis,
  HealthSummary, ExportData,
} from '../types';

const BASE = import.meta.env.VITE_API_BASE_URL as string;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(!init?.body || typeof init.body === 'string'
        ? { 'Content-Type': 'application/json' }
        : {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json();
}

// ── Sessions ──────────────────────────────────────────
export const createSession = (language = 'en') =>
  request<NewSessionResponse>('/new_session', {
    method: 'POST',
    body: JSON.stringify({ language }),
  });

export const getSessions = (includeArchived = false) =>
  request<Session[]>(`/sessions?include_archived=${includeArchived}`);

export const getMessages = (sessionId: string) =>
  request<Message[]>(`/messages/${sessionId}`);

export const renameSession = (sessionId: string, title: string) =>
  request<{ session_id: string; title: string }>(
    `/session/${sessionId}/title?title=${encodeURIComponent(title)}`,
    { method: 'PUT' },
  );

export const archiveSession = (sessionId: string) =>
  request<{ session_id: string; archived: boolean }>(
    `/session/${sessionId}/archive`,
    { method: 'PUT' },
  );

export const deleteSession = (sessionId: string) =>
  request<{ deleted: boolean }>(`/session/${sessionId}`, { method: 'DELETE' });

// ── Chat ──────────────────────────────────────────────
export const sendMessage = (payload: SendMessageRequest) =>
  request<SendMessageResponse>('/send_message', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export async function sendVoice(
  sessionId: string,
  audioBlob: Blob,
  filename = 'recording.webm',
): Promise<VoiceMessageResponse> {
  const form = new FormData();
  form.append('session_id', sessionId);
  form.append('audio', audioBlob, filename);
  const res = await fetch(`${BASE}/send_voice`, { method: 'POST', body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json();
}

// ── Intelligence ──────────────────────────────────────
export const getSymptoms = (sessionId: string) =>
  request<SymptomAnalysis>(`/symptoms/${sessionId}`);

export const getHealthSummary = (sessionId: string) =>
  request<HealthSummary>(`/health_summary/${sessionId}`);

export const getSuggestions = (sessionId: string) =>
  request<string[]>(`/suggestions/${sessionId}`);

// ── Export ─────────────────────────────────────────────
export const getExport = (sessionId: string) =>
  request<ExportData>(`/export/${sessionId}`);

// ── Health check ──────────────────────────────────────
export const healthCheck = () =>
  request<{ status: string }>('/health');
