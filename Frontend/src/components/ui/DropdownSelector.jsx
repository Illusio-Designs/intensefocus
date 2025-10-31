'use client';
import React from 'react';
import '../../styles/components/ui.css';

export default function DropdownSelector({
  options = [],
  value,
  onChange,
  placeholder = 'Select',
  className = '',
  disabled = false,
}) {
  return (
    <select
      className={`ui-select ${className}`}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
    >
      {placeholder !== null && <option value="" disabled hidden>{placeholder}</option>}
      {options.map((opt) => (
        <option key={String(opt.value)} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}


