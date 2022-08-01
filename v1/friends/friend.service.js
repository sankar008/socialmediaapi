const mongoose = require("mongoose");

const FriendSchema = mongoose.Schema({
    requester: { type: String, required: [true, "Requester is a required field"], ref: 'users'},
    recipient: { type: String, required: [true, "Recipient is a required field"], ref: 'users'},
    friendCode: {type: String, required: [true, "Frind Code is a required field"]},
    status: {
        type: Number,
        enums: [
            0,    //'requested',
            1,    //'accepted'
        ]
    }
}, {timestamps: true});

FriendSchema.index({friendCode: 1}, {unique: true});

module.exports = mongoose.model("Friend", FriendSchema);
