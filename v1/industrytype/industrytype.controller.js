const industryModel = require("./industrytype.service");

const createindustryType = async (req, res) => {
    const body = req.body
    try{
        const industryObj = new industryModel({
            name: body.name
        })

        const data = await industryObj.save()
        return data?res.status(200).json({success: 1, data: data}):res.status(400).json({success: 0, msg: "Insert error"})
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const getindustryType = async (req, res) => {
   
    try{
        const industryData = await industryModel.find({}, {name: 1, _id: 1})
        return res.status(200).json({
            success: 1,
            data: industryData
        })
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

module.exports = {
    createindustryType: createindustryType,
    getindustryType: getindustryType
}