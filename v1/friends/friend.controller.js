const FriendModule = require('./friend.service');
const UserModule = require('./../users/user.service');


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

}

module.exports = {
    requestSend: requestSend,
    getFriend: getFriend,
    getRequest: getRequest,	
    acceptedRequest: acceptedRequest,
    deleteFriend: deleteFriend,
    suggestFriend: suggestFriend,
    searchFriend: searchFriend
}
