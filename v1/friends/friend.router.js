const router = require('express').Router();
const { requestSend, getFriend, acceptedRequest, deleteFriend, suggestFriend, getRequest, getSendRequest, searchFriend} = require('./friend.controller');
const { checkToken } = require("../../author/token_validations");

router.post('/', checkToken, requestSend);
router.get('/:userCode', checkToken, getFriend);
router.post('/accept', checkToken, acceptedRequest);
router.delete('/unfriend/:recipient/:requester', deleteFriend);
router.get('/suggest-frind/:userCode', checkToken, suggestFriend);
router.get('/get-request/:userCode', getRequest);
router.get('/get-send-request/:userCode', getSendRequest);
router.get('/search/:userCode/:search', searchFriend);
module.exports = router;
