import React from 'react';
import '../styles/pages/dashboard-products.css';

const DashboardProducts = () => {
  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row header-row">
          <h4 className="page-title">Products</h4>
          <div className="row-actions">
            <button className="primary">Add New Product</button>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-card">
            <h4>Filters</h4>
            <div className="filters">
              <input className="input" placeholder="Search products" />
              <select className="input">
                <option>All Brands</option>
              </select>
              <select className="input">
                <option>Status: All</option>
              </select>
            </div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-card full">
            <h4>Products List</h4>
            <div className="placeholder">Table/List goes here</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProducts;

