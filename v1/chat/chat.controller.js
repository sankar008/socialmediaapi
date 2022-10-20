const chatModel = require("./chat.service");

const createChat = async (req, res) => {

        const body = req.body;
        try{
            const msg = new chatModel({
                sendBy: body.sendBy,
                chatroomCode: body.chatroomCode,
                message: body.message
            })

            const message = await msg.save();

            

            return res.status(200).json({
                success: 1,
                data: message
            })

        }catch(e){
            return res.status(400).json({success:0, msg:e})
        }
} 

const getChat = async (req, res) => {
   try{

    const chat = await chatModel.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "sendBy",
                foreignField: "userCode",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $match: {
                chatroomCode: req.params.chatroomCode
            }
        },
        {
            $project: {"user.firstName": 1, "user.lastName": 1, "user.image": 1, image:1, sendBy: 1, chatroomCode: 1, message: 1, _id: 0}
        }
    ])

   
    return res.status(200).json({
        message: 1,
        data: chat
    })
   }catch(e){
    return res.status(400).json({success:0, msg:e})
   }
}


module.exports = {
    createChat: createChat,
    getChat: getChat
}
