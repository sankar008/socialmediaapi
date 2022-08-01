const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    catName: {type: String, required:true},
    details: {type: String, required:true},
    catCode: {type: String}
}, {timestamps: true})

CategorySchema.index({catCode: 1}, {unique: true});
module.exports = mongoose.model('Category', CategorySchema);
