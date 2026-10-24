import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

/**
 * Health check endpoint: GET /api/health
 * Returns service status, current timestamp, environment info,
 * and MongoDB connection state.
 */
router.get('/', (req, res) => {
  const connectionStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;

  res.status(200).json({
    status: 'OK',
    message: 'Expense Tracker Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: connectionStates[dbState] || 'unknown',
      connected: dbState === 1,
    },
  });
});

export default router;
