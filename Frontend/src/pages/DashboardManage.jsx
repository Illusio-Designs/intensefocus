import React, { useMemo, useState } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';
import '../styles/pages/dashboard-orders.css';

const DashboardManage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const columns = useMemo(() => ([
    { key: 'type', label: 'TYPE' },
    { key: 'name', label: 'NAME' },
    { key: 'details', label: 'DETAILS' },
    { key: 'action', label: 'ACTION', render: (_v, row) => (
      <RowActions onEdit={() => setEditRow(row)} onDownload={() => console.log('download item', row)} onDelete={() => console.log('delete item', row)} />
    ) },
  ]), []);

  const rows = useMemo(() => ([
    { type: 'City', name: 'Mumbai', details: 'Metro city', hasUploadedMedia: true },
    { type: 'City', name: 'Delhi', details: 'Capital city', hasUploadedMedia: false },
    { type: 'Branch', name: 'Andheri', details: 'Mumbai branch', hasUploadedMedia: true },
    { type: 'Branch', name: 'Borivali', details: 'Mumbai branch', hasUploadedMedia: false },
    { type: 'Brand', name: 'Stallion', details: 'Primary brand', hasUploadedMedia: true },
    { type: 'Brand', name: 'XYZ', details: 'Secondary brand', hasUploadedMedia: false },
    { type: 'Collection', name: 'Summer 2025', details: 'Seasonal collection', hasUploadedMedia: true },
    { type: 'Collection', name: 'Classic', details: 'Evergreen collection', hasUploadedMedia: false },
  ]), []);

  const filteredRowsByTab = useMemo(() => {
    if (activeTab === 'All') return rows;
    if (activeTab === 'Uploaded Media Gallery') return rows.filter(row => row.hasUploadedMedia);
    if (activeTab === 'Unuploaded Media Gallery') return rows.filter(row => !row.hasUploadedMedia);
    return rows;
  }, [rows, activeTab]);

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="order-tabs-container">
            {['All', 'Uploaded Media Gallery', 'Unuploaded Media Gallery'].map(tab => (
              <button
                key={tab}
                className={`order-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="dash-row">
          <div className="dash-card full">
            <TableWithControls
              title="Manage"
              columns={columns}
              rows={filteredRowsByTab}
              onAddNew={() => setOpenAdd(true)}
              addNewText="Add Item"
              onExport={() => console.log('Export manage items')}
              exportText="Export All Data"
            />
          </div>
        </div>
      </div>
      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Add Item"
        footer={(
          <>
            <button className="ui-btn ui-btn--secondary" onClick={() => setOpenAdd(false)}>Cancel</button>
            <button className="ui-btn ui-btn--primary" onClick={() => setOpenAdd(false)}>Save</button>
          </>
        )}
      >
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Type</label>
            <input className="ui-input" placeholder="City / Branch / Brand / Collection" />
          </div>
          <div className="form-group">
            <label className="ui-label">Name</label>
            <input className="ui-input" placeholder="Name" />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Details</label>
            <input className="ui-input" placeholder="Details" />
          </div>
        </div>
      </Modal>
      <Modal
        open={!!editRow}
        onClose={() => setEditRow(null)}
        title="Edit Item"
        footer={(
          <>
            <button className="ui-btn ui-btn--secondary" onClick={() => setEditRow(null)}>Cancel</button>
            <button className="ui-btn ui-btn--primary" onClick={() => setEditRow(null)}>Update</button>
          </>
        )}
      >
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Type</label>
            <input className="ui-input" defaultValue={editRow?.type} />
          </div>
          <div className="form-group">
            <label className="ui-label">Name</label>
            <input className="ui-input" defaultValue={editRow?.name} />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Details</label>
            <input className="ui-input" defaultValue={editRow?.details} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardManage;
