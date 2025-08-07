import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common responses
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          console.error('API Error:', data?.message || 'Unknown error');
      }
      
      return Promise.reject({
        status,
        message: data?.message || 'An error occurred',
        data: data
      });
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.request);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        data: null
      });
    } else {
      // Other error
      console.error('Error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message,
        data: null
      });
    }
  }
);

// API Methods

// Auth API
export const authAPI = {
  // Login
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Register
  register: (userData) => api.post('/auth/register', userData),
  
  // Logout
  logout: () => api.post('/auth/logout'),
  
  // Refresh token
  refreshToken: () => api.post('/auth/refresh'),
  
  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
  
  // Forgot password
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Reset password
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

// User API
export const userAPI = {
  // Get all users
  getUsers: (params) => api.get('/users', { params }),
  
  // Get user by ID
  getUser: (id) => api.get(`/users/${id}`),
  
  // Create user
  createUser: (userData) => api.post('/users', userData),
  
  // Update user
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  
  // Delete user
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  // Update profile
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  
  // Change password
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
};

// Product API
export const productAPI = {
  // Get all products
  getProducts: (params) => api.get('/products', { params }),
  
  // Get product by ID
  getProduct: (id) => api.get(`/products/${id}`),
  
  // Create product
  createProduct: (productData) => api.post('/products', productData),
  
  // Update product
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  
  // Delete product
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // Upload product image
  uploadImage: (id, imageData) => {
    const formData = new FormData();
    formData.append('image', imageData);
    return api.post(`/products/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Get products by category
  getProductsByCategory: (categoryId, params) => 
    api.get(`/products/category/${categoryId}`, { params }),
  
  // Search products
  searchProducts: (query, params) => 
    api.get('/products/search', { params: { q: query, ...params } }),
};

// Order API
export const orderAPI = {
  // Get all orders
  getOrders: (params) => api.get('/orders', { params }),
  
  // Get order by ID
  getOrder: (id) => api.get(`/orders/${id}`),
  
  // Create order
  createOrder: (orderData) => api.post('/orders', orderData),
  
  // Update order
  updateOrder: (id, orderData) => api.put(`/orders/${id}`, orderData),
  
  // Delete order
  deleteOrder: (id) => api.delete(`/orders/${id}`),
  
  // Get user orders
  getUserOrders: (params) => api.get('/orders/my-orders', { params }),
  
  // Update order status
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

// Cart API
export const cartAPI = {
  // Get cart
  getCart: () => api.get('/cart'),
  
  // Add item to cart
  addToCart: (itemData) => api.post('/cart/items', itemData),
  
  // Update cart item
  updateCartItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  
  // Remove item from cart
  removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
  
  // Clear cart
  clearCart: () => api.delete('/cart'),
  
  // Apply coupon
  applyCoupon: (couponCode) => api.post('/cart/coupon', { code: couponCode }),
  
  // Remove coupon
  removeCoupon: () => api.delete('/cart/coupon'),
};

// Category API
export const categoryAPI = {
  // Get all categories
  getCategories: (params) => api.get('/categories', { params }),
  
  // Get category by ID
  getCategory: (id) => api.get(`/categories/${id}`),
  
  // Create category
  createCategory: (categoryData) => api.post('/categories', categoryData),
  
  // Update category
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  
  // Delete category
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

// Brand API
export const brandAPI = {
  // Get all brands
  getBrands: (params) => api.get('/brands', { params }),
  
  // Get brand by ID
  getBrand: (id) => api.get(`/brands/${id}`),
  
  // Create brand
  createBrand: (brandData) => api.post('/brands', brandData),
  
  // Update brand
  updateBrand: (id, brandData) => api.put(`/brands/${id}`, brandData),
  
  // Delete brand
  deleteBrand: (id) => api.delete(`/brands/${id}`),
};

// Notification API
export const notificationAPI = {
  // Get notifications
  getNotifications: (params) => api.get('/notifications', { params }),
  
  // Mark notification as read
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  
  // Mark all notifications as read
  markAllAsRead: () => api.patch('/notifications/read-all'),
  
  // Delete notification
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  
  // Get unread count
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// Analytics API
export const analyticsAPI = {
  // Get dashboard stats
  getDashboardStats: () => api.get('/analytics/dashboard'),
  
  // Get sales analytics
  getSalesAnalytics: (params) => api.get('/analytics/sales', { params }),
  
  // Get product analytics
  getProductAnalytics: (params) => api.get('/analytics/products', { params }),
  
  // Get user analytics
  getUserAnalytics: (params) => api.get('/analytics/users', { params }),
};

// File Upload API
export const uploadAPI = {
  // Upload single file
  uploadFile: (file, type = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Upload multiple files
  uploadFiles: (files, type = 'general') => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    formData.append('type', type);
    
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Delete file
  deleteFile: (fileId) => api.delete(`/upload/${fileId}`),
};

// Utility functions
export const apiUtils = {
  // Create query string from object
  createQueryString: (params) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        searchParams.append(key, params[key]);
      }
    });
    return searchParams.toString();
  },
  
  // Handle file upload with progress
  uploadWithProgress: (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress && onProgress(percentCompleted);
      },
    });
  },
  
  // Retry request with exponential backoff
  retryRequest: async (requestFn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  },
};

// Export the main api instance for custom requests
export default api; 