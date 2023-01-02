const AppError = require("../utils/appError");

const handleDuplicateKeyError = (err) =>
  new AppError("Duplicate field value. Please use another value", 400);

const handleJWTExpireError = (err) =>
  new AppError("Token has expired. Please login again!", 401);

const handleJWTTokenError = (err) =>
  new AppError("Invalid token. Please login again!", 401);

const handleLimitUnexpectedFile = (err) =>
  new AppError("Number of files exceeded the max count", 400);

const sendErrorDev = function (err, res) {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = function (err, res) {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
    });
  } else {
    return res.status(500).json({
      status: "Fail",
      message: "Something went wrong!",
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.code === 11000) error = handleDuplicateKeyError(error);
    if (error.name === "TokenExpiredError") error = handleJWTExpireError(error);
    if (error.name === "JsonWebTokenError") error = handleJWTTokenError(error);
    if (error.code === "LIMIT_UNEXPECTED_FILE")
      error = handleLimitUnexpectedFile(error);
    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;
