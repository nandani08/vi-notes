# Vi-Notes - Authorship Verification Platform

**Vi-Notes** is an authenticity verification platform designed to distinguish genuine human-written content from AI-generated or AI-assisted text. The system analyzes **writing behavior** alongside **statistical and linguistic characteristics** of the text to establish reliable authorship verification.

## 🎯 New Feature: Paste Detection

This fork now includes **Paste Detection** - a critical component that identifies and records when users paste text into the editor. This helps differentiate pasted content from naturally typed content in authenticity analysis.

### Paste Detection Capabilities
- ✅ Real-time paste event detection and recording
- ✅ Paste position tracking (line and column)
- ✅ Content size metric collection  
- ✅ Visual user feedback
- ✅ Backend persistent storage
- ✅ Session-based analysis
- ✅ Pasted vs. typed content percentage calculation
- ✅ Suspicious pattern detection

## Core Idea

Human writing naturally includes:
- **Variable typing speeds** - Typing speed varies based on cognitive load
- **Pauses during thinking** - Natural hesitations before sentences
- **Revisions during idea formation** - Corrections and refinements
- **Irregular sentence structures** - Natural variation in composition
- **Relationship between content complexity and editing frequency** - Complex ideas edited more

**Pasted text lacks these behavioral signatures**, making it easily detectable through paste monitoring and behavioral analysis.

## Key Features

### 📝 Writing Session Monitoring
- Capture keystroke timing metadata (not raw key content)
- Track pauses, deletions, edits, and writing flow
- **Detect pasted or externally inserted text blocks**
- Monitor natural vs. artificial writing patterns

### 🔍 Behavioral Pattern Analysis
- Pause distribution before sentences and paragraphs
- Typing speed variance
- Revision frequency relative to text complexity
- Micro-pauses around punctuation and structural boundaries
- **Paste frequency and timing analysis**

### 📊 Textual Statistical Analysis
- Sentence length variation
- Vocabulary diversity metrics
- Consistency checking
- **Paste content correlation with surrounding typed text**

### 🔐 Session Reporting
- Authenticity confidence scores
- Suspicious pattern detection
- **Pasted content percentage breakdown**
- Supporting evidence and data visualization

## Project Structure

```
vi-notes/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Editor.tsx    # ✨ Paste Detection UI
│   │   ├── hooks/
│   │   │   └── usePasteDetection.ts  # 🔍 Paste Detection Logic
│   │   └── styles/
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── src/
│   │   ├── models/          # 💾 MongoDB Schemas
│   │   ├── routes/          # 📡 API Endpoints
│   │   └── server.ts        # 🚀 Express Server
│   └── package.json
│
├── PASTE_DETECTION.md        # 📖 Feature Documentation
├── SETUP.md                  # ⚙️ Installation Guide
└── README.md                 # This file
```

## Technologies Used

### Frontend
- **React 18** - UI component framework
- **TypeScript** - Type-safe development
- **Vite** - Next-generation bundler
- **Electron** - Native desktop apps (planned)

### Backend
- **Node.js + Express.js** - REST API server
- **MongoDB** - Document database for sessions and paste events
- **Mongoose** - Object data modeling

### Analysis
- **ML Models** (TensorFlow, PyTorch) - Behavioral pattern recognition
- **NLP Models** - Statistical signature analysis
- **Anomaly Detection** - Suspicious pattern identification

### Infrastructure
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **MongoDB Atlas** - Cloud database (optional)

## Getting Started

### Quick Start
```bash
# Clone repository
cd vi-notes

# Windows
./setup.ps1

# Mac/Linux
./setup.sh
```

### Manual Setup

#### Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev  # Runs on http://localhost:5000
```

#### Frontend
```bash
cd client
npm install
npm run dev  # Runs on http://localhost:3000
```

### Verify Installation
```bash
# Check backend health
curl http://localhost:5000/health
```

## API Documentation

### Session Management
```bash
# Start session
POST /api/writing-sessions/start

# Record paste
POST /api/writing-sessions/paste-event

# Get pastes
GET /api/writing-sessions/:sessionId/paste-events

# End session
POST /api/writing-sessions/:sessionId/end

# Get report
GET /api/writing-sessions/:sessionId/report
```

See [PASTE_DETECTION.md](./PASTE_DETECTION.md) for detailed API documentation.

## How It Works

### Paste Detection Flow
1. **User pastes text** → `onPaste` event triggered
2. **Hook captures data** → Position, content size, timestamp
3. **Visual feedback** → Green notification shown
4. **Async upload** → Data sent to backend
5. **Storage** → MongoDB stores paste event
6. **Analysis** → Session updated with paste percentage
7. **Report** → Authenticity score reflects paste patterns

### Authenticity Scoring
```
Human Score = 100 - (Paste Count × 5) - (Paste % × 0.5)
Suspicious = Paste Count > 5 OR Paste % > 50
Confidence = Authenticity Score (0-100)
```

## Features by Component

### Frontend (`client/src`)
- ✨ Real-time paste detection
- 🎨 Dark-themed editor interface
- 📊 Live paste statistics display
- 📋 Paste event history
- ⌚ Cursor position tracking
- 🔔 Visual paste notifications

### Backend (`server/src`)
- 🚀 Express REST API
- 📝 Paste event models
- 🔐 Session management
- 📊 Analysis calculations
- 💾 MongoDB integration
- 📤 Report generation

## Database Schema

### PasteEvent
```javascript
{
  pasteId: String,
  sessionId: String,
  timestamp: Number,
  textLength: Number,
  content: String,
  position: { line: Number, column: Number }
}
```

### WritingSession
```javascript
{
  sessionId: String,
  startTime: Number,
  endTime: Number,
  totalPastes: Number,
  analysis: {
    humanScore: Number,
    aiScore: Number,
    pastedContentPercentage: Number,
    typedContentPercentage: Number,
    suspiciousPatterns: [String]
  }
}
```

## Configuration

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vi-notes
NODE_ENV=development
ENABLE_PASTE_DETECTION=true
MIN_PASTE_LENGTH=10
PASTE_ANALYSIS_THRESHOLD=0.5
```

## Privacy & Security

- 🔒 Content encrypted at rest
- 🔐 Session-level authorization
- 📋 GDPR-compliant data handling
- 🗑️ Automatic data retention cleanup
- 📝 Full audit logging

## Development

### Run in Development Mode
```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm run dev
```

### Build for Production
```bash
# Backend
cd server && npm run build

# Frontend
cd client && npm run build
```

## Project Goals

✅ **Phase 1 (Current)**
- Paste detection implementation
- Core feature validation
- API endpoints

🔄 **Phase 2 (Upcoming)**
- Advanced ML models
- Real-time analysis
- User authentication
- Report dashboard

🚀 **Phase 3 (Future)**
- Electron desktop app
- Browser extension
- Multi-language support
- Enterprise features

## Roadmap

- [x] Paste detection hook
- [x] Editor component integration
- [x] Backend API endpoints
- [x] MongoDB schema design
- [x] Session management
- [x] Analysis calculations
- [ ] Machine learning models
- [ ] User dashboard
- [ ] Report export (PDF/JSON)
- [ ] Real-time notifications
- [ ] Admin panel
- [ ] Authentication system
- [ ] Bulk analysis API

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Ensure MongoDB is running or update `.env` with Atlas URI |
| Port already in use | Kill process on port 5000 or change PORT in `.env` |
| CORS errors | Check backend CORS config, verify URLs match |
| Paste not recording | Check browser console, verify backend is running |

See [SETUP.md](./SETUP.md) for detailed troubleshooting.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/paste-detection`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push to branch (`git push origin feature/paste-detection`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## Documentation

- 📖 [Paste Detection Documentation](./PASTE_DETECTION.md) - Detailed feature guide
- ⚙️ [Setup Guide](./SETUP.md) - Installation and configuration
- 🔌 [API Reference](./PASTE_DETECTION.md#api-endpoints) - API endpoint documentation

## Support & Issues

- 📋 Report bugs: GitHub Issues
- 💬 Discuss features: GitHub Discussions
- 📧 Contact: [project email]

## Acknowledgments

Built with ❤️ for educational and professional integrity.

---

**Last Updated:** April 7, 2026  
**Version:** 1.0.0 (Paste Detection Alpha)  
**Status:** 🟢 Ready for Testing
