import TeacherConstant from './Teacher.constant.mjs';
import TeacherSchema from './Teacher.model.mjs';
import TeacherUtils from './Teacher.utils.mjs';
import Teacher_validation from './Teacher.validator.mjs';

class TeacherService {
  async createTeacher({ teacherData, imageUrl }) {
    try {
      let CreateTeacher = await TeacherSchema.create({
        name: teacherData.name,
        email: teacherData.email,
        image: imageUrl,
        role: teacherData.role || teacherData.designation || 'Faculty Member',
        Specialization:
          teacherData.Specialization || teacherData.department || 'General',
        Experience: Number(teacherData.Experience) || 0,
        social_media: [
          {
            facebook: teacherData.facebook || 'https://facebook.com/ednora',
            linkedin: teacherData.linkedin || 'https://linkedin.com/company/ednora',
            twitter: teacherData.twitter || 'https://twitter.com/ednora',
            instagram: teacherData.instagram || 'https://instagram.com/ednora',
          },
        ],
      });
      if (!CreateTeacher) {
        throw new Error(TeacherConstant.Teacher_NotCreated);
      }

      return CreateTeacher;
    } catch (error) {
      throw new Error(error.message || TeacherConstant.Teacher_NotCreated);
    }
  }

  async FindAllTeachers() {
    try {
      let FindAllTeachers = await TeacherUtils.FindAllTeachers();
      return FindAllTeachers || [];
    } catch (error) {
      throw new Error(error.message || TeacherConstant.Teacher_NotFound);
    }
  }

  async validateTeacherData(teacherData) {
    const { error } = Teacher_validation.validate(teacherData, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) {
      throw new Error(error.details[0].message);
    }
  }

  async deleteTeacher(teacherId) {
    try {
      if (!teacherId) {
        throw new Error(TeacherConstant.Teacher_IdRequired);
      }
      return await TeacherUtils.deleteTeacher(teacherId);
    } catch (error) {
      throw new Error(error.message || TeacherConstant.Teacher_NotDeleted);
    }
  }

  async updateTeacherById(teacherId, teacherData) {
    try {
      if (!teacherId) {
        throw new Error(TeacherConstant.Teacher_IdRequired);
      }

      return await TeacherUtils.updateTeacher(teacherId, teacherData);
    } catch (error) {
      throw new Error(error.message || TeacherConstant.Teacher_NotUpdated);
    }
  }
}

export default new TeacherService();
