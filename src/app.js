require("dotenv").config();
const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send("Email already exists");
    } else {
      res.status(400).send("ERROR : " + error.message);
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credentials!");
    }
    const isValidPassword = await user.validatePassword(password)
    if (!isValidPassword) {
      throw new Error("Invalid Credentials!");
    }
    const token = await user.getJWT();
    console.log(token);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000),
    });
    res.send("User Logged In Successfully!");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  // Sending a connection request
  try {
    const user = req.user;
    console.log("Sending a connection request");
    res.send(user.firstName + " sent the connection request.");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch(() => {
    console.log("Database cannot be connected!");
  });
