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
      console.log(error)
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Error fetching students by course and semester'
      );
    }
  }

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
}

export default new Student_Controller();
