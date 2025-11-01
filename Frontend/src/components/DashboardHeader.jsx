import React, { useEffect, useMemo, useState, useRef } from 'react';
import '../styles/components/DashboardHeader.css';
import { FiMaximize, FiMinimize } from 'react-icons/fi';
import { logout as authLogout } from '../services/authService';
import { showLogoutSuccess } from '../services/notificationService';

const DashboardHeader = ({ onPageChange, currentPage, isCollapsed }) => {
  const [userName, setUserName] = useState('Admin');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    try {
      const storedName = typeof window !== 'undefined' ? window.localStorage.getItem('userName') : null;
      const storedAvatar = typeof window !== 'undefined' ? window.localStorage.getItem('userAvatarUrl') : null;
      if (storedName) setUserName(storedName);
      if (storedAvatar) setAvatarUrl(storedAvatar);
    } catch (_) {}
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      setIsFullscreen(!!fsEl);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('msfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('msfullscreenchange', handleFsChange);
    };
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserDropdownOpen]);

  const initials = useMemo(() => {
    const parts = (userName || '').trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const second = parts[1]?.[0] || '';
    return `${first}${second}`.toUpperCase();
  }, [userName]);

  const toggleFullscreen = () => {
    const doc = document;
    const docEl = document.documentElement;
    const fsEl = doc.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement;
    if (!fsEl) {
      const req = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen;
      if (req) req.call(docEl);
    } else {
      const exit = doc.exitFullscreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
      if (exit) exit.call(doc);
    }
  };

  return (
    <header className={`dashboard-header ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="dashboard-header-content">
        <div className="dashboard-title">Welcome {userName}</div>

        <div className="dashboard-header-actions">
          <div className="dashboard-search-bar">
            <svg className="dashboard-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => {
                const q = e.target.value;
                try {
                  const ev = new CustomEvent('globalSearchChanged', { detail: { query: q } });
                  window.dispatchEvent(ev);
                } catch (_e) {}
              }}
            />
          </div>

          <div className="dashboard-action-icons">
            <button className="dashboard-icon-btn has-tooltip" aria-label="Notifications">
              <img src="/images/icons/bell.webp" alt="Notifications" className="dashboard-icon-image" />
              <span className="header-tooltip">Notifications</span>
            </button>
            <button className="dashboard-icon-btn has-tooltip" aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'} onClick={toggleFullscreen}>
              {isFullscreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
              <span className="header-tooltip">{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
            </button>
            <div className="dashboard-user-menu" ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                className="dashboard-avatar-btn has-tooltip"
                onClick={() => setIsUserDropdownOpen((v) => !v)}
                aria-label="User Menu"
                title="User Menu"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userName} className="dashboard-avatar-image" />
                ) : (
                  <span className="dashboard-avatar-initials">{initials}</span>
                )}
                <span className="header-tooltip">User Menu</span>
              </button>
              {isUserDropdownOpen && (
                <div
                  className="dashboard-user-dropdown"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    minWidth: 180,
                    background: '#fff',
                    border: '1px solid #E0E0E0',
                    borderRadius: 10,
                    boxShadow: '0 2px 12px rgba(24,18,101,.07)',
                    padding: 8,
                    zIndex: 100,
                  }}
                >
                  <button
                    className="dropdown-item"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      borderRadius: 8,
                    }}
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onPageChange('settings');
                    }}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="dropdown-item"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      borderRadius: 8,
                    }}
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      authLogout();
                      showLogoutSuccess();
                      onPageChange('');
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
