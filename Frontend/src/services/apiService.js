/**
 * API Service
 * Centralized API service for all backend endpoints
 */

import { sendOTP } from './msg91Service';
import { logout } from './authService';

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
    const errorData = isJson ? await response.json() : { error: response.statusText };
    const errorMessage = errorData.error || errorData.message || 'An error occurred';
    
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
    
    throw new Error(errorMessage);
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
  return apiRequest('/distributors/', {
    method: 'GET',
    body: { country_id: countryId },
    includeAuth: true,
  });
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
  return apiRequest('/distributors/', {
    method: 'POST',
    body: {
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
      gstin: gstin || '',
      pan: pan || '',
      territory,
      commission_rate,
    },
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
  return apiRequest(`/distributors/${distributorId}`, {
    method: 'PUT',
    body: {
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
      gstin: gstin || '',
      pan: pan || '',
      territory,
      commission_rate,
      is_active,
    },
    includeAuth: true,
  });
};

/**
 * Delete distributor
 * @param {string} distributorId - Distributor ID (UUID)
 * @returns {Promise<Object>} Response with message
 */
export const deleteDistributor = async (distributorId) => {
  return apiRequest(`/distributors/${distributorId}`, {
    method: 'DELETE',
    includeAuth: true,
  });
};

// ==================== PARTY ENDPOINTS ====================

/**
 * Get all parties
 * @returns {Promise<Array>} Array of party objects
 */
export const getParties = async () => {
  return apiRequest('/parties/', {
    method: 'GET',
    includeAuth: true,
  });
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
  return apiRequest('/parties/', {
    method: 'POST',
    body: {
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
      gstin: gstin || '',
      pan: pan || '',
    },
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
  return apiRequest(`/parties/${partyId}`, {
    method: 'PUT',
    body: {
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
      gstin: gstin || '',
      pan: pan || '',
    },
    includeAuth: true,
  });
};

/**
 * Delete party
 * @param {string} partyId - Party ID (UUID)
 * @returns {Promise<Object>} Response with message
 */
export const deleteParty = async (partyId) => {
  return apiRequest(`/parties/${partyId}`, {
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
  return apiRequest('/salesmen/', {
    method: 'GET',
    body: { country_id: countryId },
    includeAuth: true,
  });
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
  return apiRequest('/salesmen/', {
    method: 'POST',
    body: {
      user_id,
      employee_code,
      alternate_phone: alternate_phone || '',
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
    },
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
  return apiRequest(`/salesmen/${salesmanId}`, {
    method: 'PUT',
    body: {
      user_id,
      employee_code,
      alternate_phone: alternate_phone || '',
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
    },
    includeAuth: true,
  });
};

/**
 * Delete salesman
 * @param {string} salesmanId - Salesman ID (UUID)
 * @returns {Promise<Object>} Response with message
 */
export const deleteSalesman = async (salesmanId) => {
  return apiRequest(`/salesmen/${salesmanId}`, {
    method: 'DELETE',
    includeAuth: true,
  });
};

// Export base URL for reference (use getBaseURL() for dynamic access)
export { BASE_URL, getBaseURL };

