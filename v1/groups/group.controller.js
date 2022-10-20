const groupModel = require('./group.service');
const userModel = require('../users/user.service');
const fs = require("fs");
const path = require("path");

const createGroup = async (req, res) => {
    const body = req.body;
    try{

	if(body.image){
            let filePath = '../../images/group';
            var imagename = Date.now()+'.png';
            const imagepath = filePath+'/'+Date.now()+'.png';      
            let buffer = Buffer.from(body.image.split(',')[1], 'base64');
            fs.writeFileSync(path.join(__dirname, imagepath), buffer);
            body.image = 'images/group/'+imagename;
        }     
        
        const groupData = new groupModel({
            groupName: body.groupName,
            groupDetails: body.groupDetails,
            catCode: body.catCode,
            userId: body.userId,
            groupCode: Math.random().toString().substr(2, 6),
            image: body.image
        });       
    
        const group = await groupData.save();
        const addGroup = await userModel.findOneAndUpdate({userCode: body.userId}, {$push: {groups: group.groupCode}}); 

        return res.status(200).json({
            success: 1,
            data: group
        })
    }

    catch (error) {        
        let errors = {};
        Object.keys(error.errors).forEach((key) => {
            errors[key] = error.errors[key].message;
          });    
        return res.status(400).send(errors);
    }  
}

const getGroup =  async (req, res) => {
    try{
        const group = await groupModel.aggregate([{
            $lookup:{
                from:"users", 
                localField: "userId", 
                foreignField: "userCode", 
                as: "created_by"
            }}          
        ]);

        
        return res.status(200).json({
            success: 1,
            data: group
        })
    }
    catch(error){
        return res.status(400).send(error);
    }
    

}


const getGroupByCode = async (req, res) => {
    try{        
       const data = await groupModel.findOne({"groupCode": req.params.groupCode})      
         return res.status(200).json({
            success: 1,
            data: data
         })

    }catch(e){
        return res.status(400).send(e)
    }
}

const getGroupByuserCode = async (req, res) => {  
      
    try{
        const data = await groupModel.aggregate([{
            $match: { "userId": req.params.userCode }
          },{
            $lookup:{
                from:"users", 
                localField: "userId", 
                foreignField: "userCode", 
                as: "created_by"
            }}               
        ]);
      
         return res.status(200).json({
            success: 1,
            data: data
         })

    }catch(e){
        return res.status(400).send(e)
    }
    
}

const updateGroup = async (req, res) => {
    const body = req.body;
    
    try{

	if(body.image){
            let filePath = '../../images/group';
            var imagename = Date.now()+'.png';
            const imagepath = filePath+'/'+Date.now()+'.png';      
            let buffer = Buffer.from(body.image.split(',')[1], 'base64');
            fs.writeFileSync(path.join(__dirname, imagepath), buffer);
            body.image = 'images/group/'+imagename;
        } 

        const group = await groupModel.updateOne({groupCode: body.groupCode}, {
            groupName: body.groupName,
            groupDetails: body.groupDetails,
            catCode: body.catCode,            
            image: body.image,
            isActive: body.isActive
        })

        if(group.modifiedCount == 1){
            return res.status(200).json({
                success: 1,
                msg: "Updated successfull"
            })
        }else{
            return res.status(200).json({
                success: 0,
                msg: "Updated error"
            })
        }


    }
    catch(e){
        return res.status(400).send(errors)
    }

}

const deleteGroup = async (req, res) => {
    const recordId = req.params.id;
    
    try{
        const result = groupModel.findByIdAndRemove(recordId, { useFindAndModify: false });
        if(result){
            return res.status(200).json({
                success: 1,
                msg: "Data deleted successfully"
            })
        }else{
            return res.status(200).json({
                success: 0,
                msg: "Data delete error"
            })
        }
    }
    catch(e){
        return res.status(400).send(errors)
    }
}


const getAllJoinGroup = async (req, res) => {
    try{
        const data = await userModel.aggregate([{
            $lookup: {
                from: 'groups',
                localField: 'groups',
                foreignField: 'groupCode',
                as: 'group'
            }
        },
        {
            $match: {userCode: req.params.userCode}
        },
        {
            $project: {"group.groupCode": 1, _id: 0, userCode: 1, "group.groupName": 1, "group.groupDetails": 1, "group.image": 1}
        }
        ])

        return res.status(200).json({
            success: 200,
            data: data[0]
        })
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}


module.exports = {
    createGroup: createGroup,
    updateGroup: updateGroup,
    getGroup: getGroup,
    getGroupByCode:getGroupByCode,
    deleteGroup: deleteGroup,
    getGroupByuserCode: getGroupByuserCode, 
    getAllJoinGroup:getAllJoinGroup 
}
