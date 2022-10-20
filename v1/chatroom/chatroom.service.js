const mongoose = require('mongoose');

const chatroomSchema = new mongoose.Schema({
        chatroomCode: {type: String, required: [true, "Roomcode is a required field"]},
        isGroup: {type: String, enum: ["0", "1"], default: "0"},
        groupIcon: {type:String},
        groupName: {type:String, required: function() { return this.isGroup == 1?true: ''}},
        userCode: { type: Array, required: [true, "User code is a required field"]},
        createdBy: {type: String, required: function() { return this.isGroup == 1?true: ''}}

}, {timestamps: true});

module.exports = mongoose.model("Chatrooms", chatroomSchema);
