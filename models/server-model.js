const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    name: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Server', serverSchema);
