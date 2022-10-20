const {createChatroom, getChatroom, updateChatroom, getParticipantsName, getChatroomByCode, removeGroupParticipent } = require("./chatroom.controller");

const router = require('express').Router();

router.post('/', createChatroom);
router.get('/:userCode', getChatroom);
router.patch('/', updateChatroom);
router.get("/participants/:chatroomCode/:userCode", getParticipantsName);
router.get('/show/:chatroomCode', getChatroomByCode);
router.get("/participant/remove/:chatroomCode/:removeuserCode/:removeByuserCode", removeGroupParticipent);

module.exports = router;
