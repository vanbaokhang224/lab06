const express = require('express');
const router = express.Router();
const { changePassword } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware'); // Middleware kiểm tra JWT

// Yêu cầu đăng nhập (phải qua verifyToken) mới được đổi mật khẩu
router.post('/change-password', verifyToken, changePassword);

module.exports = router;