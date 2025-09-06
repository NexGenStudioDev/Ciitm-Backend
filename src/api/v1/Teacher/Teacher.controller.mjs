import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import { uploadOnCloudinary } from '../../../utils/Cloudinary.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import TeacherConstant from './Teacher.constant.mjs';
import TeacherService from './Teacher.service.mjs';
import Teacher_validation from './Teacher.validator.mjs';

class Teacher_Controller {
  async createNewTeacher(req, res) {
    try {
      const { filename } = req.file;

      if (!filename) {
        throw new Error(TeacherConstant.Image_Required);
      }

      let validatedData = await TeacherService.validateTeacherData(req.body);

      let Cloudinary = await uploadOnCloudinary(filename);

      if (!Cloudinary) {
        throw new Error(TeacherConstant.Image_NotUploaded);
      }

      let CreateTeacher = await TeacherService.createTeacher({
        teacherData: req.body,
        imageUrl: Cloudinary.url,
      });

      if (!CreateTeacher) {
        throw new Error(TeacherConstant.Teacher_NotCreated);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        TeacherConstant.TeacherCreated,
        CreateTeacher
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || TeacherConstant.Teacher_NotCreated
      );
    }
  }

  async FindAllTeachers(req, res) {
    try {
      let FindAllTeachers = await TeacherService.FindAllTeachers();

      if (FindAllTeachers.length === 0) {
        throw new Error(TeacherConstant.Teacher_NotFound);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        TeacherConstant.Find_Teacher,
        FindAllTeachers
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || TeacherConstant.Teacher_NotFound
      );
    }
  }

  async deleteTeacher(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error(TeacherConstant.Teacher_IdRequired);
      }

      let deletedTeacher = await TeacherService.deleteTeacher(id);

      if (!deletedTeacher) {
        throw new Error(TeacherConstant.Teacher_NotDeleted);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        TeacherConstant.TeacherDeleted,
        deletedTeacher
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.NOT_FOUND,
        error.message || TeacherConstant.Teacher_NotDeleted
      );
    }
  }

  async updateTeacher(req, res) {
    try {
      const { id } = req.params;

      // Optional: handle new image upload
      let imageUrl = null;
      if (req.file && req.file.filename) {
        const cloudinaryResult = await uploadOnCloudinary({
          file: req.file.filename,
          folder: 'Teachers',
        });

        if (!cloudinaryResult) {
          throw new Error(TeacherConstant.Image_NotUploaded);
        }
        imageUrl = cloudinaryResult.url;
      }

      await TeacherService.validateTeacherData(req.body);

      const updatedTeacher = await TeacherService.updateTeacherById(id, {
        ...req.body,
        imageUrl: imageUrl || undefined,
      });

      if (!updatedTeacher) {
        throw new Error(TeacherConstant.Teacher_NotFound);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        TeacherConstant.TeacherUpdated,
        updatedTeacher
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.NOT_FOUND,
        error.message || TeacherConstant.Teacher_NotUpdated
      );
    }
  }
}

export default new Teacher_Controller();
