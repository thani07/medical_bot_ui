import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../types';
import { relativeTime, formatTimestamp } from '../utils/dateUtils';

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const [showTime, setShowTime] = useState(false);
  const isUser = message.role === 'user';
  const isVoice = message.message_type === 'voice';

  return (
    <div
      className={`flex animate-slide-up ${isUser ? 'justify-end' : 'items-start gap-2'}`}
      onMouseEnter={() => setShowTime(true)}
      onMouseLeave={() => setShowTime(false)}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-dark-700 border border-dark-500 flex items-center justify-center text-xs flex-shrink-0 mt-1">
          ✚
        </div>
      )}

      <div className={`max-w-[75%] relative group ${isUser ? '' : ''}`}>
        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed
            ${isUser
              ? 'bg-gradient-to-br from-accent-fuchsia to-accent-violet text-white'
              : 'bg-dark-600 border border-dark-500 text-slate-200'
            }`}
        >
          {/* Voice badge */}
          {isVoice && isUser && (
            <span className="inline-block bg-white/20 rounded px-1.5 py-0.5 text-[10px] mr-1.5 mb-0.5 align-middle">
              🎤 voice
            </span>
          )}
          {isVoice && !isUser && (
            <span className="inline-block bg-accent-purple/20 rounded px-1.5 py-0.5 text-[10px] text-accent-purple mr-1.5 mb-0.5 align-middle">
              🎤
            </span>
          )}

          {/* Content with markdown */}
          <div className="chat-markdown">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        {/* Timestamp on hover */}
        {showTime && (
          <div
            className={`absolute -bottom-5 text-[10px] text-slate-500 whitespace-nowrap animate-fade-in
              ${isUser ? 'right-0' : 'left-0'}`}
          >
            {formatTimestamp(message.created_at)} · {relativeTime(message.created_at)}
          </div>
        )}
      </div>
    </div>
  );
}
