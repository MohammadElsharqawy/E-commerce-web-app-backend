const multer = require("multer");
const ApiError = require("../utilities/apiError");

const multerOptions = () => {
  // DiskStorage engine.

  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     // first parameter: no Error.
  //     cb(null, "uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     //we want each image has a unique filename.
  //     //format: category-${id}-Date.now.jpeg.
  //     //id- we can use the user id, but for now, we will use uuid package to generate id.

  //     //mimetype: "image/jpeg"
  //     const ext = file.mimetype.split("/")[1];
  //     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, filename);
  //   },
  // });

  // memoryStorage engine.
  const multerStorage = multer.memoryStorage();

  // allowd noly images.
  const multerFilter = function (req, file, cb) {
    // if (file.mimetype.split("/")[0] === "image") {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Image is required", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
