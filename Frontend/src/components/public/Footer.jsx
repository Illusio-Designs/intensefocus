import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/public/Footer.css';

const Footer = () => {
  return (
    <footer className="public-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">IntenseFocus</h3>
            <p className="footer-description">
              Discover your perfect vision with our premium eyewear collection. 
              Quality frames and lenses for every style and need.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">💼</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/shop" className="footer-link">Shop</Link></li>
              <li><Link to="/cart" className="footer-link">Cart</Link></li>
              <li><Link to="/login" className="footer-link">Login</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Categories</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Sunglasses</a></li>
              <li><a href="#" className="footer-link">Eyeglasses</a></li>
              <li><a href="#" className="footer-link">Contact Lenses</a></li>
              <li><a href="#" className="footer-link">Accessories</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Support</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Contact Us</a></li>
              <li><a href="#" className="footer-link">FAQ</a></li>
              <li><a href="#" className="footer-link">Shipping Info</a></li>
              <li><a href="#" className="footer-link">Returns</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Contact Info</h4>
            <div className="contact-info">
              <p>📧 info@intensefocus.com</p>
              <p>📞 +91 98765 43210</p>
              <p>📍 123 Vision Street, Mumbai, India</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; 2024 IntenseFocus. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">Privacy Policy</a>
              <a href="#" className="footer-bottom-link">Terms of Service</a>
              <a href="#" className="footer-bottom-link">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 