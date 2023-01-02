const factory = require("./factoryHandler");
const Post = require("../models/Post");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/User");
const AppError = require("../utils/appError");

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

const uploadPostPicsUpdates = catchAsync(async (req, res, next) => {
  if (req.files) {
    let imagesArr = [];
    if (req.files.imagesArr) {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return next(new AppError("Document not found", 404));
      }
      imagesArr = post.images;
      req.files.imagesArr.forEach((file) => {
        imagesArr.push(
          `${req.protocol}://${req.get("host")}/api/v1/uploads/${req.dest}/${
            file.filename
          }`
        );
      });
    } else {
      req.files.images.forEach((file) => {
        imagesArr.push(
          `${req.protocol}://${req.get("host")}/api/v1/uploads/${req.dest}/${
            file.filename
          }`
        );
      });
    }
    req.body.images = imagesArr;
  }
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

const feed = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const posts = await Post.aggregate([
    {
      $match: {
        $or: [
          { user: { $in: user.friends } },
          { user: { $in: user.followings } },
        ],
      },
    },
  ]);
  res.status(200).json({
    status: "Success",
    results: posts.length,
    data: {
      data: posts,
    },
  });
});

const likePost = factory.likeOne(Post);

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPost,
  uploadPostPics,
  setUserId,
  setFilterObj,
  feed,
  likePost,
  uploadPostPicsUpdates,
};
