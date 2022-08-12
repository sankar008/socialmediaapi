const chatroomModel = require('./chatroom.service');
const userMode = require('../users/user.service');

const createChatroom = async (req, res) => {
    const body = req.body;
    try{
        const chat = new chatroomModel({
            chatroomCode: Math.random().toString().substr(2, 6),
            userCode: body.userCode
        })        
        const chatroom = await chat.save();
        return res.status(200).json({
            success: 1,
            data: chatroom
        })
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const getChatroom = async (req, res) => {
    try{
               
        const chatroom = await chatroomModel.aggregate([{
            $lookup : {
                from: "users",
                localField: "userCode", 
                foreignField: "userCode", 
                as: "frinds"
            }},   
            {
                $match: {userCode:{"$in": [req.params.userCode]}}
            },                      
            {
                $project: {"frinds.userCode": 1, "frinds.firstName": 1, "frinds.lastName": 1, "frinds.image": 1, _id: 0, userCode: 1, chatroomCode: 1 }
            }
            ], function(err, docs){
           var userData = [];
           docs.map((frds, index) => {
                frds.frinds.map((user, iuser) => {
                    if(user.userCode != req.params.userCode){
                        userData.push({chatroomCode: frds.chatroomCode, name: user.firstName+' '+user.lastName})
                    }
                })
           })
           return res.status(200).json({
                success: 1,
                data: userData
            })
        })                 
        
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

module.exports = {
    createChatroom: createChatroom,
    getChatroom: getChatroom
}