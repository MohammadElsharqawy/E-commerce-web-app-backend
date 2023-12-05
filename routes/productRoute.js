const express = require("express");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
  deleteProductImage,
  deleteAllImagesFromServer,
  deleteCoverImageWhenUpdating,
} = require("../services/productService");

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
  deleteProductimageValidator,
} = require("../utilities/validators/productValidator");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );

//ask if this valid
router.patch(
  "/delete-product-image/:id",
  deleteProductimageValidator,
  deleteProductImage
);

// router.patch(
//   "/upload-product-Imagaes/:id",
//   updateProductValidator,
//   uploadProductImages,
//   resizeProductImages,
//   saveImagesInDB
// );

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    deleteCoverImageWhenUpdating,
    updateProduct
  )
  .delete(deleteProductValidator, deleteAllImagesFromServer, deleteProduct); // also delete images from server.

module.exports = router;
