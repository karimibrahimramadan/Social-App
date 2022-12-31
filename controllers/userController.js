const factory = require("./factoryHandler");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

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

module.exports = {
  setParamsId,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  uploadProfilePic,
};
