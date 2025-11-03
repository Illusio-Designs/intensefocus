import React, { useMemo, useState } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';
import '../styles/pages/dashboard.css';

const DashboardTray = () => {
  const [dateRange, setDateRange] = useState('Feb 25, 2025 - Mar 25, 2025');
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const columns = useMemo(() => ([
    { key: 'trayId', label: 'TRAY ID' },
    { key: 'title', label: 'TITLE' },
    { key: 'items', label: 'ITEMS' },
    { key: 'assignedTo', label: 'ASSIGNED TO' },
    { key: 'status', label: 'STATUS' },
    { key: 'action', label: 'ACTION', render: (_v, row) => (
      <RowActions onView={() => console.log('view tray', row)} onEdit={() => setEditRow(row)} onDownload={() => console.log('download tray', row)} onDelete={() => console.log('delete tray', row)} />
    ) },
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
              onAddNew={() => setOpenAdd(true)}
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
      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Add New Tray"
        footer={(
          <>
            <button className="ui-btn ui-btn--secondary" onClick={() => setOpenAdd(false)}>Cancel</button>
            <button className="ui-btn ui-btn--primary" onClick={() => setOpenAdd(false)}>Save</button>
          </>
        )}
      >
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Title</label>
            <input className="ui-input" placeholder="Tray title" />
          </div>
          <div className="form-group">
            <label className="ui-label">Assigned To</label>
            <input className="ui-input" placeholder="Team" />
          </div>
          <div className="form-group">
            <label className="ui-label">Items</label>
            <input className="ui-input" placeholder="0" />
          </div>
          <div className="form-group">
            <label className="ui-label">Status</label>
            <select className="ui-select" defaultValue="OPEN">
              <option>OPEN</option>
              <option>IN-PROGRESS</option>
              <option>CLOSED</option>
            </select>
          </div>
        </div>
      </Modal>
      <Modal
        open={!!editRow}
        onClose={() => setEditRow(null)}
        title="Edit Tray"
        footer={(
          <>
            <button className="ui-btn ui-btn--secondary" onClick={() => setEditRow(null)}>Cancel</button>
            <button className="ui-btn ui-btn--primary" onClick={() => setEditRow(null)}>Update</button>
          </>
        )}
      >
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Title</label>
            <input className="ui-input" defaultValue={editRow?.title} />
          </div>
          <div className="form-group">
            <label className="ui-label">Assigned To</label>
            <input className="ui-input" defaultValue={editRow?.assignedTo} />
          </div>
          <div className="form-group">
            <label className="ui-label">Items</label>
            <input className="ui-input" defaultValue={editRow?.items} />
          </div>
          <div className="form-group">
            <label className="ui-label">Status</label>
            <select className="ui-select" defaultValue={editRow?.status}>
              <option>OPEN</option>
              <option>IN-PROGRESS</option>
              <option>CLOSED</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardTray;
