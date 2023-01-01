const factory = require("./factoryHandler");
const Comment = require("../models/Comment");
const catchAsync = require("../utils/catchAsync");

const setCommentIds = (req, res, next) => {
  if (!req.body.post) req.body.post = req.params.postId;
  req.body.user = req.user.id;
  next();
};

const createComment = factory.createOne(Comment);

const updateComment = factory.updateOne(Comment);

const getComment = factory.getOne(Comment);

const getAllComments = factory.getAll(Comment);

const deleteComment = factory.deleteOne(Comment);

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getAllComments,
  getComment,
  setCommentIds,
};
