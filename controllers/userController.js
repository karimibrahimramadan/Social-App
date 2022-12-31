const factory = require("./factoryHandler");
const User = require("../models/User");

const setParamsId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const getUser = factory.getOne(User);

const getAllUsers = factory.getAll(User);

const updateUser = factory.updateOne(User);

const deleteUser = factory.deleteOne(User);

module.exports = {
  setParamsId,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
