'use client';
import React from 'react';
import '../../styles/components/ui.css';

const MAP = {
  pending: 'ui-badge ui-badge--warning',
  processing: 'ui-badge ui-badge--info',
  completed: 'ui-badge ui-badge--success',
  cancelled: 'ui-badge ui-badge--danger',
  default: 'ui-badge',
};

export default function StatusBadge({ status, children, className = '' }) {
  const key = String(status || '').toLowerCase();
  const classes = `${MAP[key] || MAP.default} ${className}`.trim();
  return <span className={classes}>{children || status}</span>;
}


