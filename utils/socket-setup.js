const { v4: uuidv4 } = require("uuid");
const Message = require("../models/message-model");
const userModel = require("../models/user-model");
const serverModel = require("../models/server-model");
const groups = {};

function initializeSocket(io) {
  io.on("connection", (socket) => {
    console.log("user connected");

    socket.on("join group", async ({ userId, serverId }) => {
      socket.join(serverId);
      socket.userId = userId;
      socket.serverId = serverId;

      try{
        const user = await userModel.findById(userId);
        const server = await channelModel.findById(serverId);
        console.log(`${userId} joined channel ${serverId}`);
        const message = await server.message
        socket.emit("existing message", message);
      } catch {
        console.log('error in join group');
      }


    });

    socket.on("leave group", async ({ userId, serverId }) => {
      socket.leave(serverId);
      console.log(`${userId} left channel ${serverId}`);
    });

    socket.on("chat message", async ({ userId, userName, serverId, message }) => {
      const server = await serverModel.findById(serverId);
      const msg = await Message.create({
        content: message,
        sender: userName,
        server: serverId,
      });
      server.message.push(msg);
      await server.save()
      io.to(serverId).emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      console.log("user disconnect");
    });
  });
}

module.exports = initializeSocket;
