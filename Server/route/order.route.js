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

orderRouter.post("/cash-on-delivery", auth, CashOnDeliveryOrderController);
orderRouter.post("/checkout", auth, paymentController);
orderRouter.post("/webhook", webhookStripe);
// Add new route for clearing cart after successful payment
orderRouter.post("/clear-cart", auth, clearCartEndpoint);
// Also support route with userId parameter for flexibility
orderRouter.post("/clear-cart/:userId", auth, clearCartEndpoint);
orderRouter.get("/order-list", auth, getOrderDetailsController);
orderRouter.get("/all-orders", auth,  getAllOrdersController);


export default orderRouter;
