const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    profileImg: String,
    joinedServers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Server' }],
    createdAt: { type: Date, default: Date.now }
});

userSchema.plugin(plm)

module.exports = mongoose.model("User", userSchema)