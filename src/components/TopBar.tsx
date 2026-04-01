import { useState } from 'react';
import { getExport } from '../api/client';
import { exportToPdf } from '../utils/exportPdf';
import { useApp } from '../context/AppContext';

interface Props {
  sessionId: string;
  title: string;
  onOpenSymptoms: () => void;
  onOpenSummary: () => void;
  onToggleSidebar: () => void;
  onNewChat: () => void;
}

export default function TopBar({ sessionId, title, onOpenSymptoms, onOpenSummary, onToggleSidebar, onNewChat }: Props) {
  const [exporting, setExporting] = useState(false);
  const { addToast, theme, toggleTheme } = useApp();

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await getExport(sessionId);
      exportToPdf(data);
      addToast('PDF exported successfully', 'success');
    } catch (e: any) {
      addToast(e.message || 'Export failed', 'error');
    } finally {
      setExporting(false);
    }
  };

  const isLight = theme === 'light';

  return (
    <div className={`px-4 py-3 border-b flex items-center justify-between backdrop-blur-sm
      ${isLight
        ? 'border-slate-200 bg-white/80'
        : 'border-dark-500 bg-dark-900/80'
      }`}>
      <div className="flex items-center gap-2">
        {/* Mobile hamburger */}
        <button
          onClick={onToggleSidebar}
          className={`lg:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-colors
            ${isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-dark-600'}`}
        >
          ☰
        </button>

        {/* New Chat (+ icon) for mobile */}
        <button
          onClick={onNewChat}
          title="New Chat"
          className={`lg:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-lg
            ${isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-dark-600'}`}
        >
          +
        </button>

        <h2 className={`font-heading font-semibold text-sm truncate max-w-[120px] sm:max-w-[200px] ml-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all
            ${isLight
              ? 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 shadow-sm'
              : 'bg-dark-700 border border-dark-500 text-slate-300 hover:bg-dark-600 hover:text-white shadow-lg'
            }`}
        >
          {isLight ? '🌙' : '☀️'}
        </button>

        <button
          onClick={onOpenSymptoms}
          className={`border rounded-lg px-2 sm:px-2.5 py-1.5 text-[11px] transition-all flex items-center gap-1.5
            ${isLight
              ? 'bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100 shadow-sm'
              : 'bg-dark-700 border-dark-500 text-accent-purple hover:bg-accent-purple/10'
            }`}
        >
          <span>🔍</span> <span className="hidden md:inline-block">Symptoms</span>
        </button>
        <button
          onClick={onOpenSummary}
          className={`border rounded-lg px-2 sm:px-2.5 py-1.5 text-[11px] transition-all flex items-center gap-1.5
            ${isLight
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 shadow-sm'
              : 'bg-dark-700 border-dark-500 text-health-success hover:bg-emerald-900/20'
            }`}
        >
          <span>📋</span> <span className="hidden md:inline-block">Summary</span>
        </button>
        <button
          onClick={handleExport}
          disabled={exporting}
          className={`border rounded-lg px-2 sm:px-2.5 py-1.5 text-[11px] transition-all disabled:opacity-50 flex items-center gap-1.5
            ${isLight
              ? 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100 shadow-sm'
              : 'bg-dark-700 border-dark-500 text-accent-pink hover:bg-pink-900/20'
            }`}
        >
          {exporting ? (
            <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>📥</span>
          )}
          <span className="hidden md:inline-block">Export</span>
        </button>
      </div>
    </div>
  );
}
