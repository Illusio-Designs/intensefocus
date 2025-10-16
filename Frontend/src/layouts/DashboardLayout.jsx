import React from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/pages/dashboard-layout.css';

const DashboardLayout = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
