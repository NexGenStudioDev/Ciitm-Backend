import express from 'express';
const { request, response } = express;

import Authentication from '../api/v1/Auth/Auth.model.mjs';
import AuthUtils from '../api/v1/Auth/Auth.utils.mjs';

class Auth_Middleware {
  Admin = async (req = request, res = response, next) => {
    try {
      const token = req.cookies?.token || req.headers['authorization'];
      console.log('Token:', token);

      if (!token) {
        return res.status(403).json({
          message: 'Bad Request: Token Not Found',
          admin: false,
          Unauthorized: true,
          error: true,
        });
      }

      let email = await AuthUtils.DecodeToken(token);
      console.log('Decoded Email:', email);

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

      next();
    } catch (error) {
      console.error('Error in Admin Middleware:', error);
      return res.status(error.status || 401).json({
        message: error.message || 'Unauthorized User',
        admin: false,
        Unauthorized: true,
        error: true,
      });
    }
  };

  Student = async (req = request, res = response, next) => {
    try {
      const token = req.cookies?.token || req.headers['authorization'];
      console.log('Token:', token);

      if (!token) {
        return res.status(403).json({
          message: 'Bad Request: Token Not Found',
          student: false,
          Unauthorized: true,
          error: true,
        });
      }

      let email = await AuthUtils.DecodeToken(token);
      console.log('Decoded Email:', email);

      if (!email) {
        return res.status(403).json({
          message: 'Bad Request: Email Not Found',
          student: false,
          Unauthorized: true,
          error: true,
        });
      }

      const findRole = await Authentication.checkRole(email);

      if (findRole !== 'student') {
        return res.status(403).json({
          message: 'Bad Request: You are Not Verified Student',
          Unauthorized: true,
          student: false,
          error: true,
        });
      }

      next();
    } catch (error) {
      console.error('Error in Student Middleware:', error);
      return res.status(error.status || 401).json({
        message: error.message || 'Unauthorized User',
        student: false,
        Unauthorized: true,
        error: true,
      });
    }
  };
}

export default new Auth_Middleware();
