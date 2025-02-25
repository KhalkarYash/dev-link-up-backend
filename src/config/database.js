const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://yashmk2004:Yash2004@cluster0.19jtd.mongodb.net/DevLinkUp"
  );
};

module.exports = {
    connectDB
}
