import React from 'react';
import { 
  Visibility, 
  Edit, 
  Delete, 
  Download, 
  Print,
  Settings 
} from '@mui/icons-material';
import '../../styles/components/common/ActionButton.css';

const ActionButton = ({ 
  type = 'view', 
  onClick, 
  disabled = false, 
  size = 'small',
  tooltip = '',
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'edit':
        return <Edit />;
      case 'delete':
        return <Delete />;
      case 'view':
        return <Visibility />;
      case 'download':
        return <Download />;
      case 'print':
        return <Print />;
      default:
        return <Settings />;
    }
  };

  const getTooltip = () => {
    if (tooltip) return tooltip;
    switch (type) {
      case 'edit':
        return 'Edit';
      case 'delete':
        return 'Delete';
      case 'view':
        return 'View';
      case 'download':
        return 'Download';
      case 'print':
        return 'Print';
      default:
        return 'Action';
    }
  };

  const buttonClasses = [
    'action-btn',
    `action-btn-${type}`,
    `action-btn-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      title={getTooltip()}
    >
      <span className="action-btn-icon">{getIcon()}</span>
    </button>
  );
};

export default ActionButton; 