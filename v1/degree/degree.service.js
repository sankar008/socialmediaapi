const mongoose = require("mongoose")

const degreeSchema = new mongoose.Schema({
        name: {type: String, require:[true, "Degree name is a require field"]}
}, {timestamps: true})

module.exports = mongoose.model("Degrees", degreeSchema);
