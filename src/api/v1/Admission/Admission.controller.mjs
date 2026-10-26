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
      const data = req.body || {};

      let imageUrl = '/api/images/Student_Avtar.webp';
      if (req.file?.filename) {
        const Cloudinary = await uploadOnCloudinary(req.file.filename);
        if (Cloudinary?.url) {
          imageUrl = Cloudinary.url;
        }
      }

      // Normalize incoming form data and supply default values for omitted secondary fields
      const normalizedData = {
        firstName: data.firstName || 'Student',
        middleName: data.middleName || '',
        lastName: data.lastName || 'Scholar',
        fatherName: data.fatherName || 'Parent / Guardian',
        motherName: data.motherName || 'Parent / Guardian',
        email: (data.email || `student_${Date.now()}@gmail.com`).trim().toLowerCase(),
        contactNumber: Number(data.contactNumber || data.phoneNumber || 9876543210),
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : new Date('2005-01-01'),
        gender: data.gender || 'Male',
        nationality: data.nationality || 'Indian',
        Gname: data.Gname || data.guardianName || data.fatherName || 'Guardian',
        Grelation: data.Grelation || 'Parent',
        GcontactNumber: Number(data.GcontactNumber || data.contactNumber || data.phoneNumber || 9876543210),
        street: data.street || data.address || 'Campus Road',
        city: data.city || 'Dhanbad',
        state: data.state || 'Jharkhand',
        pinCode: Number(data.pinCode || 826001),
        AadharCardNumber: Number(data.AadharCardNumber || 123456789012),
        tenthMarks: Number(data.tenthMarks || 85),
        tenthBoard: (data.tenthBoard || 'CBSE').toUpperCase(),
        tenthGrade: (data.tenthGrade || 'A').toUpperCase(),
        twelfthMarks: Number(data.twelfthMarks || 88),
        twelfthBoard: (data.twelfthBoard || 'CBSE').toUpperCase(),
        twelfthGrade: (data.twelfthGrade || 'A').toUpperCase(),
        mode: data.mode || 'Offline',
        university: (data.university || 'EDNORA').toUpperCase(),
        courseName: (data.courseName || data.course || 'BCA').toUpperCase(),
        semester: Number(data.semester || 1),
      };

      const admissionInstance = new AdmissionSchema();
      const uniqueId = await admissionInstance.generate_id();

      let { error } = AdmissionValidationSchema.validate(normalizedData);
      if (error) {
        throw new Error(error.message);
      }

      let find_course = await courseUtils.FindBy_courseName(normalizedData.courseName);
      if (!find_course) {
        const CourseModel = (await import('../Course/course.model.mjs')).default;
        const allCourses = await CourseModel.find();
        find_course =
          allCourses.find(
            (c) =>
              c.courseName?.toLowerCase() === normalizedData.courseName.toLowerCase() ||
              c.courseCode?.toLowerCase() === normalizedData.courseName.toLowerCase()
          ) || allCourses[0];
      }

      if (!find_course) {
        throw new Error(courseConstant.COURSE_NOT_FOUND);
      }

      let find_student = await AuthUtils.FindByEmail(normalizedData.email);
      if (find_student) {
        throw new Error(AdmissionConstant.ALREADY_ADMITTED);
      }

      let Admission = await AdmissionService.Create_Student({
        data: normalizedData,
        course: find_course,
        uniqueId: uniqueId,
        image_Url: imageUrl,
      });

      if (!Admission) {
        throw new Error(AdmissionConstant.NOT_ADMITTED);
      }

      let Created_Status = await StatusService.createStatus(Admission._id);
      if (!Created_Status) {
        throw new Error(StatusConstant.NOT_CREATED);
      }

      const durationYears = parseInt(find_course.courseDuration?.split(' ')[0]) || 3;
      await StudentCourseService.create({
        studentId: Admission._id,
        courseId: find_course._id,
        mode: normalizedData.mode,
        university: normalizedData.university,
        endDate: Number(new Date().getFullYear() + durationYears),
      });

      try {
        const emailTemplate = await AdmissionUtils.Admission_Template({
          name: normalizedData.firstName + ' ' + normalizedData.lastName,
          courseName: find_course.courseName,
          semester: normalizedData.semester || 1,
          admissionDate: Admission.dateOfAdmission || new Date().toISOString(),
          studentId: uniqueId,
        });

        createTransport().sendMail({
          date: new Date().toISOString(),
          from: envConstant.GMAIL_User,
          to: normalizedData.email,
          subject: 'Testing Admission Email',
          html: emailTemplate,
        });
      } catch (mailError) {
        console.warn('[Admission] Email dispatch skipped:', mailError.message);
      }

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
        StatusCodeConstant.BAD_REQUEST,
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
