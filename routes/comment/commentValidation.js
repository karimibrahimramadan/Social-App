const Joi = require("joi");

const createCommentValidation = {
  body: Joi.object()
    .required()
    .keys({
      content: Joi.string().min(1).required(),
    }),
  params: Joi.object()
    .required()
    .keys({
      postId: Joi.string().hex().length(24),
    }),
};

const updateCommentValidation = {
  body: Joi.object()
    .required()
    .keys({
      content: Joi.string().min(1),
    }),
  params: Joi.object()
    .required()
    .keys({
      id: Joi.string().hex().length(24).required(),
      postId: Joi.string().hex().length(24),
    }),
};

const getAllCommentsValidation = {
  params: Joi.object()
    .required()
    .keys({
      postId: Joi.string().hex().length(24),
    }),
};

const commentIdValidation = {
  params: Joi.object()
    .required()
    .keys({
      id: Joi.string().hex().length(24).required(),
      postId: Joi.string().hex().length(24),
    }),
};

module.exports = {
  createCommentValidation,
  updateCommentValidation,
  getAllCommentsValidation,
  commentIdValidation,
};
