const fs = require("fs");

const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const Brand = require("../models/brandModel");
const factory = require("./handlerFactory");

const { uploadSingleImage } = require("../middelwares/uploadImageMiddleware");

// upload single image
exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImages = asyncHandler(async (req, res, next) => {
  if (req.file) {
    let brand;
    if (req.params.id) {
      brand = await Brand.findById(req.params.id);
    }
    if (brand && brand.image) {
      const tempArray = brand.imageCover.split("/");
      const coverName = tempArray[tempArray.length - 1];
      const imagePath = `${__dirname}/../uploads/brands/${coverName}`;
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${filename}`);

    req.body.image = filename;
  }
  next();
});

// @Desc Get List of Brands
// @Route GET /api/v1/Brands/
// @access Public

exports.getBrands = factory.getAll(Brand);

// exports.getBrands = asyncHandler(async (req, res) => {
//   // Build query
//   const numberOfDocuments = await Brand.countDocuments();
//   const apiFeature = new ApiFeatures(Brand.find(), req.query)
//     .paginate(numberOfDocuments)
//     .filter()
//     .search()
//     .limitFields()
//     .sort();

//   // execute
//   const { mongooseQuery, paginationResults } = apiFeature;
//   const brands = await mongooseQuery;

//   res
//     .status(200)
//     .json({ results: brands.length, paginationResults, data: brands });
// });

// @desc    Get specific brand
// @Route   Get  /api/v1/brands/:id
// @access  Public

exports.getBrand = factory.getOne(Brand);

// exports.getBrand = asyncHandler(async (req, res, next) => {
//   // then catch(err)
//   // try catch(err)
//   // asyncHandler(async) ==>> // express error handler.

//   //const id  = req.params.id;

//   const brand = await Brand.findById(req.params.id);

//   if (!brand)
//     // res.status(404).json({msg :`no brands for this id ${req.params.id}`});
//     return next(new ApiError(`no brands for this id ${req.params.id}`, 404));

//   res.status(200).json({ data: brand });
// });

// @Desc    Create Brand
// @Route   POST  /api/v1/Brands/
// @acces   Private

// private- because the normal user can't create new Brand, the admin only who can create

exports.createBrand = factory.createOne(Brand);

// exports.createBrand = asyncHandler(async (req, res) => {
//   //const name = req.body.name;
//   // const newbrands = new brandsModel({name});
//   // newbrands.save().then((brands)=>{
//   //     res.json(brands);
//   // }).catch((err)=>{
//   //     res.send(err);
//   // })

//   // brandsModel.create({name: name, slug: slugify(name)}).then((brands)=>{
//   //     res.status(201).send({data : brands});
//   // }).catch((err)=>{
//   //     res.status(400).send(err)
//   // })

//   // async- await syntax
//   //1- add aync before the func name.

//   // try{
//   //    const newbrands = await brandsModel.create({name:name, slug: slugify(name)});
//   //     res.status(201).json({data: newbrands});
//   // } catch(err){
//   //     res.status(400).send(err);
//   // }

//   const newBrand = await Brand.create(req.body);
//   res.status(201).json({ data: newBrand });
// });

// @Desc    Update specific brand
// @Route   Put /api/v1/brands/:id
// @Access  Private

exports.updateBrand = factory.updateOne(Brand);

// exports.updateBrand = asyncHandler(async (req, res, next) => {
//   const brand = await Brand.findByIdAndUpdate(
//     { _id: req.params.id },
//     req.body,
//     { new: true } //third object is options. new = true, to return the new brand after the update.
//   );

//   if (!brand)
//     //res.status(404).json({msg :`no brand for this id ${id}`});
//     return next(new ApiError(`no brand for this id ${req.params.id}`, 404));

//   res.status(200).json({ data: brand });
// });

// @Desc    Delete specific brand
// @Route   Delete /api/v1/brands/:id
// @Access  Private

exports.deleteBrand = factory.deleteOne(Brand);

// exports.deleteBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const brand = await Brand.findByIdAndDelete(id);

//   if (!brand)
//     //res.status(404).json({msg :`no brand for this id ${id}`});
//     return next(new ApiError(`no brand for this id ${id}`, 404));

//   res.status(204).send(); // 204 -> no content
// });
