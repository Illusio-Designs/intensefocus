// MSG91 OTP Integration Utilities

// Initialize MSG91 Widget
export const initializeMSG91 = () => {
  return new Promise((resolve, reject) => {
    // Check if MSG91 is already loaded
    if (window.sendOtp && window.verifyOtp && window.retryOtp) {
      resolve();
      return;
    }

    // Create configuration
    const configuration = {
      widgetId: import.meta.env.VITE_MSG91_WIDGET_ID,
      exposeMethods: true,
      success: (data) => {
        console.log('MSG91 Widget initialized successfully:', data);
        resolve();
      },
      failure: (error) => {
        console.error('MSG91 Widget initialization failed:', error);
        reject(error);
      },
    };

    // Create script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://verify.msg91.com/otp-provider.js';
    script.onload = () => {
      // Initialize the widget
      if (window.initSendOTP) {
        window.initSendOTP(configuration);
      } else {
        reject(new Error('MSG91 initSendOTP function not found'));
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load MSG91 script'));
    };

    // Add script to document
    document.head.appendChild(script);
  });
};

// Send OTP
export const sendOTP = (phoneNumber) => {
  return new Promise((resolve, reject) => {
    if (!window.sendOtp) {
      reject(new Error('MSG91 sendOtp function not available'));
      return;
    }

    // Remove + and spaces from phone number
    const cleanPhone = phoneNumber.replace(/[\s+]/g, '');
    
    window.sendOtp(
      cleanPhone,
      (data) => {
        console.log('OTP sent successfully:', data);
        resolve(data);
      },
      (error) => {
        console.error('OTP send failed:', error);
        reject(error);
      }
    );
  });
};

// Verify OTP
export const verifyOTP = (otp, reqId = null) => {
  return new Promise((resolve, reject) => {
    if (!window.verifyOtp) {
      reject(new Error('MSG91 verifyOtp function not available'));
      return;
    }

    window.verifyOtp(
      otp,
      (data) => {
        console.log('OTP verified successfully:', data);
        resolve(data);
      },
      (error) => {
        console.error('OTP verification failed:', error);
        reject(error);
      },
      reqId
    );
  });
};

// Retry OTP
export const retryOTP = (channel = null, reqId = null) => {
  return new Promise((resolve, reject) => {
    if (!window.retryOtp) {
      reject(new Error('MSG91 retryOtp function not available'));
      return;
    }

    window.retryOtp(
      channel,
      (data) => {
        console.log('OTP retry successful:', data);
        resolve(data);
      },
      (error) => {
        console.error('OTP retry failed:', error);
        reject(error);
      },
      reqId
    );
  });
};

// Get Widget Data
export const getWidgetData = () => {
  if (!window.getWidgetData) {
    console.warn('MSG91 getWidgetData function not available');
    return null;
  }
  return window.getWidgetData();
};

// Check Captcha Verification
export const isCaptchaVerified = () => {
  if (!window.isCaptchaVerified) {
    console.warn('MSG91 isCaptchaVerified function not available');
    return false;
  }
  return window.isCaptchaVerified();
};

// Server-side verification
export const verifyAccessToken = async (accessToken) => {
  try {
    const response = await fetch('http://localhost:3000/api/msg91/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'access-token': accessToken,
      }),
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message || 'Verification failed' };
    }
  } catch (error) {
    console.error('Server verification failed:', error);
    return { success: false, error: error.message };
  }
}; 