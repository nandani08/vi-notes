/**
 * Vi-Notes Backend Server
 * Handles writing session management, paste event recording, and analysis
 */

import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { writingSessionRoutes } from './routes/writingSessions.js';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vi-notes';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Vi-Notes server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', writingSessionRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║        🎯 Vi-Notes Server Running            ║
╚══════════════════════════════════════════════╝
📝 API Server: http://localhost:${PORT}
💾 Database: ${MONGODB_URI}
🔍 Paste Detection: ACTIVE
📊 Analytics: ENABLED
      `);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoose.disconnect();
  process.exit(0);
});

export default app;
