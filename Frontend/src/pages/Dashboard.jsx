import React from 'react';
import '../styles/pages/dashboard.css';

const Dashboard = () => {
  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="dash-card metric">
            <h4>Total Sales (This Month)</h4>
            <div className="metric-value">₹12,45,000</div>
            <div className="metric-sub green">↑ 12% vs last month</div>
          </div>
          <div className="dash-card metric">
            <h4>Total Orders</h4>
            <div className="metric-value">845 Orders</div>
            <div className="metric-sub">Retail 620 | Bulk 225</div>
          </div>
          <div className="dash-card metric">
            <h4>Active Clients</h4>
            <div className="metric-value">549</div>
            <div className="metric-sub">Optical Stores + Enterprises</div>
          </div>
          <div className="dash-card metric">
            <h4>Pending Payments</h4>
            <div className="metric-value">₹2,10,000</div>
            <div className="metric-sub red">↓ 10% vs last month</div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-card tall">
            <h4>Sales & Revenue</h4>
            <div className="placeholder">Chart Area</div>
          </div>
          <div className="dash-card tall">
            <h4>Quick Actions</h4>
            <div className="btn-col">
              <button className="primary">Add New Product</button>
              <button className="primary">Create Bulk Order</button>
              <button className="primary">Generate Report</button>
              <button className="primary">Manage Discounts</button>
            </div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-card">
            <h4>Top Selling Products</h4>
            <div className="placeholder">List</div>
          </div>
          <div className="dash-card">
            <h4>Inventory Alerts</h4>
            <div className="placeholder">Table</div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-card" style={{gridColumn:'span 12'}}>
            <h4>Order Overview</h4>
            <div className="placeholder">Data Table</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
