'use client';
import React, { useMemo, useState } from 'react';
import Button from './Button';
import DropdownSelector from './DropdownSelector';
import Pagination from './Pagination';
import '../../styles/components/ui.css';

export default function TableWithControls({
  title = 'Overview',
  columns = [], // [{key,label,render?,width?}]
  rows = [], // array of records
  defaultVisible = null, // array of keys
  onAddNew,
  onExport,
  dateRange = null,
  onDateChange,
  searchPlaceholder = 'Search…',
  rowSizeOptions = [8, 16, 24],
  selectable = true,
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(rowSizeOptions[0]);
  const [visible, setVisible] = useState(() => new Set((defaultVisible && defaultVisible.length ? defaultVisible : columns.map(c => c.key))));
  const [selected, setSelected] = useState(new Set());
  const [sortBy, setSortBy] = useState(null); // key
  const [sortDir, setSortDir] = useState('asc'); // 'asc' | 'desc'

  const filteredRows = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q));
  }, [rows, query]);

  const sortedRows = useMemo(() => {
    if (!sortBy) return filteredRows;
    const copy = [...filteredRows];
    copy.sort((a, b) => {
      const va = a?.[sortBy];
      const vb = b?.[sortBy];
      if (va == null && vb == null) return 0;
      if (va == null) return -1;
      if (vb == null) return 1;
      const na = typeof va === 'number' ? va : parseFloat(String(va).replace(/[^0-9.\-]/g, ''));
      const nb = typeof vb === 'number' ? vb : parseFloat(String(vb).replace(/[^0-9.\-]/g, ''));
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
      return String(va).localeCompare(String(vb));
    });
    if (sortDir === 'desc') copy.reverse();
    return copy;
  }, [filteredRows, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, page, pageSize]);

  const toggleColumn = (key) => {
    const next = new Set(visible);
    if (next.has(key)) next.delete(key); else next.add(key);
    setVisible(next);
  };

  return (
    <div className="ui-table">
      <div className="ui-table__header">
        <h4 className="ui-table__title">{title}</h4>
        <div className="ui-table__actions">
          <Button variant="secondary" onClick={onExport}>Export All Data</Button>
          {onAddNew && <Button onClick={onAddNew}>Add New</Button>}
        </div>
      </div>

      <div className="ui-table__controls">
        <div className="ui-table__search">
          <div className="ui-search">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 21L16.5 16.5M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <input
              className="ui-input"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => { setPage(1); setQuery(e.target.value); }}
            />
          </div>
        </div>

        <div className="ui-table__control-row">
          {onDateChange && (
            <div className="ui-pill">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2V5M16 2V5M3 9H21M5 5H19C20.105 5 21 5.895 21 7V19C21 20.105 20.105 21 19 21H5C3.895 21 3 20.105 3 19V7C3 5.895 3.895 5 5 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <input
                type="text"
                className="ui-input ui-input--date"
                value={dateRange || ''}
                onChange={(e) => onDateChange?.(e.target.value)}
                placeholder="Feb 24, 2023 – Mar 15, 2023"
                style={{border:'none', boxShadow:'none', padding:'0 0 0 4px'}}
              />
            </div>
          )}

          <div className="ui-table__right">
            <div className="ui-manage-cols">
              <details>
                <summary className="ui-manage-cols__summary ui-pill"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15V12M12 9H12.01M21 12C21 16.971 16.971 21 12 21C7.029 21 3 16.971 3 12C3 7.029 7.029 3 12 3C16.971 3 21 7.029 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Manage Columns</summary>
                <div className="ui-manage-cols__menu">
                  {columns.map((c) => (
                    <label key={c.key} className="ui-checkbox">
                      <input type="checkbox" checked={visible.has(c.key)} onChange={() => toggleColumn(c.key)} />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
              </details>
            </div>

            <button className="ui-pill" title="Filters">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6H21M6 12H18M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="ui-pill" title="More">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H5.01M12 12H12.01M19 12H19.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            <DropdownSelector
              options={rowSizeOptions.map((n) => ({ value: n, label: `Show ${n} Row` }))}
              value={pageSize}
              onChange={(v) => { setPageSize(Number(v)); setPage(1); }}
              className="ui-select ui-pill"
            />
          </div>
        </div>
      </div>

      <div className="ui-table__scroll">
        <table>
          <thead>
            <tr>
              {selectable && (
                <th>
                  <input
                    type="checkbox"
                    checked={pageRows.length > 0 && pageRows.every((_, i) => selected.has((page - 1) * pageSize + i))}
                    onChange={(e) => {
                      const next = new Set(selected);
                      if (e.target.checked) {
                        pageRows.forEach((_, i) => next.add((page - 1) * pageSize + i));
                      } else {
                        pageRows.forEach((_, i) => next.delete((page - 1) * pageSize + i));
                      }
                      setSelected(next);
                    }}
                  />
                </th>
              )}
              {columns.filter(c => visible.has(c.key)).map((c) => {
                const active = sortBy === c.key;
                const nextDir = active && sortDir === 'asc' ? 'desc' : 'asc';
                return (
                  <th key={c.key} style={c.width ? { width: c.width } : undefined}>
                    <button className={`ui-th ui-th__btn`} onClick={() => { setSortBy(c.key); setSortDir(nextDir); }}>
                      <span>{c.label}</span>
                      <span className="sort" aria-hidden>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg" className={active && sortDir === 'asc' ? 'is-active' : ''}><path d="M15 14L12 11L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg" className={active && sortDir === 'desc' ? 'is-active' : ''}><path d="M9 10L12 13L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr><td colSpan={(selectable ? 1 : 0) + columns.filter(c => visible.has(c.key)).length} className="ui-empty">No data</td></tr>
            )}
            {pageRows.map((row, idx) => (
              <tr key={idx}>
                {selectable && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has((page - 1) * pageSize + idx)}
                      onChange={(e) => {
                        const next = new Set(selected);
                        if (e.target.checked) next.add((page - 1) * pageSize + idx); else next.delete((page - 1) * pageSize + idx);
                        setSelected(next);
                      }}
                    />
                  </td>
                )}
                {columns.filter(c => visible.has(c.key)).map((c) => (
                  <td key={c.key}>{c.render ? c.render(row[c.key], row) : String(row[c.key] ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ui-table__footer">
        <div className="ui-table__count">Showing {pageRows.length} Of {filteredRows.length} Order</div>
        <div className="ui-table__pager">
          <Pagination page={page} pageCount={totalPages} onPageChange={setPage} />
        </div>
        <div className="ui-page-goto">
          <span>Go To Page</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            className="ui-input ui-input--goto"
            defaultValue={page}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = parseInt(e.currentTarget.value || '1', 10);
                setPage(Math.min(Math.max(1, val), totalPages));
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}


