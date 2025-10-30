import React, { useState, useMemo } from 'react';
import '../styles/pages/dashboard-layout.css';
import DashboardHeader from '../components/DashboardHeader';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardFooter from '../components/DashboardFooter';

// Import Instrument Sans font in dashboard pages (font-face is best, but for now add Google font via link in head for demonstration)
if (typeof window !== 'undefined' && !document.getElementById('instrument-sans-font')) {
  const link = document.createElement('link');
  link.id = 'instrument-sans-font';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
}

const DashboardLayout = ({ children, currentPage, onPageChange }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const layoutClassName = useMemo(() => {
    return isSidebarCollapsed ? 'collapsed' : 'expanded';
  }, [isSidebarCollapsed]);

  return (
    <div className={`dashboard-layout ${layoutClassName}`} style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
      <DashboardSidebar
        currentPage={currentPage}
        onPageChange={onPageChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((v) => !v)}
      />

      <div className="dashboard-shell">
        <DashboardHeader
          currentPage={currentPage}
          onPageChange={onPageChange}
          isCollapsed={isSidebarCollapsed}
        />

        <main className="dashboard-content">
          {children}
        </main>

        <DashboardFooter isCollapsed={isSidebarCollapsed} />
      </div>
    </div>
  );
};

export default DashboardLayout;
