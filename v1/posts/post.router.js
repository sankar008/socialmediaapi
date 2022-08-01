const router = require('express').Router();
const { createPost, getPosts, getPostBypostCode, updatePost, deletePost, likePost } = require('./post.controller')
const { checkToken } = require("../../author/token_validations");
router.post("/", createPost);
router.get("/", getPosts);
router.get("/:postCode", checkToken, getPostBypostCode);
router.patch("/", checkToken, updatePost);
router.delete("/:postCode", checkToken, deletePost);
router.get("/like/:userCode/:postCode", likePost);
module.exports = router;