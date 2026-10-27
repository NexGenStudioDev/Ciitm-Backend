import mongoose from 'mongoose';
import courseModel from './course.model.mjs';

class Course_Utils {
  FindBy_courseName = async (courseName) => {
    return await courseModel.findOne({ courseName: courseName });
  };

  TOTAL_NUMBER_OF_COURSES = async () => {
    try {
      let NUMBER_OF_COURSES = (await courseModel.find({})).length;
      return NUMBER_OF_COURSES;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  FindAllCourses = async () => {
    try {
      let courses = await courseModel.find({}).sort({ createdAt: -1 });
      return courses;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  FindAllCoursesName = async () => {
    try {
      const courses = await courseModel
        .find({}, { courseName: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();

      return courses;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  FindCourseById = async (courseId) => {
    try {
      let course = null;
      if (courseId && mongoose.Types.ObjectId.isValid(courseId) && courseId.length === 24) {
        course = await courseModel.findById(courseId);
      }
      if (!course && courseId && courseId !== 'undefined' && courseId !== 'null') {
        course = await courseModel.findOne({
          $or: [{ courseCode: courseId }, { courseName: courseId }],
        });
      }
      if (!course) {
        throw new Error('Course not found');
      }
      return course;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateCourse = async (courseId, updateData) => {
    try {
      let course = null;
      if (courseId && mongoose.Types.ObjectId.isValid(courseId) && courseId.length === 24) {
        course = await courseModel.findById(courseId);
      }
      if (!course && courseId && courseId !== 'undefined' && courseId !== 'null') {
        course = await courseModel.findOne({
          $or: [{ courseCode: courseId }, { courseName: courseId }],
        });
      }
      if (!course && updateData.courseCode) {
        course = await courseModel.findOne({ courseCode: updateData.courseCode });
      }
      if (!course && updateData.courseName) {
        course = await courseModel.findOne({ courseName: updateData.courseName });
      }

      if (!course) {
        throw new Error('Course not found');
      }

      // Update fields if provided
      if (updateData.courseName) course.courseName = updateData.courseName;
      if (updateData.courseCode) course.courseCode = updateData.courseCode;
      if (updateData.Department) course.Department = updateData.Department;
      if (updateData.courseDuration || updateData.duration) {
        course.courseDuration = updateData.courseDuration || updateData.duration;
      }
      if (updateData.courseEligibility || updateData.eligibility) {
        course.courseEligibility = updateData.courseEligibility || updateData.eligibility;
      }
      if (updateData.courseDescription || updateData.description) {
        course.courseDescription = updateData.courseDescription || updateData.description;
      }
      if (updateData.coursePrice !== undefined) {
        course.coursePrice = Number(updateData.coursePrice);
      } else if (updateData.fee !== undefined) {
        course.coursePrice = Number(updateData.fee);
      }
      if (updateData.courseThumbnail) {
        course.courseThumbnail = updateData.courseThumbnail;
      }
      if (updateData.AdmissionCriteria) {
        if (Array.isArray(updateData.AdmissionCriteria) && updateData.AdmissionCriteria.length > 0) {
          course.AdmissionCriteria = updateData.AdmissionCriteria;
        } else if (typeof updateData.AdmissionCriteria === 'string') {
          try {
            course.AdmissionCriteria = JSON.parse(updateData.AdmissionCriteria);
          } catch {
            course.AdmissionCriteria = [updateData.AdmissionCriteria];
          }
        }
      }

      await course.save();
      return course;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  deleteCourse = async (courseId) => {
    try {
      let query;
      if (courseId && mongoose.Types.ObjectId.isValid(courseId) && courseId.length === 24) {
        query = { _id: courseId };
      } else if (courseId && courseId !== 'undefined' && courseId !== 'null') {
        query = {
          $or: [{ courseCode: courseId }, { courseName: courseId }],
        };
      } else {
        throw new Error('Course ID or code required');
      }

      let deletedCourse = await courseModel.findOneAndDelete(query);
      if (!deletedCourse) {
        throw new Error('Course not found');
      }
      return deletedCourse;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default new Course_Utils();
