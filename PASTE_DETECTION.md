# Paste Detection Feature

## Overview
The Paste Detection feature is a critical component of Vi-Notes that identifies when users paste text into the editor instead of typing it manually. This helps differentiate pasted content from naturally typed content in the authenticity analysis.

## Architecture

### Frontend (React/Electron)
The frontend captures paste events in real-time using React's clipboard API:

1. **Event Capture**: Monitors `onPaste` events in the editor textarea
2. **Data Extraction**: Captures pasted text content and cursor position
3. **Metadata Recording**: Records timestamp, text length, and insertion position
4. **Visual Feedback**: Shows user feedback when paste is detected
5. **Backend Sync**: Sends paste data to backend for persistent storage

### Backend (Node.js/Express)
The backend processes and stores paste events:

1. **Event Storage**: Saves paste events to MongoDB
2. **Session Management**: Associates paste events with writing sessions
3. **Analysis**: Calculates statistics on pasted vs. typed content
4. **Report Generation**: Creates authenticity reports with paste data

## Implementation Details

### Frontend Components

#### `usePasteDetection` Hook
Located in `client/src/hooks/usePasteDetection.ts`

```typescript
const { pasteEvents, recordPaste, getPasteEvents } = usePasteDetection(sessionId);
```

**Features:**
- Tracks all paste events in the current session
- Sends paste data to backend asynchronously
- Maintains local state for UI updates

**Data Structure:**
```typescript
interface PasteEvent {
  id: string;                    // Unique paste identifier
  timestamp: number;             // Unix timestamp
  textLength: number;            // Bytes pasted
  content: string;               // Pasted content
  position: {
    line: number;                // Line number in editor
    column: number;              // Column position
  };
  sessionId: string;             // Associated session
}
```

#### `Editor` Component
Located in `client/src/components/Editor.tsx`

**Paste Handling:**
- Integrates `usePasteDetection` hook
- Displays paste notifications to user
- Shows paste event history in footer
- Tracks cursor position for accurate insertion point

**Visual Feedback:**
- Green notification appears when paste is detected
- Paste counter updates in header
- Recent pastes listed with timestamp and position

### Backend API Endpoints

#### 1. Start Writing Session
```
POST /api/writing-sessions/start
Content-Type: application/json

{
  "sessionId": "session_1712527200000_abc123def"
}

Response:
{
  "success": true,
  "message": "Writing session started",
  "data": {
    "_id": "...",
    "sessionId": "session_1712527200000_abc123def",
    "startTime": 1712527200000,
    "totalPastes": 0,
    "pasteEvents": []
  }
}
```

#### 2. Record Paste Event
```
POST /api/writing-sessions/paste-event
Content-Type: application/json

{
  "id": "paste_session_1712527200000_abc123def_0",
  "sessionId": "session_1712527200000_abc123def",
  "timestamp": 1712527205123,
  "textLength": 456,
  "content": "pasted text here",
  "position": {
    "line": 5,
    "column": 23
  }
}

Response:
{
  "success": true,
  "message": "Paste event recorded",
  "data": {
    "pasteEvent": { ... },
    "session": { ... }
  }
}
```

#### 3. Get Paste Events for Session
```
GET /api/writing-sessions/:sessionId/paste-events

Response:
{
  "success": true,
  "data": {
    "sessionId": "session_...",
    "totalPastes": 5,
    "pasteEvents": [ ... ]
  }
}
```

#### 4. End Session and Get Analysis
```
POST /api/writing-sessions/:sessionId/end
Content-Type: application/json

{
  "totalWords": 1250
}

Response:
{
  "success": true,
  "message": "Session ended and analyzed",
  "data": {
    "session": {
      "sessionId": "...",
      "startTime": 1712527200000,
      "endTime": 1712527800000,
      "totalPastes": 3,
      "analysis": {
        "humanScore": 85,
        "aiScore": 15,
        "pastedContentPercentage": 24.5,
        "typedContentPercentage": 75.5,
        "suspiciousPatterns": []
      },
      "confidenceScore": 85
    },
    "analysis": { ... }
  }
}
```

#### 5. Get Session Report
```
GET /api/writing-sessions/:sessionId/report

Response:
{
  "success": true,
  "data": {
    "session": { ... },
    "pasteEventsCount": 3,
    "report": {
      "confidenceScore": 85,
      "analysis": { ... },
      "timestamp": "2024-04-07T21:30:00.000Z"
    }
  }
}
```

## Database Schema

### PasteEvent Collection
```javascript
{
  _id: ObjectId,
  pasteId: String,              // Unique identifier
  sessionId: String,            // Reference to writing session
  timestamp: Number,            // When paste occurred
  textLength: Number,           // Size of pasted content
  content: String,              // Actual pasted text (encrypted in production)
  position: {
    line: Number,
    column: Number
  },
  createdAt: Date               // Document creation timestamp
}
```

### WritingSession Collection
```javascript
{
  _id: ObjectId,
  sessionId: String,            // Unique session identifier
  startTime: Number,            // Session start timestamp
  endTime: Number,              // Session end timestamp
  totalPastes: Number,          // Count of paste events
  pasteEvents: [String],        // Array of paste IDs
  totalWordsWritten: Number,    // Total words typed
  confidenceScore: Number,      // 0-100 authenticity score
  analysis: {
    humanScore: Number,         // Human writing probability
    aiScore: Number,            // AI-generated probability
    pastedContentPercentage: Number,    // % of content that was pasted
    typedContentPercentage: Number,     // % of content that was typed
    suspiciousPatterns: [String]        // List of detected anomalies
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Analysis Algorithm

### Paste Detection Metrics
1. **Paste Frequency**: Number of paste events in session
2. **Paste Length Distribution**: Size of each paste
3. **Typing Gap Analysis**: Time between pastes
4. **Content Consistency**: Text analysis of pasted vs. typed

### Scoring Logic
```
Human Score = 100 - (Paste Count × 5) - (Paste % × 0.5)
AI Score = Paste Count > 3 ? 30 : 10
Confidence = Max(0, Min(100, Human Score))
```

### Suspicious Patterns
- High paste frequency (>5 pastes)
- Pasted content >50% of total
- Large paste chunks (>500 chars)
- Paste in conclusion sections
- Inconsistent writing patterns

## Configuration

### Environment Variables
```env
ENABLE_PASTE_DETECTION=true        # Enable/disable feature
MIN_PASTE_LENGTH=10                # Minimum chars to record as paste
PASTE_ANALYSIS_THRESHOLD=0.5       # Threshold for suspicious detection
```

## Usage Example

### Frontend
```typescript
import { Editor } from './components/Editor';

function App() {
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);

  const handlePasteDetected = (event) => {
    console.log('Paste detected:', event);
    // Handle paste event
  };

  return (
    <Editor 
      sessionId={sessionId} 
      onPasteDetected={handlePasteDetected}
    />
  );
}
```

### Backend
```typescript
import { writingSessionRoutes } from './routes/writingSessions';

app.use('/api', writingSessionRoutes);
```

## Privacy & Security

1. **Data Encryption**: Pasted content encrypted at rest
2. **Access Control**: Session-level authorization
3. **Data Retention**: Automatic cleanup after 30 days (configurable)
4. **GDPR Compliance**: User data export and deletion options
5. **Audit Logging**: All paste events logged for compliance

## Performance Considerations

1. **Batch Processing**: Paste events batched every 5 seconds
2. **Database Indexing**: Indexes on sessionId, timestamp
3. **Memory Management**: Stream processing for large files
4. **Network Optimization**: Gzip compression for API responses

## Future Enhancements

1. **Machine Learning**: Train models to detect pasted patterns
2. **Content Type Detection**: Identify code, tables, images
3. **Real-time ML Analysis**: Instant flagging of suspicious content
4. **User Warnings**: Prompt users before large pastes
5. **Paste Source Tracking**: Detect paste source (website, document, etc.)

## Troubleshooting

### Paste events not being recorded
- Check MongoDB connection
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Ensure paste detection hook is properly integrated

### High false positives
- Adjust `PASTE_ANALYSIS_THRESHOLD`
- Tune scoring algorithm multipliers
- Add whitelist for known trusted sources

### Performance issues
- Implement paste debouncing
- Use batch uploads for paste events
- Archive old sessions
- Optimize database indexes

---

**Last Updated:** April 7, 2026
**Version:** 1.0.0
