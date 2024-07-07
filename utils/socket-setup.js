const { v4: uuidv4 } = require("uuid");
const Message = require("../models/message-model");
const groups = {};

function initializeSocket(io) {
  io.on("connection", (socket) => {
    console.log("user connected");

    socket.on("join group", async ({ userId, channelId }) => {
      socket.join(channelId);
      socket.userId = userId;
      socket.channelId = channelId;
      console.log(`${userId} joined channel ${channelId}`);
      const message = await Message.find({ channel: channelId })
        .sort("createdAt")
        .exec();
      socket.emit("existing message", message);
    });

    socket.on("leave group", ({ userId, channelId }) => {
      socket.leave(channelId);
      console.log(`${userId} left channel ${channelId}`);
    });

    socket.on("chat message", async ({ userId, channelId, message }) => {
      const msg = await Message.create({
        content: message,
        sender: userId,
        channel: channelId,
      });
      await msg.save();
      io.to(channelId).emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      console.log("user disconnect");
    });
  });
}

module.exports = initializeSocket;
