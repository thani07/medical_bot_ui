import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider, useApp } from './context/AppContext';
import * as api from './api/client';
import type { Session } from './types';
import AnimatedBackground from './components/AnimatedBackground';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import WelcomeScreen from './components/WelcomeScreen';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toasts from './components/Toast';

const queryClient = new QueryClient();

function AppInner() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Session | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [apiOk, setApiOk] = useState(true);
  const { sidebarOpen, setSidebarOpen, addToast } = useApp();
  const navigate = useNavigate();
  const params = useParams<{ sessionId?: string }>();
  const activeId = params.sessionId || null;

  // Health check
  useEffect(() => {
    api.healthCheck()
      .then(() => setApiOk(true))
      .catch(() => { setApiOk(false); addToast('Unable to connect to the server. Please try again later.', 'error'); });
  }, [addToast]);

  // Load sessions
  const loadSessions = useCallback(() => {
    api.getSessions().then(setSessions).catch(() => {});
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  // Create new chat
  const handleNewChat = async () => {
    try {
      const res = await api.createSession();
      loadSessions();
      navigate(`/chat/${res.session_id}`);
    } catch (e: any) {
      addToast(e.message || 'Failed to create session', 'error');
    }
  };

  // Quick start from welcome screen
  const handleQuickStart = async (text: string) => {
    try {
      const res = await api.createSession();
      loadSessions();
      navigate(`/chat/${res.session_id}`, { state: { initialMessage: text } });
    } catch (e: any) {
      addToast(e.message || 'Failed to create session', 'error');
    }
  };

  // Rename
  const handleRename = async (id: string, title: string) => {
    try {
      await api.renameSession(id, title);
      loadSessions();
    } catch (e: any) {
      addToast(e.message || 'Rename failed', 'error');
    }
  };

  // Archive
  const handleArchive = async (id: string) => {
    try {
      await api.archiveSession(id);
      loadSessions();
      if (activeId === id) navigate('/');
      addToast('Session archived', 'info');
    } catch (e: any) {
      addToast(e.message || 'Archive failed', 'error');
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteSession(deleteTarget.id);
      loadSessions();
      if (activeId === deleteTarget.id) navigate('/');
      addToast('Session deleted', 'info');
    } catch (e: any) {
      addToast(e.message || 'Delete failed', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const activeSession = sessions.find(s => s.id === activeId);

  return (
    <div className="h-screen flex relative overflow-hidden">
      <AnimatedBackground />

      {/* Offline banner */}
      {!apiOk && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-health-warning/90 text-dark-900 text-center py-2 text-xs font-medium">
          ⚠️ Unable to connect to the server. Please check your connection.
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onSelect={id => navigate(`/chat/${id}`)}
        onNewChat={handleNewChat}
        onHome={() => navigate('/')}
        onRename={handleRename}
        onArchive={handleArchive}
        onDelete={s => setDeleteTarget(s)}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {activeId && activeSession ? (
          <ChatArea
            key={activeId}
            sessionId={activeId}
            sessionTitle={activeSession.title}
            onSessionUpdated={loadSessions}
          />
        ) : (
          <WelcomeScreen onQuickStart={handleQuickStart} />
        )}
      </div>

      {/* Delete modal */}
      <DeleteConfirmModal
        open={!!deleteTarget}
        title={deleteTarget?.title || ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />

      <Toasts />
    </div>
  );
}

function AppRouted() {
  return (
    <Routes>
      <Route path="/" element={<AppInner />} />
      <Route path="/chat/:sessionId" element={<AppInner />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <AppRouted />
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}
