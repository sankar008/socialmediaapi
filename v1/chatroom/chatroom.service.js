const mongoose = require('mongoose');

const chatroomSchema = new mongoose.Schema({
        chatroomCode: {type: String, required: [true, "Roomcode is a required field"]},
        userCode: { type: Array, required: [true, "User code is a required field"]}
}, {timestamps: true});

module.exports = mongoose.model("Chatrooms", chatroomSchema);