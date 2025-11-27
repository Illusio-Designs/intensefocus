import React from 'react';
import '../styles/components/DashboardSidebar.css';
import { FiUsers, FiSliders, FiInbox } from 'react-icons/fi';

const DashboardSidebar = ({ onPageChange, currentPage, isCollapsed, onToggleCollapse }) => {
  const sidebarIcons = {
    dashboard: '/images/icons/Dashboard.webp',
    'dashboard-products': '/images/icons/Products.webp',
    orders: '/images/icons/Orders.webp',
    party: '/images/icons/Clients.webp',
    salesmen: '/images/icons/user-circle.webp',
    distributor: '/images/icons/Supplier.webp',
    'office-team': '/images/icons/user-circle.webp',
    manage: '/images/icons/menu.webp',
    analytics: '/images/icons/Analytics.webp',
    support: '/images/icons/Support.webp',
    settings: '/images/icons/Setting.webp',
  };
  const reactSidebarIcons = {
    salesmen: FiUsers,
    manage: FiSliders,
    tray: FiInbox,
  };
  const menuItems = [
    { id: 'dashboard', text: 'Dashboard' },
    { id: 'dashboard-products', text: 'Products' },
    { id: 'orders', text: 'Orders' },
    { id: 'tray', text: 'Tray' },
    { id: 'party', text: 'Party' },
    { id: 'salesmen', text: 'Salesmen' },
    { id: 'distributor', text: 'Distributor' },
    { id: 'office-team', text: 'Office Team' },
    { id: 'manage', text: 'Manage' },
    { id: 'analytics', text: 'Analytics & Reports' },
    { id: 'support', text: 'Support' },
    { id: 'settings', text: 'Settings' },
  ];

  return (
    <aside className={`dashboard-sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="dashboard-sidebar-header">
        <div className="sidebar-logo-wrap" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {isCollapsed ? (
            <img src="/faviconnotbg.png" alt="S logo" className="sidebar-logo-img" />
          ) : (
            <img src="/images/logo/logo.webp" alt="Stallion Eyewear" className="sidebar-logo-img" />
          )}
        </div>
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
                aria-label={item.text}
              >
                <span className="sidebar-icon">
                  {reactSidebarIcons[item.id] ? (
                    React.createElement(reactSidebarIcons[item.id], { size: 20 })
                  ) : (
                    <img src={sidebarIcons[item.id]} alt={item.text} />
                  )}
                </span>
                {!isCollapsed && <span className="sidebar-text">{item.text}</span>}
                <span className="sidebar-tooltip">{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="dashboard-sidebar-footer">
        <button className="sidebar-toggle" onClick={onToggleCollapse} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', width: '100%', justifyContent: isCollapsed ? 'center' : 'start' }}>
          <img src="/images/icons/hideshow.webp" alt="Toggle Sidebar" style={{ width: 20, height: 20, transform: isCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }} />
          {!isCollapsed && <span>Hide Sidebar</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
