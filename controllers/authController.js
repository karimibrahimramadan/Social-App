const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const signup = catchAsync(async (req, res, next) => {
  const newUser = new User(req.body);
  const savedUser = await newUser.save();
  const token = savedUser.getEmailJWTToken();
  const url = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/verify-email/${token}`;
  const message = `<p>Use this link to verify your email</p><br><a href='${url}'>Verify Email</a>`;
  sendEmail(savedUser.email, message, "Verify Email");
  res.status(201).json({
    status: "Success",
    message: "User has been created",
    data: {
      data: savedUser,
      token,
    },
  });
});

const verifyEmail = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return next(new AppError("Token is invalid or has expired", 401));
  }
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  if (user.confirmEmail) {
    return next(new AppError("Email is already verified", 400));
  }
  const updatedUser = await User.findByIdAndUpdate(
    decoded.id,
    { $set: { confirmEmail: true } },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    message: "Email verified",
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("User with this email doesn't exist", 404));
  }
  if (!user.confirmEmail) {
    return next(new AppError("Verify your email first", 400));
  }
  const match = await user.comparePassword(password);
  if (!match) {
    return next(new AppError("Either email or password is incorrect", 401));
  }
  const token = user.getJWTToken();
  res.cookie("access_token", token, { httpOnly: true }).status(200).json({
    status: "Success",
    message: "Logged in successfully!",
    token,
  });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("User with this email doesn't exist", 404));
  }
  const token = user.getPasswordResetToken();
  await user.save();
  const url = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${token}`;
  const message = `<p>Use this link to reset your password</p><br><a href='${url}'>Reset Password</a>`;
  sendEmail(user.email, message, "Reset Password");
  res.status(200).json({
    status: "Success",
    message: "Email has been sent",
    token,
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordTokenExpire: { $gt: Date.now() },
  }).select("+password");
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 401));
  }
  const { password } = req.body;
  const match = await user.comparePassword(password);
  if (match) {
    return next(new AppError("Use new password", 400));
  }
  const hashedPassword = await user.hashPassword(password);
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        password: hashedPassword,
        passwordChangedAt: Date.now(),
        passwordResetToken: undefined,
        passwordTokenExpire: undefined,
      },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    message: "Password has been reset",
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { password, newPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");
  const match = await user.comparePassword(password);
  if (!match) {
    return next(new AppError("Incorrect password", 401));
  }
  const isMatch = await user.comparePassword(newPassword);
  if (isMatch) {
    return next(new AppError("Use new password", 400));
  }
  const hashedPassword = await user.hashPassword(newPassword);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { password: hashedPassword, passwordChangedAt: Date.now() } },
    { new: true }
  );
  const token = updatedUser.getJWTToken();
  res.cookie("access_token", token, { httpOnly: true }).status(200).json({
    status: "Success",
    message: "Password has been updated",
  });
});

module.exports = {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
};
