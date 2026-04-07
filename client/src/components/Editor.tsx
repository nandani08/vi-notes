/**
 * Editor Component with Paste Detection
 * Monitors typing behavior and detects paste events
 */

import React, { useRef, useEffect, useState } from 'react';
import { usePasteDetection, PasteEvent } from '../hooks/usePasteDetection';

interface EditorProps {
  sessionId: string;
  onPasteDetected?: (event: PasteEvent) => void;
}

export const Editor: React.FC<EditorProps> = ({ sessionId, onPasteDetected }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 0, column: 0 });
  const [pasteIndicator, setPasteIndicator] = useState<boolean>(false);
  const { recordPaste, getPasteEvents } = usePasteDetection(sessionId);

  // Handle paste events
  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = event.clipboardData?.getData('text') || '';
    
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const { selectionStart } = textarea;
      
      // Calculate line and column position
      const textBeforeCursor = textarea.value.substring(0, selectionStart);
      const lines = textBeforeCursor.split('\n');
      const line = lines.length - 1;
      const column = lines[lines.length - 1].length;

      // Record the paste event
      const pasteEvent = recordPaste(event as any, pastedText, { line, column });

      // Visual feedback
      setPasteIndicator(true);
      setTimeout(() => setPasteIndicator(false), 1500);

      // Callback to parent
      if (onPasteDetected) {
        onPasteDetected(pasteEvent);
      }
    }
  };

  // Update cursor position on click or keyup
  const updateCursorPosition = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const textBeforeCursor = textarea.value.substring(0, textarea.selectionStart);
      const lines = textBeforeCursor.split('\n');
      const line = lines.length - 1;
      const column = lines[lines.length - 1].length;
      
      setCursorPosition({ line, column });
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.addEventListener('click', updateCursorPosition);
    textarea.addEventListener('keyup', updateCursorPosition);

    return () => {
      textarea.removeEventListener('click', updateCursorPosition);
      textarea.removeEventListener('keyup', updateCursorPosition);
    };
  }, []);

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>Vi-Notes Editor</h2>
        <div className="editor-stats">
          <span>Position: Line {cursorPosition.line + 1}, Col {cursorPosition.column + 1}</span>
          <span className={`paste-count ${getPasteEvents().length > 0 ? 'active' : ''}`}>
            📋 Pastes: {getPasteEvents().length}
          </span>
        </div>
      </div>

      {pasteIndicator && (
        <div className="paste-notification">
          ✓ Paste detected and recorded
        </div>
      )}

      <textarea
        ref={textareaRef}
        className="editor-textarea"
        placeholder="Start typing or paste content. All writing behavior is monitored..."
        onPaste={handlePaste}
        spellCheck="false"
      />

      <div className="editor-footer">
        <div className="paste-events-info">
          <p>Paste Events: {getPasteEvents().length}</p>
          {getPasteEvents().length > 0 && (
            <div className="paste-details">
              <h4>Recent Paste Events:</h4>
              <ul>
                {getPasteEvents().slice(-5).map((event) => (
                  <li key={event.id}>
                    <span className="paste-time">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="paste-size">{event.textLength} chars</span>
                    <span className="paste-position">
                      Line {event.position.line + 1}, Col {event.position.column + 1}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
