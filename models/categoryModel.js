const mongoose = require("mongoose");

// 1- Create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    // A and B, ==>> shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true } // createdAt and updatedAt
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageURL;
  }
};

// findAll, findOne, Update
categorySchema.post("init", (doc) => {
  //this middleware does't work with create. ("save") works with create.
  setImageURL(doc);
});

//create
categorySchema.post("save", (doc) => {
  setImageURL(doc);
});
// 2- create the model
const CategoryModel = mongoose.model("Categories", categorySchema);

module.exports = CategoryModel;
