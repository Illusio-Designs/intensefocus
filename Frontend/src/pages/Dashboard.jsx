import React, { useMemo, useState } from 'react';
import '../styles/pages/dashboard.css';
import SalesRevenueChart from '../components/charts/SalesRevenueChart';

const Dashboard = () => {
  const [period, setPeriod] = useState('Monthly');

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
          <div className="dash-card tall equal">
            <div className="chart-header" style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
              <h4 style={{color: '#000000', fontSize: '16px', fontWeight: '700'}}>Sales & Revenue</h4>
              <select className="ui-select ui-pill chart-period-select" value={period} onChange={(e)=>setPeriod(e.target.value)} style={{height:32, padding:'0px 12px'}}>
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Yearly</option>
              </select>
            </div>
            <SalesRevenueChart data={useMemo(() => ([
              { label: 'Jan', sales: 24, revenue: 18 },
              { label: 'Feb', sales: 32, revenue: 22 },
              { label: 'Mar', sales: 28, revenue: 20 },
              { label: 'Apr', sales: 36, revenue: 27 },
              { label: 'May', sales: 40, revenue: 34 },
              { label: 'Jun', sales: 30, revenue: 25 },
              { label: 'Jul', sales: 42, revenue: 33 },
              { label: 'Aug', sales: 26, revenue: 19 },
              { label: 'Sep', sales: 34, revenue: 29 },
              { label: 'Oct', sales: 38, revenue: 31 },
              { label: 'Nov', sales: 29, revenue: 24 },
              { label: 'Dec', sales: 44, revenue: 36 },
            ]), [])} height={260} />
          </div>
          <div className="dash-card side equal">
            <h4 style={{color: '#000000', fontSize: '16px', fontWeight: '700'}}>Quick Actions</h4>
            <div className="btn-col">
              <button className="ui-btn ui-btn--primary">Add New Product</button>
              <button className="ui-btn ui-btn--primary">Create Bulk Order</button>
              <button className="ui-btn ui-btn--primary">Generate Report</button>
              <button className="ui-btn ui-btn--primary">Manage Discounts</button>
            </div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-card">
            <h4 style={{color: '#000000', fontSize: '16px', fontWeight: '700'}}>Top Selling Products</h4>
            <div className="placeholder">List</div>
          </div>
          <div className="dash-card">
            <h4 style={{color: '#000000', fontSize: '16px', fontWeight: '700'}}>Inventory Alerts</h4>
            <div className="placeholder">Table</div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-card" style={{gridColumn:'span 12'}}>
            <h4 style={{color: '#000000', fontSize: '16px', fontWeight: '700'}}>Order Overview</h4>
            <div className="placeholder">Data Table</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
