const {createComment, updateComment, deleteComment, createReply, getComment, getCommentByUserCode, getCommentByPostCode} = require('./comment.controller');
const router = require('express').Router();

router.post("/", createComment);
router.patch("/", updateComment);
router.delete("/", deleteComment);
router.get("/", getComment);
router.get("/user/:userCode", getCommentByUserCode);
router.get("/post/:postCode", getCommentByPostCode);
router.post("/reply", createReply);
module.exports = router;