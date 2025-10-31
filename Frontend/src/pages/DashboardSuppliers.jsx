import React, { useMemo } from 'react';
import '../styles/pages/dashboard-suppliers.css';
import TableWithControls from '../components/ui/TableWithControls';

const DashboardSuppliers = () => {
  const columns = useMemo(() => ([
    { key: 'code', label: 'SUPPLIER CODE' },
    { key: 'name', label: 'SUPPLIER NAME' },
    { key: 'region', label: 'REGION' },
    { key: 'contact', label: 'CONTACT' },
  ]), []);

  const rows = useMemo(() => (
    Array.from({ length: 22 }).map((_, i) => ({
      code: `SUP-${100 + i}`,
      name: ['VisionCraft', 'LensCo', 'FrameWorks'][i % 3],
      region: ['West', 'North', 'South'][i % 3],
      contact: '+91-90000' + String(1000 + i),
    }))
  ), []);

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="dash-card full">
            <TableWithControls
              title="Suppliers"
              columns={columns}
              rows={rows}
              onAddNew={() => console.log('Add supplier')}
              onExport={() => console.log('Export suppliers')}
              searchPlaceholder="Search suppliers"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSuppliers;

