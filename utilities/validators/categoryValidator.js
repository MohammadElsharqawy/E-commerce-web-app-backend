//const { param } = require("express-validator");
const slugify = require("slugify");
const { check, body } = require("express-validator");
// httcheck fe el params we el body we hakza.
const validatorMiddleware = require("../../middelwares/validatorMiddleware");

exports.getCategoryValidator = [
  //1- rules
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid category ID format"),

  //2- middleware => catech error from rules if exist.
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is  required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid category ID forma"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid category ID forma")
    .custom((val, { req }) => {
      // to triger next middleware to delete category image from server
      req.file = 1;
      return true;
    }),

  validatorMiddleware,
];
