const {v4: uuidv4} = require('uuid');
const Message = require('../models/message-model')
const groups = {}

function initializeSocket(io){
    io.on('connection',(socket)=>{
        console.log('user connected');

        socket.on('join group', async ({userId,chanelId})=>{
            socket.join(chanelId);
            socket.userId = userId;
            socket.chanelId = chanelId;
            console.log('${userid} joined group ${groupId}');
            const message = await Message.find({ chanelId }).sort("timestamp").exec();
            socket.emit('existing message',message)
        })

        socket.on('leave group',({userId,chanelId})=>{
            socket.leave(chanelId)
            console.log('${userid} left group ${groupId}');
        })

        socket.on('chat message',async ({userId,chanelId,message})=>{
            const msg = new Message({ userId, chanelId, message});
            await msg.save();
            io.to(groupId).emit('chat message',msg)
        })

        socket.on('disconnect',()=>{
            console.log('user disconnect');
        })
    })
}

module.exports = initializeSocket;