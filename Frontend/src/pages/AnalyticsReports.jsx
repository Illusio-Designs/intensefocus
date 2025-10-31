import React from 'react';
import SalesRevenueChart from '../components/charts/SalesRevenueChart';
import Button from '../components/ui/Button';

const AnalyticsReports = () => {
  const sample = [
    { label: 'Jan', sales: 60, revenue: 45 },
    { label: 'Feb', sales: 80, revenue: 52 },
    { label: 'Mar', sales: 70, revenue: 60 },
    { label: 'Apr', sales: 95, revenue: 70 },
    { label: 'May', sales: 100, revenue: 85 },
    { label: 'Jun', sales: 75, revenue: 62 },
  ];
  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="dash-card full">
            <h4>Sales & Revenue</h4>
            <div style={{marginBottom:12}}>
              <Button variant="secondary" onClick={() => {}}>Export All Data</Button>
            </div>
            <SalesRevenueChart data={sample} height={260} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;
