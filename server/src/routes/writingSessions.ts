/**
 * API Routes for Writing Sessions and Paste Detection
 */

import express, { Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { PasteEvent, WritingSession } from '../models/index.js';

const router = Router();

// Create a new writing session
router.post('/writing-sessions/start', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    const session = new WritingSession({
      sessionId: sessionId || `session_${uuidv4()}`,
      startTime: Date.now(),
      totalPastes: 0,
      pasteEvents: [],
      analysis: {
        humanScore: 0,
        aiScore: 0,
        pastedContentPercentage: 0,
        typedContentPercentage: 0,
        suspiciousPatterns: [],
      },
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: 'Writing session started',
      data: session,
    });
  } catch (error) {
    console.error('Error creating writing session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create writing session',
      error: String(error),
    });
  }
});

// Record a paste event
router.post('/writing-sessions/paste-event', async (req: Request, res: Response) => {
  try {
    const { id, sessionId, timestamp, textLength, content, position } = req.body;

    // Validate input
    if (!sessionId || textLength === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: sessionId, textLength',
      });
    }

    // Create paste event record
    const pasteEvent = new PasteEvent({
      pasteId: id || `paste_${uuidv4()}`,
      sessionId,
      timestamp: timestamp || Date.now(),
      textLength,
      content,
      position: position || { line: 0, column: 0 },
    });

    await pasteEvent.save();

    // Update writing session
    const session = await WritingSession.findOneAndUpdate(
      { sessionId },
      {
        $inc: { totalPastes: 1 },
        $push: { pasteEvents: pasteEvent.pasteId },
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Paste event recorded',
      data: {
        pasteEvent,
        session,
      },
    });
  } catch (error) {
    console.error('Error recording paste event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record paste event',
      error: String(error),
    });
  }
});

// Get all paste events for a session
router.get('/writing-sessions/:sessionId/paste-events', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const pasteEvents = await PasteEvent.find({ sessionId }).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      data: {
        sessionId,
        totalPastes: pasteEvents.length,
        pasteEvents,
      },
    });
  } catch (error) {
    console.error('Error fetching paste events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch paste events',
      error: String(error),
    });
  }
});

// End writing session and generate analysis
router.post('/writing-sessions/:sessionId/end', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { totalWords } = req.body;

    // Fetch all paste events for this session
    const pasteEvents = await PasteEvent.find({ sessionId });
    const totalPastedChars = pasteEvents.reduce((sum, event) => sum + event.textLength, 0);

    // Calculate statistics
    const analysis = {
      humanScore: Math.max(0, 100 - (pasteEvents.length * 5)), // Penalize per paste
      aiScore: pasteEvents.length > 3 ? 30 : 10,
      pastedContentPercentage: totalWords ? (totalPastedChars / totalWords) * 100 : 0,
      typedContentPercentage: totalWords ? 100 - (totalPastedChars / totalWords) * 100 : 100,
      suspiciousPatterns: [],
    };

    // Flag suspicious patterns
    if (pasteEvents.length > 5) {
      analysis.suspiciousPatterns.push('High paste frequency detected');
    }
    if (analysis.pastedContentPercentage > 50) {
      analysis.suspiciousPatterns.push('Over 50% pasted content');
    }

    const updatedSession = await WritingSession.findOneAndUpdate(
      { sessionId },
      {
        endTime: Date.now(),
        totalWordsWritten: totalWords,
        analysis,
        confidenceScore: analysis.humanScore,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Session ended and analyzed',
      data: {
        session: updatedSession,
        analysis,
      },
    });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end session',
      error: String(error),
    });
  }
});

// Get session report
router.get('/writing-sessions/:sessionId/report', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await WritingSession.findOne({ sessionId }).populate('pasteEvents');
    const pasteEvents = await PasteEvent.find({ sessionId });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        session,
        pasteEventsCount: pasteEvents.length,
        report: {
          confidenceScore: session.confidenceScore,
          analysis: session.analysis,
          timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report',
      error: String(error),
    });
  }
});

export const writingSessionRoutes = router;
