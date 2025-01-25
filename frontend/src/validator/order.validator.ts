import Joi from 'joi';

export const orderValidator = Joi.object({
  group: Joi.string().allow(null, '').optional(),
  name: Joi.string()
    .pattern(/^[a-zA-Zа-яА-ЯёЁ]+$/u)
    .min(4)
    .max(20)
    .allow(null, '')
    .messages({
      'string.base': 'Name must be a string',
      'string.pattern.base': 'Name can only contain letters',
      'string.min': 'Name must have at least 4 characters',
      'string.max': 'Name must have at most 20 characters',
    }),
  surname: Joi.string()
    .pattern(/^[a-zA-Zа-яА-ЯёЁ]+$/u)
    .min(4)
    .max(30)
    .allow(null, '')
    .messages({
      'string.base': 'Surname must be a string',
      'string.pattern.base': 'Surname can only contain letters',
      'string.min': 'Surname must have at least 4 characters',
      'string.max': 'Surname must have at most 30 characters',
    }),
  sum: Joi.number()
    .allow(null, '')
    .messages({
      'number.base': 'Sum must be a number',
    }),
  already_paid: Joi.number()
    .allow(null, '')
    .messages({
      'number.base': 'Already paid must be a number',
    }),
  age: Joi.number()
    .min(16)
    .max(80)
    .allow(null, 0) // Если возраст отсутствует, он может быть равен 0 или null
    .messages({
      'number.base': 'Age must be a number',
      'number.min': 'Age must be at least 16',
      'number.max': 'Age must be at most 80',
    }),
  phone: Joi.string()
    .pattern(/^\d+$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Phone must contain only numbers',
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .allow(null, '')
    .messages({
      'string.email': 'Email must be a valid email address',
    }),
  course: Joi.string().allow(null, '').optional(),
  course_format: Joi.string().allow(null, '').optional(),
  status: Joi.string().allow(null, '').optional(),
  course_type: Joi.string().allow(null, '').optional(),
});