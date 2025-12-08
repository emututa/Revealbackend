const Joi = require('joi');

const scanWithTextSchema = Joi.object({
  foodName: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Food name is required',
      'string.min': 'Food name must have at least 1 character',
      'string.max': 'Food name cannot exceed 255 characters'
    }),
  ingredients: Joi.string()
    .min(1)
    .max(10000)
    .required()
    .messages({
      'string.empty': 'Ingredients are required',
      'string.min': 'Ingredients must have at least 1 character',
      'string.max': 'Ingredients cannot exceed 10000 characters'
    })
});

const scanWithImageSchema = Joi.object({
  foodName: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Food name is required',
      'string.min': 'Food name must have at least 1 character',
      'string.max': 'Food name cannot exceed 255 characters'
    })
});

module.exports = {
  scanWithTextSchema,
  scanWithImageSchema
};