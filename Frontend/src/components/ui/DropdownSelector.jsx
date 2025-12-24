'use client';
import React, { useState, useRef, useEffect } from 'react';
import '../../styles/components/ui.css';

export default function DropdownSelector({
  options = [],
  value,
  onChange,
  placeholder = 'Select',
  className = '',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Find the selected option label
  const selectedOption = options.find(opt => String(opt.value) === String(value));
  const displayValue = selectedOption ? selectedOption.label : placeholder;
  const hasValue = selectedOption !== undefined;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div 
      ref={dropdownRef}
      className={`ui-dropdown-custom ${className} ${disabled ? 'ui-dropdown-custom--disabled' : ''} ${isOpen ? 'ui-dropdown-custom--open' : ''}`}
    >
      <div 
        className="ui-dropdown-custom__trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`ui-dropdown-custom__value ${!hasValue ? 'ui-dropdown-custom__value--placeholder' : ''}`}>{displayValue}</span>
        <svg 
          className="ui-dropdown-custom__chevron"
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      {isOpen && !disabled && (
        <div className="ui-dropdown-custom__menu">
          <div className="ui-dropdown-custom__options">
            {options.map((opt, index) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <div
                  key={opt.value != null ? String(opt.value) : `opt-${index}`}
                  className={`ui-dropdown-custom__option ${isSelected ? 'ui-dropdown-custom__option--selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


