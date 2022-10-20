const FriendModule = require('./friend.service');
const UserModule = require('./../users/user.service');
const chatroomModel = require("./../chatroom/chatroom.service");

const requestSend = async (req, res) => {
    const body = req.body;
    try{
        const frd = new FriendModule({
            'friendCode': Math.random().toString().substr(2, 6),
            'requester': body.requester,
            'recipient': body.recipient,
            'status': 0
        })
    
        const frds = await frd.save();
    
        if(frds){        
            return res.status(200).json({
                success: 1,
                data: frds
            })
        }else{
            return res.status(200).json({
                success: 0,
                msg: "Error! Please try again"
            })
        }
    }catch(e){
        return res.status(400).send(e)
    }
}

const getFriend =  async (req, res) => {
    try{
        const friends = await UserModule.find({$and:[{friends:req.params.userCode}, {userCode:{ $ne: req.params.userCode }}]})
        return res.status(200).json({
            success: 1,
            data: friends
        })
    }
    catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const getSendRequest = async (req, res) => {

    try{
        const friendRequest = await FriendModule.aggregate([{
            $lookup:{
                from:"users", 
                localField: "recipient", 
                foreignField: "userCode", 
                as: "recipient"
            }},
            {
                $unwind: "$recipient"
            },
            {
                $match: {requester: req.params.userCode, status: 0}
            }          
        ]);        


        return res.status(200).json({
            success: 1,
            data: friendRequest
        })
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const getRequest = async (req, res) => {
    try{
        const friendRequest = await FriendModule.aggregate([{
            $lookup:{
                from:"users", 
                localField: "requester", 
                foreignField: "userCode", 
                as: "requester"
            }},
            {
                $match: {recipient: req.params.userCode, status: 0}
            }          
        ]);        


        return res.status(200).json({
            success: 1,
            data: friendRequest
        })
    }
    catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const acceptedRequest = async (req, res) => {
    const body = req.body;
    try{
        const frdRequest = await FriendModule.findOneAndUpdate({friendCode: body.friendCode }, {status: 1});
        const addList1 = await UserModule.findOneAndUpdate({userCode: frdRequest.recipient}, {$push: {friends: frdRequest.requester}});
        const addList2 = await UserModule.findOneAndUpdate({userCode: frdRequest.requester}, {$push: {friends: frdRequest.recipient}});

        
        
        const chat = new chatroomModel({
            chatroomCode: Math.random().toString().substr(2, 6),
            userCode: [frdRequest.recipient, frdRequest.requester],
        })  

        chat.save()


        return res.status(200).json({
            success: 1,
            msg: "Request accepted"
        })

    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const deleteFriend = async (req, res) => {
    try{
       
        const frdRequest = await FriendModule.findOne({$or:[{recipient: req.params.recipient,  requester: req.params.requester}, {recipient: req.params.requester,  requester: req.params.recipient}]});
        const deleteChatroom = await chatroomModel.findOneAndDelete({userCode:[frdRequest.recipient, frdRequest.requester]});       
        const addList1 = await UserModule.findOneAndUpdate({userCode: frdRequest.recipient}, {$pull: {friends: frdRequest.requester}});
        const addList2 = await UserModule.findOneAndUpdate({userCode: frdRequest.requester}, {$pull: {friends: frdRequest.recipient}});        
        const frdData = await FriendModule.findOneAndDelete({friendCode: frdRequest.friendCode});

        return res.status(200).json({
            success: 1,
            msg: "Request deleted successfully"
        })

    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const suggestFriend = async (req, res) => {
    try{

        const recipientId =  await FriendModule.find({recipient: req.params.userCode}, {requester: 1, recipient:1, _id: 0})
        const requestedId =  await FriendModule.find({requester: req.params.userCode}, {requester: 1, recipient:1, _id: 0})
        const requestObj = [];

        
        recipientId.map((val) => {
            requestObj.push(val.requester)
            requestObj.push(val.recipient)
        })

        requestedId.map((val) => {
            requestObj.push(val.requester)
            requestObj.push(val.recipient)
        })

      


       


        const sugfriend = await UserModule.find({$and:[{friends:{ $ne: req.params.userCode }}, {userCode: {$nin: requestObj} }, {userCode:{ $ne: req.params.userCode }}] }, {firstName:1, lastName:1, userCode: 1, image:1, _id: 0})
        return res.status(200).json({
            success: 1,
            data: sugfriend
        })

    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const searchFriend = async (req, res) => {
    try{
        // const friends = await UserModule.find({$and:[{friends:req.params.userCode}, {'firstName' : {'$regex': '^'+req.params.search, "$options": "i"}}, {userCode:{ $ne: req.params.userCode }}]})
        

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
                $match: {$and:[{"userCode":req.params.userCode}, {'frinds.firstName' : {'$regex': '^'+req.params.search, "$options": "i"}}]}
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
                  
                    if(rec.isGroup !== "1"){
                    //     dataArray.push({name: rec.groupName, image: rec.groupIcon, isGroup: "1", chatroomCode: rec.chatroomCode})
                    // }else{
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

module.exports = {
    requestSend: requestSend,
    getFriend: getFriend,
    getRequest: getRequest,	
    acceptedRequest: acceptedRequest,
    deleteFriend: deleteFriend,
    suggestFriend: suggestFriend,
    searchFriend: searchFriend, 
    getSendRequest: getSendRequest
}
