//const { param } = require("express-validator");
const slugify = require("slugify");
const { check, body } = require("express-validator");
// httcheck fe el params we el body we hakza.
const validatorMiddleware = require("../../middelwares/validatorMiddleware");

exports.getsubCategoryValidator = [
  //1- rules
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid subCategory ID format"),

  //2- middleware => catech error from rules if exist.
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory name is required")
    .isLength({ min: 2 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("category")
    .notEmpty()
    .withMessage("subCategory must belong to a category")
    .isMongoId()
    .withMessage("Invalid Category ID format"),

  validatorMiddleware,
];

exports.updatesubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid subCategory ID forma"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];

exports.deletesubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid subCategory ID forma"),

  validatorMiddleware,
];
