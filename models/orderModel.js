const mongoose = require("mongoose");

const orderModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "order must belong to specified user"],
    },

    cartItems: [
      // product in shopping cart.
      {
        product: { type: mongoose.Schema.ObjectId, ref: "product" },
        quantity: Number,
        color: String,
        price: String,
      },
    ],
    // those two are for admin. we cam make route for them
    taxPrice: {
      type: Number,
      default: 0,
    },

    shippingPrice: {
      type: Number,
      default: 0,
    },

    //will come from cart whether there is coupon or not
    totalOrderPrice: {
      type: Number,
    },

    paymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", orderModel);
