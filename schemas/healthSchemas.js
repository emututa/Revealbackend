
const Joi = require('joi');

const healthConditionsSchema = Joi.object({
  conditions: Joi.array()
    .items(Joi.string().min(1).max(255))
    .min(0)
    .required()
    .messages({
      'array.base': 'Conditions must be an array',
      'string.min': 'Each condition must have at least 1 character',
      'string.max': 'Each condition cannot exceed 255 characters'
    })
});

const allergicFoodsSchema = Joi.object({
  foods: Joi.array()
    .items(Joi.string().min(1).max(255))
    .min(0)
    .required()
    .messages({
      'array.base': 'Foods must be an array',
      'string.min': 'Each food name must have at least 1 character',
      'string.max': 'Each food name cannot exceed 255 characters'
    })
});

const foodReactionsSchema = Joi.object({
  reactions: Joi.array()
    .items(
      Joi.object({
        foodName: Joi.string()
          .min(1)
          .max(255)
          .required()
          .messages({
            'string.empty': 'Food name is required',
            'string.min': 'Food name must have at least 1 character',
            'string.max': 'Food name cannot exceed 255 characters'
          }),
        medicalNotes: Joi.string()
          .allow('', null)
          .max(5000)
          .optional()
          .messages({
            'string.max': 'Medical notes cannot exceed 5000 characters'
          })
      })
    )
    .min(0)
    .required()
    .messages({
      'array.base': 'Reactions must be an array'
    })
});

module.exports = {
  healthConditionsSchema,
  allergicFoodsSchema,
  foodReactionsSchema
};