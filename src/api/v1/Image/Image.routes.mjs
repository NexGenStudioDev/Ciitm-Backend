import { Router } from 'express';
import imageController from './image.controller.mjs';
import upload from '../../../utils/multerUtils.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';
const router = Router();

router.post(
  '/v1/admin/create/image',
  AuthMiddleware.Admin,
  upload.single('image'),
  imageController.create_Image
);

router.get('/v1/user/get/Album/Image/:Album__Name', imageController.get_Image);

router.get('/v1/user/get/All/Image', imageController.get_All_Image);

router.delete(
  '/v1/admin/delete/image/:imageId',
  AuthMiddleware.Admin,
  imageController.delete_Image
);

export { router as ImageRoutes };
