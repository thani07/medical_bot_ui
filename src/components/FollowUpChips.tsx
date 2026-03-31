interface Props {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export default function FollowUpChips({ suggestions, onSelect }: Props) {
  if (!suggestions.length) return null;

  return (
    <div className="flex flex-wrap gap-2 pl-9 mt-1">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s)}
          className="border border-accent-purple/50 rounded-full px-3.5 py-1.5 text-xs
            text-accent-purple bg-accent-purple/[0.08] hover:bg-accent-purple/20
            hover:border-accent-purple transition-all duration-200
            hover:scale-105 animate-slide-up"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
