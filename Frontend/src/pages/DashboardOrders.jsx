import React, { useMemo, useState } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import '../styles/pages/dashboard-orders.css';

const DashboardOrders = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [dateRange, setDateRange] = useState('Feb 24, 2023 - Mar 15, 2023');

  const columns = useMemo(() => ([
    { key: 'orderId', label: 'ORDER ID' },
    { key: 'client', label: 'CLIENT NAME' },
    { key: 'product', label: 'PRODUCT' },
    { key: 'qty', label: 'QTY' },
    { key: 'status', label: 'STATUS', render: (v) => <StatusBadge status={String(v).toLowerCase()}>{v}</StatusBadge> },
    { key: 'value', label: 'VALUE' },
    { key: 'action', label: 'ACTION', render: () => (
      <div style={{display:'flex',gap:10}}>
        <button className="ui-btn ui-btn--ghost ui-btn--sm" title="View">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12C1 12 5 5 12 5C19 5 23 12 23 12C23 12 19 19 12 19C5 19 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
        </button>
        <button className="ui-btn ui-btn--ghost ui-btn--sm" title="Delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 6L18.132 19.142C18.0573 20.253 17.1311 21.1 16.018 21H7.982C6.86886 21.1 5.94267 20.253 5.868 19.142L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    ) },
  ]), []);

  const rows = useMemo(() => (
    Array.from({ length: 64 }).map((_, i) => ({
      orderId: `#${250000 + i}`,
      client: i % 2 ? 'XYZ Optical' : 'ABC Pharma',
      product: i % 3 ? 'Italian Glasses' : 'Safety Goggles',
      qty: [200, 500, 800][i % 3],
      status: ['PENDING','PROCESSING','COMPLETED'][i % 3],
      value: `₹${(85000 + (i % 5) * 15000).toLocaleString('en-IN')}`,
    }))
  ), []);

  const filteredRowsByTab = useMemo(() => {
    if (activeTab === 'All') return rows;
    return rows.filter(row => row.status === activeTab.toUpperCase());
  }, [rows, activeTab]);

  return (
    <div className="dash-page">
      <div className="dash-container">
        {/* Summary Cards */}
        <div className="dash-row orders-summary">
          <div className="dash-card metric orders-card">
            <h4>Total Orders</h4>
            <div className="metric-value">845 Orders</div>
            <div className="metric-sub">Retail 620 | Bulk 225</div>
          </div>
          <div className="dash-card metric orders-card">
            <h4>Pending Orders</h4>
            <div className="metric-value">549</div>
            <div className="metric-sub green">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              12% vs last month
            </div>
          </div>
          <div className="dash-card metric orders-card">
            <h4>Completed Orders</h4>
            <div className="metric-value">₹2,10,000</div>
            <div className="metric-sub red">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              10% vs last month
            </div>
          </div>
          <div className="dash-card metric orders-card">
            <h4>Total Revenue</h4>
            <div className="metric-value">₹12,45,000</div>
            <div className="metric-sub green">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              12% vs last month
            </div>
          </div>
        </div>

        {/* Order Status Tabs */}
        <div className="dash-row">
          <div className="order-tabs-container">
            {['All', 'Pending', 'Processing', 'Hold by Trey', 'Partially Dispatch', 'Dispatch', 'Completed', 'Cancel'].map(tab => (
              <button
                key={tab}
                className={`order-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Order Overview Table */}
        <div className="dash-row">
          <div className="dash-card full">
            <TableWithControls
              title="Order Overview"
              columns={columns}
              rows={filteredRowsByTab}
              onAddNew={() => setOpen(true)}
              onExport={() => console.log('export')}
              searchPlaceholder="Search..."
              dateRange={dateRange}
              onDateChange={setDateRange}
              addNewText="Add New Order"
              itemName="Order"
            />
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add New Order" footer={(
        <>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </>
      )}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div>
            <label>Client</label>
            <input className="ui-input" placeholder="Client name" />
          </div>
          <div>
            <label>Product</label>
            <input className="ui-input" placeholder="Product" />
          </div>
          <div>
            <label>Quantity</label>
            <input type="number" className="ui-input" defaultValue={200} />
          </div>
          <div>
            <label>Status</label>
            <select className="ui-select" defaultValue="PENDING">
              <option>PENDING</option>
              <option>PROCESSING</option>
              <option>COMPLETED</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardOrders;

