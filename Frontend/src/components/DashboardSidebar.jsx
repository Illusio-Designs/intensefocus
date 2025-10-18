import React from 'react';
import '../styles/components/DashboardSidebar.css';

const DashboardSidebar = ({ onPageChange, currentPage }) => {
  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: '📊' },
    { id: 'products', text: 'Products', icon: '🛍️' },
    { id: 'orders', text: 'Orders', icon: '📦' },
    { id: 'analytics', text: 'Analytics', icon: '📈' },
    { id: 'customers', text: 'Customers', icon: '👥' },
    { id: 'settings', text: 'Settings', icon: '⚙️' }
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar-header">
        <h3>Dashboard</h3>
      </div>
      
      <nav className="dashboard-sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <a 
                href="#"
                className={currentPage === item.id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(item.id);
                }}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="dashboard-sidebar-footer">
        <p>Stallion Eyewear</p>
        <small>Admin Panel</small>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
