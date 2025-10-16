import React from 'react';

const Sidebar = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'dashboard', icon: '📊', text: 'Dashboard' },
    { id: 'products', icon: '📦', text: 'Products' },
    { id: 'orders', icon: '📋', text: 'Orders' },
    { id: 'clients', icon: '👥', text: 'Clients' },
    { id: 'suppliers', icon: '🚚', text: 'Suppliers' },
    { id: 'analytics', icon: '📈', text: 'Analytics & Reports' },
    { id: 'support', icon: '🎧', text: 'Support' },
    { id: 'settings', icon: '⚙️', text: 'Settings' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">S</span>
          <div className="logo-text">
            <h2>STALLION EYEWEAR LLP</h2>
            <p>YOUR VISION, OUR PASSION</p>
          </div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li 
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onPageChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.text}</span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
