const storyModel = require("./story.service");
const userModel = require("../users/user.service");
const fs = require("fs");
const path = require("path");

const createStory = async (req, res) => {
    try{
        const body = req.body;

        const imageType = body.media.split(',')[0]
        const uploadType = imageType.split("/")[0].split(":")[1];
        const extentionType = imageType.split("/")[1].split(";")[0];
       


            let filePath = '../../images/stories';
            var imagename = Date.now()+'.'+extentionType;
            const imagepath = filePath+'/'+Date.now()+'.'+extentionType;
            let buffer = Buffer.from(body.media.split(',')[1], 'base64');
            fs.writeFileSync(path.join(__dirname, imagepath), buffer);        
            body.media = {type: uploadType, file: 'images/stories/'+imagename};
            
               





        body.storyCode = Math.random().toString().substr(2, 6); 
        const story = new storyModel({
            userCode: body.userCode,
            storyCode: body.storyCode,
            title: body.title,
            media: body.media
        })

        const insertData = await story.save()
        return insertData?res.status(200).json({success: 1, data: insertData}):res.status(400).json({success: 0, msg: "Insert error"});

    }catch(e){
        return res.status(400).json({success: 0,msg: e})
    }
}

const updateStory = async (req, res) => {
    
}

const getStoryByStoryCode = async (req, res) => {
    
    try{
        const story = await storyModel.findOne({storyCode: req.params.storyCode});
        return res.status(200).json({
            success: 1,
            data: story
        })
    }catch(e){
        return res.status(400).json({success: 0, msg: e})
    }

}

const getStoryByUserCode = async (req, res) => {
    try{

        const users = await userModel.findOne({userCode: req.params.userCode}, {friends: 1});

        const friendList = users.friends;
        friendList.push(req.params.userCode)
        
        
	   const stories = await storyModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    foreignField: "userCode",
                    localField: "userCode",
                    as: "user" 
                }
            },
            {
                $match: {userCode: {$in:friendList}}
            },
            {
                $project: {"user.firstName": 1, "user.lastName": 1, "storyCode": 1, userCode: 1, title: 1, media: 1, "user.image": 1}
            }

        ])


        return res.status(200).json({
            success: 1,
            data: stories
        })
    }catch(e){
        return res.status(400).json({success: 0,msg: e})
    }
}

const deleteStory = async (req, res) => {
    
}


module.exports = {
    createStory: createStory,
    updateStory: updateStory,
    getStoryByStoryCode: getStoryByStoryCode,
    getStoryByUserCode: getStoryByUserCode,
    deleteStory: deleteStory
}
