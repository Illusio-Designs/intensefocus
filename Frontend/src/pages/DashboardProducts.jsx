import React, { useMemo, useState } from 'react';
import '../styles/pages/dashboard-products.css';
import '../styles/pages/dashboard-orders.css';
import TableWithControls from '../components/ui/TableWithControls';
import Button from '../components/ui/Button';

const DashboardProducts = () => {
  const [activeTab, setActiveTab] = useState('All');
  const columns = useMemo(() => ([
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'PRODUCT' },
    { key: 'brand', label: 'BRAND' },
    { key: 'stock', label: 'STOCK' },
    { key: 'price', label: 'PRICE' },
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
              onAddNew={() => console.log('Add product')}
              addNewText="Add New Product"
              onExport={() => console.log('Export products')}
              exportText="Export All Products Data"
              searchPlaceholder="Search products"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProducts;

