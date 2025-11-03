import React, { useMemo, useState } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';
import '../styles/pages/dashboard-orders.css';

const DashboardOrders = () => {
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [dateRange, setDateRange] = useState('Feb 24, 2023 - Mar 15, 2023');

  const columns = useMemo(() => ([
    { key: 'orderId', label: 'ORDER ID' },
    { key: 'client', label: 'CLIENT NAME' },
    { key: 'product', label: 'PRODUCT' },
    { key: 'qty', label: 'QTY' },
    { key: 'status', label: 'STATUS', render: (v) => <StatusBadge status={String(v).toLowerCase()}>{v}</StatusBadge> },
    { key: 'value', label: 'VALUE' },
    { key: 'action', label: 'ACTION', render: (_v, row) => (
      <RowActions onView={() => console.log('view', row)} onEdit={() => setEditRow(row)} onDownload={() => console.log('download', row)} onDelete={() => console.log('delete', row)} />
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
              onExport={() => console.log('export')}
              onAddNew={() => setOpen(true)}
              addNewText="Add New Order"
              exportText="Export All Orders Data"
              dateRange={dateRange}
              onDateChange={setDateRange}
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
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Client</label>
            <input className="ui-input" placeholder="Client name" />
          </div>
          <div className="form-group">
            <label className="ui-label">Product</label>
            <input className="ui-input" placeholder="Product" />
          </div>
          <div className="form-group">
            <label className="ui-label">Quantity</label>
            <input type="number" className="ui-input" defaultValue={200} />
          </div>
          <div className="form-group">
            <label className="ui-label">Status</label>
            <select className="ui-select" defaultValue="PENDING">
              <option>PENDING</option>
              <option>PROCESSING</option>
              <option>COMPLETED</option>
            </select>
          </div>
        </div>
      </Modal>
      <Modal open={!!editRow} onClose={() => setEditRow(null)} title="Edit Order" footer={(
        <>
          <Button variant="secondary" onClick={() => setEditRow(null)}>Cancel</Button>
          <Button onClick={() => setEditRow(null)}>Update</Button>
        </>
      )}>
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Client</label>
            <input className="ui-input" defaultValue={editRow?.client} />
          </div>
          <div className="form-group">
            <label className="ui-label">Product</label>
            <input className="ui-input" defaultValue={editRow?.product} />
          </div>
          <div className="form-group">
            <label className="ui-label">Quantity</label>
            <input type="number" className="ui-input" defaultValue={editRow?.qty} />
          </div>
          <div className="form-group">
            <label className="ui-label">Status</label>
            <select className="ui-select" defaultValue={editRow?.status}>
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

