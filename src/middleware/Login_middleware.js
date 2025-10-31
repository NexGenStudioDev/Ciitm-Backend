import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from './loggerMiddleware.js';

import Authentication from '../api/v1/Auth/Auth.model.mjs';
import AuthUtils from '../api/v1/Auth/Auth.utils.mjs';

dotenv.config({
  path: '../../.env',
});

export const AdminVerify = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(403).json({
        message: 'Bad Request: Token Not Found',
        admin: false,
        Unauthorized: true,
        error: true,
      });
    }

    let email = await AuthUtils.DecodeToken(token);

    if (!email) {
      return res.status(403).json({
        message: 'Bad Request: Email Not Found',
        admin: false,
        Unauthorized: true,
        error: true,
      });
    }

    const findRole = await Authentication.checkRole(email);

    if (findRole !== 'admin') {
      return res.status(403).json({
        message: 'Bad Request: You are Not Verified Admin',
        Unauthorized: true,
        admin: false,
        error: true,
      });
    }

    return next();
  } catch (error) {
    return res.status(error.status || 401).json({
      message: error.message || 'Unauthorized User',
      admin: false,
      Unauthorized: true,
      error: true,
    });
  }
};

export const StudentVerify = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(403).json({
        message: 'Bad Request: Token Not Found',
        admin: false,
        Unauthorized: true,
        error: true,
      });
    }

    let email = await AuthUtils.DecodeToken(token);

    if (!email) {
      return res.status(403).json({
        message: 'Bad Request: Email Not Found',
        admin: false,
        Unauthorized: true,
        error: true,
      });
    }

    const findRole = await Authentication.checkRole(email);
    Authentication.findOne({ email: email });

    if (findRole !== 'student') {
      return res.status(403).json({
        message: 'Bad Request: You are Not Verified Student',
        Unauthorized: true,
        admin: false,
        error: true,
      });
    }

    return next();
  } catch (error) {
    return res.status(error.status || 401).json({
      message: error.message || 'Unauthorized User',
      admin: false,
      Unauthorized: true,
      error: true,
    });
  }
};
