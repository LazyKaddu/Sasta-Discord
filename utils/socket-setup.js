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

      try {
        const user = await userModel.findById(userId);
        const server = await serverModel.findById(serverId);
        try {
          const messages = await server.message.map((item) => Message.findById(item))
          console.log(messages);
          socket.emit("existing message", messages);
        } catch (e) {
          console.log("no previous messages " + e);
          socket.emit("existing message", [])
        }

        console.log(`${user} joined channel ${server}`);
      } catch (e) {
        console.log('error in join group ' + e);
      }


    });

    socket.on("leave group", async ({ userId, serverId }) => {
      socket.leave(serverId);
      console.log(`${userId} left channel ${serverId}`);
    });

    socket.on("chat message", async ({ userId, userName, serverId, message }) => {
      const server = await serverModel.findById(serverId);
      console.log(serverId)
      const msg = await Message.create({
        content: message,
        sender: userName,
        server: serverId,
      });
      await msg.save();
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
