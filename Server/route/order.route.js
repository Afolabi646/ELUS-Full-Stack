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
import { sendOrderConfirmationEmail } from "../controller/email.controller.js";

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

orderRouter.get("/send-test-email", async (req, res) => {
  try {
    await sendOrderConfirmationEmail("adeshinamuyideen646@gmail.com", {
      orderId: "Test Order",
    });
    res.send("Test email sent!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending test email");
  }
});


export default orderRouter;
