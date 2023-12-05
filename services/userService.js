const { promises: fsPromises } = require("fs");

const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const ApiError = require("../utilities/apiError");
const User = require("../models/userModel");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middelwares/uploadImageMiddleware");

// upload single image
exports.uploadUserImage = uploadSingleImage("profileImage");

exports.deleteOldUserImageFromServer = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const user = await User.findById(req.params.id);
    if (!user)
      return next(new ApiError(`No user for this id ${req.params.id}`, 404));
    if (user.profileImage) {
      const tempArray = user.profileImage.split("/");
      const name = tempArray[tempArray.length - 1];
      const imagePath = `${__dirname}/../uploads/users/${name}`;

      await fsPromises.unlink(imagePath);
    }
  }
  next();
});

exports.resizeImages = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${filename}`);

  req.body.profileImage = filename;

  next();
});

// @Desc Get List of Users
// @Route GET /api/v1/users/
// @access private
exports.getUsers = factory.getAll(User);

// @desc    Get specific USer
// @Route   Get  /api/v1/users/:id
// @access  private
exports.getUser = factory.getOne(User);

// @Desc    Create User
// @Route   POST  /api/v1/Users/
// @acces   Private
exports.createUser = factory.createOne(User);

// @Desc    Update specific User
// @Route   Put /api/v1/user/:id
// @Access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const documnet = await User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      profileImage: req.body.profileImage,
      roles: req.body.roles,
      active: req.body.active,
    },
    { new: true } //third object is options. new = true, to return the new documnet after the update.
  );

  if (!documnet)
    //res.status(404).json({msg :`no documnet for this id ${id}`});
    return next(new ApiError(`no documnet for this id ${req.params.id}`, 404));

  res.status(200).json({ data: documnet });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const documnet = await User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      password: await bcrypt.hash(req.body.password, 12),
    },
    { new: true } //third object is options. new = true, to return the new documnet after the update.
  );

  if (!documnet)
    //res.status(404).json({msg :`no documnet for this id ${id}`});
    return next(new ApiError(`no documnet for this id ${req.params.id}`, 404));

  res.status(200).json({ data: documnet });
});

// @Desc    Delete specific user
// @Route   Delete /api/v1/users/:id
// @Access  Private
exports.deleteUser = factory.deleteOne(User);
