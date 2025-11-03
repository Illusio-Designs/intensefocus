import React, { useMemo, useState } from 'react';
import '../styles/pages/dashboard.css';
import SalesRevenueChart from '../components/charts/SalesRevenueChart';
import RowActions from '../components/ui/RowActions';
import StatusBadge from '../components/ui/StatusBadge';

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
            <h4 className="card-title">Top Selling Products</h4>
            <div className="mini-list">
              {[
                {img:'/images/products/spac1.webp', name:'Anti-Fog Safety Goggles', units:'320 Units'},
                {img:'/images/products/spac2.webp', name:'Anti-Fog Safety Goggles', units:'275 Units'},
                {img:'/images/products/spac3.webp', name:'Anti-Fog Safety Goggles', units:'145 Units'},
              ].map((p,i)=> (
                <div key={i} className="row">
                  <img src={p.img} alt={p.name} className="prod-icon" />
                  <div className="name">{p.name}</div>
                  <div className="units">{p.units}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="dash-card">
            <h4 className="card-title">Inventory Alerts</h4>
            <div className="inv-list">
              {[
                {tag:'LOW STOCKS', type:'warn', img:'/images/products/spac1.webp', name:'Anti-Fog Safety Goggles', left:'43 Left'},
                {tag:'OUT OF STOCKS', type:'danger', img:'/images/products/spac2.webp', name:'Anti-Fog Safety Goggles', left:'0 Left'},
                {tag:'OUT OF STOCKS', type:'danger', img:'/images/products/spac3.webp', name:'Anti-Fog Safety Goggles', left:'0 Left'},
              ].map((r,i)=> (
                <div key={i} className="row">
                  <span className={`stock-badge ${r.type}`}>{r.tag}</span>
                  <img src={r.img} alt={r.name} className="prod-icon" />
                  <div className="name">{r.name}</div>
                  <div className="units">{r.left}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-card" style={{gridColumn:'span 12'}}>
            <h4 style={{color: '#000000', fontSize: '16px', fontWeight: '700'}}>Order Overview</h4>
            <div className="ui-table__scroll">
              <table style={{width:'100%', borderCollapse:'separate', borderSpacing:0}}>
                <thead>
                  <tr>
                    {['ORDER ID','CLIENT NAME','PRODUCT','QTY','STATUS','VALUE','ACTION'].map((h)=> (
                      <th key={h} style={{textAlign:'left', padding:'14px 0', fontSize:12, color:'#000', borderBottom:'1px solid #E0E0E0'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {id:'#250985', client:'XYZ Optical', product:'Italian Glasses', qty:200, status:'PROCESSING', value:'₹85,000'},
                    {id:'#250985', client:'ABC Pharma', product:'Safety Goggles', qty:500, status:'PENDING', value:'₹1,50,000'},
                  ].map((r,i)=> (
                    <tr key={i}>
                      <td style={{padding:'14px 0'}}>{r.id}</td>
                      <td style={{padding:'14px 0'}}>{r.client}</td>
                      <td style={{padding:'14px 0', color:'#6b7280'}}>{r.product}</td>
                      <td style={{padding:'14px 0'}}>{r.qty}</td>
                      <td style={{padding:'14px 0'}}><StatusBadge status={r.status.toLowerCase()}>{r.status}</StatusBadge></td>
                      <td style={{padding:'14px 0'}}>{r.value}</td>
                      <td style={{padding:'14px 0'}}>
                        <RowActions onView={()=>console.log('view', r)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
