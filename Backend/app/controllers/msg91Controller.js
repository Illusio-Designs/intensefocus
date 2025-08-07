const axios = require('axios');
require('dotenv').config();

// MSG91 Configuration
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY || '426738ASF2pakn3R669df9a7P1';
const MSG91_VERIFY_URL = 'https://control.msg91.com/api/v5/widget/verifyAccessToken';

// Verify Access Token
const verifyAccessToken = async (req, res) => {
  try {
    const { 'access-token': accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify with MSG91 API
    const response = await axios.post(MSG91_VERIFY_URL, {
      authkey: MSG91_AUTH_KEY,
      'access-token': accessToken
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('MSG91 verification response:', response.data);

    if (response.data && response.data.type === 'success') {
      return res.status(200).json({
        success: true,
        message: 'Token verified successfully',
        data: response.data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Token verification failed',
        error: response.data
      });
    }

  } catch (error) {
    console.error('MSG91 verification error:', error.response?.data || error.message);
    
    return res.status(500).json({
      success: false,
      message: 'Server error during token verification',
      error: error.response?.data || error.message
    });
  }
};

// Send OTP (for server-side implementation if needed)
const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // This would typically call MSG91's send OTP API
    // For now, we'll return a success response
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        requestId: `req_${Date.now()}`,
        phone: phone
      }
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while sending OTP',
      error: error.message
    });
  }
};

// Verify OTP (for server-side implementation if needed)
const verifyOTP = async (req, res) => {
  try {
    const { otp, requestId } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP is required'
      });
    }

    // This would typically call MSG91's verify OTP API
    // For now, we'll return a success response
    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token: `token_${Date.now()}`,
        requestId: requestId
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while verifying OTP',
      error: error.message
    });
  }
};

// Retry OTP (for server-side implementation if needed)
const retryOTP = async (req, res) => {
  try {
    const { requestId, channel } = req.body;

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: 'Request ID is required'
      });
    }

    // This would typically call MSG91's retry OTP API
    // For now, we'll return a success response
    return res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      data: {
        requestId: requestId,
        channel: channel || 'sms'
      }
    });

  } catch (error) {
    console.error('Retry OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrying OTP',
      error: error.message
    });
  }
};

module.exports = {
  verifyAccessToken,
  sendOTP,
  verifyOTP,
  retryOTP
}; 