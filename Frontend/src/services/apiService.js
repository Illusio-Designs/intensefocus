/**
 * API Service
 * Centralized API service for all backend endpoints
 */

import { sendOTP } from './msg91Service';

/**
 * Get Base URL from environment variable
 * Falls back to default if not set
 */
const getBaseURL = () => {
  // In Next.js, environment variables are available at build time
  // For client-side code, use NEXT_PUBLIC_ prefix
  if (typeof window !== 'undefined') {
    // Client-side: check if there's a runtime config
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl) {
      // Remove trailing slash if present
      let url = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
      // Ensure /api is included if not already present
      if (!url.includes('/api')) {
        url = `${url}/api`;
      }
      return url;
    }
  } else {
    // Server-side
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl) {
      let url = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
      if (!url.includes('/api')) {
        url = `${url}/api`;
      }
      return url;
    }
  }
  
  // Default URL
  return 'https://stallion.nishree.com/api';
};

// Get BASE_URL - will be evaluated at module load time
// For dynamic access, use getBaseURL() function
const BASE_URL = getBaseURL();

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

/**
 * Get headers for API requests
 */
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  if (!response.ok) {
    const errorData = isJson ? await response.json() : { error: response.statusText };
    throw new Error(errorData.error || errorData.message || 'An error occurred');
  }

  return isJson ? await response.json() : await response.text();
};

/**
 * Make API request
 */
const apiRequest = async (endpoint, options = {}) => {
  const { method = 'GET', body = null, includeAuth = true } = options;

  // Get base URL dynamically to ensure it's always correct
  const baseUrl = getBaseURL();
  
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Construct full URL - ensure no double slashes
  const fullUrl = `${baseUrl}${normalizedEndpoint}`.replace(/([^:]\/)\/+/g, '$1');
  
  console.log(`[API Request] ${method} ${fullUrl}`); // Debug log
  console.log(`[API Base URL] ${baseUrl}`); // Debug log

  const config = {
    method,
    headers: getHeaders(includeAuth),
    credentials: 'include', // Include cookies for CORS
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(fullUrl, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error [${method} ${fullUrl}]:`, error);
    throw error;
  }
};

// ==================== AUTH ENDPOINTS ====================

/**
 * Check if user exists
 * @param {string} phoneNumber - Phone number in E.164 format (e.g., +917600032917)
 * @param {Object} options - Optional configuration
 * @param {boolean} options.autoSendOTP - Automatically send OTP via MSG91 if checkUser returns 200 (default: true)
 * @returns {Promise<Object>} Response with message
 */
export const checkUser = async (phoneNumber, options = {}) => {
  const { autoSendOTP = true } = options;
  
  try {
    const response = await apiRequest('/auth/check-user', {
      method: 'POST',
      body: { phoneNumber },
      includeAuth: false,
    });

    // If checkUser returns 200 and autoSendOTP is enabled, send OTP via MSG91
    if (autoSendOTP && response) {
      try {
        await sendOTP(phoneNumber);
        return {
          ...response,
          otpSent: true,
          message: response.message || 'OTP sent successfully',
        };
      } catch (otpError) {
        console.error('Error sending OTP via MSG91:', otpError);
        // Return checkUser response even if OTP sending fails
        return {
          ...response,
          otpSent: false,
          otpError: otpError.message || 'Failed to send OTP',
        };
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Login user
 * @param {string} phoneNumber - Phone number in E.164 format (e.g., +917600032917)
 * @returns {Promise<Object>} Response with token, role, and message
 */
export const login = async (phoneNumber) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { phoneNumber },
    includeAuth: false,
  });
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @param {string} userData.phoneNumber - Phone number in E.164 format
 * @param {string} userData.fullName - User's full name
 * @param {string} userData.roleId - Role ID (UUID)
 * @returns {Promise<Object>} Response with user data
 */
export const register = async (userData) => {
  const { phoneNumber, fullName, roleId } = userData;
  return apiRequest('/auth/register', {
    method: 'POST',
    body: { phoneNumber, fullName, roleId },
    includeAuth: false,
  });
};

// ==================== ROLE ENDPOINTS ====================

/**
 * Get all roles
 * @returns {Promise<Array>} Array of role objects
 */
export const getRoles = async () => {
  return apiRequest('/roles', {
    method: 'GET',
    includeAuth: true,
  });
};

// Export base URL for reference (use getBaseURL() for dynamic access)
export { BASE_URL, getBaseURL };

