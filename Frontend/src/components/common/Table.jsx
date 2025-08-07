import React, { useState, useMemo } from 'react';
import { 
  KeyboardArrowUp, 
  KeyboardArrowDown,
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Visibility
} from '@mui/icons-material';
import '../../styles/components/common/Table.css';

const Table = ({
  data = [],
  columns = [],
  pageSize = 10,
  searchable = true,
  sortable = true,
  selectable = false,
  actions = [],
  onRowClick,
  onSelectionChange,
  className = '',
  loading = false,
  emptyMessage = 'No data available'
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row => 
      columns.some(column => {
        const value = row[column.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sorting
  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle row selection
  const handleRowSelect = (rowId) => {
    const newSelection = selectedRows.includes(rowId)
      ? selectedRows.filter(id => id !== rowId)
      : [...selectedRows, rowId];
    
    setSelectedRows(newSelection);
    onSelectionChange && onSelectionChange(newSelection);
  };

  // Handle select all
  const handleSelectAll = () => {
    const allIds = paginatedData.map(row => row.id);
    const newSelection = selectedRows.length === paginatedData.length ? [] : allIds;
    
    setSelectedRows(newSelection);
    onSelectionChange && onSelectionChange(newSelection);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (!sortable) return null;
    
    if (sortConfig.key !== key) {
      return <KeyboardArrowUp className="sort-icon inactive" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <KeyboardArrowUp className="sort-icon active" />
      : <KeyboardArrowDown className="sort-icon active" />;
  };

  // Render cell content
  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row[column.key], row);
    }
    
    const value = row[column.key];
    if (value === null || value === undefined) return '-';
    
    return value;
  };

  // Render action buttons
  const renderActions = (row) => {
    if (!actions.length) return null;
    
    return (
      <div className="table-actions">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`action-btn ${action.type || 'default'}`}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(row);
            }}
            title={action.label}
          >
            {action.icon}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`table-container ${className}`}>
        <div className="table-loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      {/* Table Controls */}
      <div className="table-controls">
        {searchable && (
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        )}
        
        <div className="table-controls-right">
          <button 
            className="filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterList />
            Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              {selectable && (
                <th className="select-column">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="select-checkbox"
                  />
                </th>
              )}
              {columns.map(column => (
                <th 
                  key={column.key}
                  className={`table-header ${sortable ? 'sortable' : ''}`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="header-content">
                    <span>{column.label}</span>
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="actions-column">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr 
                  key={row.id || index}
                  className={`table-row ${selectedRows.includes(row.id) ? 'selected' : ''} ${onRowClick ? 'clickable' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {selectable && (
                    <td className="select-column">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="select-checkbox"
                      />
                    </td>
                  )}
                  {columns.map(column => (
                    <td key={column.key} className="table-cell">
                      {renderCell(row, column)}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="actions-column">
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="empty-message"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="table-pagination">
          <div className="pagination-info">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Predefined action types
export const TableActions = {
  VIEW: { icon: <Visibility />, type: 'view', label: 'View' },
  EDIT: { icon: <Edit />, type: 'edit', label: 'Edit' },
  DELETE: { icon: <Delete />, type: 'delete', label: 'Delete' },
  MORE: { icon: <MoreVert />, type: 'more', label: 'More' }
};

export default Table; 