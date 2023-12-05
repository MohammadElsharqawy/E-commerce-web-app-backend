const mongoose = require("mongoose");

// 1- Create schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: [true, "Brand must be unique"],
      minlength: [3, "Too short Brand name"],
      maxlength: [32, "Too long Brand name"],
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

// const setImageURL = (doc) => {
//   if (doc.image) {
//     const imageURL = `${process.env.BASE_URL}/brands/${doc.image}`;
//     doc.image = imageURL;
//   }
// };

// // findAll, findOne, Update
// brandSchema.post("init", (doc) => {
//   //this middleware does't work with create. ("save") works with create.
//   setImageURL(doc);
// });

// //create
// brandSchema.post("save", (doc) => {
//   setImageURL(doc);
// });

// 2- create the model
const BrandModel = mongoose.model("Brands", brandSchema);

module.exports = BrandModel;
