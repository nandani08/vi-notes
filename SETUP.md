# Vi-Notes Paste Detection - Setup Guide

## Project Structure
```
vi-notes/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Editor.tsx          # Main editor with paste detection
│   │   ├── hooks/
│   │   │   └── usePasteDetection.ts # Paste detection logic
│   │   ├── styles/
│   │   │   └── editor.css          # Editor styling
│   │   ├── App.tsx                 # Main app component
│   │   ├── App.css                 # App styling
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── index.html                  # HTML entry
│   ├── package.json                # Dependencies
│   ├── tsconfig.json               # TypeScript config
│   ├── vite.config.ts              # Vite configuration
│   └── tsconfig.node.json
│
├── server/                          # Node.js Backend
│   ├── src/
│   │   ├── models/
│   │   │   └── index.ts            # MongoDB schemas
│   │   ├── routes/
│   │   │   └── writingSessions.ts  # API endpoints
│   │   └── server.ts               # Express server
│   ├── package.json                # Dependencies
│   ├── tsconfig.json               # TypeScript config
│   └── .env.example                # Environment template
│
├── README.md                        # Project overview
├── LICENSE                          # MIT License
└── PASTE_DETECTION.md              # Feature documentation
```

## Prerequisites
- Node.js 16+ and npm/yarn
- MongoDB (local or Atlas)
- Git

## Installation

### 1. Clone/Setup Repository
```bash
cd "vi-notes"
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Copy environment variables
cp .env.example .env

# Edit .env and set MongoDB connection
# MONGODB_URI=mongodb://localhost:27017/vi-notes

# Install dependencies
npm install

# For development with auto-reload
npm run dev

# Production build
npm run build
npm start
```

### 3. Frontend Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Development server (port 3000)
npm run dev

# Production build
npm run build
```

## Running the Application

### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```
Server runs on: `http://localhost:5000`

### Terminal 2 - Frontend Server
```bash
cd client
npm run dev
```
Frontend runs on: `http://localhost:3000`

## Verify Installation

### Check Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Vi-Notes server is running",
  "timestamp": "2024-04-07T21:30:00.000Z"
}
```

### Check MongoDB Connection
The backend should log: `✅ Connected to MongoDB`

## Features Implemented

### Paste Detection ✓
- Real-time paste event capture
- Paste position tracking (line, column)
- Paste content size recording
- Visual feedback to user
- Backend persistence

### Session Management ✓
- Unique session IDs
- Session start/end tracking
- Paste event aggregation
- Session analytics

### Analysis ✓
- Human vs AI scoring
- Paste percentage calculation
- Suspicious pattern detection
- Confidence scoring (0-100)

### API Endpoints ✓
- `POST /api/writing-sessions/start` - Start new session
- `POST /api/writing-sessions/paste-event` - Record paste
- `GET /api/writing-sessions/:sessionId/paste-events` - Get pastes
- `POST /api/writing-sessions/:sessionId/end` - End session
- `GET /api/writing-sessions/:sessionId/report` - Get report

## MongoDB Local Setup

### Install MongoDB
- **Windows**: Download from https://www.mongodb.com/try/download/community
- **macOS**: `brew install mongodb-community`
- **Linux**: `sudo apt-get install mongodb`

### Start MongoDB
```bash
# Windows
mongod --dbpath "C:\data\db"

# macOS/Linux
mongod
```

## MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and free cluster
3. Get connection string
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vi-notes
   ```

## Testing Paste Detection

1. Open http://localhost:3000 in browser
2. Click in the editor textarea
3. Copy some text: `Hello, this is pasted content!`
4. Paste with Ctrl+V (or Cmd+V on Mac)
5. Observe:
   - Green notification: "✓ Paste detected and recorded"
   - Paste counter updates
   - Details show in footer

## API Testing with cURL

### Start a session
```bash
curl -X POST http://localhost:5000/api/writing-sessions/start \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test_session_1"}'
```

### Record a paste
```bash
curl -X POST http://localhost:5000/api/writing-sessions/paste-event \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId":"test_session_1",
    "textLength":50,
    "content":"This is pasted text",
    "timestamp":'$(date +%s000)',
    "position":{"line":0,"column":0}
  }'
```

### Get paste events
```bash
curl http://localhost:5000/api/writing-sessions/test_session_1/paste-events
```

### End session and analyze
```bash
curl -X POST http://localhost:5000/api/writing-sessions/test_session_1/end \
  -H "Content-Type: application/json" \
  -d '{"totalWords":100}'
```

### Get session report
```bash
curl http://localhost:5000/api/writing-sessions/test_session_1/report
```

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### MongoDB connection error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify firewall isn't blocking connection

### CORS errors
- Check backend CORS configuration
- Ensure frontend and backend URLs match
- Verify API proxy in Vite config

### Paste events not recording
- Check browser console for errors
- Verify backend is running
- Check network tab for failed API calls
- Ensure MongoDB has write permissions

## Environment Variables Reference

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vi-notes
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
ENABLE_PASTE_DETECTION=true
MIN_PASTE_LENGTH=10
PASTE_ANALYSIS_THRESHOLD=0.5
```

## Development Tips

1. **Hot Reload**: Both client and server have hot reload enabled
2. **TypeScript**: All code is TypeScript for type safety
3. **CORS**: Configured to allow localhost connections
4. **Logging**: Console logs in backend show all paste events
5. **Database**: MongoDB indexes optimize paste event queries

## Performance Notes

- Paste events sent asynchronously (non-blocking)
- Database queries indexed on sessionId
- Client-side state limited to current session
- Server-side cleanup removes old sessions

## Next Steps

1. Deploy to production (Vercel for frontend, Heroku/Railway for backend)
2. Set up MongoDB Atlas for cloud database
3. Implement authentication/user accounts
4. Add more NLP analysis
5. Create admin dashboard for report viewing
6. Implement data export functionality

## Support

For issues or feature requests:
1. Check PASTE_DETECTION.md documentation
2. Review API endpoint responses
3. Check browser console and server logs
4. Verify all environment variables are set correctly

---

**Last Updated:** April 7, 2026
**Status:** Ready for Development
