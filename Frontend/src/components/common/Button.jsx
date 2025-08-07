import React from 'react';
import '../../styles/components/common/Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false, 
  loading = false,
  icon,
  iconOnly = false,
  className = '',
  type = 'button'
}) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    loading ? 'btn-loading' : '',
    iconOnly ? 'btn-icon-only' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {icon && !loading && (
        <span className="btn-icon">
          {icon}
        </span>
      )}
      {!iconOnly && children && (
        <span>{children}</span>
      )}
    </button>
  );
};

export default Button; 