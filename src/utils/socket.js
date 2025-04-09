const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (stringRoomId) => {
  return crypto.createHash("sha256").update(stringRoomId).digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.CLIENT,
    },
  });

  io.on("connection", (socket) => {
    // handle events
    socket.on("joinChat", async ({ firstName, userId, targetUserId }) => {
      try {
        const resp = await ConnectionRequest.findOne({
          status: "accepted",
          $or: [
            { fromUserId: userId, toUserId: targetUserId },
            { fromUserId: targetUserId, toUserId: userId },
          ],
        });

        if (!resp) {
          return socket.emit("errorMessage", {
            message: "You are not friends with this user!",
          });
        }

        const roomIdPre = [userId, targetUserId].sort().join("_");
        const roomId = getSecretRoomId(roomIdPre);
        socket.join(roomId);
        // console.log(firstName + " joined the room: " + roomId);
      } catch (error) {
        console.error(error);
        socket.emit("errorMessage", {
          message: "An error occurred while sending the message.",
        });
      }
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomIdPre = [userId, targetUserId].sort().join("_");
          const roomId = getSecretRoomId(roomIdPre);

          //   Save msg to DB
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
            userId,
            timeStamp: Date.now(),
          });
        } catch (error) {
          console.error(error);
          socket.emit("errorMessage", {
            message: "An error occurred while sending the message.",
          });
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
