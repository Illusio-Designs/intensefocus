import React, { useMemo, useState } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';

const DashboardDistributor = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const columns = useMemo(() => ([
    { key: 'code', label: 'DISTRIBUTOR CODE' },
    { key: 'name', label: 'DISTRIBUTOR NAME' },
    { key: 'region', label: 'REGION' },
    { key: 'contact', label: 'CONTACT' },
    { key: 'action', label: 'ACTION', render: (_v, row) => (
      <button className="ui-btn ui-btn--ghost ui-btn--sm" onClick={() => setEditRow(row)}>Edit</button>
    ) },
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
              onAddNew={() => setOpenAdd(true)}
              addNewText="Add New Distributor"
              onExport={() => console.log('Export All Distributors Data')}
              exportText="Export All Distributors Data"
            />
          </div>
        </div>
      </div>
      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Add New Distributor"
        footer={(
          <>
            <button className="ui-btn ui-btn--secondary" onClick={() => setOpenAdd(false)}>Cancel</button>
            <button className="ui-btn ui-btn--primary" onClick={() => setOpenAdd(false)}>Save</button>
          </>
        )}
      >
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Name</label>
            <input className="ui-input" placeholder="Distributor name" />
          </div>
          <div className="form-group">
            <label className="ui-label">Region</label>
            <input className="ui-input" placeholder="Region" />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Contact</label>
            <input className="ui-input" placeholder="Phone" />
          </div>
        </div>
      </Modal>
      <Modal
        open={!!editRow}
        onClose={() => setEditRow(null)}
        title="Edit Distributor"
        footer={(
          <>
            <button className="ui-btn ui-btn--secondary" onClick={() => setEditRow(null)}>Cancel</button>
            <button className="ui-btn ui-btn--primary" onClick={() => setEditRow(null)}>Update</button>
          </>
        )}
      >
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Name</label>
            <input className="ui-input" defaultValue={editRow?.name} />
          </div>
          <div className="form-group">
            <label className="ui-label">Region</label>
            <input className="ui-input" defaultValue={editRow?.region} />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Contact</label>
            <input className="ui-input" defaultValue={editRow?.contact} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardDistributor;
