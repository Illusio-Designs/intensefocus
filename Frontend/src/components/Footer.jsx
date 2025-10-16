import React from 'react';
import '@/styles/components/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>STALLION EYEWEAR LLP</h3>
          <p>Your Vision, Our Passion</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>Email: info@stallioneyewear.com</p>
          <p>Phone: +91 1234567890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Stallion Eyewear LLP. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
