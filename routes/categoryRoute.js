const express = require("express");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImages,
  deleteOldCategoryImageFromServer,
} = require("../services/categoryService");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utilities/validators/categoryValidator");

const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

//nested routes
// GET /api/v1/categories/:categoryId/subcategories

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    uploadCategoryImage,
    resizeImages,
    createCategoryValidator,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadCategoryImage,
    deleteOldCategoryImageFromServer,
    resizeImages,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    deleteCategoryValidator,
    deleteOldCategoryImageFromServer,
    deleteCategory
  );

module.exports = router;
