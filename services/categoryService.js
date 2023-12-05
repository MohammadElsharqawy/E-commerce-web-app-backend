const { promises: fsPromises } = require("fs");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const Category = require("../models/categoryModel");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middelwares/uploadImageMiddleware");
const ApiError = require("../utilities/apiError");

//upload a single image
exports.uploadCategoryImage = uploadSingleImage("image");

exports.deleteOldCategoryImageFromServer = asyncHandler(
  async (req, res, next) => {
    if (req.file) {
      const category = await Category.findById(req.params.id);
      if (!category)
        return next(
          new ApiError(`No category for this id ${req.params.id}`, 404)
        );

      if (category.image) {
        const tempArray = category.image.split("/");
        const coverName = tempArray[tempArray.length - 1];
        const imagePath = `${__dirname}/../uploads/categories/${coverName}`;
        await fsPromises.unlink(imagePath);
      }
    }
    next();
  }
);

// image processing
exports.resizeImages = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  //when we used memory storage, req.file has new (buffer) field.
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`); //persistent to Disk Storage

  req.body.image = filename;

  next();
});

// @Desc Get List of Categories
// @Route GET /api/v1/categories/
// @access Public

exports.getCategories = factory.getAll(Category);

// exports.getCategories = asyncHandler(async (req, res) => {
//   // Build query
//   const numberOfDocuments = await Category.countDocuments();
//   const apiFeature = new ApiFeatures(Category.find(), req.query)
//     .paginate(numberOfDocuments)
//     .filter()
//     .search()
//     .limitFields()
//     .sort();

//   // execute
//   const { mongooseQuery, paginationResults } = apiFeature;
//   const categories = await mongooseQuery;

//   res
//     .status(200)
//     .json({ results: categories.length, paginationResults, data: categories });
// });

// @desc    Get specific category
// @Route   Get  /api/v1/categories/:id
// @access  Public

exports.getCategory = factory.getOne(Category);

// exports.getCategory = asyncHandler(async (req, res, next) => {
//   // then catch(err)
//   // try catch(err)
//   // asyncHandler(async) ==>> // express error handler.

//   //const id  = req.params.id;
//   const { id } = req.params; // destructure
//   const category = await Category.findById(id);

//   if (!category)
//     // res.status(404).json({msg :`no category for this id ${id}`});
//     return next(new ApiError(`no category for this id ${id}`, 404));

//   res.status(200).json({ data: category });
// });

// @Desc    Create category
// @Route   POST  /api/v1/categories/
// @acces   Private

// private- because the normal user can't create new category, the admin only who can create

exports.createCategory = factory.createOne(Category);

// exports.createCategory = asyncHandler(async (req, res) => {
//   //const name = req.body.name;
//   // const newCategory = new CategoryModel({name});
//   // newCategory.save().then((category)=>{
//   //     res.json(category);
//   // }).catch((err)=>{
//   //     res.send(err);
//   // })

//   // CategoryModel.create({name: name, slug: slugify(name)}).then((category)=>{
//   //     res.status(201).send({data : category});
//   // }).catch((err)=>{
//   //     res.status(400).send(err)
//   // })

//   // async- await syntax
//   //1- add aync before the func name.

//   // try{
//   //    const newCategory = await CategoryModel.create({name:name, slug: slugify(name)});
//   //     res.status(201).json({data: newCategory});
//   // } catch(err){
//   //     res.status(400).send(err);
//   // }

//   const { name } = req.body;
//   const newCategory = await Category.create({
//     name: name,
//     slug: slugify(name),
//   });
//   res.status(201).json({ data: newCategory });
// });

// @Desc    Update specific category
// @Route   Put /api/v1/categories/:id
// @Access  Private

exports.updateCategory = factory.updateOne(Category);

// exports.updateCategory = asyncHandler(async (req, res, next) => {
//   const category = await Category.findByIdAndUpdate(
//     { _id: req.params.id },
//     req.body,
//     { new: true } //third object is options. new = true, to return the new category after the update.
//   );

//   if (!category)
//     //res.status(404).json({msg :`no category for this id ${id}`});
//     return next(new ApiError(`no category for this id ${req.params.id}`, 404));

//   res.status(200).json({ data: category });
// });

// @Desc    Delete specific category
// @Route   Delete /api/v1/categories/:id
// @Access  Private

exports.deleteCategory = factory.deleteOne(Category);

// exports.deleteCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const category = await Category.findByIdAndDelete(id);

//   if (!category)
//     //res.status(404).json({msg :`no category for this id ${id}`});
//     return next(new ApiError(`no category for this id ${id}`, 404));

//   res.status(204).send(); // 204 -> no content
// });
