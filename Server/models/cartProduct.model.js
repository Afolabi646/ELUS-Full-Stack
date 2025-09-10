import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
  name: String,
  price: Number,
  _id: String,
});

const cartProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    unit: unitSchema,
  },
  {
    timestamps: true,
  }
);

const CartProductModel = mongoose.model("cartProduct", cartProductSchema);

export default CartProductModel;
