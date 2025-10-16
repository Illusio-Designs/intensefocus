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
          <span className="logo-icon">S</span>
          <div className="logo-text">
            <h1>STALLION EYEWEAR LLP</h1>
            <p>YOUR VISION, OUR PASSION</p>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search..." />
          </div>
          <div className="action-icons">
            <button className="icon-btn" onClick={() => onPageChange('cart')} title="Cart">
              🛍️
            </button>
            <button className="icon-btn" onClick={() => onPageChange('login')} title="Login">
              👤
            </button>
            <button className="icon-btn menu-btn" title="Menu">
              ☰
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
