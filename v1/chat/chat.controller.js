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
    const chat = await chatModel.find({chatroomCode: req.params.chatroomCode})
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