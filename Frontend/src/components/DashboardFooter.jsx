import React from 'react';
import '../styles/components/DashboardFooter.css';

const DashboardFooter = () => {
  return (
    <footer className="dashboard-footer">
      <div className="dashboard-footer-content">
        <div className="dashboard-footer-section">
          <h3>STALLION EYEWEAR LLP</h3>
          <p>Your Vision, Our Passion</p>
        </div>
        
        <div className="dashboard-footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Products</a></li>
            <li><a href="#">Orders</a></li>
            <li><a href="#">Analytics</a></li>
          </ul>
        </div>
        
        <div className="dashboard-footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Documentation</a></li>
          </ul>
        </div>
        
        <div className="dashboard-footer-section">
          <h4>Contact Info</h4>
          <p>Email: info@stallioneyewear.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
      </div>
      
      <div className="dashboard-footer-bottom">
        <p>&copy; 2024 Stallion Eyewear LLP. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default DashboardFooter;
