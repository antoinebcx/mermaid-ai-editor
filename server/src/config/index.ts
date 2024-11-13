import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  },
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
} as const;