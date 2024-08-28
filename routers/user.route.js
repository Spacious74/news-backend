const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const verifyToken = require('../middlewares/tokenVerification');

router.post('/register', controller.registerUser);
router.post('/login', controller.loginUser);
router.post('/googleLogin', controller.googleLoginSignup);
router.get('/get-user/:userId', verifyToken, controller.getUserData);

module.exports = router;