const router = require('express').Router();
const { createPost, getPosts, getPostBypostCode, updatePost, deletePost, likePost, dislikePost, removeImage, addImage } = require('./post.controller')
const { checkToken } = require("../../author/token_validations");
router.post("/", createPost);
router.get("/", getPosts);
router.get("/:postCode", checkToken, getPostBypostCode);
router.patch("/", checkToken, updatePost);
router.delete("/:postCode", checkToken, deletePost);
router.get("/like/:userCode/:postCode", checkToken, likePost);
router.get("/dislike/:userCode/:postCode", checkToken, dislikePost);
router.patch("/remove-image", removeImage);
router.patch("/add-image", addImage);
module.exports = router;