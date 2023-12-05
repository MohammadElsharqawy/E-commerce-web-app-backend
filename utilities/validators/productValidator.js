//const { param } = require("express-validator");
const slugify = require("slugify");

const { check, body } = require("express-validator");
// httcheck fe el params we el body we hakza.
const validatorMiddleware = require("../../middelwares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

const ApiError = require("../apiError");

exports.createProductValidator = [
  //1- rules
  //2- middleware => catech error from rules if exist.
  check("title")
    .notEmpty()
    .withMessage("title is required")
    .isLength({ min: 3 })
    .withMessage("Product title must be at least 3 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("product description is required")
    .isLength({ max: 20000 })
    .withMessage("Too long product description."),

  check("quantity")
    .notEmpty()
    .withMessage("product quantity is required")
    .isNumeric()
    .withMessage("product quantity must be a number"),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("product quantity must be a number"),

  check("price")
    .notEmpty()
    .withMessage("product price is required")
    .isNumeric()
    .withMessage("product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Too long price"),

  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price < value)
        throw new Error("priceafterdiscount must be lower than price");

      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("colors must be an array of string"),

  check("imageCover").notEmpty().withMessage("Product imageCover is required"),

  check("image")
    .optional()
    .isArray()
    .withMessage("images should be an array of string"),

  check("category")
    .notEmpty()
    .withMessage("product category must belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No Category for this ${categoryId}`)
          );
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((val, { req }) => {
      const unique = [];
      req.body.subcategories.forEach((v) => {
        if (!unique.includes(v)) {
          unique.push(v);
        }
      });
      if (unique.length !== req.body.subcategories.length) {
        return Promise.reject(
          new ApiError(`subcategories IDs must be unique `, 400)
        );
      }
    })
    // if these subcategories exist in the database or not.
    .custom((subCategoriesID) =>
      SubCategory.find({
        _id: { $exists: true, $in: subCategoriesID },
      }).then((result) => {
        if (result.length === 0 || result.length !== subCategoriesID.length) {
          return Promise.reject(new Error(`Invalid subCategories ids`));
        }
      })
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subCategories) => {
          const subCategoriesIDInDB = [];
          subCategories.forEach((subCategory) => {
            subCategoriesIDInDB.push(subCategory._id.toString());
          });
          const checker = (target, arr) => target.every((v) => arr.includes(v));

          if (!checker(val, subCategoriesIDInDB)) {
            return Promise.reject(
              new ApiError(`subcategories are not belong to category`, 400)
            );
          }
        }
      )
    ),
  check("brand").optional().isMongoId().withMessage("Invalid ID format"),

  check("ratingAverage")
    .optional()
    .isNumeric()
    .toFloat()
    .withMessage("ratingAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("ratingAverage must be above or equal to 1.0")
    .isLength({ max: 5 })
    .withMessage("ratingAverage must be below or equal to 5.0"),

  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingQuantity must be a number"),

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),

  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),

  validatorMiddleware,
];

exports.deleteProductimageValidator = [
  check("id")
    .notEmpty()
    .withMessage("product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),
  body("image")
    .notEmpty()
    .withMessage("Must specify the photo you want to delete"),
  validatorMiddleware,
];
