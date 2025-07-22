// middlewares/error.middleware.js
const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}]`, err);

  const statusCode = err.statusCode || 500;
  const errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message);
    errorResponse.message = `Validation Error: ${messages.join(', ')}`;
    return res.status(400).json(errorResponse);
  }

  // Handle Sequelize unique constraint (duplicate key) errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map((e) => e.message);
    errorResponse.message = `Duplicate Field: ${messages.join(', ')}`;
    return res.status(409).json(errorResponse); // Conflict
  }

  // Handle Sequelize foreign key constraint errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    errorResponse.message = 'Foreign key constraint error';
    return res.status(400).json(errorResponse);
  }

  // Handle Sequelize database errors
  if (err.name === 'SequelizeDatabaseError') {
    errorResponse.message = err.message || 'Database error';
    return res.status(500).json(errorResponse);
  }

  // JWT error (optional if using JWT)
  if (err.name === 'JsonWebTokenError') {
    errorResponse.message = 'Invalid token';
    return res.status(401).json(errorResponse);
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
