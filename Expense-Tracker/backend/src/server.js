import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Connect to MongoDB
connectDB();

// CORS configuration to allow local frontend access
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/transactions', transactionRoutes);
// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Expense Tracker API',
    healthCheck: '/api/health',
  });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`[Server] Expense Tracker backend listening on port ${PORT}`);
  console.log(`[Server] Health check available at: http://localhost:${PORT}/api/health`);
  console.log(`[Server] CORS configured for frontend at: ${CLIENT_URL}`);
});
