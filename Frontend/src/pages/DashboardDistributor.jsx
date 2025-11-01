import React, { useMemo } from 'react';
import TableWithControls from '../components/ui/TableWithControls';

const DashboardDistributor = () => {
  const columns = useMemo(() => ([
    { key: 'code', label: 'DISTRIBUTOR CODE' },
    { key: 'name', label: 'DISTRIBUTOR NAME' },
    { key: 'region', label: 'REGION' },
    { key: 'contact', label: 'CONTACT' },
  ]), []);

  const rows = useMemo(() => (
    Array.from({ length: 18 }).map((_, i) => ({
      code: `DST-${200 + i}`,
      name: ['Alpha Distributors', 'Beta Supply', 'Gamma Traders'][i % 3],
      region: ['West', 'North', 'South'][i % 3],
      contact: '+91-91000' + String(2000 + i),
    }))
  ), []);

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="dash-card full">
            <TableWithControls
              title="Distributors"
              columns={columns}
              rows={rows}
              onAddNew={() => console.log('Add distributor')}
              onExport={() => console.log('Export distributors')}
              searchPlaceholder="Search distributors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDistributor;
