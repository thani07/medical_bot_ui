import { useApp } from '../context/AppContext';

const colors = {
  error: 'border-health-danger bg-red-900/40 text-red-200',
  success: 'border-health-success bg-emerald-900/40 text-emerald-200',
  info: 'border-accent-purple bg-purple-900/40 text-purple-200',
};

export default function Toasts() {
  const { toasts, removeToast } = useApp();
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`animate-slide-up border-l-4 rounded-lg px-4 py-3 min-w-[280px] max-w-sm shadow-lg
            flex items-center justify-between ${colors[t.type]}`}
        >
          <span className="text-sm font-body">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="ml-3 opacity-60 hover:opacity-100 text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
