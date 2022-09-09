const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();
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

const upload = multer({
	limits: { fieldSize: 25 * 1024 * 1024 }
  });
const cors = require('cors')
const https = require('https');
const fs = require('fs');

 const httpsServer = process.env.NODE_ENV == 'Live'?https.createServer({
 	key: fs.readFileSync('/etc/letsencrypt/live/api.webdevelopments.in/privkey.pem'),
 	cert: fs.readFileSync('/etc/letsencrypt/live/api.webdevelopments.in/fullchain.pem'),
  }, app):require('http').createServer(app);

  const io = require("socket.io")(httpsServer, {cors: {origin: "*"}})

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

const chatModel = require("./v1/chat/chat.service");

httpsServer.listen(process.env.PORT, () => {
console.log("Server is running:", process.env.PORT);
})

io.on("connection", (socket) => {

	socket.on('sendMessageByUser', function(msg){
        socket.broadcast.emit('receiveMessage', msg);
    });
  
	socket.on("disconnect", () => {
	  console.log("Someone has left");
	})
  });
  