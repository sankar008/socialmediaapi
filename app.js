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

httpsServer.listen(process.env.PORT, () => {
console.log("Server is running:", process.env.PORT);
})
