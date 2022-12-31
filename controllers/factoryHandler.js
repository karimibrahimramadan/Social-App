const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = new Model(req.body);
    const savedDoc = await newDoc.save();
    res.status(201).json({
      status: "Success",
      message: "Document has been created",
      data: {
        data: savedDoc,
      },
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!doc) {
      return next(new AppError("Document not found", 404));
    }
    res.status(200).json({
      status: "Success",
      message: "Document has been updated",
      data: {
        data: doc,
      },
    });
  });

const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new AppError("Document not found", 404));
    }
    res.status(200).json({
      status: "Success",
      data: {
        data: doc,
      },
    });
  });

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const apiFeatures = new APIFeatures(Model.find(), req.query)
      .filter()
      .limitFields()
      .search()
      .sort()
      .paginate();
    const docs = await apiFeatures.query;
    res.status(200).json({
      status: "Success",
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("Document not found", 404));
    }
    res.status(204).json({
      status: "Success",
      message: "Document has been deleted",
      data: {
        data: doc,
      },
    });
  });

module.exports = {
  createOne,
  updateOne,
  getAll,
  getOne,
  deleteOne,
};
