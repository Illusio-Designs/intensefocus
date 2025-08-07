import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone
} from '@mui/icons-material';
import '../../styles/components/dashboard/Footer.css';

const DashboardFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="dashboard-footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <h3>IntenseFocus</h3>
            <p>Leading optical solutions for better vision</p>
          </div>
          <div className="social-links">
            <a href="#" className="social-link">
              <Facebook />
            </a>
            <a href="#" className="social-link">
              <Twitter />
            </a>
            <a href="#" className="social-link">
              <Instagram />
            </a>
            <a href="#" className="social-link">
              <LinkedIn />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/dashboard/orders">Orders</Link></li>
            <li><Link to="/dashboard/customers">Customers</Link></li>
            <li><Link to="/dashboard/products">Products</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul className="footer-links">
            <li><Link to="/dashboard/help">Help Center</Link></li>
            <li><Link to="/dashboard/contact">Contact Us</Link></li>
            <li><Link to="/dashboard/faq">FAQ</Link></li>
            <li><Link to="/dashboard/support">Technical Support</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <div className="contact-info">
            <div className="contact-item">
              <Email className="contact-icon" />
              <span>support@intensefocus.com</span>
            </div>
            <div className="contact-item">
              <Phone className="contact-icon" />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} IntenseFocus. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/dashboard/privacy">Privacy Policy</Link>
            <Link to="/dashboard/terms">Terms of Service</Link>
            <Link to="/dashboard/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter; 