import { configDotenv } from 'dotenv';

configDotenv();

const env_Constant = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URL || 'mongodb://localhost:27017/ciitm',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_ciitm_jwt_token_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN || '7',
  GMAIL_User: process.env.GMAIL_User || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  REDIS_URL: process.env.REDIS_URL || '',
  GMAIL_Password: process.env.GMAIL_Password || '',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
};

export default Object.freeze(env_Constant);
