import Joi from 'joi';
import { DepartmentConstant } from './course.constant.mjs';


export const courseValidationSchema = Joi.object({
  courseName: Joi.string().trim().min(3).required().messages({
    'string.empty': 'Course name cannot be empty',
    'any.required': 'Course name is required',
    'string.base': 'Course name must be a valid string',
    'string.min': 'Course name must have at least 3 characters',
  }),

  AdmissionCriteria: Joi.array()
    .items(
      Joi.string().trim().required().messages({
        'string.empty': 'Admission criteria cannot be empty',
        'string.base': 'Admission criteria must be a valid string',
      })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Admission criteria must be an array',
      'array.min': 'At least one admission criterion is required',
      'any.required': 'Admission criteria are required',
    }),

  courseCode: Joi.string().trim().min(3).required().messages({
    'string.empty': 'Course code cannot be empty',
    'any.required': 'Course code is required',
    'string.base': 'Course code must be a valid string',
    'string.min': 'Course code must have at least 3 characters',
  }),

  courseDescription: Joi.string().trim().required().messages({
    'string.empty': 'Course description cannot be empty',
    'any.required': 'Course description is required',
    'string.base': 'Course description must be a valid string',
  }),

  courseDuration: Joi.string().trim().required().messages({
    'string.empty': 'Course duration cannot be empty',
    'any.required': 'Course duration is required',
    'string.base': 'Course duration must be a valid string',
  }),

  courseEligibility: Joi.string().trim().required().messages({
    'string.empty': 'Course eligibility cannot be empty',
    'any.required': 'Course eligibility is required',
    'string.base': 'Course eligibility must be a valid string',
  }),

  courseThumbnail: Joi.string().trim().uri().required().messages({
    'string.empty': 'Course thumbnail URL cannot be empty',
    'any.required': 'Course thumbnail URL is required',
    'string.base': 'Course thumbnail must be a valid string',
    'string.uri': 'Course thumbnail must be a valid URI',
  }),

  coursePrice: Joi.number().min(0).required().messages({
    'number.base': 'Course price must be a valid number',
    'number.min': 'Course price cannot be negative',
    'any.required': 'Course price is required',
  }),

  Department: Joi.string().valid(...DepartmentConstant).required().messages({
    'any.only': `Department must be one of the following: ${DepartmentConstant.join(
      ', '
    )}`,
    'any.required': 'Department is required',
  }),
});