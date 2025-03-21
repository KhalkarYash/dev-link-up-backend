const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This is a reference to the User Collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This is a reference to the User Collection
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not supported!`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({
  fromUserId: 1,
  toUserId: 1,
});

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (
    connectionRequest.fromUserId.toString() ===
    connectionRequest.toUserId.toString()
  ) {
    throw new Error("You cannot send request to yourself!");
  }
  next();
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
