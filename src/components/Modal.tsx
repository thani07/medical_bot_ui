import { type ReactNode } from 'react';
import { useApp } from '../context/AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: Props) {
  const { theme } = useApp();
  if (!open) return null;

  const isLight = theme === 'light';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`border rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up transition-colors duration-300
          ${isLight ? 'bg-white border-slate-200' : 'bg-dark-800 border-dark-500'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${isLight ? 'border-slate-100' : 'border-dark-500'}`}>
          <h2 className={`font-heading font-semibold text-base ${isLight ? 'text-slate-800' : 'text-white'}`}>{title}</h2>
          <button
            onClick={onClose}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-lg
              ${isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-dark-600'}`}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
