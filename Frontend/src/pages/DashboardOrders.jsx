import React from 'react';
import '../styles/pages/dashboard-orders.css';

const DashboardOrders = () => {
  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row header-row">
          <h4 className="page-title">Orders</h4>
          <div className="row-actions">
            <button className="primary">Create Order</button>
          </div>
        </div>
        <div className="dash-row">
          <div className="dash-card">
            <h4>Filters</h4>
            <div className="filters">
              <input className="input" placeholder="Search orders" />
              <select className="input"><option>Status: All</option></select>
              <select className="input"><option>Channel: All</option></select>
            </div>
          </div>
        </div>
        <div className="dash-row">
          <div className="dash-card full">
            <h4>Orders List</h4>
            <div className="placeholder">Table/List goes here</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOrders;

