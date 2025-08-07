import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search,
  Notifications,
  AccountCircle,
  Logout,
  Settings,
  Menu
} from '@mui/icons-material';
import '../../styles/components/dashboard/Header.css';

const DashboardHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [userPhone, setUserPhone] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New order received', time: '2 min ago', unread: true },
    { id: 2, message: 'Product stock low', time: '1 hour ago', unread: true },
    { id: 3, message: 'System update completed', time: '3 hours ago', unread: false }
  ]);

  useEffect(() => {
    const phone = localStorage.getItem('userPhone') || '';
    setUserPhone(phone);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu />
        </button>
        <div className="breadcrumb">
          <span>Dashboard</span>
        </div>
      </div>

      <div className="header-center">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div className="notifications-container">
          <button className="notifications-btn">
            <Notifications />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          <div className="notifications-dropdown">
            <div className="notifications-header">
              <h3>Notifications</h3>
              <button className="mark-all-read">Mark all read</button>
            </div>
            <div className="notifications-list">
              {notifications.map(notification => (
                <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
              ))}
            </div>
            <div className="notifications-footer">
              <Link to="/dashboard/notifications">View all notifications</Link>
            </div>
          </div>
        </div>

        {/* User Menu */}
        <div className="user-menu-container">
          <button 
            className="user-menu-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <AccountCircle />
            <span className="user-phone">{userPhone}</span>
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-info">
                <AccountCircle className="user-avatar" />
                <div className="user-details">
                  <p className="user-name">Admin User</p>
                  <p className="user-phone">{userPhone}</p>
                </div>
              </div>
              <div className="user-actions">
                <Link to="/dashboard/profile" className="dropdown-item">
                  <AccountCircle />
                  <span>Profile</span>
                </Link>
                <Link to="/dashboard/settings" className="dropdown-item">
                  <Settings />
                  <span>Settings</span>
                </Link>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  <Logout />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 