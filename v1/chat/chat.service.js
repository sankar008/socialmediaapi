const mongoose = require('mongoose');

const chatSchema  = new mongoose.Schema({
    sendBy: { type: String, required: [true, "SendBy is a required field"]},
    chatroomCode: { type: String, required: [true, "chatroom code must be required"]},
    message: { type: String},
    socketId: { type: String}
}, {timestamps: true})

module.exports = mongoose.model('Chats', chatSchema);