const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  //Method to get secret room id so that anyone can't steal it.
  const getSecretRommId = (userId, targetUserId) => {
    return crypto
      .createHash("sha256")
      .update([userId, targetUserId].sort().join("_"))
      .digest("hex");
  };

  io.on("connection", (socket) => {
    //handle events here
    socket.on("joinChat", async ({ userId, targetUserId }) => {
      const roomId = getSecretRommId(userId, targetUserId);
      console.log("room", roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        const roomId = getSecretRommId(userId, targetUserId);
        console.log(firstName + " " + "messageed" + " " + text);
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
          text: text,
        });
        await chat.save();
        io.to(roomId).emit("messageRecived", { firstName, lastName, text });
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
