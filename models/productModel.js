const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Product title is required"],
      minlength: [3, "too short Product title "],
      maxlength: [100, "too long Product title"],
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "too short Product description"],
    },

    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "Product price is required"],
      max: [200000, "Too long Product price"],
    },

    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],

    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },

    images: [String],

    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brands",
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Categories",
      required: [true, "Product must belong to a category"],
    },
    // one product may have multiple categories.
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subcategories",
      },
    ],

    ratingsAverage: {
      type: Number,
      min: [1, "rating must be above or equal to 1"],
      max: [5, "rating must be below or equal to 5"],
    },
    // number of ratings
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// mongoose query middleware
// regular expression: ^ : lw goz2 mn el kelma feh find,   execute this middleware.
//we find get called, this middleware is executed first.
productSchema.pre(/^find/, function (next) {
  //this: is considered the query itself.
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageURL = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageURL;
  }

  if (doc.images) {
    const images = [];
    doc.images.forEach((image) => {
      const imageURL = `${process.env.BASE_URL}/products/${image}`;
      images.push(imageURL);
    });
    doc.images = images;
  }
};

productSchema.post("init", (doc) => {
  //console.log(doc);
  setImageUrl(doc);
});

productSchema.post("save", (doc) => {
  //console.log(doc);
  setImageUrl(doc);
});

const ProductModel = mongoose.model("products", productSchema);

module.exports = ProductModel;
