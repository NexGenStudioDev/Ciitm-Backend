import { Router } from 'express';
import courseController from './course.controller.mjs';
import upload from '../../../utils/multerUtils.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';

const router = Router();

// Middleware to capture either courseThumbnail or image or any file upload
const uploadCourseThumb = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) return next(err);
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

router.post(
  '/v1/admin/course/create',
  uploadCourseThumb,
  AuthMiddleware.Admin,
  courseController.createCourse
);

router.put(
  '/v1/admin/course/:id/update',
  uploadCourseThumb,
  AuthMiddleware.Admin,
  courseController.updateCourse
);
router.put(
  '/v1/admin/course/update/:id',
  uploadCourseThumb,
  AuthMiddleware.Admin,
  courseController.updateCourse
);
router.put(
  '/v1/admin/course/:id',
  uploadCourseThumb,
  AuthMiddleware.Admin,
  courseController.updateCourse
);
router.post(
  '/v1/admin/course/:id/update',
  uploadCourseThumb,
  AuthMiddleware.Admin,
  courseController.updateCourse
);

router.delete(
  '/v1/admin/course/:id/delete',
  AuthMiddleware.Admin,
  courseController.deleteCourse
);
router.delete(
  '/v1/admin/course/delete/:id',
  AuthMiddleware.Admin,
  courseController.deleteCourse
);
router.delete(
  '/v1/admin/course/:id',
  AuthMiddleware.Admin,
  courseController.deleteCourse
);

router.get('/v1/user/findAllCourse', courseController.FindAllCourses);
router.get('/v1/user/findCourseById/:id', courseController.FindCourseById);

export { router as CourseRouter };
