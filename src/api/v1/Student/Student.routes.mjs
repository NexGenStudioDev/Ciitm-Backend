import { Router } from 'express';
import StudentController from './Student.controller.mjs';
const router = Router();

router.get(
  '/v1/Student/FindByCourseAndSemester',
  StudentController.FindByCourseAndSemester
);

router.get(
  '/v1/Student/FindByUniqueId',
  StudentController.FindStudentIdByUniqueId
);
router.get(
  '/v1/Student/validate/:uniqueId',
  StudentController.validateUniqueId
);

export { router as StudentRouter };
