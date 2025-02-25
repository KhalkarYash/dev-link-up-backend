const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  // Creating a new instance of the user model

  const user = new User({
    firstName: "Y",
    lastName: "K",
    email: "yk@example.com",
    password: "yk@123",
  });

  try {
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send("Email already exists");
    } else {
      res.status(400).send("Error occurred: " + err.message);
    }
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");

    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch(() => {
    console.log("Database cannot be connected!");
  });
