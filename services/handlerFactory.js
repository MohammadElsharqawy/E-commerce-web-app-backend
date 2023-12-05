const asyncHandler = require("express-async-handler");
const ApiError = require("../utilities/apiError");
const ApiFeatures = require("../utilities/apiFeature");

// takes input Model and returns function.
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document)
      //res.status(404).json({msg :`no document for this id ${id}`});
      return next(new ApiError(`no document for this id ${id}`, 404));

    res.status(204).send(); // 204 -> no content
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    let documnet;
    if (Model.modelName === "products") {
      documnet = await Model.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { images: req.body.images } },
        {
          new: true,
        }
      );
    } else {
      documnet = await Model.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true } //third object is options. new = true, to return the new documnet after the update.
      );
    }
    if (!documnet)
      //res.status(404).json({msg :`no documnet for this id ${id}`});
      return next(
        new ApiError(`no documnet for this id ${req.params.id}`, 404)
      );

    res.status(200).json({ data: documnet });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);

    if (!document)
      return next(
        new ApiError(`no documents for this id ${req.params.id}`, 404)
      );

    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }

    // Build query
    const numberOfDocuments = await Model.countDocuments();
    const apiFeature = new ApiFeatures(Model.find(filter), req.query)
      .paginate(numberOfDocuments)
      .search(modelName)
      .filter()
      .limitFields()
      .sort();

    // execute
    const { mongooseQuery, paginationResults } = apiFeature;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResults, data: documents });
  });
