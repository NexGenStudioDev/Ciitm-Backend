import { Router } from 'express';
import FeeController from './fee.controller.mjs';
const router = Router();

router.get('/v1/Student/FeeInfo', FeeController.Get_Fee_Info);
router.patch('/v1/Student/FeeUpdate', FeeController.Update_Fee);
router.get(
  '/v1/Student/FeeInfoByStudent',
  FeeController.get_fee_InfoByStudents
);
router.get('/v1/Student/getEarning', FeeController.get_Earnings);
router.get(
  '/v1/Student/getStudentBillById',
  FeeController.get_StudentBillByPaymentId
);

router.post('/v1/Student/createOrder', FeeController.pay_Online);
router.get('/v1/Student/verifyPayment', FeeController.verify_Online_Payment);

router.get('/v1/Student/feeType', FeeController.get_StudentFee_Types);

export { router as Fee_Routes };
// /api/find/student/payment/info?uniqueId=${Student_Id}
