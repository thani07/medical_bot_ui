export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 max-w-[75%] animate-fade-in">
      <div className="w-7 h-7 rounded-full bg-dark-700 border border-dark-500 flex items-center justify-center text-xs flex-shrink-0">
        ✚
      </div>
      <div className="bg-dark-600 border border-dark-500 rounded-xl px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-accent-purple animate-bounce-dot"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </div>
    </div>
  );
}
