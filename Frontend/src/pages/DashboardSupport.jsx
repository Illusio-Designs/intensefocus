import React from 'react';
import '../styles/pages/dashboard-support.css';

const DashboardSupport = () => {
  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row header-row">
          <h4 className="page-title">Support</h4>
          <div className="row-actions">
            <button className="primary">Create Ticket</button>
          </div>
        </div>
        <div className="dash-row">
          <div className="dash-card">
            <h4>Knowledge Base</h4>
            <div className="placeholder">Links/FAQs</div>
          </div>
          <div className="dash-card">
            <h4>Recent Tickets</h4>
            <div className="placeholder">List</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSupport;

