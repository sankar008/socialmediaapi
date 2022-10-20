var mongoose = require("mongoose");
var PostSchema = new mongoose.Schema({
    	userCode: { type: String, required: [true, "User code must be required field"]},
	title: {type: String, required: function() { return this.isAlbum == 1?true: ''}},
	isAlbum: {type: String, enum: ["0", "1"], default: 0},
	details: {type: String, required: [true, "Post details must be required field"]},
	postCode: {type: String},
	image: { type: Array },
	status: { type: String, enum:["0", "1"]},
	like: { type: Array },
	likeCount: { type: Number },
	commentCount: { type: Number },
	groupCode: { type: Array },
	location: {type: String},
	date: {type: Date, required: function() { return this.isAlbum == 1?true: ''}},
	onlyMe: {type: String, enum: ["0", "1"], default: "0"},   // 0 -> public , 1 -> only me 
        isEdited: {type: String, enum: ["0", "1"], default: "0"},   // 0 -> No , 1 -> Yes 

}, {timestamps: true});

module.exports = mongoose.model("Post", PostSchema);
