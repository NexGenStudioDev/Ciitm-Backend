import mongoose from 'mongoose';
import TeacherSchema from './Teacher.model.mjs';

class Teacher_Utils {
  FindBy_teacherName = async (teacherName) => {
    return await TeacherSchema.findOne({ name: teacherName });
  };

  TOTAL_NUMBER_OF_Teachers = async () => {
    try {
      let NUMBER_OF_Teachers = (await TeacherSchema.find({})).length;
      return NUMBER_OF_Teachers;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  FindAllTeachers = async () => {
    try {
      let teachers = await TeacherSchema.find({}).sort({ createdAt: -1 });
      return teachers;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  deleteTeacher = async (teacherId) => {
    try {
      let query;
      if (teacherId && mongoose.Types.ObjectId.isValid(teacherId) && teacherId.length === 24) {
        query = { _id: teacherId };
      } else if (teacherId && teacherId !== 'undefined' && teacherId !== 'null') {
        query = {
          $or: [{ email: teacherId }, { name: teacherId }],
        };
      } else {
        throw new Error('Teacher ID or identifier required');
      }

      let deletedTeacher = await TeacherSchema.findOneAndDelete(query);
      if (!deletedTeacher) {
        throw new Error('Teacher not found');
      }
      return deletedTeacher;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateTeacher = async (teacherId, updateData) => {
    try {
      let teacher = null;
      if (teacherId && mongoose.Types.ObjectId.isValid(teacherId) && teacherId.length === 24) {
        teacher = await TeacherSchema.findById(teacherId);
      }
      if (!teacher && teacherId && teacherId !== 'undefined' && teacherId !== 'null') {
        teacher = await TeacherSchema.findOne({
          $or: [{ email: teacherId }, { name: teacherId }],
        });
      }
      if (!teacher && updateData.email) {
        teacher = await TeacherSchema.findOne({ email: updateData.email });
      }

      if (!teacher) {
        throw new Error('Teacher not found');
      }

      Object.assign(teacher, updateData);
      await teacher.save();
      return teacher;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default new Teacher_Utils();
