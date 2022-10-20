const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
    storyCode: {type: String, required: [true, "Story code is a require field"]},
    userCode: {type: String, required: [true, "Usercode is a require field"]},
    title: {type: String},
    media: {type: Array}
}, {timestamps: true})


module.exports = mongoose.model("Stories", storySchema);