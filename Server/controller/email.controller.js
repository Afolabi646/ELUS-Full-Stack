const nodemailer = require("nodemailer");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const transporter = nodemailer.createTransport({
  // Your email service configuration
});

exports.sendPaymentSucceededEmail = (event) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: "recipient-email@example.com",
    subject: "Payment Succeeded",
    text: "Payment succeeded for invoice " + event.data.object.id,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.handleStripeWebhook = (req, res) => {
  const event = req.body;
  if (event.type === "invoice.payment_succeeded") {
    exports.sendPaymentSucceededEmail(event);
  }
  res.sendStatus(200);
};
