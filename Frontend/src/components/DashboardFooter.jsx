import React from 'react';
import '../styles/components/DashboardFooter.css';

const DashboardFooter = ({ isCollapsed }) => {
  return (
    <footer className={`dashboard-footer ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="dashboard-footer-content">
        <span className="dashboard-copyright">© 2024 Stallion Eyewear LLP. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default DashboardFooter;
