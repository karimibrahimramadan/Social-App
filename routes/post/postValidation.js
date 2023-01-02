const Joi = require("joi");

const createPostValidation = {
  body: Joi.object().required().keys({
    content: Joi.string(),
  }),
};

const updatePostValidation = {
  body: Joi.object().required().keys({
    content: Joi.string(),
  }),
  params: Joi.object()
    .required()
    .keys({
      id: Joi.string().hex().length(24).required(),
    }),
};

const postIdValidation = {
  params: Joi.object()
    .required()
    .keys({
      id: Joi.string().hex().length(24).required(),
    }),
};

const getAllPostsValidation = {
  params: Joi.object()
    .required()
    .keys({
      userId: Joi.string().hex().length(24),
    }),
};

module.exports = {
  createPostValidation,
  updatePostValidation,
  postIdValidation,
  getAllPostsValidation,
};
