const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    name: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    maxMembers : { type: Number },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Server', serverSchema);
