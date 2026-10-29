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

// Academic Promotion Endpoints
router.post('/v1/Student/promote', StudentController.promoteStudent);
router.put('/v1/Student/promote', StudentController.promoteStudent);
router.post('/v1/Student/:uniqueId/promote', StudentController.promoteStudent);
router.put('/v1/Student/:uniqueId/promote', StudentController.promoteStudent);

// Academic Demotion / Standing Endpoints
router.post('/v1/Student/demote', StudentController.demoteStudent);
router.put('/v1/Student/demote', StudentController.demoteStudent);
router.post('/v1/Student/:uniqueId/demote', StudentController.demoteStudent);
router.put('/v1/Student/:uniqueId/demote', StudentController.demoteStudent);

// Student Notification Dispatch (RabbitMQ + Nodemailer)
router.post('/v1/Student/send-notification', StudentController.sendNotification);
router.post('/v1/Student/notification', StudentController.sendNotification);

export { router as StudentRouter };
