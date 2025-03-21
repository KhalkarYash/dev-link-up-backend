const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      return res.status(401).json({ message: "Please Login!" });
    }

    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found!");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
};

module.exports = {
  userAuth,
};
