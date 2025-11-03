import React, { useMemo, useState } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import '../styles/pages/dashboard-orders.css';

const DashboardManage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const columns = useMemo(() => ([
    { key: 'type', label: 'TYPE' },
    { key: 'name', label: 'NAME' },
    { key: 'details', label: 'DETAILS' },
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
              onAddNew={() => console.log('Add manage item')}
              addNewText="Add Item"
              onExport={() => console.log('Export manage items')}
              exportText="Export All Data"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardManage;
