import React from 'react';
import '../styles/pages/dashboard-analytics.css';

const AnalyticsReports = () => {
  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row header-row">
          <h4 className="page-title">Analytics & Reports</h4>
          <div className="row-actions">
            <button className="primary">Generate Report</button>
          </div>
        </div>
        <div className="dash-row">
          <div className="dash-card full">
            <h4>Overview</h4>
            <div className="placeholder">Charts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;
