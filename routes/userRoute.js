const express = require("express");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  uploadUserImage,
  resizeImages,
  deleteOldUserImageFromServer,
} = require("../services/userService");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../utilities/validators/userValidator");

const router = express.Router();

router.put("/changePassword/:id", changeUserPasswordValidator, changePassword);

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImages, createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(
    uploadUserImage,
    deleteOldUserImageFromServer,
    resizeImages,
    updateUserValidator,
    updateUser
  )
  .delete(deleteUserValidator, deleteOldUserImageFromServer, deleteUser);

module.exports = router;
