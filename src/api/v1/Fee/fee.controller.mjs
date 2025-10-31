import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import crypto from 'crypto';
import SendResponse from '../../../utils/SendResponse.mjs';
import StatusConstant from '../Status/Status.constant.mjs';
import StudentConstant from '../Student/Student.constant.mjs';
import StudentUtils from '../Student/Student.utils.mjs';
import { Payment_Constant } from './fee.constant.mjs';
import feeService from './fee.service.mjs';
import feeUtils from './fee.utils.mjs';
import { UpdateFee_Validator } from './fee.validator.mjs';
import cf from '../../../utils/cashfree.mjs';
import Fee from './fee.model.mjs';
import Admission from '../Admission/Admission.model.mjs';
import AuthUtils from '../Auth/Auth.utils.mjs';

const FeeController = {
  // ✅ Get student fee info by unique ID
  Get_Fee_Info: async (req, res) => {
    try {
      const uniqueId = req.query.uniqueId;
      if (!uniqueId) throw new Error(Payment_Constant.UNIQE_ID_NOT_FOUND);

      const Student_Info = await feeUtils.Find_Fee_By_StudentId(uniqueId);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        Payment_Constant.FETCH_PAYMENT_INFO_SUCCESS,
        { Student_Info }
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || Payment_Constant.FAILED_TO_FETCH_PAYMENT_INFO
      );
    }
  },

  // ✅ Create order only once
  pay_Online: async (req, res) => {
    try {
      const {
        order_amount,
        customer_id,
        customer_name,
        customer_phone,
        customer_email,
        uniqueId,
        PaymentType,
        discount = 0,
      } = req.body;

      if (
        !order_amount ||
        !customer_phone ||
        !customer_email ||
        !uniqueId ||
        !PaymentType
      ) {
        throw new Error(
          'Please provide all required fields: order_amount, customer_phone, customer_email, uniqueId, PaymentType.'
        );
      }

      const { fee } = await feeUtils.TOTAL_FEE_PAID_BY_UNIQUE_ID(uniqueId);
      if (!fee) throw new Error('Student fee details not found.');

      let find_Student = await StudentUtils.FindByStudentId(uniqueId);

      const order_id = 'ORDER_' + crypto.randomBytes(8).toString('hex');

      const orderRequest = {
        order_id,
        order_amount: parseFloat(order_amount),
        order_currency: 'INR',
        customer_details: {
          customer_id,
          customer_name,
          customer_phone: customer_phone.toString(),
          customer_email,
        },
        metadata: {
          uniqueId,
          discount,
          paymentType: PaymentType,
        },
      };

      const response = await cf.PGCreateOrder(orderRequest);
      const cfData = response?.data;
      console.log('Cashfree order creation response:', cfData);
      if (!cfData?.order_id) throw new Error('Failed to create payment order.');

      // uniqueId,
      // studentId,
      // amountPaid,
      // totalFee,
      // dueFee,
      // PaymentType,
      // paymentMethod,
      // PaymentId,
      // status,

      await feeService.createFee({
        uniqueId,
        studentId: find_Student._id,
        Paid_amount: order_amount,
        totalFee: fee.course_Fee,
        dueFee: fee.course_Fee,
        PaymentType,
        PaymentId: cfData.order_id,
        status: 'Pending',
        paymentMethod: 'N/A',
      });

      const hashString = `${cfData.order_id}${cfData.order_amount}${process.env.CASHFREE_CLIENT_SECRET}`;
      const hash_Response = crypto
        .createHash('sha256')
        .update(hashString)
        .digest('hex');

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        Payment_Constant.ORDER_CREATED_SUCCESSFULLY,
        {
          payment_session_id: cfData.payment_session_id,
          order_id: cfData.order_id,
          order_status: 'Pending',
          payment_method: 'N/A',
          hash: hash_Response,
        }
      );
    } catch (error) {
      console.error(
        'Cashfree order creation error:',
        error?.response?.data || error.message
      );
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error?.response?.data?.message || 'Failed to create payment order.'
      );
    }
  },

  // ✅ Get student info by student ID
  get_fee_InfoByStudents: async (req, res) => {
    try {
      const { uniqueId } = req.query;
      if (!uniqueId) throw new Error(Payment_Constant.UNIQE_ID_NOT_FOUND);

      const Student_Info = await StudentUtils.FindByStudentId(uniqueId);
      if (!Student_Info) throw new Error(StudentConstant.STUDENT_NOT_FOUND);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        StudentConstant.STUDENT_FOUND,
        Student_Info
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || Payment_Constant.FAILED_TO_FETCH_PAYMENT_INFO
      );
    }
  },

  get_StudentFee_Types: async (req, res) => {
    try {
      const token = req.cookies?.token || req.headers['authorization'];

      // let email = await AuthUtils.DecodeToken(token);
      // let user = await AuthUtils.FindByEmail(email);
      // console.log('user in get_StudentFee_Types:', user);
      const feeTypes = await feeService.get_Student_FeeAmountAnd_FeeType(
        String('68a20d09d1250cf589498b85')
      );
      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        Payment_Constant.FETCH_FEE_TYPES_SUCCESS,
        feeTypes
      );
    } catch (error) {
      console.error('Error in get_StudentFee_Types:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || Payment_Constant.FAILED_TO_FETCH_FEE_TYPES
      );
    }
  },

  // ✅ Get student's bill info by payment ID
  get_StudentBillByPaymentId: async (req, res) => {
    try {
      const PaymentId = req.query.paymentId;
      if (!PaymentId) throw new Error('Please provide Payment ID');

      const getBillInfo =
        await feeService.get_StudentBillByPaymentId(PaymentId);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        Payment_Constant.FETCH_PAYMENT_INFO,
        getBillInfo
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || Payment_Constant.FAILED_TO_FETCH_PAYMENT_INFO
      );
    }
  },

  // ✅ Get earnings in a date range
  get_Earnings: async (req, res) => {
    try {
      let { startDate, endDate } = req.query;
      if (!startDate) throw new Error(Payment_Constant.MISSING_QUERY_PARAMS);

      if (!endDate) endDate = startDate;

      if (/^\d{4}-\d{2}-\d{2}$/.test(startDate)) startDate += 'T00:00:00.000Z';
      if (/^\d{4}-\d{2}-\d{2}$/.test(endDate)) endDate += 'T23:59:59.999Z';

      const earnings = await feeUtils.Get_Earnings_By_Date_Range({
        startDate,
        endDate,
      });

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        Payment_Constant.EARNINGS_FETCHED_SUCCESSFULLY,
        earnings
      );
    } catch (error) {
      console.error('Error in get_Earnings:', error.message);
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || Payment_Constant.FAILED_TO_FETCH_EARNINGS
      );
    }
  },

  // ✅ Update student fee manually
  Update_Fee: async (req, res) => {
    try {
      const { uniqueId, paymentMethod, Paid_amount, PaymentType } = req.body;

      const { fee, _id } = await feeUtils.TOTAL_FEE_PAID_BY_UNIQUE_ID(uniqueId);
      if (!fee || !_id) throw new Error(StudentConstant.STUDENT_NOT_FOUND);

      const { error } = UpdateFee_Validator.validate({
        uniqueId,
        Student_id: String(_id),
        paymentMethod,
        Paid_amount,
        PaymentType,
        totalFee: fee.course_Fee,
      });

      if (error) throw new Error(error.details[0].message);

      const Update_Fee = await feeService.Update_Student_fee({
        totalFee: fee.course_Fee,
        ...req.body,
      });

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        Payment_Constant.PAYMENT_PAID,
        Update_Fee
      );
    } catch (error) {
      console.error('Error in Update_Fee:', error.message);
      SendResponse.error(res, StatusCodeConstant.BAD_REQUEST, error.message);
    }
  },

  // ✅ Verify payment and update fee status
  verify_Online_Payment: async (req, res) => {
    try {
      const { order_id } = req.query;
      if (!order_id) throw new Error('Order ID is required for verification.');

      const existingFee = await Fee.findOne({ PaymentId: order_id });
      if (!existingFee) throw new Error('Fee record not found.');

      if (existingFee.status === 'Completed') {
        throw new Error('Payment has already been verified and completed.');
      }

      const response = await cf.PGFetchOrder(order_id);
      const data = response?.data;

      const cfOrderStatus = data?.order_status || 'UNKNOWN';

      let paymentStatus = 'Pending';
      if (cfOrderStatus === 'PAID') {
        paymentStatus = 'Completed';
      } else if (['FAILED', 'CANCELLED', 'ACTIVE'].includes(cfOrderStatus)) {
        paymentStatus = 'Failed';
        throw new Error('Payment failed or cancelled.');
      }

      let updatedFee = null;
      let { uniqueId } = existingFee;

      const foundStudent = await Admission.findOne({ uniqueId });

      if (!foundStudent) {
        throw new Error('Student not found');
      }

      const currentPaid = foundStudent?.fee?.amount_paid || 0;
      const currentDue = foundStudent?.fee?.amount_due;

      // Update Admission record if payment is successful
      if (paymentStatus === 'Completed') {
        updatedFee = await Fee.findOneAndUpdate(
          { PaymentId: order_id },
          {
            status: paymentStatus,
            paymentMethod: 'Online Transfer',
            amountPaid: data?.order_amount || 0,
            dueFee: currentDue - (data?.order_amount || 0),
            totalFee: foundStudent.fee.course_Fee,
          },
          { new: true }
        );

        if (!updatedFee) throw new Error('Failed to update fee status.');

        const { uniqueId } = updatedFee;
        const Paid_amount = updatedFee.Paid_amount || 0;
        const totalFee = updatedFee.totalFee || 0;

        await Admission.findOneAndUpdate(
          { uniqueId },
          {
            $set: {
              'fee.amount_paid':
                Number(currentPaid) + Number(data?.order_amount),
              'fee.amount_due': Number(currentDue) - Number(data?.order_amount),
            },
          },
          { new: true, runValidators: true }
        );
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        `Payment status is ${paymentStatus}.`,
        {
          cashfree_status: cfOrderStatus,
          fee_status: paymentStatus,
          payment_method: 'Online Transfer',
          fee: updatedFee,
        }
      );
    } catch (error) {
      console.error('Cashfree payment verification error:', error?.message);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Failed to verify payment.'
      );
    }
  },
};

export default FeeController;
