import React from 'react';
import '../styles/components/Footer.css';

const Footer = ({ onPageChange }) => {
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
            <li><a href="/about" onClick={(e) => { e.preventDefault(); onPageChange ? onPageChange('about') : (window.location.href = '/about'); }}>About</a></li>
            <li><a href="/privacy-policy" onClick={(e) => { e.preventDefault(); onPageChange ? onPageChange('privacy-policy') : (window.location.href = '/privacy-policy'); }}>Privacy policy</a></li>
            <li><a href="#faq-section" onClick={(e) => {
              e.preventDefault();
              const faqSection = document.getElementById('faq-section');
              if (faqSection) {
                faqSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}>FAQ</a></li>
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
