const Joi = require("joi");

const signupValidation = {
  body: Joi.object()
    .required()
    .keys({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    }),
};

const verifyEmailValidation = {
  params: Joi.object().required().keys({
    token: Joi.string().required(),
  }),
};

const loginValidation = {
  body: Joi.object().required().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const forgotpasswordValidation = {
  body: Joi.object().required().keys({
    email: Joi.string().email().required(),
  }),
};

const resetpasswordValidation = {
  body: Joi.object()
    .required()
    .keys({
      password: Joi.string().required(),
      confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    }),
};

const updatepasswordValidation = {
  body: Joi.object()
    .required()
    .keys({
      password: Joi.string().required(),
      newPassword: Joi.string().required(),
      confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
    }),
};

const paramsIdValidation = {
  params: Joi.object()
    .required()
    .keys({
      id: Joi.string().hex().length(24).required(),
    }),
};

module.exports = {
  signupValidation,
  verifyEmailValidation,
  loginValidation,
  forgotpasswordValidation,
  resetpasswordValidation,
  updatepasswordValidation,
  paramsIdValidation,
};
