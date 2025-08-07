// Storage service for managing localStorage and sessionStorage
class StorageService {
  constructor(storage = localStorage) {
    this.storage = storage;
  }

  // Set item with optional expiry
  set(key, value, expiry = null) {
    try {
      const item = {
        value,
        timestamp: Date.now(),
        expiry: expiry ? Date.now() + expiry : null
      };
      this.storage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Error setting storage item:', error);
      return false;
    }
  }

  // Get item with expiry check
  get(key, defaultValue = null) {
    try {
      const item = this.storage.getItem(key);
      if (!item) return defaultValue;

      const parsedItem = JSON.parse(item);
      
      // Check if item has expired
      if (parsedItem.expiry && Date.now() > parsedItem.expiry) {
        this.remove(key);
        return defaultValue;
      }

      return parsedItem.value;
    } catch (error) {
      console.error('Error getting storage item:', error);
      return defaultValue;
    }
  }

  // Remove item
  remove(key) {
    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing storage item:', error);
      return false;
    }
  }

  // Clear all items
  clear() {
    try {
      this.storage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // Check if key exists
  has(key) {
    return this.get(key) !== null;
  }

  // Get all keys
  keys() {
    try {
      return Object.keys(this.storage);
    } catch (error) {
      console.error('Error getting storage keys:', error);
      return [];
    }
  }

  // Get storage size
  size() {
    try {
      return this.storage.length;
    } catch (error) {
      console.error('Error getting storage size:', error);
      return 0;
    }
  }

  // Get storage usage in bytes
  getUsage() {
    try {
      let total = 0;
      for (let key in this.storage) {
        if (this.storage.hasOwnProperty(key)) {
          total += this.storage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return 0;
    }
  }

  // Clean expired items
  cleanExpired() {
    try {
      const keys = this.keys();
      let cleaned = 0;
      
      keys.forEach(key => {
        const item = this.get(key);
        if (item === null) {
          this.remove(key);
          cleaned++;
        }
      });
      
      return cleaned;
    } catch (error) {
      console.error('Error cleaning expired items:', error);
      return 0;
    }
  }
}

// Create instances for localStorage and sessionStorage
export const localStorage = new StorageService(window.localStorage);
export const sessionStorage = new StorageService(window.sessionStorage);

// Auth storage helpers
export const authStorage = {
  // Token management
  setToken: (token, expiry = 24 * 60 * 60 * 1000) => localStorage.set('token', token, expiry),
  getToken: () => localStorage.get('token'),
  removeToken: () => localStorage.remove('token'),
  
  // User management
  setUser: (user) => localStorage.set('user', user),
  getUser: () => localStorage.get('user'),
  removeUser: () => localStorage.remove('user'),
  
  // Clear all auth data
  clear: () => {
    localStorage.remove('token');
    localStorage.remove('user');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.get('token');
    const user = localStorage.get('user');
    return !!(token && user);
  }
};

// App settings storage
export const settingsStorage = {
  // Theme
  setTheme: (theme) => localStorage.set('theme', theme),
  getTheme: () => localStorage.get('theme', 'light'),
  
  // Language
  setLanguage: (language) => localStorage.set('language', language),
  getLanguage: () => localStorage.get('language', 'en'),
  
  // Sidebar state
  setSidebarOpen: (isOpen) => localStorage.set('sidebarOpen', isOpen),
  getSidebarOpen: () => localStorage.get('sidebarOpen', true),
  
  // Table preferences
  setTablePreferences: (preferences) => localStorage.set('tablePreferences', preferences),
  getTablePreferences: () => localStorage.get('tablePreferences', {}),
  
  // Form data (temporary)
  setFormData: (formId, data) => sessionStorage.set(`form_${formId}`, data),
  getFormData: (formId) => sessionStorage.get(`form_${formId}`),
  removeFormData: (formId) => sessionStorage.remove(`form_${formId}`)
};

// Cache storage helpers
export const cacheStorage = {
  // Cache data with expiry
  set: (key, data, expiry = 5 * 60 * 1000) => localStorage.set(`cache_${key}`, data, expiry),
  get: (key) => localStorage.get(`cache_${key}`),
  remove: (key) => localStorage.remove(`cache_${key}`),
  
  // Clear all cache
  clear: () => {
    const keys = localStorage.keys();
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.remove(key);
      }
    });
  },
  
  // Get cache keys
  keys: () => {
    const keys = localStorage.keys();
    return keys.filter(key => key.startsWith('cache_'));
  }
};

// Export default storage service
export default localStorage; 