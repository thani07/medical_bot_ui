import { useState } from 'react';
import Modal from './Modal';
import { getHealthSummary } from '../api/client';
import type { HealthSummary } from '../types';
import { useApp } from '../context/AppContext';

interface Props {
  sessionId: string;
  open: boolean;
  onClose: () => void;
}

export default function HealthSummaryModal({ sessionId, open, onClose }: Props) {
  const [data, setData] = useState<HealthSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useApp();

  const load = async () => {
    setLoading(true);
    try {
      const result = await getHealthSummary(sessionId);
      setData(result);
    } catch (e: any) {
      addToast(e.message || 'Failed to load summary', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (open && !data && !loading) load();

  const handleClose = () => {
    setData(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="📋 Health Summary">
      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-2 border-health-success border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-sm text-slate-400">Generating summary...</span>
        </div>
      )}

      {data && (
        <div className="space-y-5">
          {/* Summary paragraph */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Summary</p>
            <p className="text-sm text-slate-200 leading-relaxed bg-dark-700 rounded-lg px-4 py-3 border border-dark-500">
              {data.summary}
            </p>
          </div>

          {/* Key symptoms */}
          {data.key_symptoms.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Key symptoms</p>
              <div className="flex flex-wrap gap-2">
                {data.key_symptoms.map((s, i) => (
                  <span key={i} className="bg-accent-purple/15 text-accent-purple border border-accent-purple/30 rounded-full px-3 py-1 text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {data.recommendations.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Recommendations</p>
              <div className="space-y-2">
                {data.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5">
                    <span className="text-health-success text-sm mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-sm text-slate-300">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
