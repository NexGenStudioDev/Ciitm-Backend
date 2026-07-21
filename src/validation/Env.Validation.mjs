import Joi from 'joi';
import dotenv from 'dotenv';
dotenv.config({
  path: '../../.env',
});

let Env_Validator = Joi.object({
  MONGO_URL: Joi.string().uri().required().messages({
    'string.base': 'MONGO_URL must be a valid string',
    'any.required': 'MONGO_URL is required',
    'string.uri': 'MONGO_URL must be a valid URI',
  }),

  GEMINI_API_KEY: Joi.string().required().messages({
    'string.base': 'GEMINI_API_KEY must be a string',
    'any.required': 'GEMINI_API_KEY is required',
  }),

  SESSION_SECRET: Joi.string().min(8).required().messages({
    'string.base': 'SESSION_SECRET must be a string',
    'any.required': 'SESSION_SECRET is required',
    'string.min': 'SESSION_SECRET must have at least 8 characters',
  }),

  GOOGLE_CLIENT_ID: Joi.string().required().messages({
    'string.base': 'GOOGLE_CLIENT_ID must be a string',
    'any.required': 'GOOGLE_CLIENT_ID is required',
  }),



  JWT_SECRET: Joi.string().min(8).required().messages({
    'string.base': 'JWT_SECRET must be a string',
    'any.required': 'JWT_SECRET is required',
    'string.min': 'JWT_SECRET must have at least 8 characters',
  }),

  GOOGLE_CLIENT_SECRET: Joi.string().required().messages({
    'string.base': 'GOOGLE_CLIENT_SECRET must be a string',
    'any.required': 'GOOGLE_CLIENT_SECRET is required',
  }),

  GMAIL_User: Joi.string().email().required().messages({
    'string.base': 'GMAIL_User must be a valid email',
    'any.required': 'GMAIL_User is required',
    'string.email': 'GMAIL_User must be a valid email address',
  }),

  GMAIL_Password: Joi.string().min(8).required().messages({
    'string.base': 'GMAIL_Password must be a string',
    'any.required': 'GMAIL_Password is required',
    'string.min': 'GMAIL_Password must have at least 8 characters',
  }),

  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .required()
    .messages({
      'string.base': 'NODE_ENV must be a string',
      'any.required': 'NODE_ENV is required',
      'any.only':
        'NODE_ENV must be one of "development", "production", or "test"',
    }),

  Razorpay_key: Joi.string().required().messages({
    'string.base': 'Razorpay_key must be a string',
    'any.required': 'Razorpay_key is required',
  }),

  Razorpay_secret: Joi.string().required().messages({
    'string.base': 'Razorpay_secret must be a string',
    'any.required': 'Razorpay_secret is required',
  }),

  FRONTEND_URL: Joi.string().uri().required().messages({
    'string.base': 'website_URL must be a valid string',
    'any.required': 'website_URL is required',
    'string.uri': 'website_URL must be a valid URI',
  }),

  website_schema: Joi.string().valid('http', 'https').required().messages({
    'string.base': 'website_schema must be a string',
    'any.required': 'website_schema is required',
    'any.only': 'website_schema must be "http" or "https"',
  }),

  PORT: Joi.number().integer().min(1).max(65535).required().messages({
    'number.base': 'PORT must be a number',
    'any.required': 'PORT is required',
    'number.min': 'PORT must be between 1 and 65535',
    'number.max': 'PORT must be between 1 and 65535',
  }),
});

async function validateEnv() {
  const envData = {
    MONGO_URL: process.env.MONGO_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GMAIL_User: process.env.GMAIL_User,
    GMAIL_Password: process.env.GMAIL_Password,
    NODE_ENV: process.env.NODE_ENV,
    Razorpay_key: process.env.Razorpay_key,
    Razorpay_secret: process.env.Razorpay_secret,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    FRONTEND_URL: process.env.FRONTEND_URL,
    website_schema: process.env.website_schema,
    PORT: process.env.PORT,
  };

  try {
    const { value, error } = await Env_Validator.validate(envData);
    if (error) {
      throw Error(error.message);
    }
  } catch (error) {
    console.error('Validation failed:', error);
  }
}

export default validateEnv;
