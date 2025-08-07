import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Dashboard, 
  ShoppingCart, 
  People, 
  Settings, 
  Logout,
  Menu,
  Close
} from '@mui/icons-material';
import '../styles/layouts/DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { path: '/dashboard/orders', label: 'Orders', icon: <ShoppingCart /> },
    { path: '/dashboard/users', label: 'Users', icon: <People /> },
    { path: '/dashboard/settings', label: 'Settings', icon: <Settings /> },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>IntenseFocus</h2>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <Close />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn">
            <Logout />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <Menu />
          </button>
          
          <div className="header-content">
            <h1>Dashboard</h1>
            <div className="user-info">
              <span>Welcome, Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="dashboard-content">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default DashboardLayout; 