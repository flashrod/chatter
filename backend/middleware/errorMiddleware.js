/**
 * Error Middleware - Handles errors in the application
 */

/**
 * Not Found Error Handler
 * Handles 404 errors when a route is not found
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * General Error Handler
 * Handles all other errors in the application
 */
const errorHandler = (err, req, res, next) => {
  // Set status code (use 500 if status code is 200)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { notFound, errorHandler }; 