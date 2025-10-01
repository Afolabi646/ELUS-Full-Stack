import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


const generateEmailContent = (orderDetails, type) => {
  if (!orderDetails) {
    throw new Error("Order details are missing");
  }

  const products = orderDetails.products
    ? orderDetails.products.map((product) => product.name).join(", ")
    : "No product details";

  const deliveryAddress = orderDetails.delivery_address
    ? `${orderDetails.delivery_address.address_line || ""}, ${orderDetails.delivery_address.city || ""}, ${orderDetails.delivery_address.state || ""} - ${orderDetails.delivery_address.pincode || ""}`
    : "No address provided";

  if (type === "customer") {
    return `Dear Customer, Your order has been successfully placed. Below are the details of your order: Order ID: ${orderDetails.orderId} Products: ${products} Total Amount: ${orderDetails.totalAmt} Delivery Address: ${deliveryAddress} Thank you for shopping with us! Best regards, [Your Name]`;
  } else if (type === "admin") {
    return `A new order has been placed. Below are the details of the order: Order ID: ${orderDetails.orderId} Products: ${products} Total Amount: ${orderDetails.totalAmt} Delivery Address: ${deliveryAddress} Please process the order accordingly. Best regards, [Your System]`;
  } else {
    throw new Error("Invalid email type");
  }
};

const sendEmail = async (to, subject, content) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: content,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  const subject = "Order Confirmation";
  const content = generateEmailContent(orderDetails, "customer");
  return sendEmail(userEmail, subject, content);
};

const sendNewOrderEmailToAdmin = async (orderDetails) => {
  const subject = "New Order";
  const content = generateEmailContent(orderDetails, "admin");
  return sendEmail(process.env.ADMIN_EMAIL, subject, content);
};

export { sendOrderConfirmationEmail, sendNewOrderEmailToAdmin };
