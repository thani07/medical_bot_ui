import { useApp } from '../context/AppContext';

const colors = {
  dark: {
    error: 'border-health-danger bg-red-900/40 text-red-100',
    success: 'border-health-success bg-emerald-900/40 text-emerald-100',
    info: 'border-accent-purple bg-purple-900/40 text-purple-100',
  },
  light: {
    error: 'border-health-danger bg-red-50 text-red-800',
    success: 'border-health-success bg-emerald-50 text-emerald-800',
    info: 'border-accent-purple bg-purple-50 text-purple-800',
  }
};

export default function Toasts() {
  const { toasts, removeToast, theme } = useApp();
  if (!toasts.length) return null;

  const isLight = theme === 'light';
  const currentColors = isLight ? colors.light : colors.dark;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`animate-slide-up border-l-4 rounded-lg px-4 py-3 min-w-[280px] max-w-sm shadow-xl
            flex items-center justify-between transition-colors duration-300 ${currentColors[t.type]}`}
        >
          <span className="text-sm font-medium font-body">{t.message}</span>
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
