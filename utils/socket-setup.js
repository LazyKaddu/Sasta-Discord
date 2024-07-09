const { v4: uuidv4 } = require("uuid");
const Message = require("../models/message-model");
const userModel = require("../models/user-model");
const channelModel = require('../models/channel-model');
const groups = {};

function initializeSocket(io) {
  io.on("connection", (socket) => {
    console.log("user connected");

    socket.on("join group", async ({ userId, channelId }) => {
      socket.join(channelId);
      socket.userId = userId;
      socket.channelId = channelId;

      try{
        const user = await userModel.findById(userId);
        const channel = await channelModel.findById(channelId);
      } catch {
        console.log('error in join group');
      }

      console.log(`${userId} joined channel ${channelId}`);
      const message = await Message
        .find({ channel: channelId })
      socket.emit("existing message", message);
    });

    socket.on("leave group", async ({ userId, channelId }) => {
      socket.leave(channelId);
      try{
        const channel = await channelModel.findById(channelId);
      } catch {
        const user = await userModel.findById(userId);
        console.log(`${userId} left channel ${channelId}`);
      }
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
