import { useState, useRef, useEffect } from 'react';
import type { Session } from '../types';
import { groupByDate } from '../utils/dateUtils';
import { useApp } from '../context/AppContext';

interface Props {
  sessions: Session[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onRename: (id: string, newTitle: string) => void;
  onArchive: (id: string) => void;
  onDelete: (session: Session) => void;
  onHome: () => void;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({
  sessions, activeId, onSelect, onNewChat,
  onRename, onArchive, onDelete, onHome, open, onClose,
}: Props) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; session: Session } | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameText, setRenameText] = useState('');
  const renameRef = useRef<HTMLInputElement>(null);
  const { theme, setSidebarCollapsed } = useApp();

  const grouped = groupByDate(sessions);
  const groupOrder = ['Today', 'Yesterday', 'Previous 7 days', 'Older'];

  useEffect(() => {
    if (renaming && renameRef.current) renameRef.current.focus();
  }, [renaming]);

  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  const handleContext = (e: React.MouseEvent, session: Session) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, session });
  };

  const startRename = (session: Session) => {
    setRenaming(session.id);
    setRenameText(session.title);
    setContextMenu(null);
  };

  const finishRename = () => {
    if (renaming && renameText.trim()) {
      onRename(renaming, renameText.trim());
    }
    setRenaming(null);
  };

  const isLight = theme === 'light';

  const sidebarContent = (
    <div className={`flex flex-col h-full border-r transition-colors duration-300
      ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-dark-800 border-dark-500'}`}>
      {/* Header */}
      <div className={`p-4 border-b ${isLight ? 'border-slate-100' : 'border-dark-500'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-violet to-accent-fuchsia flex items-center justify-center text-sm font-bold shadow-lg shadow-accent-purple/20 text-white">
              H
            </div>
            <div>
              <div className={`font-heading font-semibold text-sm ${isLight ? 'text-slate-800' : 'text-white'}`}>
                Health Awareness
              </div>
              <div className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Chatbot</div>
            </div>
          </div>

          {/* Collapse button (Desktop only) */}
          <button
            onClick={() => setSidebarCollapsed(true)}
            className={`hidden lg:flex w-7 h-7 items-center justify-center rounded-lg transition-colors
              ${isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' : 'text-slate-500 hover:text-white hover:bg-dark-700'}`}
            title="Collapse sidebar"
          >
            <span className="text-sm font-mono font-bold">«</span>
          </button>
        </div>
        <button
          onClick={() => { onHome(); onClose(); }}
          className={`w-full border text-sm font-medium py-2.5 mb-2 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]
            ${isLight
              ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              : 'bg-dark-700 border-dark-600 text-slate-200 hover:bg-dark-600 hover:text-white'
            }`}
        >
          <span>🏠</span> Home
        </button>
        <button
          onClick={() => { onNewChat(); onClose(); }}
          className="w-full bg-gradient-to-r from-accent-violet to-accent-purple text-white text-sm
            font-medium py-2.5 rounded-xl hover:shadow-lg hover:shadow-accent-purple/20
            transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>+</span> New Chat
        </button>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-v">
        {sessions.length === 0 && (
          <div className="text-center py-10">
            <p className={`text-xs ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>No conversations yet</p>
            <p className={`text-[10px] mt-1 ${isLight ? 'text-slate-300' : 'text-slate-700'}`}>Start a new chat!</p>
          </div>
        )}

        {groupOrder.map(group => {
          const items = grouped[group];
          if (!items?.length) return null;
          return (
            <div key={group} className="mb-4">
              <p className={`text-[10px] uppercase tracking-widest font-medium px-2 mb-1.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                {group}
              </p>
              {items.map(s => (
                <div
                  key={s.id}
                  onClick={() => { onSelect(s.id); onClose(); }}
                  onContextMenu={e => handleContext(e, s)}
                  className={`group flex items-center justify-between rounded-lg px-2.5 py-2 mb-0.5 cursor-pointer
                    transition-all duration-150 text-sm
                    ${s.id === activeId
                      ? (isLight
                          ? 'bg-violet-50 border-l-2 border-accent-purple text-violet-700'
                          : 'bg-dark-700 border-l-2 border-accent-purple text-white')
                      : (isLight
                          ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700/50')
                    }`}
                >
                  {renaming === s.id ? (
                    <input
                      ref={renameRef}
                      value={renameText}
                      onChange={e => setRenameText(e.target.value)}
                      onBlur={finishRename}
                      onKeyDown={e => e.key === 'Enter' && finishRename()}
                      className={`border rounded px-2 py-0.5 text-xs outline-none w-full
                        ${isLight
                          ? 'bg-slate-50 border-accent-purple/30 text-slate-800'
                          : 'bg-dark-600 border-accent-purple/50 text-white'}`}
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <span className="truncate text-xs font-medium">{s.title}</span>
                      <span className={`text-[10px] flex-shrink-0 ml-2 ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
                        {s.message_count}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className={`fixed z-[100] border rounded-lg shadow-xl py-1 min-w-[140px] animate-fade-in
            ${isLight ? 'bg-white border-slate-200' : 'bg-dark-700 border-dark-500'}`}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => startRename(contextMenu.session)}
            className={`w-full text-left px-3 py-1.5 text-xs transition-colors
              ${isLight ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' : 'text-slate-300 hover:bg-dark-600 hover:text-white'}`}
          >
            ✏️ Rename
          </button>
          <button
            onClick={() => { onArchive(contextMenu.session.id); setContextMenu(null); }}
            className={`w-full text-left px-3 py-1.5 text-xs transition-colors
              ${isLight ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' : 'text-slate-300 hover:bg-dark-600 hover:text-white'}`}
          >
            📦 Archive
          </button>
          <button
            onClick={() => { onDelete(contextMenu.session); setContextMenu(null); }}
            className="w-full text-left px-3 py-1.5 text-xs text-health-danger hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-[280px] flex-shrink-0 h-full">
        {sidebarContent}
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-[280px] h-full animate-slide-in-left">
            {sidebarContent}
          </div>
          <div className="flex-1 bg-black/50" onClick={onClose} />
        </div>
      )}
    </>
  );
}
