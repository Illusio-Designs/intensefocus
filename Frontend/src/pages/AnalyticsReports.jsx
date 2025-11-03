import React, { useMemo, useState } from "react";
import "../styles/pages/dashboard-analytics.css";
import Button from "../components/ui/Button";
import TableWithControls from "../components/ui/TableWithControls";
import Modal from "../components/ui/Modal";
import RowActions from "../components/ui/RowActions";

const AnalyticsReports = () => {
  const [dateRange, setDateRange] = useState("Feb 25, 2025 - Mar 25, 2025");

  // Columns similar to other pages (serial id, client, type of checking, reason)
  const [editRow, setEditRow] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const columns = useMemo(
    () => [
      { key: "serial", label: "SERIAL ID" },
      { key: "client", label: "CLIENT NAME" },
      { key: "type", label: "TYPE OF CHECKING" },
      { key: "reason", label: "REASON" },
      { key: 'action', label: 'ACTION', render: (_v, row) => (
        <RowActions onView={() => console.log('view visit', row)} onEdit={() => setEditRow(row)} onDelete={() => console.log('delete visit', row)} />
      ) },
    ],
    []
  );

  const rows = useMemo(
    () =>
      Array.from({ length: 64 }).map((_, i) => ({
        serial: `#${420500 + i}`,
        client: i % 2 ? "XYZ Optical" : "ABC Pharma",
        type: i % 3 ? "Order" : "Visit",
        reason:
          "Lorem ipsum dolor sit amet consectetur. Et to tristique augue.",
      })),
    []
  );

  return (
    <div className="dash-page">
      <div className="dash-container">
        {/* Summary cards */}
        <div className="dash-row analytics-summary">
          <div className="dash-card metric analytics-card">
            <h4>Total Target</h4>
            <div className="metric-value">₹30,00,000</div>
          </div>
          <div className="dash-card metric analytics-card">
            <h4>Achieve Target</h4>
            <div className="metric-value">₹17,50,000</div>
          </div>
          <div className="dash-card metric analytics-card">
            <h4>Due Target</h4>
            <div className="metric-value">₹12,50,000</div>
          </div>
          <div className="dash-card metric analytics-card">
            <h4>Completed Percentage</h4>
            <div className="metric-value">65%</div>
          </div>
        </div>

        {/* Table area */}
        <div className="dash-page">
          <div className="dash-container">
            <div className="dash-row">
              <div className="dash-card full">
                <TableWithControls
                  title="Today's Visit"
                  columns={columns}
                  rows={rows}
                  onAddNew={() => setOpenAdd(true)}
                  addNewText="Add New Visit"
                  onExport={() => console.log('Export All Data')}
                  exportText="Export All Data"
                />
              </div>
            </div>
          </div>
          <Modal
            open={openAdd}
            onClose={() => setOpenAdd(false)}
            title="Add New Visit"
            footer={(
              <>
                <button className="ui-btn ui-btn--secondary" onClick={() => setOpenAdd(false)}>Cancel</button>
                <button className="ui-btn ui-btn--primary" onClick={() => setOpenAdd(false)}>Save</button>
              </>
            )}
          >
            <div className="ui-form">
              <div className="form-group">
                <label className="ui-label">Client</label>
                <input className="ui-input" placeholder="Client name" />
              </div>
              <div className="form-group">
                <label className="ui-label">Type of Checking</label>
                <input className="ui-input" placeholder="Order / Visit" />
              </div>
              <div className="form-group form-group--full">
                <label className="ui-label">Reason</label>
                <input className="ui-input" placeholder="Reason" />
              </div>
            </div>
          </Modal>
          <Modal
            open={!!editRow}
            onClose={() => setEditRow(null)}
            title="Edit Visit"
            footer={(
              <>
                <button className="ui-btn ui-btn--secondary" onClick={() => setEditRow(null)}>Cancel</button>
                <button className="ui-btn ui-btn--primary" onClick={() => setEditRow(null)}>Update</button>
              </>
            )}
          >
            <div className="ui-form">
              <div className="form-group">
                <label className="ui-label">Client</label>
                <input className="ui-input" defaultValue={editRow?.client} />
              </div>
              <div className="form-group">
                <label className="ui-label">Type of Checking</label>
                <input className="ui-input" defaultValue={editRow?.type} />
              </div>
              <div className="form-group form-group--full">
                <label className="ui-label">Reason</label>
                <input className="ui-input" defaultValue={editRow?.reason} />
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;
