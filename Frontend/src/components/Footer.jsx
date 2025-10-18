import React from 'react';
import '../styles/components/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-background">
        <img src="/images/banners/background.webp" alt="Footer Background" className="footer-bg-image" />
      </div>
      <div className="footer-left-image">
        <img src="/images/banners/spacs.webp" alt="Eyewear" className="footer-side-image" />
      </div>
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <img src="/images/logo/logo.webp" alt="Stallion Eyewear" className="footer-logo-image" />
          </div>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Privacy policy</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact and Support</h4>
          <p>+1(800)123-4567</p>
          <p><a href="mailto:support@stallion.com">support@stallion.com</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
