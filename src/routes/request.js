const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { run } = require("../utils/sendEmail");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    // Sending a connection request
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type" + status });
      }

      // // If toUserId is same as fromUserId --> This case is handled at schema level in schema file
      // if (fromUserId.toString() === toUserId.toString()) {
      //   return res
      //     .status(400)
      //     .json({ message: "You cannot send request to yourself!" });
      // }

      // If toUserId is random MongoDB ObjectId
      const isValidObjectId = await ConnectionRequest.find({ _id: toUserId });
      if (!isValidObjectId) {
        return res.status(400).json({ message: "Invalid user ID!" });
      }

      // If existing connection request is found
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already exists!" });
      }

      // else create a new connection request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const toUser = await User.findOne({ _id: toUserId });

      const data = await connectionRequest.save();

      if (status === "ignored") {
        return res.json({ message: "Connection Request ignored!" });
      }
      if (status === "interested") {
        const emailRes = await run(
          `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>New Connection Request</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h2 style="color: #007bff;">You've Received a New Connection Request from ${toUser.firstName}!</h2>
              <p>Hi there,</p>
              <p><strong>${req.user.firstName}</strong> has sent you a connection request on <strong>DevLinkUp</strong>.</p>
              <p>Expand your network by accepting the request and collaborating with like-minded developers.</p>
              <p>If you don’t want to connect, you can simply ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #ddd;">
              <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply.</p>
            </div>
          </body>
          </html>
        `,
          "You've received a new connection request on DevLinkUp!",
          toUser.email
        );
        res.json({ message: "Connection Request sent successfully!" });
      }
    } catch (err) {
      res.status(400).json({ message: "ERROR: " + err.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      // If status is valid or not
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      // If requestId is random MongoDB ObjectId
      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(400).json({ message: "Invalid request ID!" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({ message: "Connection Request " + status + "!", data });
    } catch (err) {
      res.status(400).json({ message: "ERROR: " + err.message });
    }
  }
);

module.exports = requestRouter;
