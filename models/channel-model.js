const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    profileImg: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Channel", channelSchema)