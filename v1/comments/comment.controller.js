const commentModel = require('./comment.service');
const postModel = require('../posts/post.service');
const userModel = require('../users/user.service');
const createComment = async (req, res) => {
    const body = req.body;
    try{
        const comment = new commentModel({
            userCode: body.userCode,
            postCode: body.postCode,
            comment: body.comment,
            commentCode: Math.random().toString().substr(2, 6),
            reply: body.reply
        })
        const commentSave = await comment.save();
        const post = await postModel.findOneAndUpdate({'postCode': body.postCode},{ $inc: { "commentCount": 1 } })
        return res.status(200).json({
            sucess: 1,
            data: commentSave
        })        
    }catch(e){
        return res.status(400).json({
            sucess: 0,
            msg: e
        })
    }
}

const createReply = async (req, res) => {
    const body = req.body;
    try{
        const userDetail = await userModel.findOne({'userCode': body.replyBy});

        const comment = await commentModel.findOneAndUpdate({"commentCode": body.commentCode}, {$push:{reply:{message: body.message, replyBy:body.replyBy, firstName: userDetail.firstName, lastName: userDetail.lastName, image: userDetail.image}}})
        return res.status(200).json({
            success: 1,
            data: comment.reply
        })
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const getComment = async (req, res) => {       
    try{
        const comment = await commentModel.find({}, {_id: 0, userCode:1, postCode: 1, comment: 1, commentCode: 1, reply: 1})
        return res.status(200).json({
            success: 1,
            data: comment
        })
    }
    catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}



const updateComment = (req, res) => {
        
}

const deleteComment = (req, res) => {
        
}

const getCommentByUserCode = async (req, res) => {        
    try{
        const comment = await commentModel.find({userCode: req.params.userCode})
        return res.status(200).json({
            success: 1,
            data: comment
        })
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const getCommentByPostCode = async (req, res) => {
    try{
        const comment = await commentModel.aggregate([{
            $match: { "postCode": req.params.postCode }
          },
          {
            $lookup: {
                from: "users",
                localField: "userCode", 
                foreignField: "userCode", 
                as: "commentBy"
            }},
            {
                $unwind: "$commentBy"
            },
            {
                $project: {"commentBy.firstName": 1, "commentBy.lastName": 1, "commentBy.image": 1, userCode: 1, _id: 0, comment: 1, commentCode: 1, reply: 1}
            }])


        return res.status(200).json({
            success: 1,
            data: comment
        })
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }   
}


module.exports = {
    createComment: createComment,
    getComment: getComment,
    updateComment: updateComment,
    deleteComment: deleteComment,
    getCommentByUserCode: getCommentByUserCode,
    getCommentByPostCode: getCommentByPostCode,
    createReply: createReply
}