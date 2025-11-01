import React, { useEffect, useMemo, useState } from 'react';
import '../styles/components/DashboardHeader.css';
import { FiMaximize, FiMinimize } from 'react-icons/fi';

const DashboardHeader = ({ onPageChange, currentPage, isCollapsed }) => {
  const [userName, setUserName] = useState('Admin');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
            <button className="dashboard-avatar-btn has-tooltip" onClick={() => onPageChange('profile')} aria-label="Profile">
              {avatarUrl ? (
                <img src={avatarUrl} alt={userName} className="dashboard-avatar-image" />
              ) : (
                <span className="dashboard-avatar-initials">{initials}</span>
              )}
              <span className="header-tooltip">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
