/**
 * Paste Detection Hook
 * Monitors and records paste events in the editor
 * Captures: paste timestamp, text length, position in document
 */

import { useState, useCallback, useRef } from 'react';

export interface PasteEvent {
  id: string;
  timestamp: number;
  textLength: number;
  content: string;
  position: {
    line: number;
    column: number;
  };
  sessionId: string;
}

export const usePasteDetection = (sessionId: string) => {
  const [pasteEvents, setPasteEvents] = useState<PasteEvent[]>([]);
  const pasteCountRef = useRef(0);

  const recordPaste = useCallback(
    (event: ClipboardEvent, textContent: string, position: { line: number; column: number }) => {
      const pasteEvent: PasteEvent = {
        id: `paste_${sessionId}_${pasteCountRef.current++}`,
        timestamp: Date.now(),
        textLength: textContent.length,
        content: textContent,
        position,
        sessionId,
      };

      setPasteEvents((prev) => [...prev, pasteEvent]);

      // Send to backend for persistent storage
      void sendPasteEventToBackend(pasteEvent);

      console.log('📋 Paste detected:', {
        length: pasteEvent.textLength,
        timestamp: new Date(pasteEvent.timestamp).toISOString(),
        position,
      });

      return pasteEvent;
    },
    [sessionId]
  );

  const getPasteEvents = useCallback(() => pasteEvents, [pasteEvents]);

  const clearPasteEvents = useCallback(() => setPasteEvents([]), []);

  return {
    pasteEvents,
    recordPaste,
    getPasteEvents,
    clearPasteEvents,
  };
};

// Helper function to send paste event to backend
async function sendPasteEventToBackend(event: PasteEvent) {
  try {
    await fetch('http://localhost:5000/api/writing-sessions/paste-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
  } catch (err) {
    console.error('Failed to send paste event to backend:', err);
  }
}
