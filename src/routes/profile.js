const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {
  validateProfileData,
  validatePasswordData,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({ data: user });
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("Invalid Edit Request!");
    }
    const user = req.user;

    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    await user.save();
    res.json({
      message: `${user.firstName}, your profile was updated successfully!`,
      data: user,
    });
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    if (!validatePasswordData(req)) {
      throw new Error("Invalid Edit Request!");
    }

    const user = req.user;

    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    const hashedPassword = await bcrypt.hash(user.password, 10);

    user.password = hashedPassword;
    await user.save();
    res.json({
      message: `${user.firstName}, your password was updated successfully!`,
      data: user,
    });
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});

module.exports = profileRouter;
