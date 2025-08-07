import React from 'react';
import '../styles/layouts/AuthLayout.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      {/* Left side - Auth Form */}
      <div className="auth-container">
        {children}
      </div>
      
      {/* Right side - Brand Content */}
      <div className="auth-right-side">
        <div className="right-content">
          <div className="brand-section">
            <h1 className="brand-title">IntenseFocus</h1>
            <p className="brand-tagline">Discover Your Perfect Vision</p>
          </div>
          <div className="features-section">
            <div className="feature-item">
              <div className="feature-icon">👓</div>
              <h3>Premium Eyewear</h3>
              <p>Exclusive collection of designer frames and lenses</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick and secure delivery to your doorstep</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💎</div>
              <h3>Quality Assured</h3>
              <p>100% authentic products with warranty</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 