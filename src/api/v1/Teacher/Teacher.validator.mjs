import Joi from 'joi';

let Teacher_validation = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is empty',
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is empty',
    'string.email': 'Email is invalid',
    'string.base': 'Email must be a string',
    'any.required': 'Email is required',
  }),

  role: Joi.string().allow('', null).optional().messages({
    'string.base': 'Role must be a string',
  }),

  Specialization: Joi.string().allow('', null).optional().messages({
    'string.base': 'Specialization must be a string',
  }),

  department: Joi.string().allow('', null).optional(),
  designation: Joi.string().allow('', null).optional(),
  qualification: Joi.string().allow('', null).optional(),
  phone: Joi.string().allow('', null).optional(),

  Experience: Joi.alternatives()
    .try(Joi.number(), Joi.string().allow('', null))
    .optional()
    .messages({
      'any.required': 'Experience is required',
    }),

  instagram: Joi.string().trim().allow('', '#', null).optional(),
  facebook: Joi.string().trim().allow('', '#', null).optional(),
  linkedin: Joi.string().trim().allow('', '#', null).optional(),
  twitter: Joi.string().trim().allow('', '#', null).optional(),
});

export default Teacher_validation;
