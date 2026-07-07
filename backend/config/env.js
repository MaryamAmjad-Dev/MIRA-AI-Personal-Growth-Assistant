import dotenv from 'dotenv';

dotenv.config();

const required = ['MONGODB_URI', 'JWT_SECRET'];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const nodeEnv = process.env.NODE_ENV || 'development';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  aiApiKey: process.env.AI_API_KEY || '',
  aiApiUrl: process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions',
  nodeEnv,
  frontendUrl,
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  corsOrigins: [
    frontendUrl,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ].filter(Boolean),
};

if (nodeEnv === 'production' && !process.env.FRONTEND_URL) {
  console.warn('Warning: FRONTEND_URL is not set in production. CORS may block requests.');
}
