import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/Header.css';
import { getCartCount, registerCartListener } from '../services/cartService';
import { isLoggedIn, logout as authLogout } from '../services/authService';
import { showLogoutSuccess } from '../services/notificationService';

const Header = ({ onPageChange, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Initialize on mount and then listen for scroll
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Initialize cart count
    setCartCount(getCartCount());
    
    // Listen for cart changes
    const unsubscribe = registerCartListener(() => {
      setCartCount(getCartCount());
    });
    
    return unsubscribe;
  }, []);

  // Check login status on mount and when page changes
  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [currentPage]);

  // Listen for storage changes to update login status
  useEffect(() => {
    const handleStorageChange = () => {
      setLoggedIn(isLoggedIn());
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event for same-tab updates
    window.addEventListener('authChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  // Handle user icon click
  const handleUserIconClick = () => {
    if (loggedIn) {
      setIsUserDropdownOpen(!isUserDropdownOpen);
    } else {
      onPageChange('login');
    }
  };

  // Handle dashboard navigation
  const handleDashboardClick = () => {
    setIsUserDropdownOpen(false);
    onPageChange('dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    setIsUserDropdownOpen(false);
    authLogout();
    setLoggedIn(false);
    showLogoutSuccess();
    onPageChange('');
  };

  const navItems = [
    { id: '', text: 'Home' },
    { id: 'products', text: 'Shop' },
    { id: 'about', text: 'About' }
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <nav className="nav-menu">
          {navItems.map((item) => (
            <a 
              key={item.id}
              href={item.id === '' ? '/' : `/${item.id}`}
              className={currentPage === item.id ? 'active' : ''}
              onClick={e => {
                e.preventDefault();
                if (onPageChange) onPageChange(item.id);
                else window.location.href = item.id === '' ? '/' : `/${item.id}`;
              }}
            >
              {item.text}
            </a>
          ))}
        </nav>
        
        <div className="logo" onClick={() => onPageChange ? onPageChange('') : window.location.href = '/'}>
          <img src="/images/logo/logo.webp" alt="Stallion Eyewear" className="logo-image" />
        </div>
        
        <div className="header-actions">
          <div className="search-bar">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input type="text" placeholder="Search..." />
          </div>
          <div className="action-icons">
            <button className="icon-btn cart-btn" onClick={() => onPageChange('cart')} title="Cart">
              <img src="/images/icons/shopping-bag-02.webp" alt="Cart" className="icon-image" />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>
            <div className="user-menu-container" ref={dropdownRef}>
              <button 
                className="icon-btn user-btn" 
                onClick={handleUserIconClick} 
                title={loggedIn ? "User Menu" : "Login"}
              >
                <img src="/images/icons/user-circle.webp" alt="User" className="icon-image" />
              </button>
              {loggedIn && isUserDropdownOpen && (
                <div className="user-dropdown">
                  <button 
                    className="dropdown-item" 
                    onClick={handleDashboardClick}
                  >
                    My Dashboard
                  </button>
                  <button 
                    className="dropdown-item" 
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <button className="icon-btn menu-btn" title="Menu">
              <img src="/images/icons/menu.webp" alt="Menu" className="icon-image" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
