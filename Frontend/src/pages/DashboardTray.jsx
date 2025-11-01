import React, { useMemo, useState } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import '../styles/pages/dashboard.css';

const DashboardTray = () => {
  const [dateRange, setDateRange] = useState('Feb 25, 2025 - Mar 25, 2025');

  const columns = useMemo(() => ([
    { key: 'trayId', label: 'TRAY ID' },
    { key: 'title', label: 'TITLE' },
    { key: 'items', label: 'ITEMS' },
    { key: 'assignedTo', label: 'ASSIGNED TO' },
    { key: 'status', label: 'STATUS' },
  ]), []);

  const rows = useMemo(() => (
    Array.from({ length: 36 }).map((_, i) => ({
      trayId: `TR-${1000 + i}`,
      title: i % 2 ? 'Sample Tray' : 'Dispatch Tray',
      items: [8, 12, 16, 20][i % 4],
      assignedTo: ['Team A', 'Team B', 'Trey'][i % 3],
      status: ['OPEN', 'IN-PROGRESS', 'CLOSED'][i % 3],
    }))
  ), []);

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="dash-card full">
            <TableWithControls
              title="Tray Management"
              columns={columns}
              rows={rows}
              onAddNew={() => console.log('Add tray')}
              addNewText="Add New Tray"
              onExport={() => console.log('Export trays')}
              exportText="Export All Trays Data"
              dateRange={dateRange}
              onDateChange={setDateRange}
              itemName="Tray"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTray;
