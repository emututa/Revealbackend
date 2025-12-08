// // ============================================
// // middleware/validate.js
// // ============================================

// /**
//  * Middleware to validate request body against a Joi schema
//  */
// const validate = (schema) => {
//   return (req, res, next) => {
//     const { error, value } = schema.validate(req.body, {
//       abortEarly: false,
//       stripUnknown: true
//     });

//     if (error) {
//       const errors = error.details.map(detail => ({
//         field: detail.path.join('.'),
//         message: detail.message
//       }));

//       return res.status(400).json({
//         error: 'Validation failed',
//         details: errors
//       });
//     }

//     // Replace req.body with validated and sanitized value
//     req.body = value;
//     next();
//   };
// };

// module.exports = { validate };







const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    req.body = value;
    next();
  };
};

module.exports = { validate };