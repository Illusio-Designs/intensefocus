import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/components/public/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhone, setUserPhone] = useState('');

  useEffect(() => {
    // Check authentication status on component mount
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const phone = localStorage.getItem('userPhone') || '';
    setIsAuthenticated(authStatus);
    setUserPhone(phone);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userToken');
    setIsAuthenticated(false);
    setUserPhone('');
    navigate('/');
  };

  return (
    <header className="public-header">
      <div className="header-container">
        <div className="header-brand">
          <Link to="/" className="brand-link">
            <h1>IntenseFocus</h1>
          </Link>
        </div>
        
        <nav className="header-nav">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/shop" className="nav-link">Shop</Link>
            </li>
            <li className="nav-item">
              <Link to="/cart" className="nav-link">Cart</Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">Login</Link>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <button className="header-btn">
            <span className="icon">🔍</span>
          </button>
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/dashboard" className="header-btn dashboard-btn">
                <span className="icon">📊</span>
              </Link>
              <button className="header-btn user-btn">
                <span className="icon">👤</span>
                <span className="user-phone">{userPhone}</span>
              </button>
              <button className="header-btn logout-btn" onClick={handleLogout}>
                <span className="icon">🚪</span>
              </button>
            </div>
          ) : (
            <button className="header-btn">
              <span className="icon">👤</span>
            </button>
          )}
          <button className="header-btn cart-btn">
            <span className="icon">🛒</span>
            <span className="cart-count">0</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 