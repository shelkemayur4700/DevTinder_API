const express = require("express");
const { userAuth } = require("../middlewares/auth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/user"); // Import User model
const payments = require("../models/payments");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    console.log("Request reached /payment/create");
    const user = req.user;
    const { amount, membershipType } = req.body;
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        name: user.name,
        email: user.email,
        address: {
          line1: "Dalal street",
          postal_code: "98140",
          city: "Mumbai",
          state: "MAHARASHTRA",
          country: "IN",
        },
      });

      stripeCustomerId = customer.id;
      user.stripeCustomerId = stripeCustomerId;
      await user.save();
    }
    console.log(user.name, "USER-NAME");

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount * 100),
      currency: "INR",
      customer: stripeCustomerId,
      description: "Trial payment",
      automatic_payment_methods: { enabled: true },
      shipping: {
        name: "Gukesh sir",
        address: {
          line1: "Dalal street",
          postal_code: "98140",
          city: "Mumbai",
          state: "MAHARASHTRA",
          country: "IN",
        },
      },
    });

    const newPayment = new payments({
      userId: user._id,
      paymentId: paymentIntent.id,
      amount,
      status: "pending",
      createdAt: new Date(),
      membershipType: membershipType,
    });

    await newPayment.save();

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error in /payment/create:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = paymentRouter;
