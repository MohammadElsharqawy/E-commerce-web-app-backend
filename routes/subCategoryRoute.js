const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");

const {
  createSubCategoryValidator,
  getsubCategoryValidator,
  updatesubCategoryValidator,
  deletesubCategoryValidator,
} = require("../utilities/validators/subCategoryValidator");

// mergeParams: allow us to access the parameters in other routers

// wen need tp acces categoryId from caregory router.
// GET /api/v1/categories/:categoryId/subcategories
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
  .get(createFilterObj, getSubCategories);

router
  .route("/:id")
  .get(getsubCategoryValidator, getSubCategory)
  .put(updatesubCategoryValidator, updateSubCategory)
  .delete(deletesubCategoryValidator, deleteSubCategory);

module.exports = router;
