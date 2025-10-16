import React from 'react';
import '../styles/pages/dashboard-layout.css';

const DashboardLayout = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
