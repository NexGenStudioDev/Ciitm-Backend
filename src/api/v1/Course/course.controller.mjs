import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import { uploadOnCloudinary } from '../../../utils/Cloudinary.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import courseConstant from './course.constant.mjs';
import courseService from './course.service.mjs';
import courseUtils from './course.utils.mjs';

const Course_Controller = {
  async createCourse(req, res) {
    try {
      let thumbnailUrl = req.body.courseThumbnail || '';

      if (req.file && req.file.filename) {
        let uploadResult = await uploadOnCloudinary(req.file.filename);
        if (uploadResult?.url) {
          thumbnailUrl = uploadResult.url;
        }
      }

      if (!thumbnailUrl) {
        thumbnailUrl =
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
      }

      let payload = {
        ...req.body,
        courseThumbnail: thumbnailUrl,
      };

      if (typeof payload.AdmissionCriteria === 'string') {
        try {
          payload.AdmissionCriteria = JSON.parse(payload.AdmissionCriteria);
        } catch {
          payload.AdmissionCriteria = [payload.AdmissionCriteria];
        }
      } else if (!Array.isArray(payload.AdmissionCriteria)) {
        payload.AdmissionCriteria = ['10+2 with minimum 50% marks'];
      }

      if (payload.coursePrice !== undefined) {
        payload.coursePrice = Number(payload.coursePrice);
      }

      const newCourse = await courseService.createCourse(payload);
      if (!newCourse) {
        throw new Error(courseConstant.COURSE_NOT_CREATED);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        courseConstant.COURSE_CREATED,
        newCourse
      );
    } catch (error) {
      console.error('Error creating course:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || courseConstant.COURSE_NOT_CREATED
      );
    }
  },

  async updateCourse(req, res) {
    try {
      const courseId = req.params.id;
      let payload = { ...req.body };

      if (req.file && req.file.filename) {
        let uploadResult = await uploadOnCloudinary(req.file.filename);
        if (uploadResult?.url) {
          payload.courseThumbnail = uploadResult.url;
        }
      }

      if (typeof payload.AdmissionCriteria === 'string') {
        try {
          payload.AdmissionCriteria = JSON.parse(payload.AdmissionCriteria);
        } catch {
          payload.AdmissionCriteria = [payload.AdmissionCriteria];
        }
      }

      if (payload.coursePrice !== undefined) {
        payload.coursePrice = Number(payload.coursePrice);
      }

      const updated = await courseService.updateCourse(courseId, payload);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        courseConstant.COURSE_UPDATED,
        updated
      );
    } catch (error) {
      console.error('Error updating course:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || courseConstant.COURSE_NOT_UPDATED
      );
    }
  },

  async deleteCourse(req, res) {
    try {
      const courseId = req.params.id;
      const deleted = await courseService.deleteCourse(courseId);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        courseConstant.COURSE_DELETED,
        deleted
      );
    } catch (error) {
      console.error('Error deleting course:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || 'Failed to delete course'
      );
    }
  },

  async FindAllCourses(req, res) {
    try {
      const courses = await courseService.getAllCourses();

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        courseConstant.COURSES_FOUND,
        courses || []
      );
    } catch (error) {
      console.error('Error fetching courses:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || courseConstant.COURSE_NOT_FOUND
      );
    }
  },

  async FindCourseById(req, res) {
    try {
      const courseId = req.params.id;
      const course = await courseUtils.FindCourseById(courseId);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        courseConstant.COURSE_FOUND,
        course
      );
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || courseConstant.COURSE_NOT_FOUND
      );
    }
  },
};

export default Course_Controller;
