const slugify = require("slugify");
const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");
// httcheck fe el params we el body we hakza.
const validatorMiddleware = require("../../middelwares/validatorMiddleware");
const User = require("../../models/userModel");
const ApiError = require("../apiError");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("user name is  required")
    .isLength({ min: 3 })
    .withMessage("Too short user name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("user email is required")
    .isEmail()
    .withMessage("invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new ApiError("E-mail is already in use", 400));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password is atleast 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error("password confirmation is incorrect");
      }

      return true;
    }),

  check("profileImage").optional(),
  check("roles").optional(),

  check("phoneNumber")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "Invalid phone number format only accepts egyptian and saudi phone numbers"
    ),

  check("confirmPassword")
    .notEmpty()
    .withMessage("confirmation password is required"),
  validatorMiddleware,
];

exports.getUserValidator = [
  //1- rules
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid user ID format"),

  //2- middleware => catech error from rules if exist.
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid user ID format"),

  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid email address")
    .custom((val) => {
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new ApiError("E-mail is already in use", 400));
        }
      });
    }),

  check("phoneNumber")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "Invalid phone number format only accepts egyptian and saudi phone numbers"
    ),

  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("password is atleast 6 characters"),
  check("profileImage").optional(),
  check("roles").optional(),

  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid user ID format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("current password is required"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required"),

  body("password")
    .notEmpty()
    .withMessage("new password is required")

    .custom(async (val, { req }) => {
      // verify the current password.
      const user = await User.findById(req.paramss.id);
      if (!user) throw new ApiError("No user for this id", 404);
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword)
        throw new ApiError("Incorrect current password", 400);

      // verify the confirm password.
      if (val !== req.body.confirmPassword) {
        throw new ApiError("Confirm password doesn't match the new password");
      }

      return true;
    }),

  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid user ID format")
    .custom((val, { req }) => {
      // to triger next middleware to delete user image from server
      req.file = 1;
      return true;
    }),

  validatorMiddleware,
];
