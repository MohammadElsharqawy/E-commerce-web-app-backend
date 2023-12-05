const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "user name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
    },
    phoneNumber: String,
    profileImage: String,

    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "too short password"],
    },

    roles: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    active: {
      // we won't delete user, just active or not active.
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
//mmkn aro7 fe el factory and before sending the request in update a3ml (document.save())
userSchema.pre("save", async function (next) {
  console.log(this);
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const setImageURL = (doc) => {
  if (doc.profileImage) {
    const imageURL = `${process.env.BASE_URL}/categories/${doc.profileImage}`;
    doc.profileImage = imageURL;
  }
};

// findAll, findOne, Update
userSchema.post("init", (doc) => {
  //this middleware does't work with create. ("save") works with create.
  setImageURL(doc);
});

//create
userSchema.post("save", (doc) => {
  setImageURL(doc);
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
