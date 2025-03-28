const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(process.env.MONGO_URL + process.env.MONGO_DB);
};

module.exports = {
  connectDB,
};
