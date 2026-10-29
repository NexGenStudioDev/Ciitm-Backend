import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import StudentConstant from './Student.constant.mjs';
import StudentUtils from './Student.utils.mjs';
import { studentSearchQuerySchema } from './Student.validate.mjs';

class Student_Controller {
  async FindByCourseAndSemester(req, res) {
    try {
      const { course, semester, PerPage, Limit } = req.query;

      let { error } = studentSearchQuerySchema.validate(req.query);

      if (error) {
        throw new Error(error.details[0].message);
      }

      const students = await StudentUtils.FindStudentBySemesterAndCourse({
        course,
        semester: Number(semester),
        PerPage,
        Limit,
      });
      // Log the students found for debugging

      if (students.length === 0) {
        throw new Error(StudentConstant.STUDENT_NOT_FOUND);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'Students found successfully',
        students
      );
    } catch (error) {
      console.log(error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Error fetching students by course and semester'
      );
    }
  }

  FindStudentIdByUniqueId = async (req, res) => {
    try {
      const { uniqueId } = req.query;

      let findStudentById = await StudentUtils.FindStudent(uniqueId);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        StudentConstant.STUDENT_FOUND,
        findStudentById
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || 'Error validating student ID'
      );
    }
  };

  async Get_BILLING_INVOICE(req, res) {
    try {
      const { uniqueId } = req.query;

      if (!uniqueId) {
        throw new Error(StudentConstant.UNIQUE_ID_NOT_FOUND);
      }

      const studentInfo = await StudentUtils.FindByStudentId(uniqueId);

      if (!studentInfo) {
        throw new Error(StudentConstant.STUDENT_NOT_FOUND);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'Billing invoice fetched successfully',
        studentInfo
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Error fetching billing invoice'
      );
    }
  }

  async validateUniqueId(req, res) {
    try {
      const { uniqueId } = req.params;

      if (!uniqueId || typeof uniqueId !== 'string') {
        throw new Error(StudentConstant.INVALID_UNIQUE_ID);
      }

      const student = await StudentUtils.FindByStudentId(uniqueId);
      const isValid = !!student; // Assuming it will never be "{}"

      const message = isValid
        ? StudentConstant.UNIQUE_ID_VALID
        : StudentConstant.UNIQUE_ID_INVALID;

      SendResponse.success(res, StatusCodeConstant.SUCCESS, message, {
        uniqueId,
        isValidated: isValid,
      });
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Error validating student ID'
      );
    }
  }

  promoteStudent = async (req, res) => {
    try {
      const uniqueId =
        req.body?.uniqueId ||
        req.params?.uniqueId ||
        req.query?.uniqueId ||
        req.body?.id;
      const { semester, targetSemester, reason } = req.body || {};

      if (!uniqueId) {
        throw new Error('Student identifier (uniqueId) is required.');
      }

      const result = await StudentUtils.promoteStudent({
        uniqueId,
        targetSemester: targetSemester || semester,
        reason,
      });

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        `Student successfully promoted to Semester ${result.currentSemester}. Notification queued via RabbitMQ.`,
        result
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || 'Failed to promote student'
      );
    }
  };

  demoteStudent = async (req, res) => {
    try {
      const uniqueId =
        req.body?.uniqueId ||
        req.params?.uniqueId ||
        req.query?.uniqueId ||
        req.body?.id;
      const { semester, targetSemester, reason } = req.body || {};

      if (!uniqueId) {
        throw new Error('Student identifier (uniqueId) is required.');
      }

      const result = await StudentUtils.demoteStudent({
        uniqueId,
        targetSemester: targetSemester || semester,
        reason,
      });

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        `Student term adjusted to Semester ${result.currentSemester}. Notification queued via RabbitMQ.`,
        result
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || 'Failed to adjust student semester'
      );
    }
  };

  sendNotification = async (req, res) => {
    try {
      const { uniqueId, email, title, message, priority } = req.body || {};

      if (!title || !message) {
        throw new Error('Notification title and message are required.');
      }

      const result = await StudentUtils.sendNotification({
        uniqueId,
        email,
        title,
        message,
        priority,
      });

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        `Notification queued successfully (${result.mode}) and will be delivered via Nodemailer.`,
        result
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || 'Failed to dispatch notification'
      );
    }
  };
}

export default new Student_Controller();
