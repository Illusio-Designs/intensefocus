import React, { useMemo, useState } from 'react';
import '../styles/pages/dashboard-products.css';
import '../styles/pages/dashboard-orders.css';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const DashboardProducts = () => {
  const [activeTab, setActiveTab] = useState('All');
  const columns = useMemo(() => ([
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'PRODUCT' },
    { key: 'brand', label: 'BRAND' },
    { key: 'stock', label: 'STOCK' },
    { key: 'price', label: 'PRICE' },
    { key: 'action', label: 'ACTION', render: (_, row) => (
      <button className="ui-btn ui-btn--ghost ui-btn--sm" onClick={() => setEditRow(row)}>Edit</button>
    ) },
  ]), []);

  const rows = useMemo(() => (
    Array.from({ length: 48 }).map((_, i) => ({
      sku: `SKU-${1000 + i}`,
      name: i % 2 ? 'Italian Glasses' : 'Safety Goggles',
      brand: ['Stallion', 'XYZ', 'ABC'][i % 3],
      stock: [120, 50, 0][i % 3],
      price: `₹${(1499 + (i % 4) * 200).toLocaleString('en-IN')}`,
      hasUploadedMedia: i % 3 !== 0, // Alternate between uploaded and unuploaded
    }))
  ), []);
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const filteredRowsByTab = useMemo(() => {
    if (activeTab === 'All') return rows;
    if (activeTab === 'Uploaded Media Gallery') return rows.filter(row => row.hasUploadedMedia);
    if (activeTab === 'Unuploaded Media Gallery') return rows.filter(row => !row.hasUploadedMedia);
    return rows;
  }, [rows, activeTab]);

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="order-tabs-container">
            {['All', 'Uploaded Media Gallery', 'Unuploaded Media Gallery'].map(tab => (
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
        <div className="dash-row">
          <div className="dash-card full">
            <TableWithControls
              title="Products"
              columns={columns}
              rows={filteredRowsByTab}
              onAddNew={() => setOpenAdd(true)}
              addNewText="Add New Product"
              onExport={() => console.log('Export products')}
              exportText="Export All Products Data"
              searchPlaceholder="Search products"
            />
          </div>
        </div>
      </div>
      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Add New Product"
        footer={(
          <>
            <button className="ui-btn ui-btn--secondary" onClick={() => setOpenAdd(false)}>Cancel</button>
            <button className="ui-btn ui-btn--primary" onClick={() => setOpenAdd(false)}>Save</button>
          </>
        )}
      >
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Product Name</label>
            <input className="ui-input" placeholder="Name" />
          </div>
          <div className="form-group">
            <label className="ui-label">Brand</label>
            <input className="ui-input" placeholder="Brand" />
          </div>
          <div className="form-group">
            <label className="ui-label">Price</label>
            <input className="ui-input" placeholder="₹0" />
          </div>
          <div className="form-group">
            <label className="ui-label">Stock</label>
            <input className="ui-input" placeholder="0" />
          </div>
        </div>
      </Modal>
      <Modal
        open={!!editRow}
        onClose={() => setEditRow(null)}
        title="Edit Product"
        footer={(
          <>
            <button className="ui-btn ui-btn--secondary" onClick={() => setEditRow(null)}>Cancel</button>
            <button className="ui-btn ui-btn--primary" onClick={() => setEditRow(null)}>Update</button>
          </>
        )}
      >
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Product Name</label>
            <input className="ui-input" defaultValue={editRow?.name} />
          </div>
          <div className="form-group">
            <label className="ui-label">Brand</label>
            <input className="ui-input" defaultValue={editRow?.brand} />
          </div>
          <div className="form-group">
            <label className="ui-label">Price</label>
            <input className="ui-input" defaultValue={editRow?.price} />
          </div>
          <div className="form-group">
            <label className="ui-label">Stock</label>
            <input className="ui-input" defaultValue={editRow?.stock} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardProducts;

