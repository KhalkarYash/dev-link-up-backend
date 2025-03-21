const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName photoUrl age about skills";

// Get all the pending connection request for the logged-in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const requests = await ConnectionRequest.find({
      $and: [{ status: "interested" }, { toUserId: user._id }],
    }).populate("fromUserId", USER_SAFE_DATA);
    res.send({ data: requests });
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});

// Get all the users
userRouter.get("/user/feed", userAuth, async (req, res) => {
  const excludedUserId = req.user._id;
  try {
    const allUsers = await User.find({ _id: { $ne: excludedUserId } }).select(
      "-password"
    );
    res.send({ data: allUsers });
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});

// Get all the connections of the logged-in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connections = await ConnectionRequest.find({
      $and: [
        { status: "accepted" },
        { $or: [{ fromUserId: user._id }, { toUserId: user._id }] },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === user._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});

module.exports = userRouter;
