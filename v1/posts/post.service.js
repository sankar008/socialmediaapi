var mongoose = require("mongoose");

var PostSchema = new mongoose.Schema({
    userCode: { type: String, required: [true, "User code must be required field"]},
	details: {type: String, required: [true, "Post details must be required field"]},
	postCode: {type: String},
	image: { type: String },
	status: { type: String, enum:["0", "1"]},
	like: { type: Array },
	likeCount: { type: Number },
	commentCount: { type: Number },
	groupCode: { type: Array },

}, {timestamps: true});

module.exports = mongoose.model("Post", PostSchema);