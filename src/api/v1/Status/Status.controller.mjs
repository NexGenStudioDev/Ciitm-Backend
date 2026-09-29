import crypto from 'crypto';
import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import StatusConstant from './Status.constant.mjs';
import StatusUtils from './Status.utils.mjs';
import StudentUtils from '../Student/Student.utils.mjs';
import StatusService from './Status.service.mjs';
import AuthService from '../Auth/Auth.service.mjs';
import AuthConstant from '../Auth/Auth.constant.mjs';
import { Update_Status_Validation } from './status.validator.mjs';
import StudentConstant from '../Student/Student.constant.mjs';

class Status_Controller {
  Find_Student_Status = async (req, res) => {
    try {
      let { uniqueId } = req.params;

      let find_Status = await StatusUtils.FIND_STATUS_BY_STUDENT_ID(uniqueId);

      if (!find_Status) {
        throw new Error(StatusConstant.STATUS_NOT_FOUND);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        StatusConstant.STATUS_FOUND,
        find_Status
      );
    } catch (error) {
      console.log('error', error);
      SendResponse.error(res, StatusCodeConstant.BAD_REQUEST, error.message);
    }
  };

  send_StatusTest_Email = async (req, res) => {
    try {
      let { recipientEmail, studentName, studentPassword } = req.body;
      console.log('req.body', req.body);

      await StatusService.sendReviewMail({
        recipientEmail: recipientEmail,
        studentName: studentName,
        studentPassword: studentPassword,
      });

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        `Send Status Testing Email ${recipientEmail}`
      );
    } catch (error) {
      console.error('Error sending email:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  };

  Update_Student_Status_Controller = async (req, res) => {
    try {
      let { uniqueId } = req.params;
      let { message, applicationStatus } = req.body;

      let find_Student = await StudentUtils.FindByStudentId(uniqueId);

      if (!find_Student) {
        throw new Error(StudentConstant.STUDENT_NOT_FOUND);
      }

      let validate = Update_Status_Validation.validate({
        message,
        applicationStatus,
      });

      if (validate.error) {
        throw new Error(validate.error.message);
      }

      let Updated_Student_Status = await StatusService.Update_Status({
        uniqueId: uniqueId,
        message: message,
        applicationStatus: applicationStatus,
      });

      if (applicationStatus === 'Approved') {
        // Generate a more secure password
        const password = 'Ciitm@' + crypto.randomBytes(8).toString('hex');

        let Sign_Up_new_Student = await AuthService.CreateUser({
          name:
            find_Student.student.firstName +
            ' ' +
            find_Student.student.lastName,
          email: find_Student.student.email[0],
          picture: find_Student.student.avtar,
          role: 'student',
          password: password,
        });

        if (!Sign_Up_new_Student) {
          throw new Error(AuthConstant.USER_NOT_CREATED);
        }

        // Send admission confirmation email with login details
        await StatusService.sendReviewMail({
          recipientEmail: find_Student.student.email[0],
          studentName: find_Student.student.firstName,
          studentPassword: password,
        });
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        StudentConstant.STATUS_UPDATED,
        Updated_Student_Status
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  };
}

export default new Status_Controller();
