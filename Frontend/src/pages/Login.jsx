import React, { useState, useRef, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/pages/Login.css';
import { showLoginSuccess, showError, showSuccess } from '../services/notificationService';
import { setAuth } from '../services/authService';
import { checkUser, login } from '../services/apiService';
import { verifyOTP, resendOTP, initializeOTPWidget, destroyOTPWidget } from '../services/msg91Service';

const Login = ({ onPageChange }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputRefs = useRef([]);

  // Cleanup OTP widget on unmount
  useEffect(() => {
    return () => {
      destroyOTPWidget();
    };
  }, []);

  // Resend timer countdown
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate Indian phone numbers: require exactly 10 digits (excluding country code)
    const digitsOnly = String(phoneNumber || '').replace(/\D/g, '');
    const nationalNumber = digitsOnly.startsWith('91') ? digitsOnly.slice(2) : digitsOnly;
    if (nationalNumber.length !== 10) {
      showError('Please enter a 10-digit phone number');
      setLoading(false);
      return;
    }

    // Format phone number to E.164 format
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    try {
      // Check user and auto-send OTP via MSG91
      const response = await checkUser(formattedPhone);
      
      if (response.otpSent) {
        // Initialize OTP widget for verification
        await initializeOTPWidget(formattedPhone, {
          onSuccess: () => {
            console.log('OTP sent via MSG91');
          },
          onError: (error) => {
            console.error('MSG91 OTP error:', error);
            showError('Failed to send OTP. Please try again.');
          },
        });
        
        showSuccess('OTP sent successfully to your phone number');
        setShowOTP(true);
        setResendDisabled(true);
        setResendTimer(30); // 30 seconds cooldown
      } else {
        showError(response.otpError || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Check user error:', error);
      showError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(['', '', '', '', '', '']).slice(0, 6);
      setOtp(newOtp);
      const lastIndex = Math.min(pastedData.length - 1, 5);
      otpInputRefs.current[lastIndex]?.focus();
    }
  };

  const handleOTPVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      showError('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      // Format phone number to E.164 format
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

      // Verify OTP via MSG91
      const verifyResponse = await verifyOTP(otpValue);
      
      if (verifyResponse.success) {
        // OTP verified, now login user
        const loginResponse = await login(formattedPhone);
        
        console.log('Login response:', loginResponse);
        
        if (loginResponse.token) {
          // Decode JWT token to extract user information
          let userData = null;
          try {
            // JWT token structure: header.payload.signature
            const tokenParts = loginResponse.token.split('.');
            if (tokenParts.length === 3) {
              // Decode the payload (second part)
              const payload = JSON.parse(atob(tokenParts[1]));
              userData = {
                id: payload.userId || payload.user_id,
                phone: payload.phone,
                email: payload.email,
                full_name: payload.full_name || payload.fullName,
                name: payload.full_name || payload.fullName || payload.name,
                role: loginResponse.role || payload.role,
              };
            }
          } catch (decodeError) {
            console.error('Error decoding JWT token:', decodeError);
            // Fallback: create user object from available data
            userData = {
              phone: formattedPhone,
              role: loginResponse.role || 'user',
            };
          }
          
          // If user object exists in response, use it; otherwise use decoded data
          const user = loginResponse.user || userData;
          
          if (user) {
            // Set authentication
            setAuth(user, loginResponse.token);
            showLoginSuccess();
            
            // Cleanup OTP widget
            destroyOTPWidget();
            
            setTimeout(() => {
              onPageChange('dashboard');
            }, 500);
          } else {
            showError('Login failed. Unable to extract user information.');
          }
        } else {
          showError(loginResponse.message || 'Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMessage = error.message || error.error?.message || 'OTP verification failed. Please try again.';
      showError(errorMessage);
      
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled || loading) return;

    setLoading(true);
    setResendDisabled(true);

    try {
      const resendResponse = await resendOTP();
      
      if (resendResponse.success) {
        showSuccess('OTP resent successfully');
        setResendTimer(30); // 30 seconds cooldown
        setOtp(['', '', '', '', '', '']);
        otpInputRefs.current[0]?.focus();
      } else {
        showError(resendResponse.message || 'Failed to resend OTP');
        setResendDisabled(false);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      showError(error.message || 'Failed to resend OTP. Please try again.');
      setResendDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (onPageChange) {
      onPageChange(page);
    } else if (typeof window !== 'undefined') {
      window.location.href = `/${page}`;
    }
  };

  return (
    <div className="login-page">
      <Header onPageChange={handlePageChange} currentPage="login" />
      <div className="login-background">
        <img src="/images/banners/loginbg.webp" alt="Login Background" className="login-bg-image" />
        <div className="login-gradient-overlay"></div>
      </div>
      <div className="login-content">
        <div className="login-container">
          {!showOTP ? (
            <>
              <h1 className="login-title">Login</h1>
              <p className="login-subtitle">Welcome back, enter your phone number.</p>
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="login-input-group">
                  <label htmlFor="phone">Phone Number</label>
                  <PhoneInput
                    country={'in'}
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    inputProps={{
                      id: 'phone',
                      required: true,
                      placeholder: 'Enter your phone number',
                    }}
                    containerClass="phone-input-container"
                    inputClass="phone-input-field"
                    buttonClass="phone-input-button"
                    dropdownClass="phone-input-dropdown"
                    disableDropdown={false}
                    disableCountryGuess={false}
                  />
                </div>
                <div className="login-button-container">
                  <button type="submit" className="login-button" disabled={loading}>
                    {loading ? 'SENDING...' : 'SEND OTP'}
                  </button>
                  <div className="login-button-border"></div>
                </div>
              </form>
            </>
          ) : (
            <>
              <h1 className="login-title">OTP</h1>
              <p className="login-subtitle">We sent OTP code to your phone number.</p>
              <form className="login-form" onSubmit={handleOTPVerify}>
                <div className="otp-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      onPaste={handleOTPPaste}
                      className="otp-input"
                      required
                      disabled={loading}
                    />
                  ))}
                </div>
                <div className="login-button-container">
                  <button type="submit" className="login-button" disabled={loading}>
                    {loading ? 'VERIFYING...' : 'VERIFY OTP'}
                  </button>
                  <div className="login-button-border"></div>
                </div>
                <div className="resend-otp-container" style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendDisabled || loading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: resendDisabled ? '#999' : '#007bff',
                      cursor: resendDisabled || loading ? 'not-allowed' : 'pointer',
                      textDecoration: 'underline',
                      fontSize: '0.9rem',
                    }}
                  >
                    {resendTimer > 0
                      ? `Resend OTP in ${resendTimer}s`
                      : 'Resend OTP'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
