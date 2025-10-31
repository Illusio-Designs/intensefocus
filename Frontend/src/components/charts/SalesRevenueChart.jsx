'use client';
import React from 'react';
import '../../styles/components/ui.css';

// Minimal dependency-free bar+line combo chart using plain divs
export default function SalesRevenueChart({
  data = [], // [{label, sales, revenue}]
  height = 220,
}) {
  const max = Math.max(1, ...data.map(d => Math.max(d.sales || 0, d.revenue || 0)));
  const barWidth = data.length ? Math.max(24, Math.floor(800 / data.length)) : 40;

  return (
    <div className="sr-chart" style={{height}}>
      <div className="sr-chart__grid" />
      <div className="sr-chart__series">
        {data.map((d, i) => (
          <div key={i} className="sr-chart__item" style={{ width: barWidth }}>
            <div className="sr-chart__bar" style={{ height: `${(d.sales / max) * 100}%` }} />
            <div className="sr-chart__line" style={{ height: `${(d.revenue / max) * 100}%` }} />
            <div className="sr-chart__label">{d.label}</div>
          </div>
        ))}
      </div>
      <div className="sr-chart__legend">
        <span className="sr-legend sr-legend--sales">Sales</span>
        <span className="sr-legend sr-legend--revenue">Revenue</span>
      </div>
    </div>
  );
}


