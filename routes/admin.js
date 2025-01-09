var express = require('express');
var router = express.Router();

let adminController = require('../controller/Admin')

router.get('/read', adminController.adminRead)

router.post('/signup', adminController.adminSignup)

router.post('/login', adminController.adminLogin)

module.exports = router;