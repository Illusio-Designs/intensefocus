import React, { useEffect, useState } from 'react';
import { Close, Save, Cancel } from '@mui/icons-material';
import '../../styles/components/common/Modal.css';

const Modal = ({
  isOpen = false,
  onClose,
  title = 'Modal',
  children,
  size = 'medium', // small, medium, large, xlarge
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (closeOnEscape) {
        const handleEscape = (e) => {
          if (e.key === 'Escape') {
            handleClose();
          }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, closeOnEscape]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isVisible ? 'modal-visible' : ''}`} onClick={handleOverlayClick}>
      <div className={`modal ${`modal-${size}`} ${className}`}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          {showCloseButton && (
            <button className="modal-close" onClick={handleClose}>
              <Close />
            </button>
          )}
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

// Form Modal Component
const FormModal = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  initialData = {},
  fields = [],
  submitText = 'Save',
  cancelText = 'Cancel',
  loading = false,
  size = 'medium'
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialData);
    setErrors({});
  }, [initialData, isOpen]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.validation) {
        const validationResult = field.validation(formData[field.name], formData);
        if (validationResult) {
          newErrors[field.name] = validationResult;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    const { name, label, type = 'text', placeholder, options = [], ...fieldProps } = field;
    const value = formData[name] || '';
    const error = errors[name];

    switch (type) {
      case 'textarea':
        return (
          <div key={name} className="form-field">
            <label className="form-label">{label}</label>
            <textarea
              className={`form-input ${error ? 'form-input-error' : ''}`}
              value={value}
              onChange={(e) => handleInputChange(name, e.target.value)}
              placeholder={placeholder}
              {...fieldProps}
            />
            {error && <span className="form-error">{error}</span>}
          </div>
        );

      case 'select':
        return (
          <div key={name} className="form-field">
            <label className="form-label">{label}</label>
            <select
              className={`form-input ${error ? 'form-input-error' : ''}`}
              value={value}
              onChange={(e) => handleInputChange(name, e.target.value)}
              {...fieldProps}
            >
              <option value="">{placeholder || `Select ${label}`}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <span className="form-error">{error}</span>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={name} className="form-field form-field-checkbox">
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={value}
                onChange={(e) => handleInputChange(name, e.target.checked)}
                {...fieldProps}
              />
              <span className="form-checkbox-text">{label}</span>
            </label>
            {error && <span className="form-error">{error}</span>}
          </div>
        );

      case 'radio':
        return (
          <div key={name} className="form-field">
            <label className="form-label">{label}</label>
            <div className="form-radio-group">
              {options.map((option) => (
                <label key={option.value} className="form-radio-label">
                  <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleInputChange(name, e.target.value)}
                    {...fieldProps}
                  />
                  <span className="form-radio-text">{option.label}</span>
                </label>
              ))}
            </div>
            {error && <span className="form-error">{error}</span>}
          </div>
        );

      default:
        return (
          <div key={name} className="form-field">
            <label className="form-label">{label}</label>
            <input
              type={type}
              className={`form-input ${error ? 'form-input-error' : ''}`}
              value={value}
              onChange={(e) => handleInputChange(name, e.target.value)}
              placeholder={placeholder}
              {...fieldProps}
            />
            {error && <span className="form-error">{error}</span>}
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
    >
      <form onSubmit={handleSubmit} className="form-modal-form">
        <div className="form-fields">
          {fields.map(renderField)}
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            <Cancel />
            {cancelText}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="btn-loading-spinner"></div>
                Saving...
              </>
            ) : (
              <>
                <Save />
                {submitText}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Confirmation Modal Component
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // warning, danger, info
  loading = false
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
    >
      <div className="confirm-modal">
        <div className="confirm-message">
          {message}
        </div>
        
        <div className="confirm-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn btn-${type}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export { Modal, FormModal, ConfirmModal };
export default Modal; 