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
          const messages = await (server.messages).map(async (item) => await Message.findById(item));
          console.log(messages);
          socket.emit("existing message", messages);
        } catch (e) {
          console.log("no previous messages " + e);
          socket.emit("existing message", [])
        }

        console.log(`${user.username} joined channel ${server.name}`);
      } catch (e) {
        console.log('error in join group ' + e);
      }


    });

    socket.on("leave group", async ({ userId, serverId }) => {
      socket.leave(serverId);
      console.log(`${userId} left channel ${serverId}`);
      socket.emit('leave group',{});
    });

    socket.on("chat message", async ({ userId, userName, serverId, message }) => {
      try{
        const server = await serverModel.findById(serverId);
        const msg = await Message.create({
          content: message,
          sender: userName,
          server: serverId,
        });
        await msg.save();
        server.messages.push(msg._id);
        await server.save()
        io.to(serverId).emit("chat message", msg);
      }catch (e){
        console.log(e);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnect");
    });
  });
}

module.exports = initializeSocket;
