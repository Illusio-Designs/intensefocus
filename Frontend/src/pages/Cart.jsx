import React, { useState, useEffect } from "react";
import "../styles/pages/Cart.css";
import {
  getCartItems,
  removeFromCart,
  updateCartQuantity,
  registerCartListener,
} from "../services/cartService";
import {
  showRemoveFromCartSuccess,
  showPlaceOrderSuccess,
  showCartUpdateSuccess,
} from "../services/notificationService";

const Cart = ({ onPageChange = null }) => {
  const handlePageChange = (page) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      window.location.href = `/${page}`;
    }
  };
  const [cartItems, setCartItems] = useState([]);
  const [editingQuantities, setEditingQuantities] = useState({});
  const [orderType, setOrderType] = useState("");
  const [party, setParty] = useState("");

  useEffect(() => {
    // Initialize cart items
    const items = getCartItems();
    setCartItems([...items]);

    // Listen for cart changes
    const unsubscribe = registerCartListener(() => {
      const updatedItems = getCartItems();
      setCartItems([...updatedItems]);
    });

    return unsubscribe;
  }, []);

  const handleRemoveItem = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    const itemName = item ? `${item.name} (${item.lenseColour})` : "Item";
    removeFromCart(productId);
    showRemoveFromCartSuccess(itemName);
  };

  const handleQuantityIncrease = (productId) => {
    const currentItems = getCartItems();
    const item = currentItems.find((item) => item.id === productId);
    if (item) {
      const newQuantity = item.quantity + 1;
      updateCartQuantity(productId, newQuantity);
      const itemName = `${item.name} (${item.lenseColour})`;
      showCartUpdateSuccess(itemName, newQuantity);
    }
  };

  const handleQuantityDecrease = (productId) => {
    const currentItems = getCartItems();
    const item = currentItems.find((item) => item.id === productId);
    if (item && item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      updateCartQuantity(productId, newQuantity);
      const itemName = `${item.name} (${item.lenseColour})`;
      showCartUpdateSuccess(itemName, newQuantity);
    }
  };

  const handleQuantityInputChange = (productId, value) => {
    const currentItems = getCartItems();
    const item = currentItems.find((item) => item.id === productId);
    if (!item) return;

    const parsed = parseInt(value, 10);
    const newQuantity = Number.isNaN(parsed) ? 1 : Math.max(1, parsed);
    updateCartQuantity(productId, newQuantity);
    const itemName = `${item.name} (${item.lenseColour})`;
    showCartUpdateSuccess(itemName, newQuantity);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      // Extract numeric value from whp (e.g., "₹2,090" -> 2090)
      const price = parseFloat(item.whp.replace(/[₹,]/g, "")) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const calculateTax = () => {
    return 500; // Fixed tax as per image
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const formatPrice = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const getDisplayName = (item) => {
    return `${item.name} - ${item.lenseColour}`;
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-content">
          {/* Shopping Cart Section */}
          <div className="shopping-cart-section">
            <h2 className="section-title">Shopping Cart</h2>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="cart-items">
                <div className="cart-items-header">
                  <div className="header-item">ITEMS</div>
                  <div className="header-qty">QTY</div>
                  <div className="header-subtotal">SUBTOTAL</div>
                  <div className="header-remove"></div>
                </div>

                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h3 className="item-name">{getDisplayName(item)}</h3>
                      </div>
                    </div>
                    <div className="item-qty">
                      <div className="quantity-selector-cart">
                        <button
                          className="qty-btn-cart minus"
                          onClick={() => handleQuantityDecrease(item.id)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          className="qty-number-cart"
                          type="number"
                          step="1"
                          value={editingQuantities[item.id] !== undefined ? editingQuantities[item.id] : item.quantity}
                          onChange={e => {
                            setEditingQuantities(q => ({ ...q, [item.id]: e.target.value }));
                            const itemName = `${item.name} (${item.lenseColour})`;
                            const num = parseInt(e.target.value, 10);
                            showCartUpdateSuccess(itemName, (!e.target.value || isNaN(num) || num < 1) ? 1 : num);
                          }}
                          onBlur={e => {
                            const val = editingQuantities[item.id];
                            const num = parseInt(val, 10);
                            handleQuantityInputChange(item.id, (!val || isNaN(num) || num < 1) ? '1' : val);
                            setEditingQuantities(q => {
                              const { [item.id]: _, ...rest } = q;
                              return rest;
                            });
                          }}
                        />
                        <button
                          className="qty-btn-cart plus"
                          onClick={() => handleQuantityIncrease(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="item-subtotal">
                      {formatPrice(parseFloat(item.whp.replace(/[₹,]/g, '')) * (parseInt(editingQuantities[item.id], 10) > 0 ? parseInt(editingQuantities[item.id], 10) : item.quantity))}
                    </div>
                    <div className="item-remove">
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary Section */}
          <div className="summary-section">
            <h2 className="section-title">Summary</h2>

            <div className="summary-form">
              <div className="form-group">
                <select
                  id="order-type"
                  className="summary-dropdown"
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <option value="">Select Order Type</option>
                  <option value="retail">Retail</option>
                  <option value="wholesale">Wholesale</option>
                </select>
              </div>

              <div className="form-group">
                <select
                  id="party"
                  className="summary-dropdown"
                  value={party}
                  onChange={(e) => setParty(e.target.value)}
                >
                  <option value="">Select Party</option>
                  <option value="party1">Party 1</option>
                  <option value="party2">Party 2</option>
                </select>
              </div>
            </div>

            <div className="summary-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">Subtotal:</span>
                <span className="breakdown-value">
                  {formatPrice(calculateSubtotal())}
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Tax:</span>
                <span className="breakdown-value">
                  {formatPrice(calculateTax())}
                </span>
              </div>
              <div className="breakdown-item total">
                <span className="breakdown-label">Total:</span>
                <span className="breakdown-value">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
            </div>

            <button
              className="checkout-btn"
              onClick={() => {
                if (cartItems.length > 0) {
                  showPlaceOrderSuccess();
                }
              }}
            >
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
