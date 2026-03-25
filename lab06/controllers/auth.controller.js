const bcrypt = require('bcrypt'); // Thư viện mã hóa mật khẩu
const User = require('../models/user.model'); // Giả sử bạn có Model User

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        // 1. Lấy User ID từ Token (được Middleware giải mã gắn vào req.user)
        const userId = req.user.id; 
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        }

        // 2. Kiểm tra mật khẩu cũ có khớp không
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu cũ không chính xác!" });
        }

        // 3. Validate mật khẩu mới (phải từ 6 ký tự)
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: "Mật khẩu mới phải từ 6 ký tự trở lên!" });
        }

        // 4. Mã hóa mật khẩu mới và lưu lại
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return res.status(200).json({ message: "Đổi mật khẩu thành công!" });

    } catch (error) {
        return res.status(500).json({ message: "Lỗi hệ thống!", error: error.message });
    }
};

module.exports = { changePassword };