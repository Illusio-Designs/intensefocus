import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/common/Button';
import { Phone, Sms, ArrowBack, Timer } from '@mui/icons-material';
import { initializeMSG91, sendOTP, verifyOTP, retryOTP, verifyAccessToken } from '../utils/msg91';
import '../styles/pages/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/';
  
  const [formData, setFormData] = useState({
    phone: '+91 ',
    otp: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);
  const [msg91Initialized, setMsg91Initialized] = useState(false);
  const [reqId, setReqId] = useState(null);
  
  const otpInputRefs = useRef([]);

  // Timer effect for OTP expiration
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            setOtpSent(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Initialize MSG91 on component mount
  useEffect(() => {
    const initMSG91 = async () => {
      try {
        await initializeMSG91();
        setMsg91Initialized(true);
        console.log('MSG91 initialized successfully');
      } catch (error) {
        console.error('Failed to initialize MSG91:', error);
        alert('Failed to initialize OTP service. Please refresh the page.');
      }
    };

    initMSG91();
  }, []);

  // Timer effect for resend button
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validatePhone = () => {
    const newErrors = {};
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+91 [0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors = {};
    
    if (!formData.otp || formData.otp.length !== 6) {
      newErrors.otp = 'Please enter a 6-digit OTP';
    } else if (!/^[0-9]{6}$/.test(formData.otp)) {
      newErrors.otp = 'OTP should contain only numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Format Indian phone number as user types
      const cleaned = value.replace(/\D/g, '');
      
      // If user starts typing without +91, add it
      let formatted = value;
      if (!value.startsWith('+91')) {
        if (cleaned.length <= 10) {
          formatted = `+91 ${cleaned}`;
        } else {
          formatted = `+91 ${cleaned.substring(0, 10)}`;
        }
      } else {
        // If +91 is already there, format the remaining digits
        const digitsAfterCode = cleaned.substring(2); // Remove 91 from the cleaned string
        if (digitsAfterCode.length <= 10) {
          formatted = `+91 ${digitsAfterCode}`;
        } else {
          formatted = `+91 ${digitsAfterCode.substring(0, 10)}`;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple digits
    
    const newOTP = formData.otp.split('');
    newOTP[index] = value;
    const otpString = newOTP.join('');
    
    setFormData(prev => ({
      ...prev,
      otp: otpString
    }));

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Clear error when user starts typing
    if (errors.otp) {
      setErrors(prev => ({
        ...prev,
        otp: ''
      }));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const sendOTP = async () => {
    if (!validatePhone()) {
      return;
    }

    if (!msg91Initialized) {
      alert('OTP service is not ready. Please wait a moment and try again.');
      return;
    }

    setIsLoading(true);

    try {
      // Send OTP using MSG91
      const result = await sendOTP(formData.phone);
      console.log('MSG91 send OTP result:', result);
      
      // Store request ID if available
      if (result && result.requestId) {
        setReqId(result.requestId);
      }
      
      setOtpSent(true);
      setOtpTimer(300); // 5 minutes
      setCanResend(false);
      setResendTimer(60); // 1 minute cooldown
      
      // Focus first OTP input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
      
      alert('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert(`Failed to send OTP: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!canResend) return;

    if (!msg91Initialized) {
      alert('OTP service is not ready. Please wait a moment and try again.');
      return;
    }

    setIsLoading(true);

    try {
      // Retry OTP using MSG91
      const result = await retryOTP(null, reqId);
      console.log('MSG91 retry OTP result:', result);
      
      setOtpTimer(300); // 5 minutes
      setCanResend(false);
      setResendTimer(60); // 1 minute cooldown
      
      alert('OTP resent successfully!');
    } catch (error) {
      console.error('Error resending OTP:', error);
      alert(`Failed to resend OTP: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateOTP()) {
      return;
    }

    if (!msg91Initialized) {
      alert('OTP service is not ready. Please wait a moment and try again.');
      return;
    }

    setIsLoading(true);

    try {
      // Verify OTP using MSG91
      const verifyResult = await verifyOTP(formData.otp, reqId);
      console.log('MSG91 verify OTP result:', verifyResult);
      
      // If verification successful, verify with server
      if (verifyResult && verifyResult.token) {
        const serverVerification = await verifyAccessToken(verifyResult.token);
        console.log('Server verification result:', serverVerification);
        
        if (serverVerification.success) {
          if (isLoginMode) {
            console.log('Logging in with phone:', formData.phone);
            // Set authentication status
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userPhone', formData.phone);
            localStorage.setItem('userToken', verifyResult.token);
            alert('Login successful!');
            // Redirect to the page user was trying to access, or home
            navigate(from, { replace: true });
          } else {
            console.log('Registering with phone:', formData.phone);
            // Set authentication status for new users too
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userPhone', formData.phone);
            localStorage.setItem('userToken', verifyResult.token);
            alert('Registration successful!');
            // Redirect to the page user was trying to access, or home
            navigate(from, { replace: true });
          }
        } else {
          throw new Error('Server verification failed');
        }
      } else {
        throw new Error('OTP verification failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert(`Authentication failed: ${error.message || 'Invalid OTP. Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setOtpSent(false);
    setOtpTimer(0);
    setFormData(prev => ({ ...prev, otp: '' }));
    setErrors({});
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({ phone: '+91 ', otp: '' });
    setErrors({});
    setOtpSent(false);
    setOtpTimer(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

    return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
            {otpSent && (
              <button
                type="button"
                className="back-button"
                onClick={goBack}
              >
                <ArrowBack />
              </button>
            )}
            
            <h1 className="login-title">
              {otpSent 
                ? 'Verify OTP' 
                : (isLoginMode ? 'Welcome Back' : 'Create Account')
              }
            </h1>
            <p className="login-subtitle">
              {otpSent 
                ? `Enter the 6-digit code sent to ${formData.phone}`
                : (isLoginMode 
                    ? 'Sign in with your phone number' 
                    : 'Join us and discover amazing eyewear'
                  )
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {!otpSent ? (
              // Phone Number Input
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-wrapper">
                  <Phone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`form-input ${errors.phone ? 'form-input-error' : ''}`}
                    placeholder="Enter your phone number"
                    maxLength="15"
                  />
                </div>
                {errors.phone && <span className="form-error">{errors.phone}</span>}
                
                <Button
                  type="button"
                  variant="primary"
                  size="large"
                  loading={isLoading}
                  className="submit-btn"
                  onClick={sendOTP}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </div>
            ) : (
              // OTP Input
              <div className="form-group">
                <label className="form-label">Enter OTP</label>
                <div className="otp-container">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      className={`otp-input ${errors.otp ? 'otp-input-error' : ''}`}
                      value={formData.otp[index] || ''}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onFocus={(e) => e.target.select()}
                    />
                  ))}
                </div>
                {errors.otp && <span className="form-error">{errors.otp}</span>}
                
                {/* OTP Timer */}
                {otpTimer > 0 && (
                  <div className="otp-timer">
                    <Timer className="timer-icon" />
                    <span>OTP expires in {formatTime(otpTimer)}</span>
                  </div>
                )}
                
                {/* Resend OTP */}
                <div className="resend-otp">
                  <span>Didn't receive the code? </span>
                  <button
                    type="button"
                    className={`resend-btn ${!canResend ? 'disabled' : ''}`}
                    onClick={resendOTP}
                    disabled={!canResend || isLoading}
                  >
                    {canResend 
                      ? 'Resend OTP' 
                      : `Resend in ${formatTime(resendTimer)}`
                    }
                  </button>
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  loading={isLoading}
                  className="submit-btn"
                >
                  {isLoading 
                    ? (isLoginMode ? 'Signing In...' : 'Creating Account...')
                    : (isLoginMode ? 'Sign In' : 'Create Account')
                  }
                </Button>
              </div>
            )}
          </form>

          {/* Mode Toggle */}
          {!otpSent && (
            <div className="mode-toggle">
              <p>
                {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={toggleMode}
                >
                  {isLoginMode ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
  );
};

export default Login; 