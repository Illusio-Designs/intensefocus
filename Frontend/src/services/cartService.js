// Cart Service - Shared state management for cart
let cartItems = [];
let cartListeners = [];

// Get cart items
export const getCartItems = () => cartItems;

// Get cart count
export const getCartCount = () => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

// Add item to cart
export const addToCart = (product) => {
  const existingItem = cartItems.find(item => item.id === product.id);
  
  if (existingItem) {
    // Update quantity if item already exists
    existingItem.quantity = product.quantity;
  } else {
    // Add new item
    cartItems.push({ ...product });
  }
  
  notifyListeners();
};

// Remove item from cart
export const removeFromCart = (productId) => {
  cartItems = cartItems.filter(item => item.id !== productId);
  notifyListeners();
};

// Update quantity
export const updateCartQuantity = (productId, quantity) => {
  const item = cartItems.find(item => item.id === productId);
  if (item) {
    item.quantity = quantity;
    // Create a new array reference to trigger React re-render
    cartItems = [...cartItems];
    notifyListeners();
  }
};

// Clear cart
export const clearCart = () => {
  cartItems = [];
  notifyListeners();
};

// Register listener for cart changes
export const registerCartListener = (listener) => {
  cartListeners.push(listener);
  return () => {
    cartListeners = cartListeners.filter(l => l !== listener);
  };
};

// Notify all listeners
const notifyListeners = () => {
  cartListeners.forEach(listener => listener());
};

