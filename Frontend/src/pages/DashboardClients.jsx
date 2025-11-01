import React, { useMemo } from 'react';
import TableWithControls from '../components/ui/TableWithControls';

const DashboardClients = () => {
  const columns = useMemo(() => ([
    { key: 'id', label: 'CLIENT ID' },
    { key: 'name', label: 'CLIENT NAME' },
    { key: 'type', label: 'TYPE' },
    { key: 'city', label: 'CITY' },
  ]), []);

  const rows = useMemo(() => (
    Array.from({ length: 64 }).map((_, i) => ({
      id: `#${3000 + i}`,
      name: i % 2 ? 'XYZ Optical' : 'ABC Pharma',
      type: i % 3 ? 'Retail' : 'Enterprise',
      city: ['Mumbai', 'Delhi', 'Pune'][i % 3],
    }))
  ), []);

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="dash-card full">
            <TableWithControls
              title="Party"
              columns={columns}
              rows={rows}
              onAddNew={() => console.log('Add New party')}
              addNewText="Add New Party"
              onExport={() => console.log('Export All Party Data')}
              exportText="Export All Party Data"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClients;

