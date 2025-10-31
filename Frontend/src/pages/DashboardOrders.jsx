import React, { useMemo, useState } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const DashboardOrders = () => {
  const [open, setOpen] = useState(false);

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
        <button className="ui-btn ui-btn--ghost ui-btn--sm" title="Edit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.5 3.5C17.3284 2.67157 18.6716 2.67157 19.5 3.5C20.3284 4.32843 20.3284 5.67157 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
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

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="dash-card full">
            <TableWithControls
              title="Order Overview"
              columns={columns}
              rows={rows}
              onAddNew={() => setOpen(true)}
              onExport={() => console.log('export')}
              searchPlaceholder="Search orders"
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

