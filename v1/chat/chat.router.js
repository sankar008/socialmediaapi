const { createChat, getChat } = require('./chat.controller');

const router = require('express').Router();


router.post("/", createChat);
router.get("/:chatroomCode", getChat);

module.exports = router