import React, { useMemo } from 'react';
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
              title="Salesmen"
              columns={columns}
              rows={rows}
              onAddNew={() => console.log('Add salesman')}
              addNewText="Add New Salesman"
              onExport={() => console.log('Export salesmen')}
              exportText="Export All Salesmen Data"
              searchPlaceholder="Search salesmen"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSuppliers;

