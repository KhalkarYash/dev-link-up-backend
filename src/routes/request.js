const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/request/send/interested/:userId", userAuth, async (req, res) => {
  // Sending a connection request
  try {
    const user = req.user;
    console.log("Sending a connection request");
    res.send(user.firstName + " sent the connection request.");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = requestRouter;
