import { Router } from 'express';
import TeacherController from './Teacher.controller.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';
import upload from '../../../utils/multerUtils.mjs';

const router = Router();

// Middleware to capture either Avtar or image or any file upload
const uploadAvatar = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) return next(err);
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

router.post(
  '/v1/admin/teacher/create',
  uploadAvatar,
  AuthMiddleware.Admin,
  TeacherController.createNewTeacher
);
router.delete(
  '/v1/admin/teacher/:id/delete',
  AuthMiddleware.Admin,
  TeacherController.deleteTeacher
);
router.delete(
  '/v1/admin/teacher/delete/:id',
  AuthMiddleware.Admin,
  TeacherController.deleteTeacher
);
router.delete(
  '/v1/admin/teacher/:id',
  AuthMiddleware.Admin,
  TeacherController.deleteTeacher
);

router.put(
  '/v1/admin/teacher/:id/update',
  uploadAvatar,
  AuthMiddleware.Admin,
  TeacherController.updateTeacher
);
router.put(
  '/v1/admin/teacher/update/:id',
  uploadAvatar,
  AuthMiddleware.Admin,
  TeacherController.updateTeacher
);
router.put(
  '/v1/admin/teacher/:id',
  uploadAvatar,
  AuthMiddleware.Admin,
  TeacherController.updateTeacher
);
router.post(
  '/v1/admin/teacher/:id/update',
  uploadAvatar,
  AuthMiddleware.Admin,
  TeacherController.updateTeacher
);

router.get('/v1/user/findAllTeachers', TeacherController.FindAllTeachers);

export { router as TeacherRouter };
