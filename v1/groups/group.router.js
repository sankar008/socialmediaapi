const { createGroup, getGroup, updateGroup, deleteGroup, getGroupByuserCode, getGroupByCode, getAllJoinGroup } = require('./group.controller');
const router = require('express').Router();
const { checkToken } = require("../../author/token_validations");
router.get('/', checkToken, getGroup);
router.get('/:userCode', checkToken, getGroupByuserCode);
router.get('/edit/:groupCode', getGroupByCode),
router.post('/', checkToken, createGroup);
router.patch('/', checkToken, updateGroup);
router.delete('/:id', checkToken, deleteGroup);
router.get('/all/:userCode', getAllJoinGroup);
module.exports = router;
