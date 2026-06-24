import { model, Schema } from 'mongoose';
import { DepartmentConstant } from './course.constant.mjs';


let Course_Schema = new Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },

  AdmissionCriteria: [{
    type: String,
    required: true,
  }],

  courseCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  courseDescription: {
    type: String,
    required: true,
    trim: true,
  },

  courseDuration: {
    type: String,
    required: true,
    trim: true,
  },

  courseEligibility: {
    type: String,
    required: true,
    trim: true,
  },

  courseThumbnail: {
    type: String,
    required: true,
    trim: true,
  },



  coursePrice: {
    type: Number,
    required: true,
  },

  Department: {
    type: String,
    enum: DepartmentConstant,
    required: true,
  },

  numberOfStudentsEnrolled: {
    type: Number,
    default: 0,
  },
});

export default model('Course', Course_Schema);
