import mongoose from 'mongoose';
import Admission from '../Admission/Admission.model.mjs';
import courseConstant from '../Course/course.constant.mjs';
import courseModel from '../Course/course.model.mjs';
import rabbitMQService from '../../../service/rabbitmq.service.mjs';

class Student_Utils {
  FindByStudentId = async (studentId) => {
    return Admission.findOne({ uniqueId: studentId });
  };

  FindStudentIdByUniqueId = async (uniqueId) => {
    const student = await Admission.findOne({ uniqueId: uniqueId });
    if (!student) {
      throw new Error('Student not found');
    }
    return student._id;
  };

  FindStudent = async (uniqueId) => {
    const student = await Admission.findOne({ uniqueId: uniqueId });
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  };

  FindStudentBySemesterAndCourse = async ({
    semester,
    course,
    PerPage,
    Limit,
  }) => {
    try {
      const Find_Course = await courseModel.findOne({ courseName: course });

      if (!Find_Course) {
        throw new Error(courseConstant.COURSE_NOT_FOUND);
      }
      const query = {
        semester: semester,
        course_Id: String(Find_Course._id),
      };

      const options = {
        limit: Limit || 50,
        skip: (PerPage - 1) * (Limit || 50),
      };

      let a = Admission.find(query, null, options).select(
        'uniqueId student.firstName student.lastName student.middleName student.email  student.avtar student.contactNumber student.dateOfBirth fee.amount_paid  isAdmitted'
      );

      return a.exec().then((students) => {
        return students;
      });
    } catch (error) {
      console.error('Error finding students by semester and course:', error);
      throw new Error(
        error.message || 'Error fetching students by semester and course'
      );
    }
  };

  Find_FeeByStudentId({ studentId }) {
    return Admission.findOne({ studentId: studentId }).select('fee');
  }

  promoteStudent = async ({ uniqueId, targetSemester, reason }) => {
    const student = await Admission.findOne({
      $or: [
        { uniqueId },
        { _id: mongoose.Types.ObjectId.isValid(uniqueId) ? uniqueId : null },
      ],
    });
    if (!student) {
      throw new Error('Student not found');
    }

    const previousSemester = student.semester || 1;
    const newSemester = targetSemester ? Number(targetSemester) : previousSemester + 1;

    if (newSemester > 12) {
      throw new Error('Student has reached the maximum semester (12).');
    }

    student.semester = newSemester;
    await student.save();

    let courseName = 'Academic Degree Program';
    if (student.course_Id) {
      try {
        const course = await courseModel.findById(student.course_Id);
        if (course) courseName = course.courseName;
      } catch (e) {
        // ignore
      }
    }

    const studentEmail = Array.isArray(student.student?.email)
      ? student.student.email[0]
      : student.student?.email;

    const eventPayload = {
      type: 'STUDENT_PROMOTION',
      studentId: student.uniqueId,
      uniqueId: student.uniqueId,
      email: studentEmail,
      studentName: `${student.student?.firstName || ''} ${student.student?.lastName || ''}`.trim() || 'Student',
      courseName,
      previousSemester,
      currentSemester: newSemester,
      reason: reason || 'Academic Progress',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    await rabbitMQService.publish('notifications_queue', eventPayload);

    return {
      student,
      previousSemester,
      currentSemester: newSemester,
      eventPayload,
    };
  };

  demoteStudent = async ({ uniqueId, targetSemester, reason }) => {
    const student = await Admission.findOne({
      $or: [
        { uniqueId },
        { _id: mongoose.Types.ObjectId.isValid(uniqueId) ? uniqueId : null },
      ],
    });
    if (!student) {
      throw new Error('Student not found');
    }

    const previousSemester = student.semester || 1;
    const newSemester = targetSemester ? Number(targetSemester) : Math.max(1, previousSemester - 1);

    if (previousSemester <= 1 && !targetSemester) {
      throw new Error('Student is already in Semester 1. Cannot demote further.');
    }

    student.semester = newSemester;
    await student.save();

    let courseName = 'Academic Degree Program';
    if (student.course_Id) {
      try {
        const course = await courseModel.findById(student.course_Id);
        if (course) courseName = course.courseName;
      } catch (e) {
        // ignore
      }
    }

    const studentEmail = Array.isArray(student.student?.email)
      ? student.student.email[0]
      : student.student?.email;

    const eventPayload = {
      type: 'STUDENT_DEMOTION',
      studentId: student.uniqueId,
      uniqueId: student.uniqueId,
      email: studentEmail,
      studentName: `${student.student?.firstName || ''} ${student.student?.lastName || ''}`.trim() || 'Student',
      courseName,
      previousSemester,
      currentSemester: newSemester,
      reason: reason || 'Curriculum & Standing Review',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    await rabbitMQService.publish('notifications_queue', eventPayload);

    return {
      student,
      previousSemester,
      currentSemester: newSemester,
      eventPayload,
    };
  };

  sendNotification = async ({ uniqueId, email, title, message, priority }) => {
    let student = null;
    if (uniqueId) {
      student = await Admission.findOne({
        $or: [
          { uniqueId },
          { _id: mongoose.Types.ObjectId.isValid(uniqueId) ? uniqueId : null },
        ],
      });
    }

    const recipientEmail =
      email ||
      (student?.student?.email
        ? Array.isArray(student.student.email)
          ? student.student.email[0]
          : student.student.email
        : null);

    if (!recipientEmail) {
      throw new Error('Recipient email is required to send notification.');
    }

    const studentName = student
      ? `${student.student?.firstName || ''} ${student.student?.lastName || ''}`.trim()
      : 'Student';

    const eventPayload = {
      type: 'CUSTOM_NOTIFICATION',
      studentId: uniqueId || student?.uniqueId || 'N/A',
      uniqueId: uniqueId || student?.uniqueId || 'N/A',
      email: recipientEmail,
      studentName,
      title: title || 'Official Announcement',
      message: message || '',
      priority: priority || 'Normal',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    const pubResult = await rabbitMQService.publish('notifications_queue', eventPayload);

    return {
      success: true,
      mode: pubResult.mode,
      messageId: pubResult.messageId,
      eventPayload,
    };
  };
}

export default new Student_Utils();
