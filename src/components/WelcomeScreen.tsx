interface Props {
  onQuickStart: (text: string) => void;
}

const quickCards = [
  { icon: '🤒', label: 'Check my symptoms', msg: 'I want to check my symptoms' },
  { icon: '💊', label: 'Ask about medications', msg: 'I have questions about medications' },
  { icon: '🥗', label: 'Nutrition advice', msg: 'Can you give me nutrition advice?' },
  { icon: '🏃', label: 'Exercise tips', msg: 'What exercise do you recommend for better health?' },
];

export default function WelcomeScreen({ onQuickStart }: Props) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-lg animate-fade-in">
        {/* Logo */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-violet to-accent-fuchsia flex items-center justify-center text-3xl mb-6 shadow-lg shadow-accent-purple/20">
          ✚
        </div>

        <h1 className="font-heading text-3xl font-bold text-white mb-2">
          Health Awareness Chatbot
        </h1>
        <p className="text-slate-400 mb-10 text-base">
          Your AI-powered health assistant — ask about symptoms, medications, nutrition, and more.
        </p>

        {/* Quick start cards */}
        <div className="grid grid-cols-2 gap-3">
          {quickCards.map((card, i) => (
            <button
              key={i}
              onClick={() => onQuickStart(card.msg)}
              className="bg-dark-700 border border-dark-500 rounded-xl p-4 text-left
                hover:border-accent-purple/50 hover:bg-dark-600 transition-all duration-200
                hover:scale-[1.03] group animate-slide-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="text-2xl block mb-2">{card.icon}</span>
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                {card.label}
              </span>
            </button>
          ))}
        </div>

        <p className="text-slate-600 text-xs mt-8">
          Type a message or use voice input to get started
        </p>
      </div>
    </div>
  );
}
