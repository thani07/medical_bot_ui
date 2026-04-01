import { useApp } from '../context/AppContext';

interface Props {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export default function FollowUpChips({ suggestions, onSelect }: Props) {
  const { theme } = useApp();
  if (!suggestions.length) return null;

  const isLight = theme === 'light';

  return (
    <div className="flex flex-wrap gap-2 pl-9 mt-1">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s)}
          className={`border rounded-full px-3.5 py-1.5 text-xs transition-all duration-200 hover:scale-105 animate-slide-up
            ${isLight
              ? 'border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 hover:border-violet-400'
              : 'border-accent-purple/50 text-accent-purple bg-accent-purple/[0.08] hover:bg-accent-purple/20 hover:border-accent-purple'
            }`}
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
