import { uploadOnCloudinary } from '../../../utils/Cloudinary.mjs';
import AdmissionSchema from './Admission.model.mjs';
import AuthUtils from '../Auth/Auth.utils.mjs';
import courseConstant from '../Course/course.constant.mjs';
import courseUtils from '../Course/course.utils.mjs';
import StatusConstant from '../Status/Status.constant.mjs';
import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import StatusService from '../Status/Status.service.mjs';
import AdmissionConstant from './Admission.constant.mjs';
import AdmissionService from './Admission.service.mjs';
import { AdmissionValidationSchema } from './Admission.validator.mjs';
import StudentCourseService from '../Student_Course/Student-Course.service.mjs';
// import EmailService from '../Email/Email.service.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import AdmissionUtils from './Admission.utils.mjs';
import { createTransport } from '../../../utils/SendMail.js';
import envConstant from '../../../constant/env.constant.mjs';

class AdmissionController {
  create = async (req, res) => {
    try {
      const data = req.body;
      let { courseName } = req.body;

      if (!req.file) {
        throw new Error('No file uploaded');
      }

      const { filename } = req.file;

      const admissionInstance = new AdmissionSchema();

      const uniqueId = await admissionInstance.generate_id();

      let { error } = AdmissionValidationSchema.validate(data);

      if (error) {
        throw new Error(error.message);
      }

      const find_course = await courseUtils.FindBy_courseName(data.courseName);

      if (!find_course) {
        throw new Error(courseConstant.COURSE_NOT_FOUND);
      }

      let find_student = await AuthUtils.FindByEmail(data.email);

      if (find_student) {
        throw new Error(AdmissionConstant.ALREADY_ADMITTED);
      }

      let Cloudinary = await uploadOnCloudinary(filename);

      if (Cloudinary.error) {
        throw new Error('Failed to Upload Image');
      }

      let Admission = await AdmissionService.Create_Student({
        data: data,
        course: find_course,
        uniqueId: uniqueId,
        image_Url: Cloudinary.url,
      });

      if (!Admission) {
        throw new Error(AdmissionConstant.NOT_ADMITTED);
      }

      let Created_Status = await StatusService.createStatus(Admission._id);

      if (!Created_Status) {
        throw new Error(StatusConstant.NOT_CREATED);
      }

      await StudentCourseService.create({
        studentId: Admission._id,
        courseId: find_course._id,
        mode: data.mode,
        university: data.university,
        endDate: Number(
          new Date().getFullYear() +
            parseInt(find_course.courseDuration.split(' ')[0])
        ),
      });

      const emailTemplate = await AdmissionUtils.Admission_Template({
        name: data.firstName + ' ' + data.lastName,
        courseName: data.courseName,
        semester: 1,
        admissionDate: Admission.dateOfAdmission,
        studentId: uniqueId,
      });

      createTransport().sendMail({
        date: new Date().toISOString(),
        from: envConstant.GMAIL_User,
        to: data.email,
        subject: 'Testing Admission Email',
        html: emailTemplate,
      });

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        AdmissionConstant.ADMITTED,
        Admission
      );
    } catch (error) {
      console.error('Error in create admission:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || AdmissionConstant.NOT_ADMITTED
      );
    }
  };

  sendTestingAdmissionEmail = async (req, res) => {
    try {
      const { name, courseName, semester, admissionDate, studentId, email } =
        req.body;

      const emailTemplate = await AdmissionUtils.Admission_Template({
        name,
        courseName,
        semester,
        admissionDate,
        studentId,
      });

      createTransport().sendMail({
        date: new Date().toISOString(),
        from: envConstant.GMAIL_User,
        to: email,
        subject: 'Testing Admission Email',
        html: emailTemplate,
      });

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'Check your email We send you a testing email regarding your admission'
      );
    } catch (error) {
      console.error('Error in sendTestingAdmissionEmail:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || 'Failed to generate email template'
      );
    }
  };
}

export default new AdmissionController();
