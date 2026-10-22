import Joi from 'joi';

export let UpdateFee_Validator = Joi.object({
  uniqueId: Joi.string().required().messages({
    'string.empty': 'Unique ID is required',
    'any.required': 'Unique ID is required',
  }),
  Student_id: Joi.string().required().messages({
    'string.empty': 'Student ID is required',
    'any.required': 'Student ID is required',
  }),
  paymentMethod: Joi.string()
    .valid('Cash', 'Cheque', 'Online Transfer', 'UPI', 'Card Payment')
    .required()
    .messages({
      'string.empty': 'Payment method is required',
      'any.required': 'Payment method is required',
      'any.only':
        "Payment method must be one of 'Cash', 'Cheque', 'Online Transfer', 'UPI', or 'Card Payment'",
    }),

  PaymentType: Joi.string()
    .valid(
      'Admission Fee',
      'Farewell Fee',
      'Teacher Day Fee',
      'Exam Fee',
      'Semester Fee',
      'Other'
    )
    .required()
    .messages({
      'string.empty': 'Payment type is required',
      'any.required': 'Payment type is required',
      'any.only':
        "Payment type must be one of 'Admission Fee', 'Farewell Fee', 'Teacher Day Fee', 'Exam Fee', 'Semester Fee', or 'Other'",
    }),
  totalFee: Joi.number().required().messages({
    'number.base': 'Total fee must be a number',
    'any.required': 'Total fee is required',
  }),

  Paid_amount: Joi.number().required().messages({
    'number.base': 'Paid amount must be a number',
    'any.required': 'Paid amount is required',
  }),
});
