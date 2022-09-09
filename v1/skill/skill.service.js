var mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
    value: {type: String, required: [true, "Skill value is a require field"]},
    label: {type: String, required: [true, "Skill lavel is a require field"]},
    skillCode: {type: String}
}, {timestamps: true})


module.exports = mongoose.model("Skill", SkillSchema);