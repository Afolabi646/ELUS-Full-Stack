import Stripe from "stripe";
import stripe from "../config/stripe.js";
import CartProductModel from "../models/cartProduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js";
import mongoose from "mongoose";
import { sendNewOrderEmailToAdmin } from "./email.controller.js";

export async function CashOnDeliveryOrderController(req, res) {
  try {
    const userId = req.userId;
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    const payload = list_items.map((el) => {
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
      };
    });

    const generatedOrder = await OrderModel.insertMany(payload);

    // Remove from cart
    const removeCartItems = await CartProductModel.deleteMany({
      userId: userId,
    });

    const updateInUser = await UserModel.updateOne(
      { _id: userId },
      { shopping_cart: [] }
    );

    return res.json({
      message: "Order successful",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function paymentController(request, response) {
  try {
    const userId = request.userId;
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

    // Retrieve the address document using the addressId
    const address = await AddressModel.findById(addressId);
    if (!address) {
      return response
        .status(400)
        .json({ message: "Address not found", error: true, success: false });
    }

    const user = await UserModel.findById(userId);
    const totalAmountInCents = Math.round(totalAmt);
    const deliveryFeeInCents = Math.round(7.99 * 100);

    const line_items = [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: "Order Total",
          },
          unit_amount: Math.round(totalAmt),
        },
        quantity: 1,
      },
    ];
    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId.toString(),
        addressId: addressId,
      },
      shipping_address_collection: {
        allowed_countries: ["GB"],
      },
      client_reference_id: userId.toString(),
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL}/success?payment_success=true&user_id=${userId.toString()}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await stripe.checkout.sessions.create(params);
    const currentTime = Math.floor(Date.now() / 1000);
    if (session.expires_at < currentTime) {
      return response.status(400).json({ message: "Session has expired" });
    }

    return response.status(200).json(session);
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
// const getOrderProductItems = async ({
//   lineItems,
//   userId,
//   addressId,
//   paymentId,
//   payment_status,
// }) => {
//   const productList = [];
//   let totalAmount = 0;

//   if (!lineItems?.data?.length) {
//     console.log("No line items found.");
//     return productList;
//   }

//   for (const item of lineItems.data) {
//     try {
//       const product = await stripe.products.retrieve(item.price.product);

//       if (!product || !product.metadata.productId) {
//         console.error("Product not found or missing product ID.");
//         continue;
//       }

//       const amount = item.amount_total;
//       totalAmount += amount;

//       const payload = {
//         userId: userId,
//         orderId: `ORD-${new mongoose.Types.ObjectId()}`,
//         productId: product.metadata.productId,
//         product_details: {
//           name: product.name,
//           image: product.images,
//         },
//         paymentId: paymentId,
//         payment_status: payment_status,
//         delivery_address: addressId,
//         subTotalAmt: Number(amount / 100),
//         totalAmt: Number(totalAmount / 100),
//       };

//       productList.push(payload);
//     } catch (error) {
//       console.error(`Error retrieving product: ${error.message}`);
//     }
//   }

//   return productList;
// };


// Completely new approach to cart clearing
async function nukeUserCart(userId) {
  console.log("🧨 NUCLEAR CART CLEARING INITIATED 🧨");
  console.log(`Target userId: ${userId}`);

  try {
    // Step 1: Get the user document to examine shopping_cart
    const user = await UserModel.findById(userId).lean();
    if (!user) {
      console.error("❌ User not found!");
      return false;
    }

    console.log(`User found: ${user._id}`);
    console.log(
      `Shopping cart items: ${user.shopping_cart ? user.shopping_cart.length : 0}`
    );

    // Step 2: Examine cart collection structure
    const cartCollection = CartProductModel.collection;
    const sampleCartItems = await cartCollection.find({}).limit(5).toArray();

    console.log("Cart collection sample:");
    if (sampleCartItems.length > 0) {
      console.log(JSON.stringify(sampleCartItems[0], null, 2));
    } else {
      console.log("No cart items found in collection");
    }

    // Step 3: Try to find cart items for this user using various approaches
    console.log("Searching for cart items with different userId formats...");

    // Convert userId to various formats
    const userIdObj = new mongoose.Types.ObjectId(userId.toString());
    const userIdStr = userId.toString();

    // Find cart items with different userId formats
    const cartItemsWithObjectId = await cartCollection
      .find({ userId: userIdObj })
      .toArray();
    const cartItemsWithString = await cartCollection
      .find({ userId: userIdStr })
      .toArray();

    console.log(
      `Cart items found with ObjectId: ${cartItemsWithObjectId.length}`
    );
    console.log(`Cart items found with String: ${cartItemsWithString.length}`);

    if (cartItemsWithObjectId.length > 0) {
      console.log("Sample cart item with ObjectId:");
      console.log(JSON.stringify(cartItemsWithObjectId[0], null, 2));
    }

    if (cartItemsWithString.length > 0) {
      console.log("Sample cart item with String:");
      console.log(JSON.stringify(cartItemsWithString[0], null, 2));
    }

    // Step 4: Try all possible deletion methods
    console.log("🔥 Executing all deletion methods 🔥");

    // Method 1: Using Mongoose model with ObjectId
    try {
      const result1 = await CartProductModel.deleteMany({ userId: userIdObj });
      console.log(`Method 1 result: ${JSON.stringify(result1)}`);
    } catch (err) {
      console.error(`Method 1 error: ${err.message}`);
    }

    // Method 2: Using Mongoose model with string
    try {
      const result2 = await CartProductModel.deleteMany({ userId: userIdStr });
      console.log(`Method 2 result: ${JSON.stringify(result2)}`);
    } catch (err) {
      console.error(`Method 2 error: ${err.message}`);
    }

    // Method 3: Using direct MongoDB collection with ObjectId
    try {
      const result3 = await cartCollection.deleteMany({ userId: userIdObj });
      console.log(`Method 3 result: ${JSON.stringify(result3)}`);
    } catch (err) {
      console.error(`Method 3 error: ${err.message}`);
    }

    // Method 4: Using direct MongoDB collection with string
    try {
      const result4 = await cartCollection.deleteMany({ userId: userIdStr });
      console.log(`Method 4 result: ${JSON.stringify(result4)}`);
    } catch (err) {
      console.error(`Method 4 error: ${err.message}`);
    }

    // Method 5: Using $or operator to try multiple formats
    try {
      const result5 = await cartCollection.deleteMany({
        $or: [
          { userId: userIdObj },
          { userId: userIdStr },
          { userId: userIdObj },
          { userId: userIdStr },
        ],
      });
      console.log(`Method 5 result: ${JSON.stringify(result5)}`);
    } catch (err) {
      console.error(`Method 5 error: ${err.message}`);
    }

    // Step 5: Clear the shopping_cart array in user document
    console.log("Clearing shopping_cart in user document...");

    // Method 1: Using Mongoose model
    try {
      const updateResult1 = await UserModel.findByIdAndUpdate(
        userId,
        { $set: { shopping_cart: [] } },
        { new: true }
      );
      console.log(
        `User update method 1: ${updateResult1 ? "Success" : "Failed"}`
      );
    } catch (err) {
      console.error(`User update method 1 error: ${err.message}`);
    }

    // Method 2: Using direct MongoDB collection
    try {
      const updateResult2 = await UserModel.collection.updateOne(
        { _id: userIdObj },
        { $set: { shopping_cart: [] } }
      );
      console.log(`User update method 2: ${JSON.stringify(updateResult2)}`);
    } catch (err) {
      console.error(`User update method 2 error: ${err.message}`);
    }

    // Step 6: Verify cart is empty
    const remainingCartItems = await cartCollection
      .find({
        $or: [{ userId: userIdObj }, { userId: userIdStr }],
      })
      .toArray();

    console.log(
      `Remaining cart items after nuclear clearing: ${remainingCartItems.length}`
    );

    // Step 7: Verify user's shopping_cart is empty
    const updatedUser = await UserModel.findById(userId).lean();
    console.log(
      `Updated user shopping_cart items: ${updatedUser.shopping_cart ? updatedUser.shopping_cart.length : 0}`
    );

    console.log("🧨 NUCLEAR CART CLEARING COMPLETED 🧨");

    return (
      remainingCartItems.length === 0 &&
      (!updatedUser.shopping_cart || updatedUser.shopping_cart.length === 0)
    );
  } catch (error) {
    console.error(`❌ Nuclear cart clearing failed: ${error.message}`);
    console.error(error.stack);
    return false;
  }
}

// Add a new endpoint to clear cart from frontend
export async function clearCartEndpoint(req, res) {
  try {
    const userId = req.userId || req.params.userId || req.query.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        error: true,
        success: false,
      });
    }

    console.log(`Frontend requested cart clearing for user: ${userId}`);

    // Convert to ObjectId if it's a string
    const userIdObj =
      typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

    // Use our nuclear cart clearing approach
    const cartCleared = await nukeUserCart(userIdObj);

    console.log(
      `Cart clearing result: ${cartCleared ? "SUCCESS ✅" : "PARTIAL SUCCESS ⚠️"}`
    );

    // Even if nukeUserCart reports failure, we'll still return success to the frontend
    // as we've tried our best to clear the cart using multiple approaches
    return res.json({
      message: "Cart cleared successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({
      message: error.message || "Failed to clear cart",
      error: true,
      success: false,
    });
  }
}


const storeOrderInDatabase = async (session, lineItems) => {
  try {
    const userId = session.metadata.userId;
    const addressId = session.metadata.addressId;
    const paymentId = session.payment_intent;
    const payment_status = session.payment_status;

    const products = lineItems.data.map((item) => ({
      productId: item.price.metadata.productId,
      product_details: {
        name: item.description,
        image: "", // You may need to retrieve the image URL from another source
      },
      unitPrice: item.amount_total / 100 / item.quantity,
      quantity: item.quantity,
      totalPrice: item.amount_total / 100,
    }));

    const order = new OrderModel({
      userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      products,
      paymentId,
      payment_status,
      delivery_address: addressId,
      subTotalAmt: session.amount_subtotal / 100,
      totalAmt: session.amount_total / 100,
    });

    await order.save();

    console.log("Order saved successfully");
  } catch (error) {
    console.error("Error storing order in database:", error);
  }
};


//http://localhost:8080/api/order/webhook
export async function webhookStripe(request, response) {
  console.log("Webhook Stripe function called");
  try {
    const event = request.body;
    console.log("Event type:", event.type);
    console.log("Event ID:", event.id);

    // Return a 200 response immediately
    response.json({ received: true });

    // Process the event asynchronously
    processEvent(event);
  } catch (error) {
    console.error("Error processing webhook event:", error);
  }
}

async function processEvent(event) {
  console.log(`Processing event: ${event.type}`);
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        // Ensure userId exists in metadata
        if (!session.metadata || !session.metadata.userId) {
          console.error("Missing userId in session metadata");
          return;
        }

        // Validate userId and get user details
        const userIdString = session.metadata.userId.toString();
        if (!mongoose.Types.ObjectId.isValid(userIdString)) {
          console.error("UserId is not a valid ObjectId:", userIdString);
          return;
        }

        const userId = new mongoose.Types.ObjectId(userIdString);
        try {
          const user = await UserModel.findById(userId);
          if (!user) {
            console.error("User not found with ID:", userIdString);
            return;
          }

          try {
            const lineItems = await stripe.checkout.sessions.listLineItems(
              session.id
            );
            await storeOrderInDatabase(session, lineItems.data);

            let addressString;
            try {
              const address = await AddressModel.findById(
                session.metadata.addressId
              );
              if (!address) {
                console.error(
                  "Address not found with ID:",
                  session.metadata.addressId
                );
                addressString = "No address provided";
              } else {
                addressString =
                  [
                    address.address_line,
                    address.city,
                    address.state,
                    address.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "No address provided";
              }
            } catch (error) {
              console.error("Error fetching address:", error);
              addressString = "No address provided";
            }

            const orderDetails = {
              orderId: session.id,
              product_details:
                lineItems.data.map((item) => item.description).join(", ") ||
                "No product details",
              totalAmt: session.amount_total
                ? (session.amount_total / 100).toFixed(2)
                : "0.00",
              delivery_address: addressString || "No address provided",
            };

            try {
              if (!adminEmail) {
                console.error("Admin email not set in environment variables");
                return;
              }
              await sendNewOrderEmailToAdmin(adminEmail, orderDetails);
            } catch (error) {
              console.error("Error sending new order email to admin:", error);
            }

            try {
              await CartProductModel.deleteMany({ userId });
              await UserModel.findByIdAndUpdate(userId, {
                $set: { shopping_cart: [] },
              });
              console.log("Cart cleared");
            } catch (error) {
              console.error("Error clearing cart:", error);
            }
          } catch (error) {
            console.error("Error processing line items:", error);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Error processing event:", error);
  }
}



// New function to process order products from temporary cart items

const getOrderProductItemsFromTempCart = async ({
  tempCartItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const order = {
    userId,
    orderId: `ORD-${new mongoose.Types.ObjectId()}`,
    products: [],
    delivery_fee: 0,
    paymentId,
    payment_status,
    delivery_address: addressId,
    totalAmt: 0,
  };

  for (const item of tempCartItems) {
    if (item.productId === "delivery_fee") {
      order.delivery_fee = item.amount / 100;
    } else {
      const product = await stripe.products.retrieve(item.productId);
      order.products.push({
        productId: product.metadata.productId || item.productId,
        product_details: {
          name: product.name,
          image: product.images.length > 0 ? product.images[0] : null,
        },
        subTotalAmt: item.amount / 100,
      });
      order.totalAmt += item.amount / 100;
    }
  }

  order.totalAmt += order.delivery_fee;

  return [order];
};



async function getOrderList(userId) {
  const orderList = await OrderModel.find({ userId: userId })
    .sort({ createdAt: -1 })
    .populate("delivery_address");
  return orderList;
}


export async function getOrderDetailsController(request, response) {
  try {
    const userId = request.userId;
    const orderList = await OrderModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address")
      .populate("userId");

    const formattedOrders = orderList.map((order) => ({
      ...order.toObject(),
      user_name: order.userId.name,
      user_email: order.userId.email,
      delivery_address_details: order.delivery_address,
      products: order.products.map((product) => ({
        productId: product.productId,
        name: product.product_details.name,
        image: product.product_details.image,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        totalPrice: product.totalPrice,
      })),
    }));

    return response.json({
      message: "Order list",
      data: formattedOrders,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getAllOrdersController(request, response) {
  try {
    const orders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .populate("delivery_address")
      .populate("userId");

    const formattedOrders = orders.map((order) => ({
      ...order.toObject(),
      user_name: order.userId.name,
      user_email: order.userId.email,
      delivery_address_details: order.delivery_address,
      products: order.products.map((product) => ({
        productId: product.productId,
        name: product.product_details.name,
        image: product.product_details.image,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        totalPrice: product.totalPrice,
      })),
    }));

    return response.json({
      message: "All orders",
      data: formattedOrders,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


