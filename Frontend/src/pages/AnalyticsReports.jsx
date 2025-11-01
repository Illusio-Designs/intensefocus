import React, { useMemo, useState } from "react";
import "../styles/pages/dashboard-analytics.css";
import Button from "../components/ui/Button";
import TableWithControls from "../components/ui/TableWithControls";

const AnalyticsReports = () => {
  const [dateRange, setDateRange] = useState("Feb 25, 2025 - Mar 25, 2025");

  // Columns similar to other pages (serial id, client, type of checking, reason)
  const columns = useMemo(
    () => [
      { key: "serial", label: "SERIAL ID" },
      { key: "client", label: "CLIENT NAME" },
      { key: "type", label: "TYPE OF CHECKING" },
      { key: "reason", label: "REASON" },
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
                  onAddNew={() => console.log('Add New Visit')}
                  addNewText="Add New Visit"
                  onExport={() => console.log('Export All Data')}
                  exportText="Export All Data"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;
