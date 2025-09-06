import { Router } from 'express';
import TeacherController from './Teacher.controller.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';
import upload from '../../../utils/multerUtils.mjs';

const router = Router();

router.post(
  '/v1/admin/teacher/create',
  upload.single('Avtar'),
  TeacherController.createNewTeacher
);
router.delete(
  '/v1/admin/teacher/:id/delete',
  AuthMiddleware.Admin,
  TeacherController.deleteTeacher
);
router.put(
  '/v1/admin/teacher/:id/update',
  AuthMiddleware.Admin,
  TeacherController.updateTeacher
);

router.get('/v1/user/findAllTeachers', TeacherController.FindAllTeachers);

export { router as TeacherRouter };
