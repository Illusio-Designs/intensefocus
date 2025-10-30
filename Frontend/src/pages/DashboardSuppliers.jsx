import React from 'react';
import '../styles/pages/dashboard-suppliers.css';

const DashboardSuppliers = () => {
  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row header-row">
          <h4 className="page-title">Suppliers</h4>
          <div className="row-actions">
            <button className="primary">Add Supplier</button>
          </div>
        </div>
        <div className="dash-row">
          <div className="dash-card">
            <h4>Filters</h4>
            <div className="filters">
              <input className="input" placeholder="Search suppliers" />
              <select className="input"><option>Region: All</option></select>
            </div>
          </div>
        </div>
        <div className="dash-row">
          <div className="dash-card full">
            <h4>Suppliers</h4>
            <div className="placeholder">Table/List goes here</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSuppliers;

