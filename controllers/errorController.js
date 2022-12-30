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
    return res.status(400).json({
      status: "Fail",
      message: "Something went wrong!",
    });
  } else {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
    });
  }
};

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;
