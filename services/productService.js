const fs = require("fs");
const { promises: fsPromises } = require("fs");

const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const Product = require("../models/productModel");
const factory = require("./handlerFactory");

const { uploadMixOfImages } = require("../middelwares/uploadImageMiddleware");
const ApiError = require("../utilities/apiError");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.deleteCoverImageWhenUpdating = asyncHandler(async (req, res, next) => {
  if (req.body.imageCover) {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ApiError(`No product for this id ${req.params.id}`, 404));
    }

    const tempArray = product.imageCover.split("/");
    const coverName = tempArray[tempArray.length - 1];

    const imagePathCover = `${__dirname}/../uploads/products/${coverName}`;
    await fsPromises.unlink(imagePathCover);
  }

  next();
});

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // image processing for image cover.

  if (req.files.imageCover) {
    const filename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${filename}`);

    // save image into DB

    req.body.imageCover = filename;
  }

  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

exports.deleteProductImage = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  const existingProduct = await Product.findById(productId);

  // Check if the image exists in the images array
  let imageExists = false;
  existingProduct.images.some((img) => {
    const tempArray = img.split("/");
    const coverName = tempArray[tempArray.length - 1];
    if (coverName === req.body.image) {
      imageExists = true;
      return true;
    }

    return false;
  });

  let product;
  if (imageExists) {
    product = await Product.updateOne(
      { _id: req.params.id },
      { $pull: { images: { $eq: req.body.image } } },
      { new: true }
    );
  } else {
    return next(
      new ApiError(`no matching images for this name ${req.body.image}`, 404)
    );
  }
  if (!product) return next(new ApiError("Product not found", 404));

  const imagePath = `${__dirname}/../uploads/products/${req.body.image}`;
  await fsPromises.unlink(imagePath);

  return res.status(200).send({ product });
});

//when you delete a product, you delete all the images of this.
exports.deleteAllImagesFromServer = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ApiError(`No product for this id ${req.params.id}`, 404));
  }

  const tempArray = product.imageCover.split("/");
  const coverName = tempArray[tempArray.length - 1];

  const imagePathCover = `${__dirname}/../uploads/products/${coverName}`;
  await fsPromises.unlink(imagePathCover);

  await Promise.all(
    product.images.map(async (image) => {
      const tempArray2 = image.split("/");
      const coverName2 = tempArray2[tempArray2.length - 1];
      const imagePath = `${__dirname}/../uploads/products/${coverName2}`;
      await fsPromises.unlink(imagePath);
    })
  );

  next();
});

// @Desc Get List of Products
// @Route GET /api/v1/products/
// @access Public

exports.getProducts = factory.getAll(Product, "Product");

// exports.getProducts = asyncHandler(async (req, res) => {
//   // 1) filtering.

//   // //const QueryStringObj = req.body; // reference
//   // const queryStringObj = { ...req.query }; // value not reference.
//   // const execludeFields = ["page", "limit", "skip", "sort", "fields"];
//   // execludeFields.forEach((field) => delete queryStringObj[field]);

//   // //apply filteration based on (gte, gt, lte, lt)
//   // let queryStr = JSON.stringify(queryStringObj);

//   // //   /\b()\b/--> \b\b tells that we are looking for exact and complete match.
//   // // g, tells to get all matches not the first  only.

//   // queryStr = queryStr.replace(
//   //   /\b(gte|gt|lte|lt)\b/g,
//   //   (element) => `$${element}`
//   // );

//   // //2) pagination.
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 5;
//   // const skip = (page - 1) * limit;

//   // build query.
//   const numberOfDocuments = await Product.countDocuments();
//   const apiFeature = new ApiFeatures(Product.find(), req.query)
//     .paginate(numberOfDocuments)
//     .filter()
//     .search("Product")
//     .limitFields()
//     .sort();
//   //.populate({ path: "category", select: "name -_id" });

//   // execute
//   const { mongooseQuery, paginationResults } = apiFeature;
//   const products = await mongooseQuery;

//   res
//     .status(200)
//     .json({ results: products.length, paginationResults, data: products });

//   // let mongooseQuery = Product.find(JSON.parse(queryStr))
//   //   .skip(skip)
//   //   .limit(limit)

//   // // 3) sorting
//   // if (req.query.sort) {
//   //   const sortFilter = req.query.sort.split(",").join(" ");
//   //   mongooseQuery = mongooseQuery.sort(sortFilter);
//   // } else {
//   //   mongooseQuery = mongooseQuery.sort("-createdAt"); // newest first
//   // }
//   // //4) Fields limiting
//   // if (req.query.fields) {
//   //   const fieldsFilter = req.query.fields.split(",").join(" ");
//   //   mongooseQuery = mongooseQuery.select(fieldsFilter);
//   // } else {
//   //   mongooseQuery = mongooseQuery.select("-__v");
//   // }

//   // //4) Search
//   // if (req.query.keyword) {
//   //   const query = {};

//   //   query.$or = [
//   //     { title: { $regex: req.query.keyword, $options: "i" } },
//   //     {
//   //       description: { $regex: req.query.keyword, $options: "i" },
//   //     },
//   //   ];
//   //   console.log(query);
//   //   mongooseQuery = mongooseQuery.find(query);
//   // }

//   // // execute
//   // const products = await mongooseQuery;

//   // res
//   //   .status(200)
//   //   .json({ results: products.length, page: page, data: products });
// });

// @desc    Get specific product
// @Route   Get  /api/v1/products/:id
// @access  Public
exports.getProduct = factory.getOne(Product);
// exports.getProduct = asyncHandler(async (req, res, next) => {
//   // then catch(err)
//   // try catch(err)
//   // asyncHandler(async) ==>> // express error handler.

//   //const id  = req.params.id;
//   const { id } = req.params; // destructure
//   const product = await Product.findById(id).populate({
//     path: "category",
//     select: "name -_id",
//   }); //mmoken n3ml parameter fy function bta3t factory asmo populateOptions lw true ndef fy el query populate.

//   if (!product)
//     // res.status(404).json({msg :`no product for this id ${id}`});
//     return next(new ApiError(`no product for this id ${id}`, 404));

//   res.status(200).json({ data: product });
// });

// @Desc    Create product
// @Route   POST  /api/v1/products/
// @acces   Private

// private- because the normal user can't create new product, the admin only who can create
exports.createProduct = factory.createOne(Product);

// exports.createProduct = asyncHandler(async (req, res) => {
//   req.body.slug = slugify(req.body.title);
//   const newProduct = await Product.create(req.body);
//   res.status(201).json({ data: newProduct });
// });

// @Desc    Update specific product
// @Route   Put /api/v1/products/:id
// @Access  Private

exports.updateProduct = factory.updateOne(Product);

// exports.updateProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   if (req.body.title) req.body.slug = slugify(req.body.title);

//   const product = await Product.findOneAndUpdate(
//     { _id: id },
//     req.body,
//     { new: true } //third object is options. new = true, to return the new product after the update.
//   );

//   if (!product)
//     //res.status(404).json({msg :`no product for this id ${id}`});
//     return next(new ApiError(`no product for this id ${id}`, 404));

//   res.status(200).json({ data: product });
// });

// @Desc    Delete specific product
// @Route   Delete /api/v1/products/:id
// @Access  Private

exports.deleteProduct = factory.deleteOne(Product);

// exports.deleteProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const product = await Product.findByIdAndDelete(id);

//   if (!product)
//     //res.status(404).json({msg :`no product for this id ${id}`});
//     return next(new ApiError(`no product for this id ${id}`, 404));

//   res.status(204).send(); // 204 -> no content
// });

// // @Desc Create new review
// // @Route POST /api/v1/:productID/review
// // @Access Public

// exports.createProductReview = asyncHandler(async (req, res, next) => {
//   const id = req.params.productId;
//   const product = await Product.findById(id);
//   if (!product) return next(new ApiError(`no product for this id ${id}`, 404));
//   product.reviews.push(req.body);
//   const updateProducted = await product.save();

//   res.status(201).json({ data: updateProducted });
// });

// // @Desc Get all reviews for a product
// // @Route GET /api/v1/:productID/review
// // @Access Public

// exports.getProductReviews = asyncHandler(async (req, res, next) => {
//   const { productID } = req.params;

//   const product = await Product.findById(productID);
//   if (!product)
//     return next(new ApiError(`no product for this id ${productID}`, 404));

//   return res.status(200).json({ data: product.reviews });
// });
