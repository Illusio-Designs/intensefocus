'use client';
import React, { useMemo } from 'react';
import '../../styles/components/ui.css';

// Lightweight SVG dual-bar chart (Sales dark, Revenue light) with grid and axis
export default function SalesRevenueChart({
  data = [], // [{label, sales, revenue}]
  height = 260,
}) {
  const cfg = useMemo(() => {
    const margin = { top: 10, right: 0, bottom: 28, left: 0 };
    const width = 820; // scales via viewBox
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const maxVal = Math.max(1, ...data.map(d => Math.max(d.sales || 0, d.revenue || 0)));
    const visualMax = maxVal * 1.5; // headroom like mock

    const n = Math.max(1, data.length);
    const band = innerW / n;
    // Thin bars with near-joined spacing like the mock
    const gap = Math.max(1, Math.min(4, band * 0.08));
    const barW = Math.max(6, Math.min(12, (band - gap) / 2));

    const centerX = (i) => margin.left + band * i + band / 2;
    const xRevenue = (i) => centerX(i) - gap / 2 - barW; // left (light)
    const xSales = (i) => centerX(i) + gap / 2;          // right (dark)
    const y = (v) => margin.top + innerH - (v / visualMax) * innerH;

    // y ticks at 0, 0.5, 1.0, 1.5 of max
    const yTicksVals = [0, 0.5, 1.0, 1.5].map(m => m * maxVal);
    const formatK = (v) => `$${(v/1000).toFixed(1)}k`;

    return { margin, width, height, innerW, innerH, visualMax, band, barW, gap, xSales, xRevenue, y, yTicksVals, formatK };
  }, [data, height]);

  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${cfg.width} ${height}`} width="100%" height={height}>
        {/* Horizontal grid and y-axis labels */}
        {cfg.yTicksVals.map((t, i) => {
          const yPos = cfg.y(t);
          return (
            <g key={`g-${i}`}>
              <line x1={cfg.margin.left} x2={cfg.margin.left + cfg.innerW} y1={yPos} y2={yPos} stroke="#E5E7EB" strokeDasharray="4 4" />
              <text x={cfg.margin.left - 8} y={yPos + 4} textAnchor="end" fontSize="10" fill="#6B7280">{cfg.formatK(t)}</text>
            </g>
          );
        })}

        {/* Bars: revenue (light) then sales (dark) */}
        {data.map((d, i) => (
          <rect
            key={`rev-${i}`}
            x={cfg.xRevenue(i)}
            y={cfg.y(d.revenue || 0)}
            width={cfg.barW}
            height={cfg.margin.top + cfg.innerH - cfg.y(d.revenue || 0)}
            fill="#E5E7F1"
            rx="4"
          />
        ))}
        {data.map((d, i) => (
          <rect
            key={`sal-${i}`}
            x={cfg.xSales(i)}
            y={cfg.y(d.sales || 0)}
            width={cfg.barW}
            height={cfg.margin.top + cfg.innerH - cfg.y(d.sales || 0)}
            fill="#181265"
            rx="4"
          />
        ))}

        {/* X labels */}
        {data.map((d, i) => (
          <text
            key={`l-${i}`}
            x={cfg.margin.left + cfg.band * i + cfg.band / 2}
            y={height - 6}
            textAnchor="middle"
            fontSize="10"
            fill="#6B7280"
          >
            {d.label}
          </text>
        ))}
      </svg>
    </div>
  );
}


