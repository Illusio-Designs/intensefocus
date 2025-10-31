import React, { useMemo } from 'react';
import '../styles/pages/dashboard-products.css';
import TableWithControls from '../components/ui/TableWithControls';
import Button from '../components/ui/Button';

const DashboardProducts = () => {
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
    }))
  ), []);

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="dash-card full">
            <TableWithControls
              title="Products"
              columns={columns}
              rows={rows}
              onAddNew={() => console.log('Add product')}
              onExport={() => console.log('Export products')}
              searchPlaceholder="Search products"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProducts;

