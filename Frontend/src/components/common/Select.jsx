import React from 'react';
import Select from 'react-select';
import '../../styles/components/common/Select.css';

const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option...',
  isMulti = false,
  isClearable = true,
  isSearchable = true,
  isDisabled = false,
  isLoading = false,
  className = '',
  label = '',
  error = '',
  required = false
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#3b82f6' : error ? '#ef4444' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#9ca3af'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#3b82f6' 
        : state.isFocused 
        ? '#f3f4f6' 
        : 'transparent',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6'
      }
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e5e7eb'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#374151'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#6b7280',
      '&:hover': {
        backgroundColor: '#d1d5db',
        color: '#374151'
      }
    })
  };

  const formatOptionLabel = (option) => (
    <div className="select-option">
      {option.icon && <span className="option-icon">{option.icon}</span>}
      <span className="option-label">{option.label}</span>
      {option.description && (
        <span className="option-description">{option.description}</span>
      )}
    </div>
  );

  return (
    <div className={`select-container ${className}`}>
      {label && (
        <label className="select-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isMulti={isMulti}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        isLoading={isLoading}
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        classNamePrefix="react-select"
        noOptionsMessage={() => 'No options available'}
        loadingMessage={() => 'Loading...'}
      />
      
      {error && <div className="select-error">{error}</div>}
    </div>
  );
};

export default CustomSelect; 