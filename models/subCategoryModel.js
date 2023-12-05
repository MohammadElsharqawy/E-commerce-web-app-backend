const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // " hp " -->> "hp"
      unique: [true, "subCategory must be unique"],
      minlength: [2, "too short subCategoty name"],
      maxlength: [32, "too long subCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      //as foreign key in SQL
      type: mongoose.Schema.ObjectId,
      required: [true, "subCategory must belong to a main category"],
      ref: "Categories",
    },
  },
  { timestamps: true }
);

// Model
const SubCategoryModel = mongoose.model("subcategories", subCategorySchema);

module.exports = SubCategoryModel;
