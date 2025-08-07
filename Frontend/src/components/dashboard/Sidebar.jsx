import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Dashboard,
  ShoppingCart,
  People,
  Inventory,
  Assessment,
  Settings,
  Notifications,
  Menu,
  Close
} from '@mui/icons-material';
import '../../styles/components/dashboard/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const menuItems = [
    {
      path: '/dashboard',
      icon: <Dashboard />,
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/dashboard/orders',
      icon: <ShoppingCart />,
      label: 'Orders'
    },
    {
      path: '/dashboard/customers',
      icon: <People />,
      label: 'Customers'
    },
    {
      path: '/dashboard/products',
      icon: <Inventory />,
      label: 'Products'
    },
    {
      path: '/dashboard/analytics',
      icon: <Assessment />,
      label: 'Analytics'
    },
    {
      path: '/dashboard/notifications',
      icon: <Notifications />,
      label: 'Notifications'
    },
    {
      path: '/dashboard/settings',
      icon: <Settings />,
      label: 'Settings'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
      
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <h2>IntenseFocus</h2>
            <span className="brand-subtitle">Admin Panel</span>
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isOpen ? <Close /> : <Menu />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-menu">
            {menuItems.map((item, index) => (
              <li key={index} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
                  onClick={() => {
                    // Close sidebar on mobile when clicking a link
                    if (window.innerWidth <= 768) {
                      toggleSidebar();
                    }
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <span>👤</span>
            </div>
            <div className="user-details">
              <p className="user-name">Admin User</p>
              <p className="user-role">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 