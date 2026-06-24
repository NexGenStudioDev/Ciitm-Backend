import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import { uploadOnCloudinary } from '../../../utils/Cloudinary.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import courseConstant from './course.constant.mjs';
import courseService from './course.service.mjs';
import courseUtils from './course.utils.mjs';

const Course_Controller = {
  async createCourse(req, res) {
    try {
    
       const { filename } = req.file;


       let upload = await  uploadOnCloudinary(filename);

      const newCourse = await courseService.createCourse({ ...req.body, courseThumbnail: upload.url });
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
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || courseConstant.COURSE_NOT_CREATED
      );
    }
  },

  async FindAllCourses(req, res) {
    try {
      const courses = await courseService.getAllCourses();
      if (courses.length === 0) {
        throw new Error(courseConstant.COURSE_NOT_FOUND);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        courseConstant.COURSES_FOUND,
        courses
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
