const mongoose = require("mongoose")

const industrySchema = new mongoose.Schema({
        name: {type: String, require:[true, "Industry name is a require field"]}
}, {timestamps: true})

module.exports = mongoose.model("Industries", industrySchema);
