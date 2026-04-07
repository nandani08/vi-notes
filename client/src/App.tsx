import React, { useState, useEffect } from 'react';
import { Editor } from './components/Editor';
import { PasteEvent } from './hooks/usePasteDetection';
import './App.css';
import './styles/editor.css';

function App() {
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [totalPastes, setTotalPastes] = useState(0);
  const [sessionStartTime] = useState(Date.now());

  const handlePasteDetected = (event: PasteEvent) => {
    setTotalPastes((prev) => prev + 1);
    console.log('📊 Paste Event:', event);
  };

  const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);

  return (
    <div className="app">
      <div className="session-info">
        <span>Session: {sessionId.substring(0, 15)}...</span>
        <span>Duration: {sessionDuration}s</span>
        <span>Total Pastes: {totalPastes}</span>
      </div>
      
      <Editor 
        sessionId={sessionId} 
        onPasteDetected={handlePasteDetected}
      />
    </div>
  );
}

export default App;
