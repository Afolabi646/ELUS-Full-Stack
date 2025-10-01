import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    orderId: {
      type: String,
      required: [true, "Provide orderId"],
      unique: true,
    },
    products: [
      {
        productId: {
          type: String,
          required: [true, "Provide productId"],
        },
        product_details: {
          name: String,
          image: String,
        },
        unitPrice: {
          type: Number,
          required: [true, "Provide unit price"],
        },
        quantity: {
          type: Number,
          required: [true, "Provide quantity"],
          min: 1,
        },
        totalPrice: {
          type: Number,
          required: [true, "Provide total price"],
        },
      },
    ],
    paymentId: {
      type: String,
      default: "",
    },
    payment_status: {
      type: String,
      default: "",
    },
    delivery_address: {
      type: mongoose.Schema.ObjectId,
      ref: "address",
    },
    subTotalAmt: {
      type: Number,
      default: 0,
    },
    totalAmt: {
      type: Number,
      default: 0,
    },
    invoice_receipt: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("order", orderSchema);

export default OrderModel;
