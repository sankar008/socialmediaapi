const router = require('express').Router();
const { requestSend, getFriend, acceptedRequest, deleteFriend, suggestFriend, getRequest} = require('./friend.controller');
const { checkToken } = require("../../author/token_validations");

router.post('/', checkToken, requestSend);
router.get('/:userCode', checkToken, getFriend);
router.post('/accept', checkToken, acceptedRequest);
router.delete('/unfriend/:recipient/:requester', deleteFriend);
router.get('/suggest-frind/:userCode', checkToken, suggestFriend);
router.get('/get-request/:userCode', getRequest);
module.exports = router;
