import { useState } from 'react';
import Modal from './Modal';
import { getSymptoms } from '../api/client';
import type { SymptomAnalysis } from '../types';
import { useApp } from '../context/AppContext';

const severityColors = {
  mild: 'bg-emerald-900/40 text-emerald-300 border-health-success',
  moderate: 'bg-amber-900/40 text-amber-300 border-health-warning',
  severe: 'bg-red-900/40 text-red-300 border-health-danger',
  unknown: 'bg-slate-800 text-slate-400 border-slate-600',
};

interface Props {
  sessionId: string;
  open: boolean;
  onClose: () => void;
}

export default function SymptomModal({ sessionId, open, onClose }: Props) {
  const [data, setData] = useState<SymptomAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useApp();

  const load = async () => {
    setLoading(true);
    try {
      const result = await getSymptoms(sessionId);
      setData(result);
    } catch (e: any) {
      addToast(e.message || 'Failed to load symptoms', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load on open
  if (open && !data && !loading) load();

  const handleClose = () => {
    setData(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="🔍 Symptom Analysis">
      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-sm text-slate-400">Analysing conversation...</span>
        </div>
      )}

      {data && (
        <div className="space-y-5">
          {/* Emergency alert */}
          {data.seek_emergency && (
            <div className="bg-red-900/30 border border-health-danger rounded-xl px-4 py-3 animate-pulse-red">
              <p className="text-health-danger font-semibold text-sm">
                ⚠️ Based on your symptoms, please seek emergency medical care immediately.
              </p>
            </div>
          )}

          {/* Severity */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Severity</p>
            <span className={`inline-block border rounded-full px-3 py-1 text-sm font-medium ${severityColors[data.severity]}`}>
              {data.severity.charAt(0).toUpperCase() + data.severity.slice(1)}
            </span>
          </div>

          {/* Symptoms */}
          {data.symptoms.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Symptoms identified</p>
              <div className="flex flex-wrap gap-2">
                {data.symptoms.map((s, i) => (
                  <span key={i} className="bg-accent-purple/15 text-accent-purple border border-accent-purple/30 rounded-full px-3 py-1 text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Possible conditions */}
          {data.possible_conditions.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Possible conditions</p>
              <div className="space-y-2">
                {data.possible_conditions.map((c, i) => (
                  <div key={i} className="bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm text-slate-300">
                    {c}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!data.symptoms.length && !data.possible_conditions.length && (
            <p className="text-sm text-slate-500 text-center py-4">
              No symptoms detected in this conversation yet. Keep chatting!
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
