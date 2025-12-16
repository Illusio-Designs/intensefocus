/**
 * Authentication Service
 * Handles user authentication state and token management
 */

// Check if user is logged in
export const isLoggedIn = () => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Get user data
export const getUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Set user data and token
export const setAuth = (user, token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
  // Dispatch custom event for same-tab updates
  window.dispatchEvent(new Event('authChange'));
};

// Clear authentication data
export const logout = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  // Dispatch custom event for same-tab updates
  window.dispatchEvent(new Event('authChange'));
  // Dispatch token removal event
  window.dispatchEvent(new CustomEvent('tokenRemoved'));
};

// Get auth token
export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

