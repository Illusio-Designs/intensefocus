const msg91Service = require('../services/msg91Service');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
class AuthController {
    async sendOtp(req, res) {
        try {
            const { phoneNumber } = req.body;
            if (!phoneNumber) {
                return res.status(400).json({ error: 'Phone number is required' });
            }
            if (!/^\+?[1-9]\d{1,2}\d{7,12}$/.test(phoneNumber)) {
                return res.status(400).json({ error: 'Phone number must include country code (e.g., +91XXXXXXXXXX or 91XXXXXXXXXX)' });
            }
            const data = await msg91Service.sendOtp(phoneNumber);
            if (data.type === 'success') {
                res.status(200).json({ message: 'OTP sent successfully' });
            } else {
                res.status(400).json({ error: data.message });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async verifyOtp(req, res) {
        try {
            const { phoneNumber, otp } = req.body;
            if (!phoneNumber) {
                return res.status(400).json({ error: 'Phone number is required' });
            }
            if (!otp) {
                return res.status(400).json({ error: 'OTP is required' });
            }
            if (!/^\+?[1-9]\d{1,2}\d{7,12}$/.test(phoneNumber)) {
                return res.status(400).json({ error: 'Phone number must include country code (e.g., +91XXXXXXXXXX or 91XXXXXXXXXX)' });
            }
            const data = await msg91Service.verifyOtp(phoneNumber, otp);
            if (data.type === 'success') {
                const user = await User.findOne({
                    where: {
                        phone: phoneNumber,
                        is_active: true
                    }
                });
                if (!user) {
                    return res.status(400).json({ error: 'User not found' });
                }
                const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                await user.update({ last_login: new Date() });
                res.status(200).json({ token: token });
            } else {
                res.status(400).json({ error: data.message });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async logout(req, res) {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ error: 'Token is required' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.userId);
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }
            await user.update({ last_login: null });
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async refreshToken(req, res) {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ error: 'Token is required' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.userId);
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }
            const newToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            await user.update({ last_login: new Date() });
            res.status(200).json({ token: newToken });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();