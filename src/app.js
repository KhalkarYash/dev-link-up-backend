require("dotenv").config();
const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  // Creating a new instance of the user model
  const user = new User(req.body);

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

// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const users = await User.findOne({ email: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});

// Delete a user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Update a user from the database
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const users = await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("User Updated Successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong");
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
