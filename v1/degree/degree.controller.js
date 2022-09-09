const degreeModel = require("./degree.service");

const createDegree = async (req, res) => {
    const body = req.body
    try{
        const degreeObj = new degreeModel({
            name: body.name
        })

        const data = await degreeObj.save()
        return data?res.status(200).json({success: 1, data: data}):res.status(400).json({success: 0, msg: "Insert error"})
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const getDegree = async (req, res) => {
    try{
        const degree = await degreeModel.find({}, {name: 1, _id: 1})
        return res.status(200).json({
            success: 1,
            data: degree
        })
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

module.exports = {
    createDegree: createDegree,
    getDegree: getDegree
}