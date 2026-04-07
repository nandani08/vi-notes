# File Structure & Quick Reference

## 📁 Complete File Tree

```
vi-notes/
│
├── 📄 Configuration & Documentation
│   ├── README.md                          # Original project overview
│   ├── README-NEW.md                      # Updated with paste detection
│   ├── LICENSE                            # MIT License
│   ├── .gitignore                         # Git ignore rules
│   │
│   ├── 📋 Documentation (READ THESE)
│   ├── IMPLEMENTATION_SUMMARY.md          # What was built (overview)
│   ├── SETUP.md                           # Installation guide ⭐ START HERE
│   ├── PASTE_DETECTION.md                 # Feature documentation (detailed)
│   │
│   └── 🚀 Setup Scripts
│       ├── setup.sh                       # Mac/Linux setup
│       └── setup.ps1                      # Windows setup
│
├── 📁 client/                             # Frontend (React + Vite)
│   │
│   ├── 📄 Configuration Files
│   ├── package.json                       # Dependencies & scripts
│   ├── tsconfig.json                      # TypeScript config
│   ├── tsconfig.node.json                 # Vite TypeScript config
│   ├── vite.config.ts                     # Vite bundler config
│   ├── index.html                         # HTML entry point
│   │
│   └── 📁 src/                            # Source Code
│       ├── main.tsx                       # React entry point
│       ├── App.tsx                        # Main app component
│       ├── App.css                        # App styling
│       ├── index.css                      # Global styles
│       │
│       ├── 📁 components/
│       │   └── Editor.tsx                 # ✨ Main editor with paste UI
│       │
│       ├── 📁 hooks/
│       │   └── usePasteDetection.ts       # 🔍 Paste detection logic
│       │
│       ├── 📁 styles/
│       │   └── editor.css                 # Editor dark theme
│       │
│       └── 📁 utils/
│           └── pasteDetectionUtils.ts     # 🛠️ Helper functions
│
├── 📁 server/                             # Backend (Node.js + Express)
│   │
│   ├── 📄 Configuration Files
│   ├── package.json                       # Dependencies & scripts
│   ├── tsconfig.json                      # TypeScript config
│   ├── .env.example                       # Environment template
│   │
│   └── 📁 src/                            # Source Code
│       ├── server.ts                      # 🚀 Express server setup
│       │
│       ├── 📁 models/
│       │   └── index.ts                   # 💾 MongoDB schemas
│       │       ├── PasteEvent
│       │       ├── WritingSession
│       │       └── KeystrokeData
│       │
│       └── 📁 routes/
│           └── writingSessions.ts         # 📡 API endpoints
│               ├── POST /start
│               ├── POST /paste-event
│               ├── GET /paste-events
│               ├── POST /end
│               └── GET /report
│
└── [git files]                            # .git/, .gitignore
```

## 📖 File Descriptions

### 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | NPM dependencies & scripts |
| `tsconfig.json` | TypeScript compiler options |
| `vite.config.ts` | Frontend bundler config |
| `.env.example` | Template for environment vars |
| `.gitignore` | Files to exclude from git |

### 📝 Documentation Files

| File | Read When | Key Sections |
|------|-----------|--------------|
| **SETUP.md** ⭐ | Starting the project | Prerequisites, Installation, Verify, Troubleshooting |
| **PASTE_DETECTION.md** | Understanding the feature | Architecture, API, Database, Analysis Algorithm |
| **IMPLEMENTATION_SUMMARY.md** | Overview of what was built | What Was Created, Key Features, How It Works |
| **README-NEW.md** | Project overview | Paste Detection feature, Architecture, Getting Started |

### 🎨 Frontend Files

#### Entry Points
| File | Purpose |
|------|---------|
| `index.html` | HTML page structure |
| `main.tsx` | React entry point |
| `App.tsx` | Main app component |

#### Components
| File | Purpose | Key Props |
|------|---------|-----------|
| `Editor.tsx` | Editor UI with paste detection | `sessionId`, `onPasteDetected` |

#### Hooks
| File | Purpose | Returns |
|------|---------|---------|
| `usePasteDetection.ts` | Manages paste events in session | `pasteEvents`, `recordPaste`, `getPasteEvents` |

#### Utilities
| File | Purpose | Exports |
|------|---------|---------|
| `pasteDetectionUtils.ts` | Helper functions | `generateSessionId`, `formatBytes`, `calculateWritingStats`, `createAuthenticityReport` |

#### Styling
| File | Purpose |
|------|---------|
| `App.css` | App layout & session info |
| `editor.css` | Editor & paste UI styling |
| `index.css` | Global styles |

### 🚀 Backend Files

#### Entry Point
| File | Purpose |
|------|---------|
| `server.ts` | Express app setup, middleware, routes |

#### Database Models
| File | Models | Collections |
|------|--------|-------------|
| `models/index.ts` | PasteEvent, WritingSession, KeystrokeData | 3 MongoDB collections |

#### API Routes
| File | Endpoints | Functions |
|------|-----------|-----------|
| `routes/writingSessions.ts` | 5 REST endpoints | Create, record, query, analyze |

---

## 🔄 Data Flow

### How Paste Detection Works

```
USER ACTION
    ↓
[Ctrl+V] Paste
    ↓
Editor.tsx <onPaste> event
    ↓
usePasteDetection.recordPaste()
    ↓
Create PasteEvent object
    ↓
Show UI notification (green banner)
    ↓
Async send to backend
    ↓
Backend: writingSessions.ts <POST /paste-event>
    ↓
Save to MongoDB (PasteEvent collection)
    ↓
Update WritingSession (increment totalPastes)
    ↓
Frontend: Update local state
    ↓
Display in footer statistics
```

---

## 🚀 Running the Application

### Start Backend
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend
```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### Expected Console Output

**Backend:**
```
╔══════════════════════════════════════════╗
║        🎯 Vi-Notes Server Running        ║
╚══════════════════════════════════════════╝
📝 API Server: http://localhost:5000
💾 Database: mongodb://localhost:27017/vi-notes
🔍 Paste Detection: ACTIVE
📊 Analytics: ENABLED
```

**Frontend:**
```
VITE v4.x.x ready in 123 ms

➜  Local:   http://localhost:3000/
```

---

## 📡 API Endpoints Reference

### Start Session
```
POST /api/writing-sessions/start
Body: { "sessionId": "session_1712527200000_abc123def" }
Response: { session: WritingSession }
```

### Record Paste Event
```
POST /api/writing-sessions/paste-event
Body: { 
  "sessionId": "session_...",
  "timestamp": 1712527205123,
  "textLength": 456,
  "content": "pasted text",
  "position": { "line": 5, "column": 23 }
}
Response: { pasteEvent: PasteEvent, session: WritingSession }
```

### Get Paste Events
```
GET /api/writing-sessions/:sessionId/paste-events
Response: { sessionId: "...", totalPastes: 5, pasteEvents: [...] }
```

### End Session & Analyze
```
POST /api/writing-sessions/:sessionId/end
Body: { "totalWords": 1250 }
Response: {
  session: WritingSession,
  analysis: {
    humanScore: 85,
    aiScore: 15,
    pastedPercentage: 24.5,
    suspiciousPatterns: []
  }
}
```

### Get Report
```
GET /api/writing-sessions/:sessionId/report
Response: {
  session: WritingSession,
  pasteEventsCount: 3,
  report: { confidenceScore: 85, analysis: {...} }
}
```

---

## 🛠️ Key Technologies

| Layer | Technology | File |
|-------|-----------|------|
| Frontend | React 18 + TypeScript + Vite | `client/src/` |
| Backend | Node.js + Express + TypeScript | `server/src/server.ts` |
| Database | MongoDB + Mongoose | `server/src/models/index.ts` |
| API | REST (Express.js) | `server/src/routes/writingSessions.ts` |
| Real-time UI | React Hooks | `client/src/hooks/usePasteDetection.ts` |

---

## 🎯 Component Relationships

```
Frontend
├── App.tsx
│   └── Editor.tsx
│       ├── usePasteDetection() Hook
│       │   └── recordPaste() → Backend
│       └── UI Components
│           ├── Textarea
│           ├── Header (stats)
│           ├── Notification
│           └── Footer (paste history)

Backend
├── server.ts (Express setup)
├── writingSessions.ts (Routes)
│   ├── POST /start → Create WritingSession
│   ├── POST /paste-event → Save PasteEvent + Update WritingSession
│   ├── GET /paste-events → Query PasteEvents
│   ├── POST /end → Calculate Analysis
│   └── GET /report → Return Analysis
└── models/index.ts (Schemas)
    ├── PasteEvent
    ├── WritingSession
    └── KeystrokeData
```

---

## 💾 Database Schema Summary

### PasteEvent
```javascript
{
  _id: ObjectId,
  pasteId: String,              // Unique ID
  sessionId: String,            // Reference
  timestamp: Number,            // When it happened
  textLength: Number,           // Size
  content: String,              // The text
  position: { line, column },   // Where inserted
  createdAt: Date              // Record time
}
```

### WritingSession
```javascript
{
  _id: ObjectId,
  sessionId: String,            // Unique
  startTime: Number,            // Begin
  endTime: Number,              // End
  totalPastes: Number,          // Count
  pasteEvents: [String],        // Paste IDs
  totalWordsWritten: Number,    // Stats
  confidenceScore: Number,      // 0-100
  analysis: {                   // Results
    humanScore,
    aiScore,
    pastedContentPercentage,
    typedContentPercentage,
    suspiciousPatterns
  },
  createdAt: Date,              // When created
  updatedAt: Date              // Last modified
}
```

---

## ✅ Implementation Checklist

- [x] Frontend React component with editor
- [x] Paste event detection (`onPaste` handler)
- [x] Custom React hook for paste management
- [x] Real-time UI feedback (notifications)
- [x] Paste statistics display
- [x] Backend Express server
- [x] MongoDB schemas (Mongoose)
- [x] 5 REST API endpoints
- [x] Session management
- [x] Authenticity analysis calculations
- [x] Error handling
- [x] Documentation (3 docs)
- [x] Setup scripts (bash + PowerShell)
- [x] Environment configuration
- [x] TypeScript throughout
- [x] Type-safe interfaces/schemas

---

## 🎓 How to Use This Structure

### For Development
1. **Edit frontend:** Modify files in `client/src/`
2. **Edit backend:** Modify files in `server/src/`
3. **Add features:** Follow existing patterns
4. **Test:** Use cURL or browser console

### For Understanding
1. **Flow:** Read `IMPLEMENTATION_SUMMARY.md`
2. **Setup:** Read `SETUP.md`
3. **Details:** Read `PASTE_DETECTION.md`
4. **Code:** Start with `Editor.tsx` → `usePasteDetection.ts`

### For Deployment
1. Build frontend: `cd client && npm run build`
2. Build backend: `cd server && npm run build`
3. Deploy to hosting
4. Configure `.env` on server
5. Connect to cloud MongoDB

---

**Last Updated:** April 7, 2026  
**Status:** ✅ Complete & Ready to Use
