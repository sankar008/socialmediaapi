var mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
    skill: {type: String, required: [true, "Skill is a require field"]},
    skillCode: {type: String}
}, {timestamps: true})


module.exports = mongoose.model("Skill", SkillSchema);