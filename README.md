# Health Awareness Chatbot — Frontend

A premium dark-mode AI medical chatbot frontend built with React, TypeScript, and Tailwind CSS.

## Features

- **Text & Voice Chat** — Type or speak your health questions
- **Conversation History** — Sidebar with all past sessions grouped by date
- **Voice Recording** — MediaRecorder + live Speech-to-Text preview + waveform visualizer
- **AI Symptom Analysis** — Extracts symptoms, conditions, severity from conversation
- **AI Health Summary** — Generates consultation summary with recommendations
- **PDF Export** — Download conversation as a formatted medical report
- **Follow-up Suggestions** — Smart AI-generated question chips after each reply
- **Session Management** — Create, rename, archive, delete chat sessions
- **Responsive Design** — Desktop two-column layout, mobile drawer sidebar
- **Dark Theme** — Premium dark UI with purple/fuchsia gradient accents

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS (custom dark theme)
- TanStack React Query
- React Router DOM
- jsPDF (PDF export)
- Web Speech API (live voice preview)
- MediaRecorder API (audio capture)
- Web Audio API (waveform visualizer)

## Backend API

This frontend connects to a FastAPI backend deployed at:
```
https://medi-bot-zk5j.onrender.com
```

### API Endpoints Used

| Method | Endpoint                       | Purpose                    |
|--------|--------------------------------|----------------------------|
| GET    | /health                        | API health check           |
| POST   | /new_session                   | Create new chat session    |
| GET    | /sessions                      | List all sessions          |
| GET    | /messages/{session_id}         | Load chat messages         |
| POST   | /send_message                  | Send text message          |
| POST   | /send_voice                    | Send voice (multipart)     |
| GET    | /suggestions/{session_id}      | Follow-up questions        |
| GET    | /symptoms/{session_id}         | AI symptom analysis        |
| GET    | /health_summary/{session_id}   | AI health summary          |
| GET    | /export/{session_id}           | Export conversation JSON   |
| PUT    | /session/{id}/title?title=X    | Rename session             |
| PUT    | /session/{id}/archive          | Archive session            |
| DELETE | /session/{id}                  | Delete session             |

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

The app will open at **http://localhost:3000**

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` folder — deploy this to Vercel, Netlify, or any static host.

## Environment Variables

Create a `.env` file in the project root (already included):

```env
VITE_API_BASE_URL=https://medi-bot-zk5j.onrender.com
```

Change this URL if your backend is deployed elsewhere.

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

When prompted:
- Framework: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Add environment variable: `VITE_API_BASE_URL` = your backend URL

## Deploy to Netlify

```bash
npm run build
```

Then drag the `dist/` folder to Netlify's deploy page, or connect your Git repo.

Add env var in Netlify dashboard:
- `VITE_API_BASE_URL` = `https://medi-bot-zk5j.onrender.com`

## Project Structure

```
src/
├── api/
│   └── client.ts           # All API endpoint functions
├── components/
│   ├── AnimatedBackground   # Floating gradient blobs
│   ├── ChatArea             # Main chat view with messages
│   ├── ChatInput            # Text input + mic + send button
│   ├── DeleteConfirmModal   # Confirm session deletion
│   ├── FollowUpChips        # Clickable suggestion pills
│   ├── HealthSummaryModal   # AI health summary panel
│   ├── MessageBubble        # Chat message with markdown
│   ├── Modal                # Generic modal wrapper
│   ├── Sidebar              # Session list + new chat
│   ├── SymptomModal         # AI symptom analysis panel
│   ├── Toast                # Toast notifications
│   ├── TopBar               # Session title + action buttons
│   ├── TypingIndicator      # Bouncing dots
│   ├── VoiceRecorder        # Voice recording overlay
│   └── WelcomeScreen        # Landing page with quick-start
├── context/
│   └── AppContext.tsx        # Global state (sidebar, toasts)
├── hooks/
│   └── useVoiceRecorder.ts  # Voice recording logic
├── types/
│   └── index.ts             # TypeScript interfaces
├── utils/
│   ├── dateUtils.ts         # Date formatting & grouping
│   └── exportPdf.ts         # PDF generation with jsPDF
├── App.tsx                   # Root component with routing
├── main.tsx                  # React entry point
└── index.css                 # Global styles + Tailwind
```

## How Voice Input Works

1. User clicks the 🎤 mic button
2. Browser requests microphone permission
3. `MediaRecorder` starts capturing audio (webm/mp4)
4. `Web Speech API` provides live text preview (browser-side, for visual feedback only)
5. `Web Audio API AnalyserNode` drives the waveform visualizer bars
6. User clicks "Stop & Send"
7. Audio blob is uploaded to `POST /send_voice` as multipart form-data
8. Server transcribes with Azure Whisper (more accurate than browser Speech API)
9. Server's Whisper transcription replaces the live preview text
10. AI response and follow-up suggestions are shown

## Browser Compatibility

| Feature           | Chrome | Firefox | Safari | Edge |
|-------------------|--------|---------|--------|------|
| Text chat         | ✅     | ✅      | ✅     | ✅   |
| MediaRecorder     | ✅     | ✅      | ✅*    | ✅   |
| Web Speech API    | ✅     | ❌      | ✅     | ✅   |
| Waveform viz      | ✅     | ✅      | ✅     | ✅   |

*Safari uses audio/mp4 instead of audio/webm

If Web Speech API is unavailable (Firefox), the live preview won't show — but voice recording and Whisper transcription still work normally.
