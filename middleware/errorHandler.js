
// // ============================================
// // middleware/errorHandler.js
// // ============================================

// /**
//  * Global error handler middleware
//  */
// const errorHandler = (err, req, res, next) => {
//   console.error('Error:', err);

//   // Sequelize validation error
//   if (err.name === 'SequelizeValidationError') {
//     return res.status(400).json({
//       error: 'Validation error',
//       details: err.errors.map(e => ({
//         field: e.path,
//         message: e.message
//       }))
//     });
//   }

//   // Sequelize unique constraint error
//   if (err.name === 'SequelizeUniqueConstraintError') {
//     return res.status(400).json({
//       error: 'Duplicate entry',
//       details: err.errors.map(e => ({
//         field: e.path,
//         message: `${e.path} already exists`
//       }))
//     });
//   }

//   // JWT errors
//   if (err.name === 'JsonWebTokenError') {
//     return res.status(401).json({
//       error: 'Invalid token'
//     });
//   }

//   if (err.name === 'TokenExpiredError') {
//     return res.status(401).json({
//       error: 'Token expired'
//     });
//   }

//   // Multer errors
//   if (err.name === 'MulterError') {
//     return res.status(400).json({
//       error: 'File upload error',
//       message: err.message
//     });
//   }

//   // Default error
//   res.status(err.status || 500).json({
//     error: err.message || 'Internal server error'
//   });
// };

// /**
//  * 404 handler
//  */
// const notFoundHandler = (req, res) => {
//   res.status(404).json({
//     error: 'Route not found'
//   });
// };

// module.exports = {
//   errorHandler,
//   notFoundHandler
// };






const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Duplicate entry',
      details: err.errors.map(e => ({
        field: e.path,
        message: `${e.path} already exists`
      }))
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
