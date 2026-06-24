import { Router } from 'express';
import courseController from './course.controller.mjs';
import upload from '../../../utils/multerUtils.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';
const router = Router();

router.post(
  '/v1/admin/course/create',
  upload.single('courseThumbnail'),
  AuthMiddleware.Admin,
  courseController.createCourse
);
router.get('/v1/user/findAllCourse', courseController.FindAllCourses);
router.get('/v1/user/findCourseById/:id', courseController.FindCourseById);

export { router as CourseRouter };
