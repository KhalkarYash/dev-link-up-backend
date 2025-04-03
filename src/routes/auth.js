const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const verifyEmail = require("../utils/verifyEmail");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    // Encrypt the password
    const {
      firstName,
      lastName,
      email,
      password,
      about,
      skills,
      photoUrl,
      gender,
      age,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      about,
      skills,
      photoUrl,
      gender,
      age,
    });

    const savedUser = await user.save();

    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000),
    });

    // Remove this when SES in production
    await verifyEmail(email);

    res.json({ message: "User added successfully!", data: savedUser });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(400).json({ message: "ERROR : " + error.message });
    }
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credentials!");
    }
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid Credentials!");
    }
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000),
    });
    res.json({ data: user });
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({ message: "Logged out successfully!" });
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});

module.exports = authRouter;
