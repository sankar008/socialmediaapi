const router = require('express').Router();
const { getUser, createUser, updateUser, getUserById, sendOtp, forgotPassword, userLogin, otpVerification, resetPassword, joinGroup, exitsGroup } = require('./user.controller');
const { checkToken } = require("../../author/token_validations");

router.get('/', getUser);
router.post('/', createUser);
router.get('/:userCode', getUserById);
router.patch('/', updateUser);
router.patch('/send-otp', sendOtp);
router.patch('/reset-password', resetPassword);
router.patch('/forgot-password', forgotPassword);
router.patch('/email-verified', otpVerification);
router.post('/login', userLogin);
router.post('/join', checkToken, joinGroup);
router.post('/exists', exitsGroup)
module.exports = router;
