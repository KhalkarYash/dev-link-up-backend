const express = require("express");

const app = express();

// req /user , /user/xyz , /user/1
app.get("/user/:userId/:name/:password", (req, res) => {
  console.log(req.params);
  res.send({ firstName: "Yash", lastName: "Khalkar" });
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
