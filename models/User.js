const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    confirmEmail: { type: Boolean, default: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    gender: { type: String, enum: ["Male", "Female"], default: "Male" },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [18, "Age must be at least 18"],
    },
    profilePic: String,
    phone: String,
    passwordResetToken: String,
    passwordChangedAt: Date,
    passwordTokenExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.hashPassword = async function (inputPassword) {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  return await bcrypt.hash(inputPassword, salt);
};

userSchema.methods.getEmailJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EMAIL_TOKEN_EXPIRE,
  });
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE,
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
