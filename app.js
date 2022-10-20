const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const multer = require('multer');
const config = require("./config/config.json");
const mongodb = require('./db');
const userRouter = require('./v1/users/user.router');
const postRouter = require('./v1/posts/post.router');
const friendRouter = require('./v1/friends/friend.router');
const groupRouter = require('./v1/groups/group.router');
const categoryRouter = require('./v1/categories/categories.router');
const commentRouter = require('./v1/comments/comment.router');
const skillRouter = require("./v1/skill/skill.router");
const chatroomRouter = require("./v1/chatroom/chatroom.router");
const chatRouter = require("./v1/chat/chat.router");
const degreeRouter = require("./v1/degree/degree.router");
const empTypeRouter = require("./v1/emptype/emptype.router");
const industryRouter = require("./v1/industrytype/industrytype.router");
const storyRouter = require("./v1/story/story.router");

const upload = multer({
	limits: { fieldSize: 25 * 1024 * 1024 }
  });
const cors = require('cors')
const https = require('https');
const fs = require('fs');
const path = require("path");



const httpsServer = require('http').createServer(app);

//const io = require("socket.io")(httpsServer, {cors: {origin: "*"}})

 const io = require("socket.io")(httpsServer, {cors: {origin: "*"}, maxHttpBufferSize: 5e8, pingTimeout: 600000})


app.use(cors());
app.use(upload.none());
app.use(bodyParser.json({ limit: '500000mb' }));
app.use(bodyParser.urlencoded({ limit: '500000mb', extended: true }));


app.use('/v1/user', userRouter);
app.use('/v1/post', postRouter);
app.use('/v1/comment', commentRouter);
app.use('/v1/category', categoryRouter);
app.use('/v1/friend', friendRouter);
app.use('/v1/group', groupRouter);
app.use('/v1/skill', skillRouter);
app.use('/v1/chatroom', chatroomRouter);
app.use('/v1/chat', chatRouter);
app.use('/v1/degree', degreeRouter);
app.use("/v1/emp-type", empTypeRouter);
app.use("/v1/industry-type", industryRouter);
app.use("/v1/story", storyRouter);

const chatModel = require("./v1/chat/chat.service");
const userModel = require("./v1/users/user.service");
httpsServer.listen(config.PORT, () => {
console.log("Server is running:", config.PORT);
})

io.on("connection", (socket) => {
       socket.on("activeuser", async function(data){
	   const user = await userModel.findOneAndUpdate({userCode: data.userCode}, {socketId: socket.id, isOnline: "1"});
	  // console.log(user);
	})

	socket.on('sendMessageByUser', async function(msg){
		console.log(socket.id)

		/*.................Convert base64 to png..................*/
	
	  
	    if(msg.image){
	    const imageType = msg.image.split(',')[0]
            const uploadType = imageType.split("/")[0].split(":")[1];
	    const extentionType = imageType.split("/")[1].split(";")[0];
            let filePath = '/images/chat';
            var imagename = Date.now()+'.'+extentionType;            
			const imagepath = filePath+'/'+Date.now()+'.'+extentionType;    
			let buffer = Buffer.from(msg.image.split(',')[1], 'base64');            
			fs.writeFileSync(path.join(__dirname, imagepath), buffer);
                        msg.image = {type: uploadType, file: 'images/chat/'+imagename};

        }else{
			msg.image = ''
	} 

		/*...................End.......................*/
		
		const userMsg = new chatModel({
			sendBy: msg.sendBy,
			chatroomCode: msg.chatroomCode,
			message: msg.message,
			image: msg.image,
			socketId: socket.id
		})

		const message = await userMsg.save();

		
		const useChatdata = await chatModel.aggregate([
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
					chatroomCode: msg.chatroomCode
				}
			},
			{
				$project: {"user.firstName": 1, "user.lastName": 1, "user.image": 1, image:1,  sendBy: 1, chatroomCode: 1, message: 1, _id: 0}
			}
		])


        socket.broadcast.emit('receiveMessage', useChatdata);

    });  
	socket.on("disconnect", async () => {
	  const user = await userModel.findOneAndUpdate({socketId: socket.id}, {isOnline: "0"})
          console.log(socket.id);
	  console.log("Someone has left");
	})
  });
  
