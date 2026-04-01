import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ChatInput from './ChatInput';

interface Props {
  onQuickStart: (text: string) => void;
}

const quickCards = [
  { icon: '🤒', label: 'Check my symptoms', msg: 'I want to check my symptoms' },
  { icon: '💊', label: 'Ask about medications', msg: 'I have questions about medications' },
  { icon: '🥗', label: 'Nutrition advice', msg: 'Can you give me nutrition advice?' },
  { icon: '🏃', label: 'Exercise tips', msg: 'What exercise do you recommend for better health?' },
];

function getGreeting(): { text: string; emoji: string; sub: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12)
    return { text: 'Good Morning', emoji: '🌅', sub: 'Start your day with a health check-in!' };
  if (hour >= 12 && hour < 17)
    return { text: 'Good Afternoon', emoji: '☀️', sub: 'How are you feeling this afternoon?' };
  if (hour >= 17 && hour < 21)
    return { text: 'Good Evening', emoji: '🌇', sub: 'Wind down and check in on your wellness.' };
  return { text: 'Good Night', emoji: '🌙', sub: 'Take care, rest well and stay healthy.' };
}

export default function WelcomeScreen({ onQuickStart }: Props) {
  const { theme } = useApp();
  const [greeting, setGreeting] = useState(getGreeting);

  // Update greeting every minute in case the hour rolls over
  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting()), 60_000);
    return () => clearInterval(id);
  }, []);

  const isLight = theme === 'light';

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pt-12 pb-8 px-6 scrollbar-v">
        <div className="max-w-lg mx-auto text-center animate-fade-in">
          {/* Greeting badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 animate-fade-in
            ${isLight
              ? 'bg-violet-100 text-violet-700 border border-violet-200'
              : 'bg-accent-purple/15 text-accent-purple border border-accent-purple/25'
            }`}>
            <span>{greeting.emoji}</span>
            <span>{greeting.text}</span>
          </div>

          {/* Logo */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-violet to-accent-fuchsia flex items-center justify-center text-3xl mb-5 shadow-lg shadow-accent-purple/20 text-white">
            ✚
          </div>

          <h1 className={`font-heading text-3xl font-bold mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>
            Health Awareness Chatbot
          </h1>
          <p className={`text-sm mb-1.5 font-medium ${isLight ? 'text-violet-600' : 'text-accent-purple/80'}`}>
            {greeting.sub}
          </p>
          <p className={`mb-10 text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Ask about symptoms, medications, nutrition, and more.
          </p>

          {/* Quick start cards */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {quickCards.map((card, i) => (
              <button
                key={i}
                onClick={() => onQuickStart(card.msg)}
                className={`rounded-xl p-4 text-left transition-all duration-200 hover:scale-[1.03] group animate-slide-up border
                  ${isLight
                    ? 'bg-white border-slate-200 hover:border-violet-400 hover:bg-violet-50 shadow-sm hover:shadow-md text-slate-600 group-hover:text-violet-700'
                    : 'bg-dark-700 border-dark-500 hover:border-accent-purple/50 hover:bg-dark-600 text-slate-300 group-hover:text-white'
                  }`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className="text-2xl block mb-2">{card.icon}</span>
                <span className="text-sm font-medium">{card.label}</span>
              </button>
            ))}
          </div>

          <p className={`text-xs ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
            Type a message or use voice input to get started
          </p>
        </div>
      </div>

      {/* Input Bar at the Bottom */}
      <div className="border-t border-transparent">
        <ChatInput
          onSendText={onQuickStart}
          onSendVoice={(_, text) => onQuickStart(text)}
          disabled={false}
        />
      </div>
    </div>
  );
}
