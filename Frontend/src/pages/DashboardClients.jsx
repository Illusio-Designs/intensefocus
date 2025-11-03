import React, { useMemo, useState } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';

const DashboardClients = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const columns = useMemo(() => ([
    { key: 'id', label: 'CLIENT ID' },
    { key: 'name', label: 'CLIENT NAME' },
    { key: 'type', label: 'TYPE' },
    { key: 'city', label: 'CITY' },
    { key: 'action', label: 'ACTION', render: (_v, row) => (
      <button className="ui-btn ui-btn--ghost ui-btn--sm" onClick={() => setEditRow(row)}>Edit</button>
    ) },
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
              onAddNew={() => setOpenAdd(true)}
              addNewText="Add New Party"
              onExport={() => console.log('Export All Party Data')}
              exportText="Export All Party Data"
            />
          </div>
        </div>
      </div>
      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Add New Party"
        footer={(
          <>
            <button className="ui-btn ui-btn--secondary" onClick={() => setOpenAdd(false)}>Cancel</button>
            <button className="ui-btn ui-btn--primary" onClick={() => setOpenAdd(false)}>Save</button>
          </>
        )}
      >
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Client Name</label>
            <input className="ui-input" placeholder="Name" />
          </div>
          <div className="form-group">
            <label className="ui-label">Type</label>
            <input className="ui-input" placeholder="Retail / Enterprise" />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">City</label>
            <input className="ui-input" placeholder="City" />
          </div>
        </div>
      </Modal>
      <Modal
        open={!!editRow}
        onClose={() => setEditRow(null)}
        title="Edit Party"
        footer={(
          <>
            <button className="ui-btn ui-btn--secondary" onClick={() => setEditRow(null)}>Cancel</button>
            <button className="ui-btn ui-btn--primary" onClick={() => setEditRow(null)}>Update</button>
          </>
        )}
      >
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Client Name</label>
            <input className="ui-input" defaultValue={editRow?.name} />
          </div>
          <div className="form-group">
            <label className="ui-label">Type</label>
            <input className="ui-input" defaultValue={editRow?.type} />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">City</label>
            <input className="ui-input" defaultValue={editRow?.city} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardClients;

