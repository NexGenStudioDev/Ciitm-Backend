import { Router } from 'express';
const router = Router();
import AuthController from './Auth.controller.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';
import upload from '../../../utils/multerUtils.mjs';

router.post('/v1/auth/login', AuthController.Login);

router.post('/v1/auth/Admin/SignUp', upload.single('profileImage'), AuthController.SignUP_Admin);

export { router as AuthRouter };
