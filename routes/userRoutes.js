const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();
router.post('/login', authController.login);
router.get('/verify', authController.verify);

// Protect all routes after this middleware

module.exports = router;
