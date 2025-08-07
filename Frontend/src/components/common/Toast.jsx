import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  Error, 
  Warning, 
  Info, 
  Close 
} from '@mui/icons-material';
import '../../styles/components/common/Toast.css';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose, 
  position = 'top-right' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon success" />;
      case 'error':
        return <Error className="toast-icon error" />;
      case 'warning':
        return <Warning className="toast-icon warning" />;
      case 'info':
      default:
        return <Info className="toast-icon info" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`toast-container ${position}`}>
      <div className={`toast ${type} ${isExiting ? 'exiting' : ''}`}>
        <div className="toast-content">
          {getIcon()}
          <div className="toast-message">
            <p>{message}</p>
          </div>
        </div>
        <button className="toast-close" onClick={handleClose}>
          <Close />
        </button>
        {duration > 0 && (
          <div className="toast-progress">
            <div 
              className="toast-progress-bar" 
              style={{ 
                animationDuration: `${duration}ms`,
                animationDelay: '0ms'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Toast Container for managing multiple toasts
export const ToastContainer = ({ children, position = 'top-right' }) => {
  return (
    <div className={`toast-container-wrapper ${position}`}>
      {children}
    </div>
  );
};

// Toast Hook for easy usage
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration) => addToast(message, 'success', duration);
  const error = (message, duration) => addToast(message, 'error', duration);
  const warning = (message, duration) => addToast(message, 'warning', duration);
  const info = (message, duration) => addToast(message, 'info', duration);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
};

export default Toast; 