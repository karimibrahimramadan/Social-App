const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies.access_token) {
    token = req.cookies.access_token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You need to login first", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return next(new AppError("Token is invalid or has expired", 401));
  }
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  if (user.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError("Password was recently changed. Log in again!", 401)
    );
  }
  req.user = user;
  next();
});

const retrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Authorization denied", 403));
    } else {
      next();
    }
  };
};

module.exports = {
  protect,
  retrictTo,
};
