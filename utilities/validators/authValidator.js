const slugify = require("slugify");
const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");
// httcheck fe el params we el body we hakza.
const validatorMiddleware = require("../../middelwares/validatorMiddleware");
const User = require("../../models/userModel");
const ApiError = require("../apiError");

exports.signupValidator = [
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

  validatorMiddleware,
];
