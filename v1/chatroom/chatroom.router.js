const {createChatroom, getChatroom } = require("./chatroom.controller");

const router = require('express').Router();

router.post('/', createChatroom);
router.get('/:userCode', getChatroom);

module.exports = router;