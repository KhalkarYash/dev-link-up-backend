require("dotenv").config();
const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
const requestRouter = require("./routes/request");
const paymentRouter = require("./routes/payment");
require("./utils/cronjobs");

const isCrossOrigin = process.env.IS_CROSS_ORIGIN === "true";

const keepAlive = () => {
  setInterval(async () => {
    try {
      const response = await fetch(process.env.RenderURL);
      console.log(
        "Keep-alive ping sent to the server, status: " + response.status
      );
    } catch (error) {
      console.error("Keep-alive ping failed: " + error);
    }
  }, 840000);
};

app.use(
  cors({
    origin: process.env.CLIENT,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", requestRouter);
app.use("/", paymentRouter);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });

    if (isCrossOrigin) {
      keepAlive();
    }
  })
  .catch(() => {
    console.log("Database cannot be connected!");
  });
