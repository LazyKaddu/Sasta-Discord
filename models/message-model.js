const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: { type: String},
    sender: { type: String},
    server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server'},
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema)