export interface Session {
  id: string;
  title: string;
  language: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  message_type: 'text' | 'voice';
  created_at: string;
}

export interface NewSessionResponse {
  session_id: string;
  title: string;
}

export interface SendMessageRequest {
  session_id: string;
  message: string;
}

export interface SendMessageResponse {
  assistant: string;
  session_id: string;
  follow_up_suggestions: string[];
}

export interface VoiceMessageResponse {
  transcription: string;
  assistant: string;
  session_id: string;
  follow_up_suggestions: string[];
}

export interface SymptomAnalysis {
  session_id: string;
  symptoms: string[];
  possible_conditions: string[];
  severity: 'mild' | 'moderate' | 'severe' | 'unknown';
  seek_emergency: boolean;
}

export interface HealthSummary {
  session_id: string;
  summary: string;
  key_symptoms: string[];
  recommendations: string[];
}

export interface ExportData {
  session_id: string;
  title: string;
  language: string;
  created_at: string;
  messages: Message[];
  total_messages: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'error' | 'success' | 'info';
}
