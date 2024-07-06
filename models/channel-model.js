const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: { type: String },
    server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Channel', channelSchema);
