import joi from 'joi';

export let Update_Status_Validation = joi.object({
  message: joi.string().required().min(3).max(100).messages({
    'string.base': 'Message should be a type of text',
    'string.empty': 'Message cannot be an empty field',
    'string.min': 'Message should have a minimum length of {#limit}',
    'string.max': 'Message should have a maximum length of {#limit}',
    'any.required': 'Message is a required field',
  }),

  applicationStatus: joi
    .string()
    .required()
    .valid('Pending', 'Verified', 'Approved', 'Rejected')
    .min(3)
    .max(100)
    .messages({
      'string.base': 'Application Status should be a type of text',
      'string.empty': 'Application Status cannot be an empty field',
      'string.min': 'Application Status should have a minimum length of {#limit}',
      'string.valid': 'Application Status should be one of \'Pending\', \'Verified\', \'Approved\', \'Rejected\'',
      'string.max': 'Application Status should have a maximum length of {#limit}',
      'any.required': 'Application Status is a required field',
    }),
});
