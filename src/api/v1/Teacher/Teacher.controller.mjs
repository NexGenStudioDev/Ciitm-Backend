import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import { uploadOnCloudinary } from '../../../utils/Cloudinary.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import TeacherConstant from './Teacher.constant.mjs';
import TeacherService from './Teacher.service.mjs';

class Teacher_Controller {
  async createNewTeacher(req, res) {
    try {
      let imageUrl = null;
      if (req.file && req.file.filename) {
        let Cloudinary = await uploadOnCloudinary(req.file.filename);
        if (!Cloudinary) {
          throw new Error(TeacherConstant.Image_NotUploaded);
        }
        imageUrl = Cloudinary.url;
      } else if (req.body.image || req.body.Avtar) {
        imageUrl = req.body.image || req.body.Avtar;
      }

      if (!imageUrl) {
        throw new Error(TeacherConstant.Image_Required);
      }

      await TeacherService.validateTeacherData(req.body);

      let CreateTeacher = await TeacherService.createTeacher({
        teacherData: req.body,
        imageUrl,
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

      let imageUrl = null;
      if (req.file && req.file.filename) {
        const cloudinaryResult = await uploadOnCloudinary(req.file.filename);
        if (!cloudinaryResult) {
          throw new Error(TeacherConstant.Image_NotUploaded);
        }
        imageUrl = cloudinaryResult.url;
      } else if (req.body.image || req.body.Avtar) {
        imageUrl = req.body.image || req.body.Avtar;
      }

      await TeacherService.validateTeacherData(req.body);

      let updatePayload = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role || req.body.designation,
        Specialization: req.body.Specialization || req.body.department,
        Experience: req.body.Experience ? Number(req.body.Experience) : undefined,
      };

      if (imageUrl) {
        updatePayload.image = imageUrl;
      }

      if (
        req.body.facebook ||
        req.body.linkedin ||
        req.body.twitter ||
        req.body.instagram
      ) {
        updatePayload.social_media = [
          {
            facebook: req.body.facebook || '#',
            linkedin: req.body.linkedin || '#',
            twitter: req.body.twitter || '#',
            instagram: req.body.instagram || '#',
          },
        ];
      }

      const updatedTeacher = await TeacherService.updateTeacherById(
        id,
        updatePayload
      );

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
        StatusCodeConstant.BAD_REQUEST,
        error.message || TeacherConstant.Teacher_NotUpdated
      );
    }
  }
}

export default new Teacher_Controller();
