/**
 * MSG91 OTP Widget Service
 * Handles OTP sending, verification, and resending using MSG91 API endpoints
 */

// MSG91 Configuration - should be set via environment variables
const MSG91_WIDGET_ID = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID || '';
const MSG91_AUTH_KEY = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH || '';
// Note: Token Auth and Auth Key are the same in MSG91

// MSG91 API Base URL
const MSG91_API_BASE = 'https://api.msg91.com/api/v5/widget';

// Store current request data
let currentReqId = null;
let currentPhoneNumber = null;
let currentAccessToken = null;

/**
 * Format phone number for MSG91 (remove + and format as 919999999999)
 * @param {string} phoneNumber - Phone number in any format
 * @returns {string} Formatted phone number (e.g., 919999999999)
 */
const formatPhoneNumberForMSG91 = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  let digits = phoneNumber.replace(/\D/g, '');
  
  // Ensure it starts with country code (91 for India)
  if (digits.startsWith('91')) {
    return digits;
  }
  
  // If it's a 10-digit number, assume it's Indian and add 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  
  // Return as is if already formatted
  return digits;
};

/**
 * Make API request to MSG91
 */
const makeMSG91Request = async (endpoint, body = {}) => {
  // Validate credentials
  if (!MSG91_AUTH_KEY) {
    throw new Error('MSG91_AUTH_KEY is not set. Please add NEXT_PUBLIC_MSG91_TOKEN_AUTH to your environment variables.');
  }
  if (!MSG91_WIDGET_ID) {
    throw new Error('MSG91_WIDGET_ID is not set. Please add NEXT_PUBLIC_MSG91_WIDGET_ID to your environment variables.');
  }

  const response = await fetch(`${MSG91_API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'authkey': MSG91_AUTH_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'MSG91 API request failed');
  }

  return data;
};

/**
 * Send OTP to phone number
 * @param {string} phoneNumber - Phone number in any format
 * @returns {Promise<Object>} Promise that resolves when OTP is sent
 */
export const sendOTP = async (phoneNumber) => {
  try {
    // Format phone number for MSG91
    const formattedPhone = formatPhoneNumberForMSG91(phoneNumber);
    
    if (!formattedPhone || formattedPhone.length < 10) {
      throw new Error('Invalid phone number format');
    }

    console.log('Sending OTP to:', formattedPhone);

    // Call MSG91 sendOtp API
    const response = await makeMSG91Request('/sendOtp', {
      widgetId: MSG91_WIDGET_ID,
      identifier: formattedPhone,
    });

    console.log('MSG91 sendOtp response:', response);
    console.log('Full response structure:', JSON.stringify(response, null, 2));

    // Store request ID - MSG91 returns reqId in 'message' field when type is 'success'
    let reqId = null;
    
    if (response.type === 'success' && response.message) {
      // MSG91 returns reqId in the 'message' field
      reqId = response.message;
    } else {
      // Fallback to other possible field names
      reqId = response.requestId || response.reqId || response.request_id || response.id || response.message;
    }
    
    if (reqId) {
      currentReqId = reqId;
      currentPhoneNumber = formattedPhone;
      console.log('Stored reqId:', currentReqId);
      // Also store in localStorage as backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('msg91_reqId', reqId);
        localStorage.setItem('msg91_phoneNumber', formattedPhone);
      }
    } else {
      console.warn('No requestId found in response. Available fields:', Object.keys(response));
      // Still store phone number even if reqId is missing
      currentPhoneNumber = formattedPhone;
      if (typeof window !== 'undefined') {
        localStorage.setItem('msg91_phoneNumber', formattedPhone);
      }
    }

    return {
      success: true,
      message: 'OTP sent successfully',
      data: response,
      reqId: reqId,
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw {
      success: false,
      message: error.message || 'Failed to send OTP',
      error: error,
    };
  }
};

/**
 * Verify OTP
 * @param {string} otp - OTP code entered by user
 * @returns {Promise<Object>} Promise that resolves when OTP is verified
 */
export const verifyOTP = async (otp) => {
  try {
    if (!otp || otp.length < 4) {
      throw new Error('Invalid OTP code');
    }

    // Check if we have reqId, if not try to get it from last sendOTP response
    if (!currentReqId) {
      console.warn('currentReqId is missing. Checking if we can recover...');
      // Try to get from localStorage as fallback
      const storedReqId = typeof window !== 'undefined' ? localStorage.getItem('msg91_reqId') : null;
      if (storedReqId) {
        currentReqId = storedReqId;
        console.log('Recovered reqId from storage:', currentReqId);
      } else {
        throw new Error('Request ID not found. Please send OTP first.');
      }
    }

    console.log('Verifying OTP:', otp, 'with reqId:', currentReqId);

    // Call MSG91 verifyOtp API
    const response = await makeMSG91Request('/verifyOtp', {
      widgetId: MSG91_WIDGET_ID,
      reqId: currentReqId,
      otp: otp,
    });

    console.log('MSG91 verifyOtp response:', response);
    console.log('Full verify response structure:', JSON.stringify(response, null, 2));

    // Store access token if provided - check multiple possible field names
    const accessToken = response.access_token || response.accessToken || response.token;
    if (accessToken) {
      currentAccessToken = accessToken;
      // Also store in localStorage as backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('msg91_accessToken', accessToken);
      }
    }

    return {
      success: true,
      message: 'OTP verified successfully',
      data: response,
      accessToken: accessToken,
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw {
      success: false,
      message: error.message || 'OTP verification failed',
      error: error,
    };
  }
};

/**
 * Resend OTP
 * @param {string} retryChannel - Retry channel (default: "11" for SMS)
 * @returns {Promise<Object>} Promise that resolves when OTP is resent
 */
export const resendOTP = async (retryChannel = '11') => {
  try {
    // Try to get reqId from memory or localStorage
    if (!currentReqId) {
      const storedReqId = typeof window !== 'undefined' ? localStorage.getItem('msg91_reqId') : null;
      if (storedReqId) {
        currentReqId = storedReqId;
        console.log('Recovered reqId from storage for resend:', currentReqId);
      }
    }

    if (!currentReqId) {
      // If no reqId, try to send new OTP
      const phoneNumber = currentPhoneNumber || (typeof window !== 'undefined' ? localStorage.getItem('msg91_phoneNumber') : null);
      if (!phoneNumber) {
        throw new Error('No active OTP session. Please send OTP first.');
      }
      console.log('No reqId found, sending new OTP instead');
      return await sendOTP(phoneNumber);
    }

    console.log('Resending OTP with reqId:', currentReqId);

    // Call MSG91 retryOtp API
    const response = await makeMSG91Request('/retryOtp', {
      widgetId: MSG91_WIDGET_ID,
      reqId: currentReqId,
      retryChannel: retryChannel, // 11 for SMS
    });

    console.log('MSG91 retryOtp response:', response);
    console.log('Full retry response structure:', JSON.stringify(response, null, 2));

    // Update request ID if new one is provided - MSG91 returns reqId in 'message' field when type is 'success'
    let newReqId = null;
    
    if (response.type === 'success' && response.message) {
      // MSG91 returns reqId in the 'message' field
      newReqId = response.message;
    } else {
      // Fallback to other possible field names
      newReqId = response.requestId || response.reqId || response.request_id || response.id || response.message;
    }
    
    if (newReqId) {
      currentReqId = newReqId;
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('msg91_reqId', newReqId);
      }
      console.log('Updated reqId to:', newReqId);
    }

    return {
      success: true,
      message: 'OTP resent successfully',
      data: response,
      reqId: newReqId || currentReqId,
    };
  } catch (error) {
    console.error('Error resending OTP:', error);
    throw {
      success: false,
      message: error.message || 'Failed to resend OTP',
      error: error,
    };
  }
};

/**
 * Verify Access Token
 * @param {string} accessToken - Access token from verifyOtp response (optional, uses stored token if not provided)
 * @returns {Promise<Object>} Promise that resolves when access token is verified
 */
export const verifyAccessToken = async (accessToken = null) => {
  try {
    const token = accessToken || currentAccessToken;
    
    if (!token) {
      throw new Error('Access token not found. Please verify OTP first.');
    }

    console.log('Verifying access token');

    // Call MSG91 verifyAccessToken API
    const response = await makeMSG91Request('/verifyAccessToken', {
      'access-token': token,
    });

    console.log('MSG91 verifyAccessToken response:', response);

    return {
      success: true,
      message: 'Access token verified successfully',
      data: response,
    };
  } catch (error) {
    console.error('Error verifying access token:', error);
    throw {
      success: false,
      message: error.message || 'Access token verification failed',
      error: error,
    };
  }
};

/**
 * Initialize OTP Widget (for backward compatibility)
 * This now just validates credentials and formats phone number
 * @param {string} phoneNumber - Phone number
 * @param {Object} callbacks - Callback functions (not used with API approach)
 * @returns {Promise<Object>}
 */
export const initializeOTPWidget = async (phoneNumber, callbacks = {}) => {
  // Validate credentials
  if (!MSG91_WIDGET_ID) {
    throw new Error('MSG91_WIDGET_ID is not set. Please add NEXT_PUBLIC_MSG91_WIDGET_ID to your environment variables.');
  }
  if (!MSG91_AUTH_KEY) {
    throw new Error('MSG91_AUTH_KEY is not set. Please add NEXT_PUBLIC_MSG91_TOKEN_AUTH to your environment variables.');
  }

  const formattedPhone = formatPhoneNumberForMSG91(phoneNumber);
  currentPhoneNumber = formattedPhone;

  return { initialized: true, phoneNumber: formattedPhone };
};

/**
 * Destroy OTP Widget instance and reset state
 */
export const destroyOTPWidget = () => {
  currentReqId = null;
  currentPhoneNumber = null;
  currentAccessToken = null;
  // Clear localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('msg91_reqId');
    localStorage.removeItem('msg91_phoneNumber');
    localStorage.removeItem('msg91_accessToken');
  }
};

/**
 * Get current request ID (for advanced usage)
 */
export const getReqId = () => {
  return currentReqId;
};

/**
 * Get current access token (for advanced usage)
 */
export const getAccessToken = () => {
  return currentAccessToken;
};

// Legacy exports for backward compatibility (not used with API approach)
export const verifyOTPWithWidget = verifyOTP;
export const resendOTPWithWidget = resendOTP;
export const getJWTToken = getAccessToken;
export const getWidgetMethods = () => null;
