import React from 'react';

const Header = ({ onPageChange, currentPage }) => {
  const navItems = [
    { id: 'home', text: 'Home' },
    { id: 'collection', text: 'Collection' },
    { id: 'about', text: 'About' }
  ];

  return (
    <header className="header">
      <div className="header-content">
        <nav className="nav-menu">
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
        
        <div className="logo" onClick={() => onPageChange('home')}>
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
            <button className="icon-btn" onClick={() => onPageChange('cart')} title="Cart">
              <img src="/images/icons/shopping-bag-02.webp" alt="Cart" className="icon-image" />
            </button>
            <button className="icon-btn" onClick={() => onPageChange('login')} title="Login">
              <img src="/images/icons/user-circle.webp" alt="User" className="icon-image" />
            </button>
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
