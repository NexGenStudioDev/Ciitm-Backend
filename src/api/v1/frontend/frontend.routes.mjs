import { Router } from 'express';
import frontendController from './frontend.controller.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';
const router = Router();

router.get('/v1/frontend', frontendController.find);
router.put('/v1/frontend', AuthMiddleware.Admin, frontendController.update);

export { router as FrontendRouter };
