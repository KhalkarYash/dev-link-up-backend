const express = require("express");
const app = express();
const { connectDB } = require("./config/database");

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
