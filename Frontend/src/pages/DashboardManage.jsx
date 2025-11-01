import React, { useMemo } from 'react';
import TableWithControls from '../components/ui/TableWithControls';

const DashboardManage = () => {
  const columns = useMemo(() => ([
    { key: 'type', label: 'TYPE' },
    { key: 'name', label: 'NAME' },
    { key: 'details', label: 'DETAILS' },
  ]), []);

  const rows = useMemo(() => ([
    { type: 'City', name: 'Mumbai', details: 'Metro city' },
    { type: 'City', name: 'Delhi', details: 'Capital city' },
    { type: 'Branch', name: 'Andheri', details: 'Mumbai branch' },
    { type: 'Branch', name: 'Borivali', details: 'Mumbai branch' },
    { type: 'Brand', name: 'Stallion', details: 'Primary brand' },
    { type: 'Brand', name: 'XYZ', details: 'Secondary brand' },
    { type: 'Collection', name: 'Summer 2025', details: 'Seasonal collection' },
    { type: 'Collection', name: 'Classic', details: 'Evergreen collection' },
  ]), []);

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="dash-card full">
            <TableWithControls
              title="Manage"
              columns={columns}
              rows={rows}
              onAddNew={() => console.log('Add manage item')}
              onExport={() => console.log('Export manage items')}
              searchPlaceholder="Search manage items"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardManage;
