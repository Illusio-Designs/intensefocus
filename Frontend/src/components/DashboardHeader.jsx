import React, { useEffect, useMemo, useState } from 'react';
import '../styles/components/DashboardHeader.css';

const DashboardHeader = ({ onPageChange, currentPage, isCollapsed }) => {
  const [userName, setUserName] = useState('Riya Patel');
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    try {
      const storedName = typeof window !== 'undefined' ? window.localStorage.getItem('userName') : null;
      const storedAvatar = typeof window !== 'undefined' ? window.localStorage.getItem('userAvatarUrl') : null;
      if (storedName) setUserName(storedName);
      if (storedAvatar) setAvatarUrl(storedAvatar);
    } catch (_) {}
  }, []);

  const initials = useMemo(() => {
    const parts = (userName || '').trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const second = parts[1]?.[0] || '';
    return `${first}${second}`.toUpperCase();
  }, [userName]);

  return (
    <header className={`dashboard-header ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="dashboard-header-content">
        <div className="dashboard-title">Welcome Stacy</div>

        <div className="dashboard-header-actions">
          <div className="dashboard-search-bar">
            <svg className="dashboard-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input type="text" placeholder="Search..." />
          </div>

          <div className="dashboard-action-icons">
            <button className="dashboard-icon-btn" title="Notifications">
              <img src="/images/icons/bell.webp" alt="Notifications" className="dashboard-icon-image" />
            </button>
            <button className="dashboard-icon-btn" title="Messages">
              <img src="/images/icons/chat.webp" alt="Messages" className="dashboard-icon-image" />
            </button>
            <button className="dashboard-avatar-btn" onClick={() => onPageChange('profile')} title="Profile">
              {avatarUrl ? (
                <img src={avatarUrl} alt={userName} className="dashboard-avatar-image" />
              ) : (
                <span className="dashboard-avatar-initials">{initials}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
