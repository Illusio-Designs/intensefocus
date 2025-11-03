import React, { useMemo, useState } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';

const DashboardSuppliers = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const columns = useMemo(() => ([
    { key: 'code', label: 'SUPPLIER CODE' },
    { key: 'name', label: 'SUPPLIER NAME' },
    { key: 'region', label: 'REGION' },
    { key: 'contact', label: 'CONTACT' },
    { key: 'action', label: 'ACTION', render: (_v, row) => (
      <RowActions onView={() => console.log('view salesman', row)} onEdit={() => setEditRow(row)} onDelete={() => console.log('delete salesman', row)} />
    ) },
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
              onAddNew={() => setOpenAdd(true)}
              addNewText="Add New Salesman"
              onExport={() => console.log('Export salesmen')}
              exportText="Export All Salesmen Data"
              searchPlaceholder="Search salesmen"
            />
          </div>
        </div>
      </div>
      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Add New Salesman"
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
            <input className="ui-input" placeholder="Supplier name" />
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
        title="Edit Salesman"
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

export default DashboardSuppliers;

