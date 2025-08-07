import React from 'react';
import '../../styles/components/common/SortBy.css';

const SortBy = ({ 
  options = [], 
  currentSort = '', 
  onSortChange, 
  className = '',
  label = 'Sort by:'
}) => {
  const handleSortChange = (e) => {
    const [field, direction] = e.target.value.split('-');
    onSortChange(field, direction);
  };

  const getCurrentValue = () => {
    if (!currentSort) return '';
    const [field, direction] = currentSort.split('-');
    return `${field}-${direction}`;
  };

  return (
    <div className={`sort-by ${className}`}>
      <label className="sort-label">{label}</label>
      <select 
        className="sort-select"
        value={getCurrentValue()}
        onChange={handleSortChange}
      >
        <option value="">Select sort option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {currentSort && (
        <div className="sort-indicator">
          <span className="sort-field">
            {options.find(opt => opt.value === currentSort)?.label || currentSort}
          </span>
          <span className="sort-direction">
            {currentSort.includes('asc') ? '↑' : '↓'}
          </span>
        </div>
      )}
    </div>
  );
};

export default SortBy; 