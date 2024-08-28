const express = require('express');
const router = express.Router();
const controller = require('../controllers/saveList.controller')

const verifyToken = require("../middlewares/tokenVerification");

// add to saveList
router.post('/',verifyToken, controller.addToSaveList);

// remove from saveList
router.delete('/', verifyToken, controller.removeFromSaveList);

module.exports = router;