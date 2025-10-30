import React, { useState, useRef } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/pages/Login.css';
import { showLoginSuccess, showError } from '../services/notificationService';
import { setAuth } from '../services/authService';

const Login = ({ onPageChange }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate Indian phone numbers: require exactly 10 digits (excluding country code)
    const digitsOnly = String(phoneNumber || '').replace(/\D/g, '');
    const nationalNumber = digitsOnly.startsWith('91') ? digitsOnly.slice(2) : digitsOnly;
    if (nationalNumber.length !== 10) {
      showError('Please enter a 10-digit phone number');
      return;
    }
    // Show OTP screen for phone login
    setShowOTP(true);
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
    if (otpValue.length === 6) {
      try {
        // TODO: Verify OTP with backend
        const mockUser = {
          id: 1,
          name: 'User',
          email: null,
          phone: phoneNumber,
        };
        const mockToken = 'mock-jwt-token-' + Date.now();
        setAuth(mockUser, mockToken);
        showLoginSuccess();
        setTimeout(() => {
          onPageChange('dashboard');
        }, 500);
      } catch (error) {
        console.error('OTP verification error:', error);
        showError('OTP verification failed. Please try again.');
      }
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
                  <button type="submit" className="login-button">SEND OTP</button>
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
                    />
                  ))}
                </div>
                <div className="login-button-container">
                  <button type="submit" className="login-button">VERIFY OTP</button>
                  <div className="login-button-border"></div>
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
