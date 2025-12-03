/**
 * API Service
 * Centralized API service for all backend endpoints
 */

import { sendOTP } from './msg91Service';
import { logout } from './authService';

/**
 * Get Base URL from environment variable
 * Falls back to default if not set
 * Uses Next.js API proxy in browser to avoid CORS issues
 */
const getBaseURL = () => {
  // In Next.js, environment variables are available at build time
  // For client-side code, use NEXT_PUBLIC_ prefix
  if (typeof window !== 'undefined') {
    // Client-side: Use Next.js API proxy to avoid CORS issues
    // The proxy route at /api/[...path] will forward requests to the backend
    return '/api';
  } else {
    // Server-side: Use direct backend URL (no CORS issues on server)
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl) {
      let url = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
      if (!url.includes('/api')) {
        url = `${url}/api`;
      }
      return url;
    }
    // Default URL for server-side
    return 'https://stallion.nishree.com/api';
  }
};

// Get BASE_URL - will be evaluated at module load time
// For dynamic access, use getBaseURL() function
const BASE_URL = getBaseURL();

// Flag to prevent infinite redirect loops
let isRedirecting = false;

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
    let errorData = {};
    let errorMessage = 'An error occurred';
    
    try {
      if (isJson) {
        errorData = await response.json();
      } else {
        // Try to get text response
        const textResponse = await response.text();
        try {
          // Try to parse as JSON even if content-type doesn't say so
          errorData = JSON.parse(textResponse);
        } catch {
          // If not JSON, use the text as error message
          errorMessage = textResponse || response.statusText || `HTTP ${response.status} Error`;
        }
      }
      
      // Extract error message from various possible structures
      errorMessage = errorData.error || 
                    errorData.message || 
                    errorData.msg ||
                    errorData.detail ||
                    (errorData.data && (errorData.data.error || errorData.data.message)) ||
                    errorMessage;
      
      // If we still have the default message, try to get more info
      if (errorMessage === 'An error occurred' && errorData) {
        // Log the full error data for debugging
        console.error('[API Error] Full error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          url: response.url
        });
        
        // Try to construct a more informative message
        if (response.status === 404) {
          errorMessage = 'Resource not found';
        } else if (response.status === 500) {
          errorMessage = 'Internal server error. Please try again later.';
        } else if (response.status === 400) {
          errorMessage = 'Bad request. Please check your input.';
        } else if (response.status === 403) {
          errorMessage = 'Access forbidden';
        } else {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
      }
    } catch (parseError) {
      // If we can't parse the error response, use status text
      console.error('[API Error] Failed to parse error response:', parseError);
      errorMessage = response.statusText || `HTTP ${response.status} Error`;
    }
    
    // Check for token expiration (401 Unauthorized or "Token expired" message)
    const isTokenExpired = response.status === 401 || 
                          errorMessage.toLowerCase().includes('token expired') ||
                          errorMessage.toLowerCase().includes('unauthorized') ||
                          errorMessage.toLowerCase().includes('invalid token');
    
    if (isTokenExpired && typeof window !== 'undefined' && !isRedirecting) {
      isRedirecting = true;
      
      // Clear authentication
      logout();
      
      // Show user-friendly message
      console.warn('Session expired. Please login again.');
      
      // Redirect to login page
      // Check if we're not already on the login page to avoid infinite loops
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login')) {
        window.location.href = '/login';
      }
      
      // Reset flag after a delay
      setTimeout(() => {
        isRedirecting = false;
      }, 1000);
    }
    
    // Check for backend initialization error - mark it specially so components can handle it
    const isInitError = errorMessage.toLowerCase().includes("cannot access 'party' before initialization") ||
                       errorMessage.toLowerCase().includes("cannot access 'distributor' before initialization") ||
                       (errorMessage.toLowerCase().includes("cannot access") && errorMessage.toLowerCase().includes("before initialization"));
    
    if (isInitError) {
      // Create a special error object that components can detect
      const initError = new Error(errorMessage);
      initError.isInitializationError = true;
      initError.statusCode = response.status;
      throw initError;
    }
    
    // Create error with more context
    const error = new Error(errorMessage);
    error.statusCode = response.status;
    error.statusText = response.statusText;
    error.errorData = errorData;
    throw error;
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
  let normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // For GET requests with body, convert body to query parameters
  // (Browsers don't support body in GET requests)
  let fullUrl = `${baseUrl}${normalizedEndpoint}`;
  if (method === 'GET' && body) {
    const queryParams = new URLSearchParams();
    Object.keys(body).forEach(key => {
      if (body[key] !== null && body[key] !== undefined) {
        queryParams.append(key, body[key]);
      }
    });
    const queryString = queryParams.toString();
    if (queryString) {
      fullUrl += `?${queryString}`;
    }
  }
  
  // Ensure no double slashes
  fullUrl = fullUrl.replace(/([^:]\/)\/+/g, '$1');
  
  console.log(`[API Request] ${method} ${fullUrl}`); // Debug log
  console.log(`[API Base URL] ${baseUrl}`); // Debug log

  const config = {
    method,
    headers: getHeaders(includeAuth),
    credentials: 'include', // Include cookies for CORS
  };

  // Add body for non-GET requests
  if (body && method !== 'GET') {
    // Clean the body - remove any undefined values and ensure proper JSON
    const cleanBody = JSON.parse(JSON.stringify(body)); // This removes undefined and ensures valid JSON
    config.body = JSON.stringify(cleanBody);
    console.log(`[API Request Body]`, cleanBody); // Debug log
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

// ==================== USER ENDPOINTS ====================

/**
 * Get all users
 * @returns {Promise<Array>} Array of user objects
 */
export const getUsers = async () => {
  return apiRequest('/users', {
    method: 'GET',
    includeAuth: true,
  });
};

/**
 * Update user
 * @param {string} userId - User ID (UUID)
 * @param {Object} userData - User data to update
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.profile_image - Profile image (legacy field, can be empty)
 * @param {string} userData.image_url - Profile image URL or data URL
 * @param {boolean} userData.is_active - Whether user is active
 * @param {string} userData.role_id - Role ID (UUID)
 * @returns {Promise<Object>} Response with message
 */
export const updateUser = async (userId, userData) => {
  const { name, email, profile_image, image_url, is_active, role_id } = userData;
  return apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: {
      name,
      email: email || '',
      profile_image: profile_image || '',
      is_active,
      image_url: image_url || '',
      role_id,
    },
    includeAuth: true,
  });
};

/**
 * Delete user
 * @param {string} userId - User ID (UUID)
 * @returns {Promise<Object>} Response with message
 */
export const deleteUser = async (userId) => {
  return apiRequest(`/users/${userId}`, {
    method: 'DELETE',
    includeAuth: true,
  });
};

/**
 * Upload profile image
 * @param {string} userId - User ID (UUID)
 * @param {File} profileImage - Profile image file
 * @returns {Promise<Object>} Response with image data
 */
export const uploadProfileImage = async (userId, profileImage) => {
  const baseUrl = getBaseURL();
  const fullUrl = `${baseUrl}/users/${userId}/upload-profile`;
  
  const formData = new FormData();
  formData.append('profile_image', profileImage);
  
  const token = getAuthToken();
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // For FormData, don't set Content-Type header (browser will set it with boundary)
  const response = await fetch(fullUrl, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: formData,
  });
  
  return await handleResponse(response);
};

// ==================== COUNTRY ENDPOINTS ====================

/**
 * Get all countries
 * @returns {Promise<Array>} Array of country objects
 */
export const getCountries = async () => {
  return apiRequest('/countries', {
    method: 'GET',
    includeAuth: true,
  });
};

/**
 * Create country
 * @param {Object} countryData - Country data
 * @param {string} countryData.name - Country name
 * @param {string} countryData.code - Country code (e.g., "IN", "US")
 * @param {string} countryData.phone_code - Phone code (e.g., "+91", "+1")
 * @param {string} countryData.currency - Currency code (e.g., "INR", "USD")
 * @returns {Promise<Object>} Created country object
 */
export const createCountry = async (countryData) => {
  const { name, code, phone_code, currency } = countryData;
  return apiRequest('/countries/', {
    method: 'POST',
    body: { name, code, phone_code, currency },
    includeAuth: true,
  });
};

/**
 * Update country
 * @param {string} countryId - Country ID (UUID)
 * @param {Object} countryData - Country data to update
 * @param {string} countryData.name - Country name
 * @param {string} countryData.code - Country code
 * @param {string} countryData.phone_code - Phone code
 * @param {string} countryData.currency - Currency code
 * @returns {Promise<Object>} Response with message
 */
export const updateCountry = async (countryId, countryData) => {
  const { name, code, phone_code, currency } = countryData;
  return apiRequest(`/countries/${countryId}`, {
    method: 'PUT',
    body: { name, code, phone_code, currency },
    includeAuth: true,
  });
};

/**
 * Delete country
 * @param {string} countryId - Country ID (UUID)
 * @returns {Promise<Object>} Response with message
 */
export const deleteCountry = async (countryId) => {
  return apiRequest(`/countries/${countryId}`, {
    method: 'DELETE',
    includeAuth: true,
  });
};

// ==================== STATE ENDPOINTS ====================

/**
 * Get states by country
 * @param {string} countryId - Country ID (UUID)
 * @returns {Promise<Array>} Array of state objects
 */
export const getStates = async (countryId) => {
  try {
    // Use POST to /states/get with country_id in body
    const response = await apiRequest('/states/get', {
      method: 'POST',
      body: { country_id: countryId },
      includeAuth: true,
    });
    
    // Ensure we always return an array
    if (Array.isArray(response)) {
      return response;
    }
    // Handle case where response might be wrapped in data property
    if (response && Array.isArray(response.data)) {
      return response.data;
    }
    // Return empty array if response is unexpected
    return [];
  } catch (error) {
    // Handle "States not found" as a valid case (empty states)
    if (error.message?.toLowerCase().includes('states not found') ||
        error.message?.toLowerCase().includes('no states found')) {
      return [];
    }
    // Re-throw other errors
    throw error;
  }
};

/**
 * Create state
 * @param {Object} stateData - State data
 * @param {string} stateData.name - State name
 * @param {string} stateData.code - State code (e.g., "GJ", "MH")
 * @param {string} stateData.country_id - Country ID (UUID)
 * @returns {Promise<Object>} Created state object
 */
export const createState = async (stateData) => {
  const { name, code, country_id } = stateData;
  return apiRequest('/states/', {
    method: 'POST',
    body: { name, code, country_id },
    includeAuth: true,
  });
};

/**
 * Update state
 * @param {string} stateId - State ID (UUID)
 * @param {Object} stateData - State data to update
 * @param {string} stateData.name - State name
 * @param {string} stateData.code - State code
 * @param {string} stateData.country_id - Country ID (UUID)
 * @returns {Promise<Object>} Response with message
 */
export const updateState = async (stateId, stateData) => {
  const { name, code, country_id } = stateData;
  return apiRequest(`/states/${stateId}`, {
    method: 'PUT',
    body: { name, code, country_id },
    includeAuth: true,
  });
};

/**
 * Delete state
 * @param {string} stateId - State ID (UUID)
 * @returns {Promise<Object>} Response with message
 */
export const deleteState = async (stateId) => {
  return apiRequest(`/states/${stateId}`, {
    method: 'DELETE',
    includeAuth: true,
  });
};

// ==================== CITY ENDPOINTS ====================

/**
 * Get cities by state
 * @param {string} stateId - State ID (UUID)
 * @returns {Promise<Array>} Array of city objects
 */
export const getCities = async (stateId) => {
  try {
    const response = await apiRequest('/cities/get', {
      method: 'POST',
      body: { state_id: stateId },
      includeAuth: true,
    });
    
    // Ensure we always return an array
    if (Array.isArray(response)) {
      return response;
    }
    // Handle case where response might be wrapped in data property
    if (response && Array.isArray(response.data)) {
      return response.data;
    }
    // Return empty array if response is unexpected
    return [];
  } catch (error) {
    // Handle "Cities not found" as a valid case (empty cities)
    if (error.message?.toLowerCase().includes('cities not found') ||
        error.message?.toLowerCase().includes('no cities found')) {
      return [];
    }
    // Re-throw other errors
    throw error;
  }
};

/**
 * Create city
 * @param {Object} cityData - City data
 * @param {string} cityData.name - City name
 * @param {string} cityData.state_id - State ID (UUID)
 * @returns {Promise<Object>} Created city object
 */
export const createCity = async (cityData) => {
  const { name, state_id } = cityData;
  return apiRequest('/cities/', {
    method: 'POST',
    body: { name, state_id },
    includeAuth: true,
  });
};

/**
 * Update city
 * @param {string} cityId - City ID (UUID)
 * @param {Object} cityData - City data to update
 * @param {string} cityData.name - City name
 * @param {string} cityData.state_id - State ID (UUID)
 * @returns {Promise<Object>} Response with message
 */
export const updateCity = async (cityId, cityData) => {
  const { name, state_id } = cityData;
  return apiRequest(`/cities/${cityId}`, {
    method: 'PUT',
    body: { name, state_id },
    includeAuth: true,
  });
};

/**
 * Delete city
 * @param {string} cityId - City ID (UUID)
 * @returns {Promise<Object>} Response with message
 */
export const deleteCity = async (cityId) => {
  return apiRequest(`/cities/${cityId}`, {
    method: 'DELETE',
    includeAuth: true,
  });
};

// ==================== ZONE ENDPOINTS ====================

/**
 * Get zones by city
 * @param {string} cityId - City ID (UUID)
 * @returns {Promise<Array>} Array of zone objects
 */
export const getZones = async (cityId) => {
  try {
    const response = await apiRequest('/zones/get', {
      method: 'POST',
      body: { city_id: cityId },
      includeAuth: true,
    });
    
    // Ensure we always return an array
    if (Array.isArray(response)) {
      return response;
    }
    // Handle case where response might be wrapped in data property
    if (response && Array.isArray(response.data)) {
      return response.data;
    }
    // Return empty array if response is unexpected
    return [];
  } catch (error) {
    // Handle "Zones not found" as a valid case (empty zones)
    if (error.message?.toLowerCase().includes('zones not found') ||
        error.message?.toLowerCase().includes('no zones found')) {
      return [];
    }
    // Re-throw other errors
    throw error;
  }
};

/**
 * Create zone
 * @param {Object} zoneData - Zone data
 * @param {string} zoneData.name - Zone name
 * @param {string} zoneData.description - Zone description
 * @param {string} zoneData.city_id - City ID (UUID)
 * @param {string} zoneData.state_id - State ID (UUID)
 * @param {string} zoneData.country_id - Country ID (UUID)
 * @param {string} zoneData.zone_code - Zone code
 * @returns {Promise<Object>} Created zone object
 */
export const createZone = async (zoneData) => {
  const { name, description, city_id, state_id, country_id, zone_code } = zoneData;
  return apiRequest('/zones/', {
    method: 'POST',
    body: { name, description, city_id, state_id, country_id, zone_code },
    includeAuth: true,
  });
};

/**
 * Update zone
 * @param {string} zoneId - Zone ID (UUID)
 * @param {Object} zoneData - Zone data to update
 * @param {string} zoneData.name - Zone name
 * @param {string} zoneData.description - Zone description
 * @param {string} zoneData.city_id - City ID (UUID)
 * @param {string} zoneData.state_id - State ID (UUID)
 * @param {string} zoneData.country_id - Country ID (UUID)
 * @param {string} zoneData.zone_code - Zone code
 * @returns {Promise<Object>} Response with message
 */
export const updateZone = async (zoneId, zoneData) => {
  const { name, description, city_id, state_id, country_id, zone_code } = zoneData;
  return apiRequest(`/zones/${zoneId}`, {
    method: 'PUT',
    body: { name, description, city_id, state_id, country_id, zone_code },
    includeAuth: true,
  });
};

/**
 * Delete zone
 * @param {string} zoneId - Zone ID (UUID)
 * @returns {Promise<Object>} Response with message
 */
export const deleteZone = async (zoneId) => {
  return apiRequest(`/zones/${zoneId}`, {
    method: 'DELETE',
    includeAuth: true,
  });
};

// ==================== DISTRIBUTOR ENDPOINTS ====================

/**
 * Get distributors by country
 * @param {string} countryId - Country ID (UUID)
 * @returns {Promise<Array>} Array of distributor objects
 */
export const getDistributors = async (countryId) => {
  // Validate countryId
  if (!countryId) {
    console.warn('[getDistributors] No country ID provided');
    return [];
  }
  
  try {
    // Validate and clean countryId
    const cleanCountryId = String(countryId).trim();
    if (!cleanCountryId || cleanCountryId === 'undefined' || cleanCountryId === 'null') {
      console.error('[getDistributors] Invalid country ID:', countryId);
      return [];
    }
    
    console.log('[getDistributors] ====== API CALL ======');
    console.log('[getDistributors] Requested country_id:', cleanCountryId);
    console.log('[getDistributors] Request body:', JSON.stringify({ country_id: cleanCountryId }));
    
    // Use POST to /distributors/get with country_id in body (following pattern from getStates/getCities)
    const response = await apiRequest('/distributors/get', {
      method: 'POST',
      body: { country_id: cleanCountryId },
      includeAuth: true,
    });
    
    console.log('[getDistributors] API response received:', response?.length || 0, 'distributors');
    if (response && response.length > 0) {
      console.log('[getDistributors] Response country_ids:', response.map(d => ({
        id: d.distributor_id || d.id,
        name: d.distributor_name,
        country_id: d.country_id
      })));
    }
    
    // Ensure we always return an array
    let distributorsArray = [];
    if (Array.isArray(response)) {
      distributorsArray = response;
    } else if (response && Array.isArray(response.data)) {
      distributorsArray = response.data;
    }
    
    // CRITICAL: Backend may return wrong data, so we MUST filter strictly by country_id
    if (distributorsArray.length > 0) {
      console.log('[getDistributors] ====== FILTERING RESPONSE ======');
      console.log('[getDistributors] Requested country_id:', cleanCountryId);
      console.log('[getDistributors] Total distributors received:', distributorsArray.length);
      
      // Filter to ONLY include distributors matching the requested country
      const beforeFilter = distributorsArray.length;
      distributorsArray = distributorsArray.filter(d => {
        if (!d) return false;
        const distributorCountryId = String(d.country_id || d.countryId || '').trim();
        const matches = distributorCountryId === cleanCountryId;
        
        if (!matches) {
          console.warn('[getDistributors] ❌ REJECTING - country mismatch:', {
            distributor_id: d.distributor_id || d.id,
            distributor_name: d.distributor_name,
            distributor_country_id: distributorCountryId,
            requested_country_id: cleanCountryId
          });
        }
        return matches;
      });
      
      const filteredOut = beforeFilter - distributorsArray.length;
      if (filteredOut > 0) {
        console.warn('[getDistributors] ⚠️ FILTERED OUT', filteredOut, 'distributors with wrong country_id');
        console.warn('[getDistributors] Backend returned wrong data - this is a backend issue!');
      }
      
      console.log('[getDistributors] ✅ Final count after filtering:', distributorsArray.length, 'matching distributors');
      
      // Log sample distributor to verify
      if (distributorsArray.length > 0) {
        console.log('[getDistributors] Sample valid distributor:', {
          id: distributorsArray[0].distributor_id || distributorsArray[0].id,
          name: distributorsArray[0].distributor_name,
          country_id: distributorsArray[0].country_id,
          requested_country_id: cleanCountryId,
          matches: String(distributorsArray[0].country_id) === cleanCountryId
        });
      } else {
        console.log('[getDistributors] ℹ️ No distributors found for country:', cleanCountryId);
      }
      console.log('[getDistributors] ====== END FILTERING ======');
    }
    
    return distributorsArray;
  } catch (error) {
    // Handle "Distributors not found" as a valid case (empty distributors)
    const errorMessage = (error.message || '').toLowerCase();
    const errorText = (error.errorData?.error || error.errorData?.message || '').toLowerCase();
    
    // Check multiple variations of "not found" messages
    if (errorMessage.includes('distributors not found') ||
        errorMessage.includes('no distributors found') ||
        errorMessage.includes('distributor not found') ||
        errorText.includes('distributors not found') ||
        errorText.includes('no distributors found') ||
        errorText.includes('distributor not found') ||
        error.statusCode === 404) {
      // Return empty array for "not found" cases - this is a valid state
      console.log('[getDistributors] No distributors found for country, returning empty array');
      return [];
    }
    // Re-throw other errors
    throw error;
  }
};

/**
 * Create distributor
 * @param {Object} distributorData - Distributor data
 * @param {string} distributorData.distributor_name - Distributor name
 * @param {string} distributorData.trade_name - Trade name
 * @param {string} distributorData.contact_person - Contact person name
 * @param {string} distributorData.email - Email address
 * @param {string} distributorData.phone - Phone number
 * @param {string} distributorData.address - Address
 * @param {string} distributorData.country_id - Country ID (UUID)
 * @param {string} distributorData.state_id - State ID (UUID)
 * @param {string} distributorData.city_id - City ID (UUID)
 * @param {string} distributorData.zone_id - Zone ID (UUID)
 * @param {string} distributorData.pincode - Pincode
 * @param {string} distributorData.gstin - GSTIN (optional)
 * @param {string} distributorData.pan - PAN (optional)
 * @param {string} distributorData.territory - Territory
 * @param {number} distributorData.commission_rate - Commission rate
 * @returns {Promise<Object>} Created distributor object
 */
export const createDistributor = async (distributorData) => {
  const {
    distributor_name,
    trade_name,
    contact_person,
    email,
    phone,
    address,
    country_id,
    state_id,
    city_id,
    zone_id,
    pincode,
    gstin,
    pan,
    territory,
    commission_rate,
  } = distributorData;
  
  // Validate required fields - ensure they exist and are not empty
  const trimmedDistributorName = distributor_name ? String(distributor_name).trim() : '';
  const trimmedTradeName = trade_name ? String(trade_name).trim() : '';
  const trimmedContactPerson = contact_person ? String(contact_person).trim() : '';
  const trimmedEmail = email ? String(email).trim() : '';
  const trimmedPhone = phone ? String(phone).trim() : '';
  const trimmedCountryId = country_id ? String(country_id).trim() : '';
  
  if (!trimmedDistributorName) {
    throw new Error('Distributor name is required');
  }
  if (!trimmedTradeName) {
    throw new Error('Trade name is required');
  }
  if (!trimmedContactPerson) {
    throw new Error('Contact person is required');
  }
  if (!trimmedEmail) {
    throw new Error('Email is required');
  }
  if (!trimmedPhone) {
    throw new Error('Phone is required');
  }
  if (!trimmedCountryId) {
    throw new Error('Country is required');
  }
  
  // Final safety check - ensure distributor_name is never null or undefined
  if (!trimmedDistributorName || trimmedDistributorName === '') {
    console.error('[Create Distributor] Validation failed: distributor_name is empty', {
      distributor_name,
      trimmedDistributorName,
      distributorData
    });
    throw new Error('Distributor name is required and cannot be empty');
  }
  
  // Build request body with explicit checks
  const requestBody = {
    distributor_name: trimmedDistributorName,
    trade_name: trimmedTradeName,
    contact_person: trimmedContactPerson,
    email: trimmedEmail,
    phone: trimmedPhone,
    address: address ? String(address).trim() : '',
    country_id: trimmedCountryId,
    state_id: state_id && String(state_id).trim() !== '' ? String(state_id).trim() : null,
    city_id: city_id && String(city_id).trim() !== '' ? String(city_id).trim() : null,
    zone_id: zone_id && String(zone_id).trim() !== '' ? String(zone_id).trim() : null,
    pincode: pincode ? String(pincode).trim() : '',
    gstin: gstin ? String(gstin) : '',
    pan: pan ? String(pan) : '',
    territory: territory ? String(territory).trim() : '',
    commission_rate: commission_rate || 0,
  };
  
  // Final validation of request body
  if (!requestBody.distributor_name || requestBody.distributor_name === '') {
    console.error('[Create Distributor] Request body validation failed:', requestBody);
    throw new Error('Distributor name is required in request body');
  }
  
  console.log('[Create Distributor] Sending request with distributor_name:', requestBody.distributor_name);
  
  return apiRequest('/distributors/', {
    method: 'POST',
    body: requestBody,
    includeAuth: true,
  });
};

/**
 * Update distributor
 * @param {string} distributorId - Distributor ID (UUID)
 * @param {Object} distributorData - Distributor data to update
 * @param {string} distributorData.distributor_name - Distributor name
 * @param {string} distributorData.trade_name - Trade name
 * @param {string} distributorData.contact_person - Contact person name
 * @param {string} distributorData.email - Email address
 * @param {string} distributorData.phone - Phone number
 * @param {string} distributorData.address - Address
 * @param {string} distributorData.country_id - Country ID (UUID)
 * @param {string} distributorData.state_id - State ID (UUID)
 * @param {string} distributorData.city_id - City ID (UUID)
 * @param {string} distributorData.zone_id - Zone ID (UUID)
 * @param {string} distributorData.pincode - Pincode
 * @param {string} distributorData.gstin - GSTIN (optional)
 * @param {string} distributorData.pan - PAN (optional)
 * @param {string} distributorData.territory - Territory
 * @param {number} distributorData.commission_rate - Commission rate
 * @param {boolean} distributorData.is_active - Whether distributor is active
 * @returns {Promise<Object>} Response with message
 */
export const updateDistributor = async (distributorId, distributorData) => {
  // Validate distributorId
  if (!distributorId) {
    throw new Error('Distributor ID is required');
  }
  
  // Trim and validate the ID
  const trimmedId = String(distributorId).trim();
  if (trimmedId === '' || trimmedId === 'undefined' || trimmedId === 'null') {
    console.error('[Update Distributor] Invalid distributor ID:', distributorId);
    throw new Error('Invalid distributor ID');
  }
  
  const {
    distributor_name,
    trade_name,
    contact_person,
    email,
    phone,
    address,
    country_id,
    state_id,
    city_id,
    zone_id,
    pincode,
    gstin,
    pan,
    territory,
    commission_rate,
    is_active,
  } = distributorData;
  
  // Validate required fields - ensure they exist and are not empty
  const trimmedDistributorName = distributor_name ? String(distributor_name).trim() : '';
  const trimmedTradeName = trade_name ? String(trade_name).trim() : '';
  const trimmedContactPerson = contact_person ? String(contact_person).trim() : '';
  const trimmedEmail = email ? String(email).trim() : '';
  const trimmedPhone = phone ? String(phone).trim() : '';
  const trimmedCountryId = country_id ? String(country_id).trim() : '';
  
  if (!trimmedDistributorName) {
    throw new Error('Distributor name is required');
  }
  if (!trimmedTradeName) {
    throw new Error('Trade name is required');
  }
  if (!trimmedContactPerson) {
    throw new Error('Contact person is required');
  }
  if (!trimmedEmail) {
    throw new Error('Email is required');
  }
  if (!trimmedPhone) {
    throw new Error('Phone is required');
  }
  if (!trimmedCountryId) {
    throw new Error('Country is required');
  }
  
  // Final safety check - ensure distributor_name is never null or undefined
  if (!trimmedDistributorName || trimmedDistributorName === '') {
    console.error('[Update Distributor] Validation failed: distributor_name is empty', {
      distributor_name,
      trimmedDistributorName,
      distributorData
    });
    throw new Error('Distributor name is required and cannot be empty');
  }
  
  // Build request body with explicit checks
  // Ensure empty strings are converted to empty strings (not null) for required string fields
  // and null for optional UUID fields
  const requestBody = {
    distributor_name: trimmedDistributorName,
    trade_name: trimmedTradeName,
    contact_person: trimmedContactPerson,
    email: trimmedEmail,
    phone: trimmedPhone,
    address: address ? String(address).trim() : '',
    country_id: trimmedCountryId,
    state_id: (state_id && String(state_id).trim() !== '') ? String(state_id).trim() : '',
    city_id: (city_id && String(city_id).trim() !== '') ? String(city_id).trim() : '',
    zone_id: (zone_id && String(zone_id).trim() !== '') ? String(zone_id).trim() : '',
    pincode: pincode ? String(pincode).trim() : '',
    gstin: gstin ? String(gstin).trim() : '',
    pan: pan ? String(pan).trim() : '',
    territory: territory ? String(territory).trim() : '',
    commission_rate: commission_rate || 0,
    is_active: is_active !== undefined ? is_active : true,
  };
  
  // Remove empty string UUID fields (convert to empty string as per payload requirement)
  // The backend expects empty strings, not null for these fields
  
  // Final validation of request body
  if (!requestBody.distributor_name || requestBody.distributor_name === '') {
    console.error('[Update Distributor] Request body validation failed:', requestBody);
    throw new Error('Distributor name is required in request body');
  }
  
  console.log('[Update Distributor] Sending request with distributor_name:', requestBody.distributor_name);
  console.log('[Update Distributor] Distributor ID:', trimmedId);
  
  return apiRequest(`/distributors/${trimmedId}`, {
    method: 'PUT',
    body: requestBody,
    includeAuth: true,
  });
};

/**
 * Delete distributor
 * @param {string} distributorId - Distributor ID (UUID)
 * @returns {Promise<Object>} Response with message
 */
export const deleteDistributor = async (distributorId) => {
  // Validate distributorId
  if (!distributorId) {
    throw new Error('Distributor ID is required');
  }
  
  // Trim and validate the ID
  const trimmedId = String(distributorId).trim();
  if (trimmedId === '' || trimmedId === 'undefined' || trimmedId === 'null') {
    console.error('[Delete Distributor] Invalid distributor ID:', distributorId);
    throw new Error('Invalid distributor ID');
  }
  
  console.log('[Delete Distributor] Deleting distributor with ID:', trimmedId);
  
  return apiRequest(`/distributors/${trimmedId}`, {
    method: 'DELETE',
    includeAuth: true,
  });
};

// ==================== PARTY ENDPOINTS ====================

/**
 * Get all parties
 * @returns {Promise<Array>} Array of party objects
 */
export const getParties = async (countryId) => {
  // Validate countryId
  if (!countryId) {
    console.warn('[getParties] No country ID provided');
    return [];
  }
  
  try {
    // Validate and clean countryId
    const cleanCountryId = String(countryId).trim();
    if (!cleanCountryId || cleanCountryId === 'undefined' || cleanCountryId === 'null') {
      console.error('[getParties] Invalid country ID:', countryId);
      return [];
    }
    
    console.log('[getParties] ====== API CALL ======');
    console.log('[getParties] Requested country_id:', cleanCountryId);
    console.log('[getParties] Request body:', JSON.stringify({ country_id: cleanCountryId }));
    
    // Use POST to /parties/get with country_id in body (following pattern from getDistributors/getSalesmen)
    const response = await apiRequest('/parties/get', {
      method: 'POST',
      body: { country_id: cleanCountryId },
      includeAuth: true,
    });
    
    console.log('[getParties] API response received:', response?.length || 0, 'parties');
    if (response && response.length > 0) {
      console.log('[getParties] Response country_ids:', response.map(p => ({
        id: p.id || p.party_id,
        name: p.party_name,
        country_id: p.country_id
      })));
    }
    
    // Ensure we always return an array
    let partiesArray = [];
    if (Array.isArray(response)) {
      partiesArray = response;
    } else if (response && Array.isArray(response.data)) {
      partiesArray = response.data;
    }
    
    // CRITICAL: Backend may return wrong data, so we MUST filter strictly by country_id
    if (partiesArray.length > 0) {
      console.log('[getParties] ====== FILTERING RESPONSE ======');
      console.log('[getParties] Requested country_id:', cleanCountryId);
      console.log('[getParties] Total parties received:', partiesArray.length);
      
      // Filter to ONLY include parties matching the requested country
      const beforeFilter = partiesArray.length;
      partiesArray = partiesArray.filter(p => {
        if (!p) return false;
        const partyCountryId = String(p.country_id || p.countryId || '').trim();
        const matches = partyCountryId === cleanCountryId;
        
        if (!matches) {
          console.warn('[getParties] ❌ REJECTING - country mismatch:', {
            party_id: p.id || p.party_id,
            party_name: p.party_name,
            party_country_id: partyCountryId,
            requested_country_id: cleanCountryId
          });
        }
        return matches;
      });
      
      const filteredOut = beforeFilter - partiesArray.length;
      if (filteredOut > 0) {
        console.warn('[getParties] ⚠️ FILTERED OUT', filteredOut, 'parties with wrong country_id');
        console.warn('[getParties] Backend returned wrong data - this is a backend issue!');
      }
      
      console.log('[getParties] ✅ Final count after filtering:', partiesArray.length, 'matching parties');
      
      // Log sample party to verify
      if (partiesArray.length > 0) {
        console.log('[getParties] Sample valid party:', {
          id: partiesArray[0].id || partiesArray[0].party_id,
          name: partiesArray[0].party_name,
          country_id: partiesArray[0].country_id,
          requested_country_id: cleanCountryId,
          matches: String(partiesArray[0].country_id) === cleanCountryId
        });
      } else {
        // Backend returned 200 with data, but after filtering by country_id, no matching parties found
        console.log('[getParties] ====== NO PARTIES FOUND ======');
        console.log('[getParties] ⚠️ IMPORTANT: Backend returned HTTP 200, but this country has NO parties');
        console.log('[getParties] Requested country_id:', cleanCountryId);
        console.log('[getParties] Backend returned', beforeFilter, 'parties, but NONE match the requested country');
        console.log('[getParties] This is treated as "Parties not found" on the frontend');
      }
      console.log('[getParties] ====== END FILTERING ======');
    } else {
      // Backend returned empty array - no parties for this country
      console.log('[getParties] ℹ️ Backend returned empty array - no parties for country:', cleanCountryId);
    }
    
    return partiesArray;
  } catch (error) {
    // Handle "Parties not found" as a valid case (empty parties)
    const errorMessage = (error.message || '').toLowerCase();
    const errorText = (error.errorData?.error || error.errorData?.message || '').toLowerCase();
    
    // Check multiple variations of "not found" messages
    if (errorMessage.includes('parties not found') ||
        errorMessage.includes('no parties found') ||
        errorMessage.includes('party not found') ||
        errorText.includes('parties not found') ||
        errorText.includes('no parties found') ||
        errorText.includes('party not found') ||
        error.statusCode === 404) {
      // Return empty array for "not found" cases - this is a valid state
      console.log('[getParties] No parties found for country, returning empty array');
      return [];
    }
    // Re-throw other errors
    throw error;
  }
};

/**
 * Create party
 * @param {Object} partyData - Party data
 * @param {string} partyData.party_name - Party name
 * @param {string} partyData.trade_name - Trade name
 * @param {string} partyData.contact_person - Contact person name
 * @param {string} partyData.email - Email address
 * @param {string} partyData.phone - Phone number
 * @param {string} partyData.address - Address
 * @param {string} partyData.country_id - Country ID (UUID)
 * @param {string} partyData.state_id - State ID (UUID)
 * @param {string} partyData.city_id - City ID (UUID)
 * @param {string} partyData.zone_id - Zone ID (UUID)
 * @param {string} partyData.pincode - Pincode
 * @param {string} partyData.gstin - GSTIN (optional)
 * @param {string} partyData.pan - PAN (optional)
 * @returns {Promise<Object>} Created party object
 */
export const createParty = async (partyData) => {
  // Helper function to validate UUID format
  const isValidUUID = (str) => {
    if (!str || str.trim() === '') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(String(str).trim());
  };
  
  const {
    party_name,
    trade_name,
    contact_person,
    email,
    phone,
    address,
    country_id,
    state_id,
    city_id,
    zone_id,
    pincode,
    gstin,
    pan,
  } = partyData;
  
  // Helper functions to get validated UUIDs
  const getStateId = () => {
    const value = state_id?.trim() || '';
    if (value === '') return null;
    return isValidUUID(value) ? String(value).trim() : null;
  };

  const getCityId = () => {
    const value = city_id?.trim() || '';
    if (value === '') return null;
    return isValidUUID(value) ? String(value).trim() : null;
  };

  const getZoneId = () => {
    const value = zone_id?.trim() || '';
    if (value === '') return null;
    return isValidUUID(value) ? String(value).trim() : null;
  };
  
  // Build request body matching exact payload structure
  // All string fields as strings, UUIDs as strings when provided or null when empty
  const requestBody = {
    party_name: String(party_name || ''),
    trade_name: String(trade_name || ''),
    contact_person: String(contact_person || ''),
    email: String(email || ''),
    phone: String(phone || ''),
    address: String(address || ''),
    country_id: (country_id && isValidUUID(country_id)) ? String(country_id).trim() : null,
    state_id: getStateId(),
    city_id: getCityId(),
    zone_id: getZoneId(),
    pincode: String(pincode || ''),
    gstin: String(gstin || ''),
    pan: String(pan || ''),
  };
  
  // Validate that all required fields are present (no undefined)
  const requiredFields = ['party_name', 'trade_name', 'contact_person', 'email', 'phone', 'address', 'country_id', 'pincode', 'gstin', 'pan'];
  for (const field of requiredFields) {
    if (requestBody[field] === undefined) {
      console.error(`[Create Party] Missing required field: ${field}`);
      requestBody[field] = field.includes('_id') ? null : '';
    }
  }
  
  // Ensure optional UUID fields are explicitly null if not valid
  if (requestBody.state_id === undefined) requestBody.state_id = null;
  if (requestBody.city_id === undefined) requestBody.city_id = null;
  if (requestBody.zone_id === undefined) requestBody.zone_id = null;
  
  console.log('[Create Party] Request Body:', JSON.stringify(requestBody, null, 2));
  console.log('[Create Party] Request Body Keys:', Object.keys(requestBody));
  console.log('[Create Party] Has undefined values:', Object.values(requestBody).some(v => v === undefined));
  
  return apiRequest('/parties/', {
    method: 'POST',
    body: requestBody,
    includeAuth: true,
  });
};

/**
 * Update party
 * @param {string} partyId - Party ID (UUID)
 * @param {Object} partyData - Party data to update
 * @param {string} partyData.party_name - Party name
 * @param {string} partyData.trade_name - Trade name
 * @param {string} partyData.contact_person - Contact person name
 * @param {string} partyData.email - Email address
 * @param {string} partyData.phone - Phone number
 * @param {string} partyData.address - Address
 * @param {string} partyData.country_id - Country ID (UUID)
 * @param {string} partyData.state_id - State ID (UUID)
 * @param {string} partyData.city_id - City ID (UUID)
 * @param {string} partyData.zone_id - Zone ID (UUID)
 * @param {string} partyData.pincode - Pincode
 * @param {string} partyData.gstin - GSTIN (optional)
 * @param {string} partyData.pan - PAN (optional)
 * @returns {Promise<Object>} Response with message
 */
export const updateParty = async (partyId, partyData) => {
  // Validate partyId
  if (!partyId || typeof partyId !== 'string' || partyId.trim() === '') {
    throw new Error('Invalid party ID provided');
  }
  
  // Helper function to validate UUID format
  const isValidUUID = (str) => {
    if (!str || str.trim() === '') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(String(str).trim());
  };
  
  const {
    party_name,
    trade_name,
    contact_person,
    email,
    phone,
    address,
    country_id,
    state_id,
    city_id,
    zone_id,
    pincode,
    gstin,
    pan,
  } = partyData;
  
  // Helper functions to get validated UUIDs
  const getStateId = () => {
    const value = state_id?.trim() || '';
    if (value === '') return null;
    return isValidUUID(value) ? String(value).trim() : null;
  };

  const getCityId = () => {
    const value = city_id?.trim() || '';
    if (value === '') return null;
    return isValidUUID(value) ? String(value).trim() : null;
  };

  const getZoneId = () => {
    const value = zone_id?.trim() || '';
    if (value === '') return null;
    return isValidUUID(value) ? String(value).trim() : null;
  };
  
  // Build request body - ensure clean format matching your examples exactly
  // All fields must be explicitly defined, no undefined values
  const requestBody = {
    party_name: String(party_name || ''),
    trade_name: String(trade_name || ''),
    contact_person: String(contact_person || ''),
    email: String(email || ''),
    phone: String(phone || ''),
    address: String(address || ''),
    country_id: (country_id && isValidUUID(country_id)) ? String(country_id).trim() : null,
    state_id: getStateId(),
    city_id: getCityId(),
    zone_id: getZoneId(),
    pincode: String(pincode || ''),
    gstin: String(gstin || ''),
    pan: String(pan || ''),
  };
  
  // Validate that all required fields are present (no undefined)
  const requiredFields = ['party_name', 'trade_name', 'contact_person', 'email', 'phone', 'address', 'country_id', 'pincode', 'gstin', 'pan'];
  for (const field of requiredFields) {
    if (requestBody[field] === undefined) {
      console.error(`[Update Party] Missing required field: ${field}`);
      requestBody[field] = field.includes('_id') ? null : '';
    }
  }
  
  // Ensure optional UUID fields are explicitly null if not valid
  if (requestBody.state_id === undefined) requestBody.state_id = null;
  if (requestBody.city_id === undefined) requestBody.city_id = null;
  if (requestBody.zone_id === undefined) requestBody.zone_id = null;
  
  // Final validation: ensure absolutely no undefined values
  const finalRequestBody = {};
  const allFields = ['party_name', 'trade_name', 'contact_person', 'email', 'phone', 'address', 'country_id', 'state_id', 'city_id', 'zone_id', 'pincode', 'gstin', 'pan'];
  allFields.forEach(field => {
    const value = requestBody[field];
    if (value === undefined) {
      console.error(`[Update Party] Field ${field} is undefined, setting to default`);
      finalRequestBody[field] = field.includes('_id') ? null : '';
    } else {
      finalRequestBody[field] = value;
    }
  });
  
  // Log the request body for debugging
  console.log('[Update Party] Request Body:', JSON.stringify(finalRequestBody, null, 2));
  console.log('[Update Party] Party ID:', partyId);
  console.log('[Update Party] Request Body Keys:', Object.keys(finalRequestBody));
  console.log('[Update Party] Has undefined values:', Object.values(finalRequestBody).some(v => v === undefined));
  console.log('[Update Party] All fields present:', allFields.every(f => finalRequestBody.hasOwnProperty(f)));
  
  return apiRequest(`/parties/${partyId}`, {
    method: 'PUT',
    body: finalRequestBody,
    includeAuth: true,
  });
};

/**
 * Delete party
 * @param {string} partyId - Party ID (UUID)
 * @returns {Promise<Object>} Response with message
 */
export const deleteParty = async (partyId) => {
  // Validate partyId
  if (!partyId || typeof partyId !== 'string' || partyId.trim() === '') {
    throw new Error('Invalid party ID provided');
  }
  return apiRequest(`/parties/${partyId.trim()}`, {
    method: 'DELETE',
    includeAuth: true,
  });
};

// ==================== SALESMEN ENDPOINTS ====================

/**
 * Get salesmen by country
 * @param {string} countryId - Country ID (UUID)
 * @returns {Promise<Array>} Array of salesman objects
 */
export const getSalesmen = async (countryId) => {
  // Validate countryId
  if (!countryId) {
    console.warn('[getSalesmen] No country ID provided');
    return [];
  }
  
  try {
    // Validate and clean countryId
    const cleanCountryId = String(countryId).trim();
    if (!cleanCountryId || cleanCountryId === 'undefined' || cleanCountryId === 'null') {
      console.error('[getSalesmen] Invalid country ID:', countryId);
      return [];
    }
    
    console.log('[getSalesmen] ====== API CALL ======');
    console.log('[getSalesmen] Requested country_id:', cleanCountryId);
    console.log('[getSalesmen] Request body:', JSON.stringify({ country_id: cleanCountryId }));
    
    // Use POST to /salesmen/get with country_id in body (following pattern from getStates/getCities/getDistributors)
    const response = await apiRequest('/salesmen/get', {
      method: 'POST',
      body: { country_id: cleanCountryId },
      includeAuth: true,
    });
    
    console.log('[getSalesmen] API response received:', response?.length || 0, 'salesmen');
    if (response && response.length > 0) {
      console.log('[getSalesmen] Response country_ids:', response.map(s => ({
        id: s.id || s.salesman_id,
        name: s.full_name,
        country_id: s.country_id
      })));
    }
    
    // Ensure we always return an array
    let salesmenArray = [];
    if (Array.isArray(response)) {
      salesmenArray = response;
    } else if (response && Array.isArray(response.data)) {
      salesmenArray = response.data;
    }
    
    // CRITICAL: Backend may return wrong data, so we MUST filter strictly by country_id
    if (salesmenArray.length > 0) {
      console.log('[getSalesmen] ====== FILTERING RESPONSE ======');
      console.log('[getSalesmen] Requested country_id:', cleanCountryId);
      console.log('[getSalesmen] Total salesmen received:', salesmenArray.length);
      
      // Filter to ONLY include salesmen matching the requested country
      const beforeFilter = salesmenArray.length;
      salesmenArray = salesmenArray.filter(s => {
        if (!s) return false;
        const salesmanCountryId = String(s.country_id || s.countryId || '').trim();
        const matches = salesmanCountryId === cleanCountryId;
        
        if (!matches) {
          console.warn('[getSalesmen] ❌ REJECTING - country mismatch:', {
            salesman_id: s.id || s.salesman_id,
            salesman_name: s.full_name,
            salesman_country_id: salesmanCountryId,
            requested_country_id: cleanCountryId
          });
        }
        return matches;
      });
      
      const filteredOut = beforeFilter - salesmenArray.length;
      if (filteredOut > 0) {
        console.warn('[getSalesmen] ⚠️ FILTERED OUT', filteredOut, 'salesmen with wrong country_id');
        console.warn('[getSalesmen] Backend returned wrong data - this is a backend issue!');
      }
      
      console.log('[getSalesmen] ✅ Final count after filtering:', salesmenArray.length, 'matching salesmen');
      
      // Log sample salesman to verify
      if (salesmenArray.length > 0) {
        console.log('[getSalesmen] Sample valid salesman:', {
          id: salesmenArray[0].id || salesmenArray[0].salesman_id,
          name: salesmenArray[0].full_name,
          country_id: salesmenArray[0].country_id,
          requested_country_id: cleanCountryId,
          matches: String(salesmenArray[0].country_id) === cleanCountryId
        });
      } else {
        // Backend returned 200 with data, but after filtering by country_id, no matching salesmen found
        // This means the country has no salesmen - treat as "not found"
        console.log('[getSalesmen] ====== NO SALESMEN FOUND ======');
        console.log('[getSalesmen] ⚠️ IMPORTANT: Backend returned HTTP 200, but this country has NO salesmen');
        console.log('[getSalesmen] Requested country_id:', cleanCountryId);
        console.log('[getSalesmen] Backend returned', beforeFilter, 'salesmen, but NONE match the requested country');
        console.log('[getSalesmen] This is treated as "Salesmen not found" on the frontend');
        console.log('[getSalesmen] UI will show "404 - No salesman found" message');
        console.log('[getSalesmen] NOTE: Backend should return 404 or empty array, but returns 200 with wrong data');
      }
      console.log('[getSalesmen] ====== END FILTERING ======');
    } else {
      // Backend returned empty array - no salesmen for this country
      console.log('[getSalesmen] ℹ️ Backend returned empty array - no salesmen for country:', cleanCountryId);
      console.log('[getSalesmen] This should be treated as "Salesmen not found"');
    }
    
    // If no salesmen found after filtering, return empty array
    // The component will show "404 - No salesman found" message
    // Note: Backend returns 200 even when no salesmen exist, so we handle "not found" on frontend
    return salesmenArray;
  } catch (error) {
    // Handle "Salesmen not found" as a valid case (empty salesmen)
    const errorMessage = (error.message || '').toLowerCase();
    const errorText = (error.errorData?.error || error.errorData?.message || '').toLowerCase();
    
    // Check multiple variations of "not found" messages
    if (errorMessage.includes('salesmen not found') ||
        errorMessage.includes('no salesmen found') ||
        errorMessage.includes('salesman not found') ||
        errorText.includes('salesmen not found') ||
        errorText.includes('no salesmen found') ||
        errorText.includes('salesman not found') ||
        error.statusCode === 404) {
      // Return empty array for "not found" cases - this is a valid state
      console.log('[getSalesmen] No salesmen found for country, returning empty array');
      return [];
    }
    // Re-throw other errors
    throw error;
  }
};

/**
 * Create salesman
 * @param {Object} salesmanData - Salesman data
 * @param {string} salesmanData.user_id - User ID (UUID)
 * @param {string} salesmanData.employee_code - Employee code
 * @param {string} salesmanData.alternate_phone - Alternate phone (optional)
 * @param {string} salesmanData.full_name - Full name
 * @param {string} salesmanData.reporting_manager - Reporting manager ID (UUID)
 * @param {string} salesmanData.email - Email address
 * @param {string} salesmanData.phone - Phone number
 * @param {string} salesmanData.address - Address
 * @param {string} salesmanData.country_id - Country ID (UUID)
 * @param {string} salesmanData.state_id - State ID (UUID)
 * @param {string} salesmanData.city_id - City ID (UUID)
 * @param {string} salesmanData.zone_preference - Zone preference
 * @param {string} salesmanData.joining_date - Joining date (ISO string)
 * @returns {Promise<Object>} Created salesman object
 */
export const createSalesman = async (salesmanData) => {
  const {
    user_id,
    employee_code,
    alternate_phone,
    full_name,
    reporting_manager,
    email,
    phone,
    address,
    country_id,
    state_id,
    city_id,
    zone_preference,
    joining_date,
  } = salesmanData;
  
  // Validate required fields - ensure they exist and are not empty
  const trimmedEmployeeCode = employee_code ? String(employee_code).trim() : '';
  const trimmedFullName = full_name ? String(full_name).trim() : '';
  const trimmedEmail = email ? String(email).trim() : '';
  const trimmedPhone = phone ? String(phone).trim() : '';
  const trimmedCountryId = country_id ? String(country_id).trim() : '';
  
  if (!trimmedEmployeeCode) {
    throw new Error('Employee code is required');
  }
  if (!trimmedFullName) {
    throw new Error('Full name is required');
  }
  if (!trimmedEmail) {
    throw new Error('Email is required');
  }
  if (!trimmedPhone) {
    throw new Error('Phone is required');
  }
  if (!trimmedCountryId) {
    throw new Error('Country is required');
  }
  
  // Validate user_id - it's required (NOT NULL in database)
  const trimmedUserId = user_id ? String(user_id).trim() : '';
  if (!trimmedUserId || trimmedUserId === '') {
    throw new Error('User ID is required');
  }
  
  // Build request body matching the exact payload structure provided
  // reporting_manager must be null (not empty string) if not provided, to satisfy foreign key constraint
  let reportingManagerValue = null;
  if (reporting_manager !== null && reporting_manager !== undefined && reporting_manager !== '') {
    const trimmed = String(reporting_manager).trim();
    if (trimmed !== '') {
      reportingManagerValue = trimmed;
    }
  }
  
  const requestBody = {
    user_id: trimmedUserId,
    employee_code: trimmedEmployeeCode,
    alternate_phone: alternate_phone ? String(alternate_phone).trim() : '',
    full_name: trimmedFullName,
    email: trimmedEmail,
    phone: trimmedPhone,
    address: address ? String(address).trim() : '',
    country_id: trimmedCountryId,
    state_id: state_id && String(state_id).trim() !== '' ? String(state_id).trim() : '',
    city_id: city_id && String(city_id).trim() !== '' ? String(city_id).trim() : '',
    zone_preference: zone_preference ? String(zone_preference).trim() : '',
    joining_date: joining_date || new Date().toISOString(),
  };
  
  // Set reporting_manager - must be either a valid UUID string or null (never empty string)
  // The database foreign key constraint requires either a valid user_id or NULL
  if (reportingManagerValue !== null && reportingManagerValue !== '' && reportingManagerValue !== undefined) {
    // Validate it looks like a UUID (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(reportingManagerValue)) {
      requestBody.reporting_manager = reportingManagerValue;
    } else {
      console.warn('[Create Salesman] Invalid UUID format for reporting_manager, setting to null:', reportingManagerValue);
      requestBody.reporting_manager = null;
    }
  } else {
    // Explicitly set to null - backend should handle this for foreign key constraint
    requestBody.reporting_manager = null;
  }
  
  // Final validation of request body
  if (!requestBody.employee_code || requestBody.employee_code === '') {
    console.error('[Create Salesman] Request body validation failed:', requestBody);
    throw new Error('Employee code is required in request body');
  }
  if (!requestBody.full_name || requestBody.full_name === '') {
    console.error('[Create Salesman] Request body validation failed:', requestBody);
    throw new Error('Full name is required in request body');
  }
  if (!requestBody.user_id || requestBody.user_id === '') {
    console.error('[Create Salesman] Request body validation failed: user_id is required', requestBody);
    throw new Error('User ID is required in request body');
  }
  
  console.log('[Create Salesman] Creating salesman with employee_code:', requestBody.employee_code);
  console.log('[Create Salesman] Request body:', JSON.stringify(requestBody, null, 2));
  console.log('[Create Salesman] reporting_manager value:', requestBody.reporting_manager, 'type:', typeof requestBody.reporting_manager);
  
  return apiRequest('/salesmen/', {
    method: 'POST',
    body: requestBody,
    includeAuth: true,
  });
};

/**
 * Update salesman
 * @param {string} salesmanId - Salesman ID (UUID)
 * @param {Object} salesmanData - Salesman data to update
 * @param {string} salesmanData.user_id - User ID (UUID)
 * @param {string} salesmanData.employee_code - Employee code
 * @param {string} salesmanData.alternate_phone - Alternate phone (optional)
 * @param {string} salesmanData.full_name - Full name
 * @param {string} salesmanData.reporting_manager - Reporting manager ID (UUID)
 * @param {string} salesmanData.email - Email address
 * @param {string} salesmanData.phone - Phone number
 * @param {string} salesmanData.address - Address
 * @param {string} salesmanData.country_id - Country ID (UUID)
 * @param {string} salesmanData.state_id - State ID (UUID)
 * @param {string} salesmanData.city_id - City ID (UUID)
 * @param {string} salesmanData.zone_preference - Zone preference
 * @param {string} salesmanData.joining_date - Joining date (ISO string)
 * @returns {Promise<Object>} Response with message
 */
export const updateSalesman = async (salesmanId, salesmanData) => {
  // Validate salesmanId
  if (!salesmanId) {
    throw new Error('Salesman ID is required');
  }
  
  const cleanSalesmanId = String(salesmanId).trim();
  if (!cleanSalesmanId || cleanSalesmanId === 'undefined' || cleanSalesmanId === 'null') {
    console.error('[Update Salesman] Invalid salesman ID:', salesmanId);
    throw new Error('Invalid salesman ID');
  }
  
  const {
    user_id,
    employee_code,
    alternate_phone,
    full_name,
    reporting_manager,
    email,
    phone,
    address,
    country_id,
    state_id,
    city_id,
    zone_preference,
    joining_date,
  } = salesmanData;
  
  // Validate required fields - ensure they exist and are not empty
  const trimmedEmployeeCode = employee_code ? String(employee_code).trim() : '';
  const trimmedFullName = full_name ? String(full_name).trim() : '';
  const trimmedEmail = email ? String(email).trim() : '';
  const trimmedPhone = phone ? String(phone).trim() : '';
  const trimmedCountryId = country_id ? String(country_id).trim() : '';
  
  if (!trimmedEmployeeCode) {
    throw new Error('Employee code is required');
  }
  if (!trimmedFullName) {
    throw new Error('Full name is required');
  }
  if (!trimmedEmail) {
    throw new Error('Email is required');
  }
  if (!trimmedPhone) {
    throw new Error('Phone is required');
  }
  if (!trimmedCountryId) {
    throw new Error('Country is required');
  }
  
  // Validate user_id - it's required (NOT NULL in database)
  const trimmedUserId = user_id ? String(user_id).trim() : '';
  if (!trimmedUserId || trimmedUserId === '') {
    throw new Error('User ID is required');
  }
  
  // Build request body matching the exact payload structure provided
  // reporting_manager must be null (not empty string) if not provided, to satisfy foreign key constraint
  let reportingManagerValue = null;
  if (reporting_manager !== null && reporting_manager !== undefined && reporting_manager !== '') {
    const trimmed = String(reporting_manager).trim();
    if (trimmed !== '') {
      reportingManagerValue = trimmed;
    }
  }
  
  const requestBody = {
    user_id: trimmedUserId,
    employee_code: trimmedEmployeeCode,
    alternate_phone: alternate_phone ? String(alternate_phone).trim() : '',
    full_name: trimmedFullName,
    email: trimmedEmail,
    phone: trimmedPhone,
    address: address ? String(address).trim() : '',
    country_id: trimmedCountryId,
    state_id: state_id && String(state_id).trim() !== '' ? String(state_id).trim() : '',
    city_id: city_id && String(city_id).trim() !== '' ? String(city_id).trim() : '',
    zone_preference: zone_preference ? String(zone_preference).trim() : '',
    joining_date: joining_date || new Date().toISOString(),
  };
  
  // Set reporting_manager - must be either a valid UUID string or null (never empty string)
  // The database foreign key constraint requires either a valid user_id or NULL
  if (reportingManagerValue !== null && reportingManagerValue !== '' && reportingManagerValue !== undefined) {
    // Validate it looks like a UUID (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(reportingManagerValue)) {
      requestBody.reporting_manager = reportingManagerValue;
    } else {
      console.warn('[Create Salesman] Invalid UUID format for reporting_manager, setting to null:', reportingManagerValue);
      requestBody.reporting_manager = null;
    }
  } else {
    // Explicitly set to null - backend should handle this for foreign key constraint
    requestBody.reporting_manager = null;
  }
  
  // Final validation of request body
  if (!requestBody.employee_code || requestBody.employee_code === '') {
    console.error('[Update Salesman] Request body validation failed:', requestBody);
    throw new Error('Employee code is required in request body');
  }
  if (!requestBody.full_name || requestBody.full_name === '') {
    console.error('[Update Salesman] Request body validation failed:', requestBody);
    throw new Error('Full name is required in request body');
  }
  if (!requestBody.user_id || requestBody.user_id === '') {
    console.error('[Update Salesman] Request body validation failed: user_id is required', requestBody);
    throw new Error('User ID is required in request body');
  }
  
  console.log('[Update Salesman] Updating salesman with ID:', cleanSalesmanId);
  console.log('[Update Salesman] Request body:', JSON.stringify(requestBody, null, 2));
  console.log('[Update Salesman] reporting_manager value:', requestBody.reporting_manager, 'type:', typeof requestBody.reporting_manager);
  
  return apiRequest(`/salesmen/${cleanSalesmanId}`, {
    method: 'PUT',
    body: requestBody,
    includeAuth: true,
  });
};

/**
 * Delete salesman
 * @param {string} salesmanId - Salesman ID (UUID)
 * @returns {Promise<Object>} Response with message
 */
export const deleteSalesman = async (salesmanId) => {
  // Validate salesmanId
  if (!salesmanId) {
    throw new Error('Salesman ID is required');
  }
  
  const cleanSalesmanId = String(salesmanId).trim();
  if (!cleanSalesmanId || cleanSalesmanId === 'undefined' || cleanSalesmanId === 'null') {
    console.error('[Delete Salesman] Invalid salesman ID:', salesmanId);
    throw new Error('Invalid salesman ID');
  }
  
  console.log('[Delete Salesman] Deleting salesman with ID:', cleanSalesmanId);
  
  return apiRequest(`/salesmen/${cleanSalesmanId}`, {
    method: 'DELETE',
    includeAuth: true,
  });
};

// Export base URL for reference (use getBaseURL() for dynamic access)
export { BASE_URL, getBaseURL };

