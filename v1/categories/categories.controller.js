const catModel = require('./categories.service');

const createCategory = async (req, res) => {

    const body = req.body;
    try{
        const cat = new catModel({
            catName: body.catName,
            details: body.details,
            catCode: Math.random().toString().substr(2, 6)
        })
        const c = await cat.save();

        return res.status(200).json({
            success: 1,
            data: c
        })

    }catch(e){
        return res.status(200).json({
            success: 0,
            msg: e
        })
    }
   


}

const getCategory = async (req, res) => {

    try{
        const c = await catModel.find({})
        return res.status(200).json({
            success: 1,
            data: c
        })
    }catch(e){
        return res.status(200).json({
            success: 0,
            msg: e
        })
    }
}

const getCategoryById = async (req, res) => {
    try{
        const c = await catModel.find({"_id": req.params.id})
        return res.status(200).json({
            success: 1,
            data: c
        })
    }catch(e){
        return res.status(200).json({
            success: 0,
            msg: e
        })
    }
}

const updateCategory = async (req, res) => {

    const body = req.body;
    try{
        const c = await catModel.updateOne({"_id": body._id}, {
            catName: body.catName,
            details: body.details
        })

        return res.status(200).json({
            success: 1,
            msg: "Update successfully"
        })
    }catch(e){
        return res.status(200).json({
            success: 0,
            msg: e
        })
    }
}

const deleteCategory = async (req, res) => {
    try{
        const r = await catModel.findByIdAndRemove({_id: req.params.id})
        
        return res.status(200).json({
            success: 1,
            msg: "Data deleted successfully"
        });
    }catch(e){
        return res.status(200).json({
            success: 0,
            msg: e
        })
    }
}




module.exports = {
    createCategory: createCategory,
    getCategory: getCategory,
    deleteCategory: deleteCategory,
    updateCategory: updateCategory,
    getCategoryById: getCategoryById
}