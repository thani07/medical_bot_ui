import { useState, useEffect, useRef, useCallback } from 'react';
import * as api from '../api/client';
import type { Message } from '../types';
import { useApp } from '../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import FollowUpChips from './FollowUpChips';
import ChatInput from './ChatInput';
import TopBar from './TopBar';
import SymptomModal from './SymptomModal';
import HealthSummaryModal from './HealthSummaryModal';

interface Props {
  sessionId: string;
  sessionTitle: string;
  onSessionUpdated: () => void;
}

export default function ChatArea({ sessionId, sessionTitle, onSessionUpdated }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [symptomsOpen, setSymptomsOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToast, setSidebarOpen } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Load messages on session change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFollowUps([]);

    api.getMessages(sessionId).then(msgs => {
      if (cancelled) return;
      setMessages(msgs);
      setLoading(false);

      // Load follow-up suggestions for existing sessions
      if (msgs.length > 2) {
        api.getSuggestions(sessionId).then(setFollowUps).catch(() => {});
      }
    }).catch(err => {
      if (cancelled) return;
      addToast(err.message || 'Failed to load messages', 'error');
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [sessionId, addToast]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  const handleSendText = useCallback(async (text: string) => {
    // Optimistic UI: show user message immediately
    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      session_id: sessionId,
      role: 'user',
      content: text,
      message_type: 'text',
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);
    setFollowUps([]);
    setSending(true);

    try {
      const res = await api.sendMessage({ session_id: sessionId, message: text });

      const assistantMsg: Message = {
        id: `resp-${Date.now()}`,
        session_id: sessionId,
        role: 'assistant',
        content: res.assistant,
        message_type: 'text',
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setFollowUps(res.follow_up_suggestions || []);
      onSessionUpdated(); // refresh sidebar
    } catch (e: any) {
      addToast(e.message || 'Failed to send message', 'error');
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
    } finally {
      setSending(false);
    }
  }, [sessionId, addToast, onSessionUpdated]);

  const handleSendVoice = useCallback(async (blob: Blob, previewText: string) => {
    // Optimistic: show user message with preview text
    const tempMsg: Message = {
      id: `temp-voice-${Date.now()}`,
      session_id: sessionId,
      role: 'user',
      content: previewText || 'Voice message...',
      message_type: 'voice',
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);
    setFollowUps([]);
    setSending(true);

    try {
      const ext = blob.type.includes('mp4') || blob.type.includes('m4a') ? 'recording.m4a' : 'recording.webm';
      const res = await api.sendVoice(sessionId, blob, ext);

      // Update user message with accurate Whisper transcription
      setMessages(prev =>
        prev.map(m =>
          m.id === tempMsg.id
            ? { ...m, content: res.transcription || previewText }
            : m
        )
      );

      const assistantMsg: Message = {
        id: `resp-voice-${Date.now()}`,
        session_id: sessionId,
        role: 'assistant',
        content: res.assistant,
        message_type: 'text',
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setFollowUps(res.follow_up_suggestions || []);
      onSessionUpdated();
    } catch (e: any) {
      addToast(e.message || 'Voice message failed', 'error');
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
    } finally {
      setSending(false);
    }
  }, [sessionId, addToast, onSessionUpdated]);

  const handleFollowUp = (text: string) => {
    handleSendText(text);
  };

  // Track if we've sent the initial message to prevent React 18 Strict Mode double-fire
  const initialMessageSent = useRef(false);

  // Handle initial message from route state (e.g., from quick start cards)
  useEffect(() => {
    const state = location.state as { initialMessage?: string };
    if (state?.initialMessage && !initialMessageSent.current) {
      initialMessageSent.current = true;
      const msg = state.initialMessage;
      // Replace state so we don't send again on refresh
      navigate(location.pathname, { replace: true });
      // Send the initial message with optimistic UI and normal flow
      handleSendText(msg);
    }
  }, [location.state, location.pathname, navigate, handleSendText]);

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      {/* Top bar */}
      <TopBar
        sessionId={sessionId}
        title={sessionTitle}
        onOpenSymptoms={() => setSymptomsOpen(true)}
        onOpenSummary={() => setSummaryOpen(true)}
        onToggleSidebar={() => setSidebarOpen(true)}
      />

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {sending && <TypingIndicator />}

            {!sending && followUps.length > 0 && (
              <FollowUpChips suggestions={followUps} onSelect={handleFollowUp} />
            )}
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSendText={handleSendText}
        onSendVoice={handleSendVoice}
        disabled={sending || loading}
      />

      {/* Modals */}
      <SymptomModal sessionId={sessionId} open={symptomsOpen} onClose={() => setSymptomsOpen(false)} />
      <HealthSummaryModal sessionId={sessionId} open={summaryOpen} onClose={() => setSummaryOpen(false)} />
    </div>
  );
}
