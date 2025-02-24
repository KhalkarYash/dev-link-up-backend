const express = require("express");

const app = express();

app.get("/getUserData", (req, res) => {
  // Logic of DB call and get user data
  try {
    throw new Error("random error")
    res.send("User Data Sent");
  }
  catch (err) {
    res.status(500).send("Some error occurred contact support team")
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong")
  }
})

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
