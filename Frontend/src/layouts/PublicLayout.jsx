import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/layouts/PublicLayout.css';

const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout">
      {/* Navigation */}
      <nav className="main-navigation">
        <div className="nav-container">
          <div className="nav-brand">
            <Link to="/" className="brand-link">
              <h1>IntenseFocus</h1>
            </Link>
          </div>
          
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/shop" className="nav-link">Shop</Link>
            <Link to="/cart" className="nav-link">Cart</Link>
            <Link to="/login" className="nav-link">Login</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="public-main">
        {children}
      </main>

      {/* Footer */}
      <footer className="public-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>IntenseFocus</h3>
              <p>Discover your perfect vision with our premium eyewear collection.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/cart">Cart</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: info@intensefocus.com</p>
              <p>Phone: +91 98765 43210</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 IntenseFocus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout; 