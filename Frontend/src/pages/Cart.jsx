import React, { useState } from 'react';
import { Button, ActionButton } from '../components';
import { Delete, Add, Remove } from '@mui/icons-material';
import '../styles/Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Classic Aviator Sunglasses',
      price: 129.99,
      image: '/placeholder-product-1.jpg',
      quantity: 1,
      brand: 'Ray-Ban'
    },
    {
      id: 2,
      name: 'Modern Round Eyeglasses',
      price: 89.99,
      image: '/placeholder-product-2.jpg',
      quantity: 2,
      brand: 'Oakley'
    },
    {
      id: 3,
      name: 'Sport Contact Lenses',
      price: 49.99,
      image: '/placeholder-product-3.jpg',
      quantity: 1,
      brand: 'Acuvue'
    }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? subtotal * 0.1 : 0; // 10% discount
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal - discount + shipping;

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'save10') {
      setAppliedCoupon({ code: couponCode, discount: 0.1 });
      setCouponCode('');
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    // Handle checkout logic here
    alert('Proceeding to checkout...');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1 className="page-title">Shopping Cart</h1>
          </div>
          <div className="empty-cart">
            <div className="empty-cart-content">
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <Button 
                variant="primary" 
                size="large"
                onClick={() => window.location.href = '/shop'}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="page-title">Shopping Cart</h1>
          <p className="cart-subtitle">You have {cartItems.length} item(s) in your cart</p>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-items-header">
              <h3>Items</h3>
            </div>
            
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="item-details">
                  <h4 className="item-name">{item.name}</h4>
                  <p className="item-brand">{item.brand}</p>
                  <p className="item-price">${item.price}</p>
                </div>

                <div className="item-quantity">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Remove />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Add />
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  <span className="total-amount">${(item.price * item.quantity).toFixed(2)}</span>
                </div>

                <div className="item-actions">
                  <ActionButton
                    type="delete"
                    onClick={() => removeItem(item.id)}
                    tooltip="Remove item"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <div className="summary-header">
              <h3>Order Summary</h3>
            </div>

            <div className="summary-content">
              {/* Coupon Section */}
              <div className="coupon-section">
                <h4>Have a coupon?</h4>
                {appliedCoupon ? (
                  <div className="applied-coupon">
                    <span>Applied: {appliedCoupon.code}</span>
                    <button 
                      className="remove-coupon-btn"
                      onClick={removeCoupon}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="coupon-input">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="coupon-field"
                    />
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={applyCoupon}
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="price-row discount">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="price-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                
                <div className="price-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="checkout-section">
                <Button 
                  variant="primary" 
                  size="large"
                  onClick={handleCheckout}
                  className="checkout-btn"
                >
                  Proceed to Checkout
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="medium"
                  onClick={() => window.location.href = '/shop'}
                  className="continue-shopping-btn"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 