import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const generateEmailContent = (orderDetails, type) => {
  const products = orderDetails.products
    .map((product) => `${product.name} (x${product.quantity})`)
    .join(", ");
  const address = orderDetails.address || {};
  const deliveryAddress =
    [
      address.address_line_1,
      address.address_line_2,
      address.city,
      address.postcode,
    ]
      .filter(Boolean)
      .join(", ") || "No address provided";

  if (type === "customer") {
    return `Dear Customer,

Your order has been successfully placed. Below are the details of your order:

Order ID: ${orderDetails.orderId}
Products: ${products}
Total Amount: ${orderDetails.totalAmount}
Delivery Address: ${deliveryAddress}

Thank you for shopping with us!
Best regards,
[Your Name]`;
  } else {
    return `A new order has been placed. Below are the details of the order:

Order ID: ${orderDetails.orderId}
Customer Name: ${orderDetails.customerName}
Customer Email: ${orderDetails.customerEmail}
Products: ${products}
Total Amount: ${orderDetails.totalAmount}
Delivery Address: ${deliveryAddress}

Please process the order accordingly.
Best regards,
[Your System]`;
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
    console.error("Error code:", error.code);
    console.error("Error response:", error.response);
    throw error;
  }
};

const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  const subject = "Order Confirmation";
  const content = generateEmailContent(orderDetails, "customer");
  return sendEmail(userEmail, subject, content);
};

const sendNewOrderEmailToAdmin = async (adminEmail, orderDetails) => {
  const subject = "New Order";
  const content = generateEmailContent(orderDetails, "admin");
  return sendEmail(adminEmail, subject, content);
};

export { sendOrderConfirmationEmail, sendNewOrderEmailToAdmin };
