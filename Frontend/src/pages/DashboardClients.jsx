import React from 'react';
import '../styles/pages/dashboard-clients.css';

const DashboardClients = () => {
  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row header-row">
          <h4 className="page-title">Clients</h4>
          <div className="row-actions">
            <button className="primary">Add Client</button>
          </div>
        </div>
        <div className="dash-row">
          <div className="dash-card">
            <h4>Filters</h4>
            <div className="filters">
              <input className="input" placeholder="Search clients" />
              <select className="input"><option>Type: All</option></select>
              <select className="input"><option>Status: Active</option></select>
            </div>
          </div>
        </div>
        <div className="dash-row">
          <div className="dash-card full">
            <h4>Clients</h4>
            <div className="placeholder">Table/List goes here</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClients;

