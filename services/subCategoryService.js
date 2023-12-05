const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlerFactory");

// POST /api/v1/categories/:categoryId/subcategories
exports.setCategoryIdToBody = (req, res, next) => {
  // nested routes
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @Desc    Create subCategory
// @Route   POST  /api/v1/subCategories/
// @acces   Private

exports.createSubCategory = factory.createOne(SubCategory);

// exports.createSubCategory = asyncHandler(async (req, res) => {
//   const { name, category } = req.body;

//   const newSubCategory = await SubCategory.create({
//     name: name,
//     slug: slugify(name),
//     category: category,
//   });

//   return res.status(201).json({ newSubCategory });
// });

//nested routes.
// GET /api/v1/categories/:categoryId/subCategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};

// @Desc Get List of subCategories
// @Route GET /api/v1/subCategories/
// @access Public

exports.getSubCategories = factory.getAll(SubCategory);

// exports.getSubCategories = asyncHandler(async (req, res) => {
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 5;
//   // const skip = (page - 1) * limit;

//   // const subCategories = await SubCategory.find(req.filterObject)
//   //   .skip(skip)
//   //   .limit(limit);
//   // //.populate("category"); name of the foreign key, which i stated in the schema kda hyrg3 kol el m3lomat 3n el category.
//   // .populate({ path: "category", select: "name -_id " }); // return name and id, if i want onlt the name ("name -_id")

//   // Build query
//   const numberOfDocuments = await SubCategory.countDocuments();
//   const apiFeature = new ApiFeatures(SubCategory.find(), req.query)
//     .paginate(numberOfDocuments)
//     .filter()
//     .search()
//     .limitFields()
//     .sort();

//   // execute
//   const { mongooseQuery, paginationResults } = apiFeature;
//   const subCategories = await mongooseQuery;

//   res.status(200).json({
//     results: subCategories.length,
//     paginationResults,
//     data: subCategories,
//   });
// });

// @desc    Get specific subCategory
// @Route   Get  /api/v1/subCategories/:id
// @access  Public

exports.getSubCategory = factory.getOne(SubCategory);

// exports.getSubCategory = asyncHandler(async (req, res, next) => {
//   // then catch(err)
//   // try catch(err)
//   // asyncHandler(async) ==>> // express error handler.

//   //const id  = req.params.id;
//   const { id } = req.params; // destructure
//   const subCategory = await SubCategory.findById(id);
//   //   .populate({
//   //     path: "category",
//   //     select: "name -_id",
//   //   });

//   if (!subCategory)
//     // res.status(404).json({msg :`no category for this id ${id}`});
//     return next(new ApiError(`no category for this id ${id}`, 404));

//   res.status(200).json({ data: subCategory });
// });

// @Desc    Update specific subCategory
// @Route   Put /api/v1/subCategories/:id
// @Access  Private
exports.updateSubCategory = factory.updateOne(SubCategory);

// exports.updateSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name, category } = req.body;

//   const subCategory = await SubCategory.findOneAndUpdate(
//     { _id: id },
//     { name: name, slug: slugify(name), category },
//     { new: true } //third object is options. new = true, to return the new category after the update.
//   );

//   if (!subCategory)
//     //res.status(404).json({msg :`no category for this id ${id}`});
//     return next(new ApiError(`no subCcategory for this id ${id}`, 404));

//   res.status(200).json({ data: subCategory });
// });

// @Desc    Delete specific subCategory
// @Route   Delete /api/v1/subCategories/:id
// @Access  Private

exports.deleteSubCategory = factory.deleteOne(SubCategory);

// exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const subCategory = await SubCategory.findByIdAndDelete(id);

//   if (!subCategory)
//     //res.status(404).json({msg :`no category for this id ${id}`});
//     return next(new ApiError(`no subCategory for this id ${id}`, 404));

//   res.status(204).send(); // 204 -> no content
// });
