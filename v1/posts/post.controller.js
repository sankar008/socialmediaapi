const postModel = require("./post.service");
// const userModel = require("../users/user.service");
const fs = require("fs");
const path = require("path");
const createPost = async (req, res) => {

    const body = req.body; 
    try{  
        
        if(body.image.length > 1){
            var newimage = [];
            for(var i = 0; i <body.image.length; i++){
                let filePath = '../../images/post';
                var imagename = Date.now()+'.png';
                const imagepath = filePath+'/'+Date.now()+'.png';
                let buffer = Buffer.from(body.image[i].split(',')[1], 'base64');
                fs.writeFileSync(path.join(__dirname, imagepath), buffer);               
                newimage[i] = 'images/post/'+imagename;
            }

            body.image = newimage;
        }else{
            let filePath = '../../images/post';
            var imagename = Date.now()+'.png';
            const imagepath = filePath+'/'+Date.now()+'.png';      
            let buffer = Buffer.from(body.image[0].split(',')[1], 'base64');
            fs.writeFileSync(path.join(__dirname, imagepath), buffer);
            body.image = 'images/post/'+imagename; 
        }

        const post = new postModel({        
            userCode: body.userCode,
            title: body.title,
            isAlbum: body.isAlbum,
            details: body.details,
            image: body.image,
            postCode: Math.random().toString().substr(2, 6),
            likeCount: 0,
            commentCount: 0,
            status: 1,
            groupCode: body.groupCode
        })
        const user = await post .save();
        return res.status(200).json({
            success: 1,
            data: user
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

const getPosts = async (req, res) => {
    try{
        const data = await postModel.aggregate([{ $sort : { createdAt : -1 } },{
            $lookup: {
                from: "users",
                localField: "userCode", 
                foreignField: "userCode", 
                as: "postBy"
            }},
            {
                $unwind: "$postBy"
            },
            {
                $project: {"postBy.firstName": 1, "postBy.lastName": 1, "postBy.image": 1, userCode: 1, _id: 0, details: 1, image: 1, likeCount:1, commentCount: 1, postCode: 1, isAlbum: 1, title: 1}
            }])
        return res.status(200).json({
            success: 1,
            data: data
        })
    }
    catch(e){
        return res.status(400).send(e);
    }
}

const removeImage = async (req, res) => {
    const body = req.body; 
    try{
        const image = await postModel.findOneAndUpdate({
            postCode: body.postCode
        },
        {$pull:{image: body.image}});

        return res.status(200).json({
            success: 1,
            msg: "Image Remove successfully"
        })

    }
    catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const addImage = async (req, res) => {
    const body = req.body
    try{
        let filePath = '../../images/post';
        var imagename = Date.now()+'.png';
        const imagepath = filePath+'/'+Date.now()+'.png';      
        let buffer = Buffer.from(body.image.split(',')[1], 'base64');
        fs.writeFileSync(path.join(__dirname, imagepath), buffer);
        body.image = 'images/post/'+imagename; 
        const addimage = await postModel.findOneAndUpdate({postCode: body.postCode}, {$push: {image: body.image}})
        return res.status(200).json({
            success: 1,
            msg: "Image added successfully"
        });
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const updatePost = async (req, res) => {
    const body = req.body;
        try{
            const post = await postModel.findOneAndUpdate({postCode: body.postCode}, {details: body.details, isAlbum: body.isAlbum, title: body.title});
        }catch(e){
            return res.status(400).json({
                success: 0,
                msg: e
            })
        }
}

const getPostBypostCode = async (req, res) => {
    try{
        const post = await postModel.findOne({postCode: req.params.postCode})
        return res.status(200).json({
            success: 1,
            data: post
        })
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const deletePost = async (req, res) => {    
    try{
        const post = await postModel.findOneAndDelete({postCode: req.params.postCode});
        
        if(post){
            return res.status(200).json({
                success: 1,
                msg: "Data deleted successfully"
            });
        }else{
            return res.status(200).json({
                success: 0,
                msg: "Data not found"
            });
        }
       
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const likePost = async (req, res) => {

    try{
        const like = await postModel.findOneAndUpdate({postCode: req.params.postCode}, {$push:{like:req.params.userCode}})
        const post = await postModel.findOneAndUpdate({'postCode': req.params.postCode},{ $inc: { "likeCount": 1 } })
        return res.status(200).json({
            success: 1,
            msg: "Success"
        })
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const dislikePost = async (req, res) => {
    try{
        const like = await postModel.findOneAndUpdate({postCode: req.params.postCode}, {$pull:{like:req.params.userCode}})  
        const post = await postModel.findOneAndUpdate({'postCode': req.params.postCode},{ $inc: { "likeCount": -1 } })
        return res.status(200).json({
            success: 1,
            msg: "Success"
        })
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}




module.exports = {
    createPost: createPost,
    getPosts: getPosts,
    getPostBypostCode: getPostBypostCode,
    deletePost: deletePost,
    updatePost: updatePost,
    likePost: likePost,
    dislikePost: dislikePost,
    removeImage: removeImage,
    addImage: addImage
}
