import React from 'react';
import '../styles/components/DashboardHeader.css';

const DashboardHeader = ({ onPageChange, currentPage }) => {
  const navItems = [
    { id: 'dashboard', text: 'Dashboard' },
    { id: 'products', text: 'Products' },
    { id: 'orders', text: 'Orders' },
    { id: 'analytics', text: 'Analytics' }
  ];

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-content">
        <nav className="dashboard-nav-menu">
          {navItems.map((item) => (
            <a 
              key={item.id}
              href="#" 
              className={currentPage === item.id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(item.id);
              }}
            >
              {item.text}
            </a>
          ))}
        </nav>
        
        <div className="dashboard-logo" onClick={() => onPageChange('dashboard')}>
          <img src="/images/logo/logo.webp" alt="Stallion Eyewear" className="dashboard-logo-image" />
        </div>
        
        <div className="dashboard-header-actions">
          <div className="dashboard-search-bar">
            <svg className="dashboard-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input type="text" placeholder="Search..." />
          </div>
          <div className="dashboard-action-icons">
            <button className="dashboard-icon-btn" onClick={() => onPageChange('cart')} title="Cart">
              <img src="/images/icons/shopping-bag-02.webp" alt="Cart" className="dashboard-icon-image" />
            </button>
            <button className="dashboard-icon-btn" onClick={() => onPageChange('profile')} title="Profile">
              <img src="/images/icons/user-circle.webp" alt="User" className="dashboard-icon-image" />
            </button>
            <button className="dashboard-icon-btn dashboard-menu-btn" title="Menu">
              <img src="/images/icons/menu.webp" alt="Menu" className="dashboard-icon-image" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
