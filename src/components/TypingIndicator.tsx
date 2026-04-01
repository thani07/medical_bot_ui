import { useApp } from '../context/AppContext';

export default function TypingIndicator() {
  const { theme } = useApp();
  const isLight = theme === 'light';

  return (
    <div className="flex items-start gap-2 max-w-[75%] animate-fade-in">
      <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs flex-shrink-0
        ${isLight ? 'bg-white border-slate-200 text-slate-400' : 'bg-dark-700 border-dark-500 text-slate-300'}`}>
        ✚
      </div>
      <div className={`border rounded-xl px-4 py-3 flex items-center gap-1.5 transition-colors duration-300
        ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-dark-600 border-dark-500'}`}>
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-accent-purple animate-bounce-dot opacity-60"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </div>
    </div>
  );
}
