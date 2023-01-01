const factory = require("./factoryHandler");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const setParamsId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const getUser = factory.getOne(User);

const getAllUsers = factory.getAll(User);

const updateUser = factory.updateOne(User);

const deleteUser = factory.deleteOne(User);

const uploadProfilePic = catchAsync(async (req, res, next) => {
  req.body.profilePic = `${req.protocol}://${req.get("host")}/api/v1/${
    req.dest
  }/${req.file.filename}`;
  next();
});

const sendRequest = catchAsync(async (req, res, next) => {
  if (req.params.id.toString() === req.user.id.toString()) {
    return next(new AppError("Cannot send request to yourself", 400));
  }
  const user = await User.findById(req.params.id);
  if (user.friendsRequest.includes(req.user.id)) {
    return next(new AppError("Request is already sent", 400));
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { friendsRequest: req.user.id } },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    data: {
      data: updatedUser,
    },
  });
});

const addFriend = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id);
  if (!currentUser.friendsRequest.includes(req.params.id)) {
    return next(new AppError("Something went wrong!", 400));
  }
  const updatedCurrentUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { friends: req.params.id },
      $pull: { friendsRequest: req.params.id },
    },
    { new: true }
  );
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { friends: req.user.id } },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    data: {
      data: updatedCurrentUser,
    },
  });
});

const follow = catchAsync(async (req, res, next) => {
  if (req.params.id.toString() === req.user.id.toString()) {
    return next(new AppError("Cannot follow yourself", 400));
  }
  const currentUser = await User.findById(req.user.id);
  let updatedUser;
  if (currentUser.followers.includes(req.params.id)) {
    updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { followings: req.params.id } },
      { new: true }
    );
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { followers: req.user.id } },
      { new: true }
    );
  } else {
    updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { followings: req.params.id } },
      { new: true }
    );
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { followers: req.user.id } },
      { new: true }
    );
  }
  res.status(200).json({
    status: "Success",
    data: {
      data: updatedUser,
    },
  });
});

module.exports = {
  setParamsId,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  uploadProfilePic,
  sendRequest,
  addFriend,
  follow,
};
