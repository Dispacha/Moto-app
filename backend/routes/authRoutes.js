const express = require('express');
const router = express.Router();
const { refreshToken, logout } = require('../controllers/authController');

router.post('/refresh', refreshToken);
router.post('/logout', logout);

module.exports = router;
