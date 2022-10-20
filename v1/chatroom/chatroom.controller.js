const chatroomModel = require('./chatroom.service');
const userMode = require('../users/user.service');

const createChatroom = async (req, res) => {
    const body = req.body;
 
    try{           

        const chat = new chatroomModel({
            chatroomCode: Math.random().toString().substr(2, 6),
            groupName: body.groupName,
            isGroup: body.isGroup,
            groupIcon: body.groupIcon,
            userCode: body.userCode,
           createdBy: body.createdBy
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
                $lookup : {
                    from: "chats",
                    localField: "chatroomCode", 
                    foreignField: "chatroomCode", 
                    as: "chat"
                }},   
            {
                $match: {userCode:{"$in": [req.params.userCode]}}
            },                      
            {
                $project: {"frinds.userCode": 1, "frinds.firstName": 1, "frinds.lastName": 1, "frinds.isOnline": 1, "frinds.image": 1, _id: 0, chatroomCode: 1, isGroup: 1, groupName: 1, groupIcon: 1, createdBy: 1, "chat.createdAt": 1  }
            },
            {
                $sort: {"chat.createdAt": -1}
            }
            ], function(err, data){
                var dataArray = []
                data.map((rec, index) => {
                  
                    if(rec.isGroup == "1"){
                        dataArray.push({name: rec.groupName, image: rec.groupIcon, isGroup: "1", chatroomCode: rec.chatroomCode})
                    }else{
                        rec.frinds.map((frds, index) => {
                            if(frds.userCode != req.params.userCode){
                                dataArray.push({name: frds.firstName+' '+ frds.lastName, image: frds.image, userCode: frds.userCode, isGroup: "0", chatroomCode: rec.chatroomCode, isOnline: frds.isOnline})
                            }
                        })
                    }
                })

               return res.status(200).json({
                    success: 1,
                    data: dataArray
                })

            }
            )    
            
           
        
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const updateChatroom = async (req, res) => {
    const body = req.body;
    try{
        if(body.groupIcon){
           const chatroom = await chatroomModel.findOneAndUpdate({chatroomCode: body.chatroomCode}, {groupName: body.groupName, groupIcon: body.groupIcon});
        }else{
            const chatroom = await chatroomModel.findOneAndUpdate({chatroomCode: body.chatroomCode}, {groupName: body.groupName});
        }

        return res.status(200).json({
            success: 1,
            msg: "Update successfully."
        })
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}


const getParticipantsName = async (req, res) => {

    try{
        const participants = await chatroomModel.aggregate([{
            $lookup : {
                from: "users",
                localField: "userCode", 
                foreignField: "userCode", 
                as: "frinds"
            }},
            {
                $match: {chatroomCode: req.params.chatroomCode}
            }
        ], function(err, par){

            var participantName = [];
            
            par[0].frinds.map((frd, index) => {
               
                
                if(participantName !== ''){
                    participantName.push({"name": frd.firstName+' '+frd.lastName, isOnline: frd.isOnline, userCode: frd.userCode})
                }else{
                    participantName = {"name": frd.firstName+' '+frd.lastName, isOnline: frd.isOnline, userCode: frd.userCode};
                }
                
            })


            return res.status(200).json({
                success: 1,
                data: participantName
            })
        })


        
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const getChatroomByCode = async (req, res) =>{
    try{

        const chatroom = await chatroomModel.findOne({chatroomCode: req.params.chatroomCode})

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

const removeGroupParticipent = async (req, res) => {
    try{

        const chatroom = await chatroomModel.findOneAndUpdate({chatroomCode: req.params.chatroomCode, createdBy: req.params.removeByuserCode}, {$pull: {userCode: req.params.removeuserCode}})
    
        return chatroom?res.status(200).json({
            success: 1, 
            msg: "User remove successfully."
        }):res.status(400).json({
            success: 0, 
            msg: "Remove user code does not match."
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
    getChatroom: getChatroom,
    updateChatroom: updateChatroom,
    getParticipantsName: getParticipantsName,
    getChatroomByCode:getChatroomByCode,
    removeGroupParticipent: removeGroupParticipent

}
