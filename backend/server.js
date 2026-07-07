import cors from 'cors';
import dns from 'dns';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import intelligenceRoutes from './routes/intelligenceRoutes.js';
import capsuleRoutes from './routes/capsuleRoutes.js';
import dreamRoutes from './routes/dreamRoutes.js';
import vaultRoutes from './routes/vaultRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (env.nodeEnv !== 'production') {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.nodeEnv === 'production' ? 300 : 500,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many auth attempts, please try again later' },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.nodeEnv === 'production' ? 60 : 120,
  message: { success: false, message: 'Too many AI requests, please try again later' },
});

app.use('/api', limiter);
app.use('/api/ai', aiLimiter);
app.use('/api/intelligence', aiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/google', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/twin', intelligenceRoutes);
app.use('/api/capsules', capsuleRoutes);
app.use('/api/dreams', dreamRoutes);
app.use('/api/vault', vaultRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      environment: env.nodeEnv,
      database: mongoose.connection.readyState,
    },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

let server;

const startServer = async () => {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log('MongoDB Connected Successfully');

    server = app.listen(env.port, () => {
      console.log(`Server running on port ${env.port} (${env.nodeEnv})`);
    });
  } catch (error) {
    console.error('MongoDB Connection Failed', error.message);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      await mongoose.connection.close(false);
      console.log('Server closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();

export default app;

