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
    res.json({ data: requests });
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});

// Get all the other users
userRouter.get("/user/feed", userAuth, async (req, res) => {
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit;

  try {
    // User should see all the cards except
    // 0. himself/herself
    // 1. his connections
    // 2. ignored people
    // 3. already sent the connection request to

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const allUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: user._id } },
      ],
    })
      .select("-password -email")
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ data: allUsers });
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
