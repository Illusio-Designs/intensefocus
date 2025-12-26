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
  showError,
  showSuccess,
} from "../services/notificationService";
import { getUserRole, getUser } from "../services/authService";
import {
  createOrder,
  getParties,
  getEvents,
  getCountries,
} from "../services/apiService";

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
  
  // Get user role and user info
  const userRole = getUserRole();
  const user = getUser();
  const isParty = userRole === 'party';
  const isDistributor = userRole === 'distributor';
  const isSalesman = userRole === 'salesman';
  
  // Role-based state
  const [orderType, setOrderType] = useState(isDistributor ? "distributor_order" : "");
  const [selectedParty, setSelectedParty] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  
  // Dropdown data
  const [countries, setCountries] = useState([]);
  const [parties, setParties] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize cart items
    const items = getCartItems();
    setCartItems([...items]);

    // Listen for cart changes
    const unsubscribe = registerCartListener(() => {
      const updatedItems = getCartItems();
      setCartItems([...updatedItems]);
    });

    // Fetch countries if needed (for distributor or salesman)
    if (isDistributor || isSalesman) {
      fetchCountries();
    }

    return unsubscribe;
  }, []);

  // Fetch countries
  const fetchCountries = async () => {
    try {
      const countriesData = await getCountries();
      setCountries(Array.isArray(countriesData) ? countriesData : []);
    } catch (err) {
      console.error('Failed to fetch countries:', err);
      setCountries([]);
    }
  };

  // Fetch parties when country is selected (for distributor or salesman)
  useEffect(() => {
    if ((isDistributor || isSalesman) && selectedCountry) {
      fetchParties(selectedCountry);
    } else {
      setParties([]);
    }
  }, [selectedCountry, isDistributor, isSalesman]);

  const fetchParties = async (countryId) => {
    if (!countryId) {
      setParties([]);
      return;
    }
    try {
      const partiesData = await getParties(countryId);
      setParties(Array.isArray(partiesData) ? partiesData : []);
    } catch (err) {
      console.error('Failed to fetch parties:', err);
      setParties([]);
    }
  };

  // Fetch events when event_order is selected (for salesman)
  useEffect(() => {
    if (isSalesman && orderType === 'event_order') {
      fetchEvents();
    } else {
      setEvents([]);
    }
  }, [orderType, isSalesman]);

  const fetchEvents = async () => {
    try {
      const eventsData = await getEvents();
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setEvents([]);
    }
  };

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

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showError('Your cart is empty');
      return;
    }

    // Validation based on role
    if (isDistributor && !selectedParty) {
      showError('Please select a party');
      return;
    }

    if (isSalesman) {
      if (!orderType) {
        showError('Please select an order type');
        return;
      }
      if (orderType === 'event_order' && !selectedEvent) {
        showError('Please select an event');
        return;
      }
      if (!selectedParty) {
        showError('Please select a party');
        return;
      }
    }

    setLoading(true);
    try {
      // Prepare order items
      const orderItems = cartItems.map(item => {
        const quantity = editingQuantities[item.id] !== undefined 
          ? parseInt(editingQuantities[item.id], 10) || item.quantity 
          : item.quantity;
        const price = parseFloat(item.whp.replace(/[₹,]/g, "")) || 0;
        
        return {
          product_id: item.id,
          quantity: quantity,
          price: price
        };
      });

      // Prepare order data
      const orderData = {
        order_date: new Date().toISOString(),
        order_items: orderItems,
      };

      // Set order type
      if (isParty) {
        orderData.order_type = 'party_order';
      } else if (isDistributor) {
        orderData.order_type = 'distributor_order';
      } else if (isSalesman && orderType) {
        orderData.order_type = orderType;
      }

      // Set party_id
      if (isParty) {
        // For party users, try multiple possible fields for party_id
        orderData.party_id = user?.party_id || user?.partyId || user?.id || null;
        if (!orderData.party_id) {
          showError('Party ID not found. Please contact support.');
          setLoading(false);
          return;
        }
        
        // Set distributor_id if available in user object (backend will handle if not provided)
        if (user?.distributor_id) {
          orderData.distributor_id = user.distributor_id;
        }
      } else if (selectedParty) {
        orderData.party_id = selectedParty;
      }

      // Set user_id (logged-in person's ID)
      if (user?.id || user?.user_id) {
        orderData.user_id = user.id || user.user_id;
      }

      // Set distributor_id for distributor role
      if (isDistributor && user?.distributor_id) {
        orderData.distributor_id = user.distributor_id;
      }

      // Set salesman_id
      if (isSalesman && user?.salesman_id) {
        orderData.salesman_id = user.salesman_id;
      }

      // Set event_id
      if (isSalesman && orderType === 'event_order' && selectedEvent) {
        orderData.event_id = selectedEvent;
      }

      // Create order
      await createOrder(orderData);
      showSuccess('Order placed successfully!');
      showPlaceOrderSuccess();
      
      // Clear cart after successful order
      cartItems.forEach(item => {
        removeFromCart(item.id);
      });
      
      // Reset form
      setSelectedParty("");
      setSelectedEvent("");
      setSelectedCountry("");
      if (isSalesman) {
        setOrderType("");
      }
    } catch (err) {
      const errorMessage = err?.message || err?.errorData?.error || 'Failed to place order';
      showError(errorMessage);
      console.error('Order creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Determine if party dropdown should be shown
  const shouldShowPartyDropdown = () => {
    if (isParty) return false; // Party role: no dropdowns
    if (isDistributor) return true; // Distributor: show party dropdown
    if (isSalesman && orderType) return true; // Salesman: show after order type selected
    return false;
  };

  // Determine if event dropdown should be shown
  const shouldShowEventDropdown = () => {
    return isSalesman && orderType === 'event_order';
  };

  // Determine if country dropdown should be shown (needed for party selection)
  const shouldShowCountryDropdown = () => {
    return (isDistributor || isSalesman) && shouldShowPartyDropdown();
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
              {/* Order Type Dropdown - Only for Salesman */}
              {isSalesman && (
                <div className="form-group">
                  <label htmlFor="order-type" className="form-label">Order Type</label>
                  <select
                    id="order-type"
                    className="summary-dropdown"
                    value={orderType}
                    onChange={(e) => {
                      setOrderType(e.target.value);
                      // Reset party and event when order type changes
                      setSelectedParty("");
                      setSelectedEvent("");
                    }}
                  >
                    <option value="">Select Order Type</option>
                    <option value="visit_order">Visit Order</option>
                    <option value="whatsapp_order">WhatsApp Order</option>
                    <option value="event_order">Event Order</option>
                  </select>
                </div>
              )}

              {/* Country Dropdown - For Distributor and Salesman (when party selection is needed) */}
              {shouldShowCountryDropdown() && (
                <div className="form-group">
                  <label htmlFor="country" className="form-label">Country</label>
                  <select
                    id="country"
                    className="summary-dropdown"
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      // Reset party when country changes
                      setSelectedParty("");
                    }}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.id || country.country_id} value={country.id || country.country_id}>
                        {country.country_name || country.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Event Dropdown - Only for Salesman when event_order is selected */}
              {shouldShowEventDropdown() && (
                <div className="form-group">
                  <label htmlFor="event" className="form-label">Event</label>
                  <select
                    id="event"
                    className="summary-dropdown"
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                  >
                    <option value="">Select Event</option>
                    {events.map(event => (
                      <option key={event.id || event.event_id} value={event.id || event.event_id}>
                        {event.event_name || event.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Party Dropdown - For Distributor and Salesman (after order type selected) */}
              {shouldShowPartyDropdown() && (
                <div className="form-group">
                  <label htmlFor="party" className="form-label">Party</label>
                  <select
                    id="party"
                    className="summary-dropdown"
                    value={selectedParty}
                    onChange={(e) => setSelectedParty(e.target.value)}
                    disabled={!selectedCountry && (isDistributor || isSalesman)}
                  >
                    <option value="">Select Party</option>
                    {parties.map(party => (
                      <option key={party.id || party.party_id} value={party.id || party.party_id}>
                        {party.party_name || party.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'PLACING ORDER...' : 'CHECKOUT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
