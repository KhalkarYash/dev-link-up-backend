const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, email } = req.user;

    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType],
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        email,
        membershipType: membershipType,
      },

      //   It should open the razorpay dialog box
    });
    // Save it in db
    const payment = await Payment.create({
      userId: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      notes: order.notes,
    });

    const savePayment = await payment.save();

    // Return back order details to frontend
    res.json({ ...savePayment.toJSON(), key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error(error);
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res.status(400).send("Invalid webhook signature");
    }

    // Update payment status in db
    // Update the user as premium

    // return success response to response

    const { event, payload } = req.body;

    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });

    payment.status = paymentDetails.status;

    await payment.save();

    const user = await User.findOne({ _id: payment.userId });

    user.isPremium = true;
    user.membershipType = paymentDetails.notes.membershipType;

    await user.save();

    // if (event === "payment.captured") {
    // }

    // if (event === "payment.failed") {
    // }

    res.status(200).send("Webhook received successfully");
  } catch (error) {
    console.error(error);
  }
});

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (user.isPremium) {
      return res.json({ isPremium: true });
    } else {
      return res.json({ isPremium: false });
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = paymentRouter;
