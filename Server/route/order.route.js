import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  CashOnDeliveryOrderController,
  paymentController,
  webhookStripe,
  clearCartEndpoint,
  getOrderDetailsController,
  getAllOrdersController,
} from "../controller/order.controller.js";

const orderRouter = Router();

// Order routes
orderRouter.post("/cash-on-delivery", auth, CashOnDeliveryOrderController);
orderRouter.post("/checkout", auth, paymentController);
orderRouter.post("/webhook", webhookStripe);

// Cart management
orderRouter.post("/clear-cart", auth, clearCartEndpoint);
orderRouter.post("/clear-cart/:userId", auth, clearCartEndpoint);

// Order retrieval
orderRouter.get("/order-list", auth, getOrderDetailsController);
orderRouter.get("/all-orders", auth, getAllOrdersController);

export default orderRouter;
