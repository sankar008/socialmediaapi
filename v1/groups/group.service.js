const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    groupName: {type: String, required: [true, "Group name is a required field"]},
    groupDetails: {type: String, required: [true, "Group details is a required field"]},
    userId: {type: String, require: [true, "User id is a required field"]},
    groupCode: {type: String},
    userCount: {type: Number},
    catCode: {type: String, require: [true, "Category code is a required field"]},
    image: { type: String, required: [true, "Group image is a required field"]},
    isActive: { type: String, enum : ['0','1'], default: '1' },
}, {timestamps: true});

GroupSchema.index({groupCode: 1}, {unique: true});

module.exports = mongoose.model("Group", GroupSchema);
