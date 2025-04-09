const socket = require("socket.io");
const crypto = require("crypto");

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
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomIdPre = [userId, targetUserId].sort().join("_");
      const roomId = getSecretRoomId(roomIdPre);
      socket.join(roomId);
      console.log(firstName + " joined the room: " + roomId);
    });

    socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
      const roomIdPre = [userId, targetUserId].sort().join("_");
      const roomId = getSecretRoomId(roomIdPre);
      console.log(firstName, text);
      io.to(roomId).emit("messageReceived", { firstName, text });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
