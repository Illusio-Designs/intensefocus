import React from 'react';
import '../styles/pages/Products.css';

const DashboardProducts = () => {
  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Products Management</h1>
        <button className="add-product-btn">Add Product</button>
      </div>
      <div className="products-content">
        <p>Manage your product inventory, pricing, and details</p>
      </div>
    </div>
  );
};

export default DashboardProducts;

