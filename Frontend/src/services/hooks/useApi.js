import { useState, useCallback } from 'react';
import { useToast } from '../../components/common';

export const useApi = (apiFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { success, error: showError } = useToast();
  
  const {
    showSuccessMessage = true,
    showErrorMessage = true,
    successMessage = 'Operation completed successfully',
    errorMessage = 'An error occurred',
    onSuccess,
    onError,
    transformData
  } = options;

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      
      // Transform data if function provided
      const transformedData = transformData ? transformData(result) : result;
      setData(transformedData);
      
      // Show success message
      if (showSuccessMessage && successMessage) {
        success(successMessage);
      }
      
      // Call onSuccess callback
      if (onSuccess) {
        onSuccess(transformedData, ...args);
      }
      
      return transformedData;
    } catch (err) {
      const errorMsg = err.message || errorMessage;
      setError(err);
      
      // Show error message
      if (showErrorMessage) {
        showError(errorMsg);
      }
      
      // Call onError callback
      if (onError) {
        onError(err, ...args);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, showSuccessMessage, showErrorMessage, successMessage, errorMessage, onSuccess, onError, transformData, success, showError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};

// Specialized hooks for common operations
export const useGet = (apiFunction, options = {}) => {
  return useApi(apiFunction, {
    showSuccessMessage: false,
    ...options
  });
};

export const usePost = (apiFunction, options = {}) => {
  return useApi(apiFunction, {
    successMessage: 'Created successfully',
    ...options
  });
};

export const usePut = (apiFunction, options = {}) => {
  return useApi(apiFunction, {
    successMessage: 'Updated successfully',
    ...options
  });
};

export const useDelete = (apiFunction, options = {}) => {
  return useApi(apiFunction, {
    successMessage: 'Deleted successfully',
    ...options
  });
};

export const useUpload = (apiFunction, options = {}) => {
  return useApi(apiFunction, {
    successMessage: 'File uploaded successfully',
    errorMessage: 'Upload failed',
    ...options
  });
}; 