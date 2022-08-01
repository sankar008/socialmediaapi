const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userCode: {type: String, required: [true, "User code must be required field"]},
    postCode: {type: String, required: [true, "Post code must be required filed"]},
    comment: {type: String, required: [true, "Comment must be required filed"]},
    commentCode: {type: String, required: [true, "Comment Code must be required field"]},
    reply: {type: Array}
}, {timestamps: true})

CommentSchema.index({commentCode: 1}, {unique: true});
CommentSchema.index({postCode: 1});

module.exports = mongoose.model("Comment", CommentSchema);