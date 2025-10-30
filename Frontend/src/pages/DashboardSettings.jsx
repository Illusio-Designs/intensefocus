import React from 'react';
import '../styles/pages/dashboard-settings.css';

const DashboardSettings = () => {
  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row header-row">
          <h4 className="page-title">Settings</h4>
        </div>
        <div className="dash-row">
          <div className="dash-card">
            <h4>Profile</h4>
            <div className="placeholder">Profile form</div>
          </div>
          <div className="dash-card">
            <h4>Security</h4>
            <div className="placeholder">Password/2FA</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;

