import Joi from 'joi';
import dotenv from 'dotenv';
dotenv.config();

let Env_Validator = Joi.object({
  MONGO_URL: Joi.string().uri().optional(),
  GEMINI_API_KEY: Joi.string().optional(),
  SESSION_SECRET: Joi.string().min(8).optional(),
  GOOGLE_CLIENT_ID: Joi.string().optional(),
  JWT_SECRET: Joi.string().min(8).optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().optional(),
  GMAIL_User: Joi.string().email().optional(),
  GMAIL_Password: Joi.string().min(8).optional(),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  Razorpay_key: Joi.string().optional(),
  Razorpay_secret: Joi.string().optional(),
  FRONTEND_URL: Joi.string().uri().optional(),
  ALLOWED_ORIGINS: Joi.string().optional(),
  website_schema: Joi.string().valid('http', 'https').default('http'),
  PORT: Joi.number().integer().min(1).max(65535).default(3000),
}).unknown(true);

async function validateEnv() {
  const envData = {
    MONGO_URL: process.env.MONGO_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GMAIL_User: process.env.GMAIL_User,
    GMAIL_Password: process.env.GMAIL_Password,
    NODE_ENV: process.env.NODE_ENV || 'development',
    Razorpay_key: process.env.Razorpay_key,
    Razorpay_secret: process.env.Razorpay_secret,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    FRONTEND_URL: process.env.FRONTEND_URL,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    website_schema: process.env.website_schema || 'http',
    PORT: Number(process.env.PORT || 3000),
  };

  try {
    const { error } = Env_Validator.validate(envData, { abortEarly: false });
    if (error) {
      console.warn('⚠️ Environment warnings:', error.message);
    } else {
      console.log('✅ Environment configuration validated.');
    }
  } catch (error) {
    console.warn('Validation notice:', error.message);
  }
}

export default validateEnv;
