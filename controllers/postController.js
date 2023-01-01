const factory = require("./factoryHandler");
const Post = require("../models/Post");
const catchAsync = require("../utils/catchAsync");

const uploadPostPics = catchAsync(async (req, res, next) => {
  let images = [];
  req.files.forEach((file) => {
    images.push(
      `${req.protocol}://${req.get("host")}/api/v1/uploads/${req.dest}/${
        file.filename
      }`
    );
  });
  req.body.images = images;
  next();
});

const setUserId = (req, res, next) => {
  req.body.user = req.user.id;
  next();
};

const setFilterObj = (req, res, next) => {
  res.locals.filterObj = req.params.userId ? { user: req.params.userId } : {};
  next();
};

const createPost = factory.createOne(Post);

const updatePost = factory.updateOne(Post);

const deletePost = factory.deleteOne(Post);

const getPost = factory.getOne(Post);

const getAllPosts = factory.getAll(Post);

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPost,
  uploadPostPics,
  setUserId,
  setFilterObj,
};
