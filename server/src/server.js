
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
import auth from './routes/auth.js';
import customers from './routes/customers.js';
import works from './routes/works.js';
import publicStatus from './routes/publicStatus.js';

const app = express();

// Security
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://work-payment-manager.vercel.app'
].map(origin => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin.trim())) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json({ limit: '1mb' }));

// API Routes
app.use(
  '/api/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  }),
  auth
);

app.use('/api/customers', customers);
app.use('/api/works', works);
app.use('/api/public-status', publicStatus);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'WorkPaymentManager API'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: 'A record with this value already exists.'
    });
  }

  res.status(500).json({
    message:
      process.env.NODE_ENV === 'production'
        ? 'Server error. Please try again.'
        : err.message
  });
});

// Start server
const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  });
