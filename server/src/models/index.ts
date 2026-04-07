/**
 * MongoDB Schemas for Vi-Notes
 */

import mongoose, { Schema, Document } from 'mongoose';

// Paste Event Schema - Records every paste event
export interface IPasteEvent extends Document {
  sessionId: string;
  pasteId: string;
  timestamp: number;
  textLength: number;
  content: string;
  position: {
    line: number;
    column: number;
  };
  createdAt: Date;
}

const PasteEventSchema = new Schema<IPasteEvent>({
  sessionId: { type: String, required: true, index: true },
  pasteId: { type: String, required: true, unique: true },
  timestamp: { type: Number, required: true },
  textLength: { type: Number, required: true },
  content: { type: String, required: true },
  position: {
    line: { type: Number, required: true },
    column: { type: Number, required: true },
  },
  createdAt: { type: Date, default: Date.now, index: true },
});

// Writing Session Schema - Contains overall session metadata
export interface IWritingSession extends Document {
  sessionId: string;
  startTime: number;
  endTime?: number;
  totalPastes: number;
  pasteEvents: string[]; // Array of paste IDs
  totalWordsWritten: number;
  confidenceScore?: number;
  analysis?: {
    humanScore: number;
    aiScore: number;
    pastedContentPercentage: number;
    typedContentPercentage: number;
    suspiciousPatterns: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const WritingSessionSchema = new Schema<IWritingSession>({
  sessionId: { type: String, required: true, unique: true, index: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number },
  totalPastes: { type: Number, default: 0 },
  pasteEvents: [{ type: String }],
  totalWordsWritten: { type: Number, default: 0 },
  confidenceScore: { type: Number, min: 0, max: 100 },
  analysis: {
    humanScore: { type: Number, min: 0, max: 100 },
    aiScore: { type: Number, min: 0, max: 100 },
    pastedContentPercentage: { type: Number, min: 0, max: 100 },
    typedContentPercentage: { type: Number, min: 0, max: 100 },
    suspiciousPatterns: [String],
  },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
});

// Keystroke Data Schema - Records typing metrics (without actual key content)
export interface IKeystrokeData extends Document {
  sessionId: string;
  timestamp: number;
  keyType: 'character' | 'backspace' | 'enter' | 'delete';
  duration: number; // Time since last keystroke
  position: {
    line: number;
    column: number;
  };
}

const KeystrokeDataSchema = new Schema<IKeystrokeData>({
  sessionId: { type: String, required: true, index: true },
  timestamp: { type: Number, required: true },
  keyType: { type: String, enum: ['character', 'backspace', 'enter', 'delete'], required: true },
  duration: { type: Number, required: true },
  position: {
    line: { type: Number, required: true },
    column: { type: Number, required: true },
  },
});

// Export models
export const PasteEvent = mongoose.model<IPasteEvent>('PasteEvent', PasteEventSchema);
export const WritingSession = mongoose.model<IWritingSession>('WritingSession', WritingSessionSchema);
export const KeystrokeData = mongoose.model<IKeystrokeData>('KeystrokeData', KeystrokeDataSchema);
