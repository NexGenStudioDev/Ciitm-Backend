import express from 'express';
const app = express();

import cors from 'cors';

import { AuthRouter } from '../api/v1/Auth/Auth.routes.mjs';
import { RoleRouter } from '../api/v1/Role/Role.routes.mjs';
import { StatusRouter } from '../api/v1/Status/Status.routes.mjs';
import { AdmissionRouter } from '../api/v1/Admission/Admission.routes.mjs';
import { SocialMediaRouter } from '../api/v1/SocialMedia/SocialMedia.routes.mjs';
import { FrontendRouter } from '../api/v1/frontend/frontend.routes.mjs';
import { ContactRouter } from '../api/v1/Contact/Contact.routes.mjs';
import { NoticeRouter } from '../api/v1/Notice/notice.routes.mjs';
import { AlbumRoutes } from '../api/v1/Album/Album.routes.mjs';
import { ImageRoutes } from '../api/v1/Image/Image.routes.mjs';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { CourseRouter } from '../api/v1/Course/course.routes.mjs';
import { TeacherRouter } from '../api/v1/Teacher/Teacher.routes.mjs';
import { StudentRouter } from '../api/v1/Student/Student.routes.mjs';
import forgotPasswordRouter from '../api/v1/forget-password/ForgotPassword.routes.mjs';
import { Fee_Routes } from '../api/v1/Fee/fee.routes.mjs';
import { TestimonialRouter } from '../api/v1/Testimonial/Testimonial.routes.mjs';
import { QueueRouter } from '../api/v1/Queue/Queue.routes.mjs';
import envConstant from '../constant/env.constant.mjs';

app.use((req, res, next) => {
  console.log('METHOD :', req.method);
  console.log('URL :', req.url);
  console.log('ORIGIN :', req.headers.origin);
  next();
});

const whitelist = new Set([
  envConstant.FRONTEND_URL?.replace(/\/$/, ''),
  'http://localhost:5173',
  'http://localhost:3000',
]);

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      if (
        !envConstant.NODE_ENV ||
        envConstant.NODE_ENV === 'development' ||
        whitelist.has(cleanOrigin) ||
        cleanOrigin.includes('localhost') ||
        cleanOrigin.includes('run.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
  })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  '/api',
  AuthRouter,
  RoleRouter,
  StatusRouter,
  AdmissionRouter,
  FrontendRouter,
  ContactRouter,
  AlbumRoutes,
  forgotPasswordRouter,
  ImageRoutes,
  NoticeRouter,
  SocialMediaRouter,
  Fee_Routes,
  CourseRouter,
  TeacherRouter,
  StudentRouter,
  TestimonialRouter,
  QueueRouter
);

// Mongoose / Database offline fallback middleware
app.use((err, req, res, next) => {
  if (
    err.name === 'MongooseError' ||
    err.name === 'MongoNetworkError' ||
    err.name === 'MongoServerSelectionError' ||
    (err.message && (err.message.includes('buffering timed out') || err.message.includes('topology was destroyed') || err.message.includes('connect ECONNREFUSED')))
  ) {
    console.warn('[Resilient DB] Database temporarily unreachable — returning fallback response');
    if (req.method === 'GET') {
      return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
    }
    return res.status(503).json({
      status: false,
      statusCode: 503,
      message: 'Service temporarily unavailable (database offline)',
      error: true,
    });
  }
  next(err);
});

// Global catch-all error handler: converts any uncaught exceptions into clean JSON envelopes
app.use((err, req, res, _next) => {
  console.error('[Global Error]', err.name || 'Error', ':', err.message);

  if (
    err.name === 'JsonWebTokenError' ||
    err.name === 'TokenExpiredError' ||
    err.message?.includes('jwt') ||
    err.message?.includes('token')
  ) {
    return res.status(401).json({
      status: false,
      statusCode: 401,
      message: err.message || 'Unauthorized: Invalid or expired authentication token',
      Unauthorized: true,
      error: true,
    });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({
      status: false,
      statusCode: 400,
      message: `File upload error: ${err.message}`,
      error: true,
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  return res.status(statusCode).json({
    status: false,
    statusCode: statusCode,
    message: err.message || 'An unexpected error occurred',
    error: true,
  });
});

export default app;
