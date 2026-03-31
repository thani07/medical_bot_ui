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
}

export default function TopBar({ sessionId, title, onOpenSymptoms, onOpenSummary, onToggleSidebar }: Props) {
  const [exporting, setExporting] = useState(false);
  const { addToast } = useApp();

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

  return (
    <div className="px-4 py-3 border-b border-dark-500 flex items-center justify-between bg-dark-900/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400
            hover:text-white hover:bg-dark-600 transition-colors"
        >
          ☰
        </button>
        <h2 className="font-heading font-semibold text-sm text-white truncate max-w-[200px]">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSymptoms}
          className="bg-dark-700 border border-dark-500 rounded-lg px-2.5 py-1.5 text-[11px]
            text-accent-purple hover:bg-accent-purple/10 hover:border-accent-purple/40 transition-all"
        >
          🔍 Symptoms
        </button>
        <button
          onClick={onOpenSummary}
          className="bg-dark-700 border border-dark-500 rounded-lg px-2.5 py-1.5 text-[11px]
            text-health-success hover:bg-emerald-900/20 hover:border-health-success/40 transition-all"
        >
          📋 Summary
        </button>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="bg-dark-700 border border-dark-500 rounded-lg px-2.5 py-1.5 text-[11px]
            text-accent-pink hover:bg-pink-900/20 hover:border-accent-pink/40 transition-all disabled:opacity-50"
        >
          {exporting ? (
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border border-accent-pink border-t-transparent rounded-full animate-spin" />
              Exporting...
            </span>
          ) : (
            '📥 Export PDF'
          )}
        </button>
      </div>
    </div>
  );
}
