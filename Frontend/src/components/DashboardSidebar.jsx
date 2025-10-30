import React from 'react';
import '../styles/components/DashboardSidebar.css';

const DashboardSidebar = ({ onPageChange, currentPage, isCollapsed, onToggleCollapse }) => {
  const sidebarIcons = {
    dashboard: '/images/icons/Dashboard.webp',
    'dashboard-products': '/images/icons/Products.webp',
    orders: '/images/icons/Orders.webp',
    clients: '/images/icons/Clients.webp',
    suppliers: '/images/icons/Supplier.webp',
    analytics: '/images/icons/Analytics.webp',
    support: '/images/icons/Support.webp',
    settings: '/images/icons/Setting.webp',
  };
  const menuItems = [
    { id: 'dashboard', text: 'Dashboard' },
    { id: 'dashboard-products', text: 'Products' },
    { id: 'orders', text: 'Orders' },
    { id: 'clients', text: 'Clients' },
    { id: 'suppliers', text: 'Suppliers' },
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
                  <img src={sidebarIcons[item.id]} alt={item.text} />
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
