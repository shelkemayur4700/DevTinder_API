const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/payments");
const User = require("../models/user");

const webhookRouter = express.Router();

webhookRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    console.log(
      "process.env.STRIPE_WEBHOOK_KEY",
      process.env.STRIPE_WEBHOOK_KEY
    );
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_KEY
      );
    } catch (err) {
      console.error("Webhook Error:", err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }
    console.log("event", event);
    // Handle the payment_intent.succeeded event
    if (event.type === "charge.succeeded") {
      const paymentIntentData = event.data.object;
      console.log("✅ Payment successful:", paymentIntentData.status);

      // Update the payment status in MongoDB
      const paymentDetails = await Payment.findOneAndUpdate(
        {
          paymentId: paymentIntentData?.payment_intent,
        },
        { status: paymentIntentData?.status },
        { new: true }
      );

      //User update membership details
      const user = await User.findOne({ _id: paymentDetails.userId });
      user.isPremium = true;
      user.membershipType = paymentDetails.membershipType;
      console.log("User saved");

      await user.save();
      console.log("paymentDetails", paymentDetails);
      console.log("✅ Payment status updated in MongoDB");
    }

    res.status(200).json({ received: true });
  }
);

module.exports = webhookRouter;
