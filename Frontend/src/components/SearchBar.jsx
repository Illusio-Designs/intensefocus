import React, { useState } from 'react';
import { Search, Clear } from '@mui/icons-material';
import '../styles/SearchBar.css';

const SearchBar = ({ 
  onSearch, 
  placeholder = 'Search...', 
  filters = [], 
  onFilterChange,
  className = '',
  debounceMs = 300
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      onSearch(value, selectedFilter);
    }, debounceMs);
  };

  const handleFilterChange = (e) => {
    const filter = e.target.value;
    setSelectedFilter(filter);
    onFilterChange?.(filter);
    onSearch(searchTerm, filter);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedFilter('');
    onSearch('', '');
  };

  return (
    <div className={`search-bar ${className}`}>
      <div className="search-input-container">
        <span className="search-icon">
          <Search />
        </span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button className="search-clear" onClick={handleClear}>
            <Clear />
          </button>
        )}
      </div>
      
      {filters.length > 0 && (
        <select 
          className="search-filter"
          value={selectedFilter}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          {filters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SearchBar; 