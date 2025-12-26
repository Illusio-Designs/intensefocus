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
  getParties,
  getPartyById,
  getEvents,
  getCountries,
  getUsers,
  getDistributors,
  createOrder,
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

    // Fetch countries if needed (for distributor, salesman, or party)
    if (isDistributor || isSalesman || isParty) {
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
      let filteredParties = Array.isArray(partiesData) ? partiesData : [];
      
      // Filter parties by distributor's zone if user is a distributor
      if (isDistributor && user) {
        // Get distributor's zone_id from user object
        const distributorZoneId = user?.zone_id || 
                                  user?.zone_preference || 
                                  user?.distributor?.zone_id || 
                                  user?.distributor?.zoneId ||
                                  null;
        
        if (distributorZoneId) {
          const beforeFilter = filteredParties.length;
          filteredParties = filteredParties.filter(party => {
            const partyZoneId = party?.zone_id || party?.zoneId;
            if (!partyZoneId) return false;
            return String(partyZoneId).trim() === String(distributorZoneId).trim();
          });
          console.log('[Cart] Filtered parties by distributor zone:', distributorZoneId, 'Before:', beforeFilter, 'After:', filteredParties.length);
        } else {
          console.warn('[Cart] Distributor zone_id not found in user object, showing all parties for country');
        }
      }
      
      setParties(filteredParties);
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
    // Note: For distributor orders, party selection is optional (not required by backend)
    // Distributors can place orders without selecting a party

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

      // Debug: Log user object to see what fields are available
      if (isParty) {
        console.log('[Cart] Party user object:', user);
        console.log('[Cart] Available user fields:', Object.keys(user || {}));
        console.log('[Cart] user.party_id:', user?.party_id);
        console.log('[Cart] user.partyId:', user?.partyId);
        console.log('[Cart] user.party:', user?.party);
        console.log('[Cart] user.id:', user?.id);
      }
      
      // Debug: Log distributor user object
      if (isDistributor) {
        console.log('[Cart] Distributor user object:', user);
        console.log('[Cart] Available user fields:', Object.keys(user || {}));
        console.log('[Cart] user.distributor_id:', user?.distributor_id);
        console.log('[Cart] user.distributorId:', user?.distributorId);
        console.log('[Cart] user.distributor:', user?.distributor);
        console.log('[Cart] user.id:', user?.id);
        console.log('[Cart] user.zone_id:', user?.zone_id);
        console.log('[Cart] user.zone_preference:', user?.zone_preference);
        console.log('[Cart] user.distributor?.zone_id:', user?.distributor?.zone_id);
      }

      // Set party_id, distributor_id, and zone_id for party users
      if (isParty) {
        // Search for party by user's phone number (since party has phone field)
        let partyId = null;
        let distributorId = null;
        let zoneId = null;
        
        if (user?.phone) {
          console.log('[Cart] Searching for party by phone:', user.phone);
          try {
            // Fetch countries first
            let countriesList = countries;
            if (!countriesList || countriesList.length === 0) {
              countriesList = await getCountries();
              setCountries(countriesList);
            }
            
            // Normalize phone for comparison
            const normalizePhone = (phone) => {
              if (!phone) return '';
              return String(phone).trim().replace(/^\+/, '').replace(/[\s-]/g, '');
            };
            
            const userPhone = normalizePhone(user.phone);
            
            // Collect ALL parties from ALL countries (before filtering)
            // The backend returns parties even for wrong countries, so we collect them all
            const allPartiesMap = new Map(); // Use Map to avoid duplicates by party_id
            
            // Helper function to make API call directly
            const fetchPartiesRaw = async (countryId) => {
              const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stallion.nishree.com/api';
              const url = baseUrl.endsWith('/api') ? `${baseUrl}/parties/get` : `${baseUrl}/api/parties/get`;
              const token = localStorage.getItem('token');
              
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({ country_id: countryId })
              });
              
              if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
              }
              
              return await response.json();
            };
            
            for (const country of countriesList) {
              try {
                const countryId = country.id || country.country_id;
                if (!countryId) continue;
                
                // Make direct API call to get raw response (before getParties filters it)
                const response = await fetchPartiesRaw(countryId);
                
                // Collect all parties from raw response (before filtering)
                let partiesArray = [];
                if (Array.isArray(response)) {
                  partiesArray = response;
                } else if (response && Array.isArray(response.data)) {
                  partiesArray = response.data;
                }
                
                // Add all parties to map (keyed by party_id to avoid duplicates)
                partiesArray.forEach(p => {
                  if (p) {
                    const pId = p.id || p.party_id;
                    if (pId && !allPartiesMap.has(pId)) {
                      allPartiesMap.set(pId, p);
                    }
                  }
                });
              } catch (err) {
                console.warn(`[Cart] Failed to fetch parties for country ${country.id}:`, err);
              }
            }
            
            // Now search through all collected parties (without country filtering)
            const allParties = Array.from(allPartiesMap.values());
            console.log(`[Cart] Collected ${allParties.length} unique parties from all countries`);
            
            const partyData = allParties.find(p => {
              const partyPhone = normalizePhone(p.phone || p.phoneNumber);
              return partyPhone && partyPhone === userPhone;
            });
            
            if (partyData) {
              partyId = partyData.id || partyData.party_id || null;
              // Get distributor_id from party data first
              let partyDistributorId = partyData?.distributor_id || 
                             partyData?.distributorId || 
                             partyData?.distributor?.distributor_id || 
                             partyData?.distributor?.id ||
                             null;
              // Get zone_id from party data
              zoneId = partyData?.zone_id || partyData?.zoneId || null;
              
              if (partyId) {
                console.log('[Cart] Found party by phone:', partyId);
                console.log('[Cart] Found distributor_id from party:', partyDistributorId);
                console.log('[Cart] Found zone_id from party:', zoneId);
                
                // If distributor_id is not in party data, try to get full party details
                if (!partyDistributorId || !zoneId) {
                  try {
                    console.log('[Cart] Distributor ID or zone_id not found in party data, fetching full party details...');
                    const fullPartyData = await getPartyById(partyId);
                    if (fullPartyData) {
                      if (!partyDistributorId) {
                        partyDistributorId = fullPartyData?.distributor_id || 
                                           fullPartyData?.distributorId || 
                                           fullPartyData?.distributor?.distributor_id || 
                                           fullPartyData?.distributor?.id ||
                                           null;
                        console.log('[Cart] Found distributor_id from full party data:', partyDistributorId);
                      }
                      if (!zoneId) {
                        zoneId = fullPartyData?.zone_id || fullPartyData?.zoneId || null;
                        console.log('[Cart] Found zone_id from full party data:', zoneId);
                      }
                    }
                  } catch (err) {
                    console.warn('[Cart] Failed to fetch full party data:', err);
                  }
                }
              }
              
              // Always fetch all distributors to get distributor_id
              try {
                console.log('[Cart] Fetching all distributors...');
                const allDistributorsMap = new Map(); // Use Map to avoid duplicates
                
                // Get party's country_id to prioritize fetching distributors for that country
                const partyCountryId = partyData?.country_id || null;
                
                // Fetch distributors for all countries
                for (const country of countriesList) {
                  try {
                    const countryId = country.id || country.country_id;
                    if (!countryId) continue;
                    
                    const distributorsData = await getDistributors(countryId);
                    
                    // Add all distributors to map (keyed by distributor_id to avoid duplicates)
                    if (Array.isArray(distributorsData)) {
                      distributorsData.forEach(d => {
                        if (d) {
                          const dId = d.distributor_id || d.id;
                          if (dId && !allDistributorsMap.has(dId)) {
                            allDistributorsMap.set(dId, d);
                          }
                        }
                      });
                    }
                  } catch (err) {
                    console.warn(`[Cart] Failed to fetch distributors for country ${country.id}:`, err);
                  }
                }
                
                const allDistributors = Array.from(allDistributorsMap.values());
                console.log(`[Cart] Collected ${allDistributors.length} unique distributors from all countries`);
                
                // Find distributor by ID from party data
                if (partyDistributorId) {
                  const distributorData = allDistributors.find(d => {
                    const dId = d.distributor_id || d.id;
                    return dId && String(dId) === String(partyDistributorId);
                  });
                  
                  if (distributorData) {
                    distributorId = distributorData.distributor_id || distributorData.id || null;
                    console.log('[Cart] Found distributor_id from all distributors:', distributorId);
                  } else {
                    // If not found, use the one from party data
                    distributorId = partyDistributorId;
                    console.log('[Cart] Distributor not found in all distributors list, using party distributor_id:', distributorId);
                  }
                } else {
                  // If no distributor_id from party, find distributor by party's country
                  if (partyCountryId) {
                    // Filter distributors by party's country
                    const distributorsInPartyCountry = allDistributors.filter(d => {
                      const dCountryId = d.country_id || d.countryId;
                      return dCountryId && String(dCountryId) === String(partyCountryId);
                    });
                    
                    console.log(`[Cart] Found ${distributorsInPartyCountry.length} distributors in party's country`);
                    
                    if (distributorsInPartyCountry.length > 0) {
                      // Use the first distributor from the party's country
                      distributorId = distributorsInPartyCountry[0].distributor_id || distributorsInPartyCountry[0].id || null;
                      console.log('[Cart] Using distributor from party country:', distributorId);
                    } else {
                      console.warn('[Cart] No distributor found in party country, trying all distributors...');
                      // Fallback: use first distributor from all countries if none found in party country
                      if (allDistributors.length > 0) {
                        distributorId = allDistributors[0].distributor_id || allDistributors[0].id || null;
                        console.log('[Cart] Using first available distributor as fallback:', distributorId);
                      } else {
                        console.error('[Cart] No distributors found at all');
                      }
                    }
                  } else {
                    // If party has no country_id, use first available distributor
                    if (allDistributors.length > 0) {
                      distributorId = allDistributors[0].distributor_id || allDistributors[0].id || null;
                      console.log('[Cart] Party has no country_id, using first available distributor:', distributorId);
                    } else {
                      console.error('[Cart] No distributors found and party has no country_id');
                    }
                  }
                }
              } catch (err) {
                console.error('[Cart] Failed to fetch all distributors:', err);
                // Fallback to distributor_id from party data if available
                if (partyDistributorId) {
                  distributorId = partyDistributorId;
                }
              }
            }
          } catch (err) {
            console.error('[Cart] Failed to search for party:', err);
          }
        }
        
        if (!partyId) {
          console.error('[Cart] Party not found by phone number. User phone:', user?.phone);
          showError('Party not found. Please contact support.');
          setLoading(false);
          return;
        }
        
        orderData.party_id = partyId;
        
        if (distributorId) {
          orderData.distributor_id = distributorId;
          console.log('[Cart] Using Party ID:', partyId, 'Distributor ID:', distributorId);
        } else {
          console.error('[Cart] Distributor ID not found for party:', partyId);
          showError('Distributor ID is required for party orders. Please contact support.');
          setLoading(false);
          return;
        }
        
        // Add zone_id for party orders (required by backend)
        if (zoneId) {
          orderData.zone_id = zoneId;
          console.log('[Cart] Using Zone ID:', zoneId);
        } else {
          console.warn('[Cart] Zone ID not found for party:', partyId);
          // Zone ID might not be critical, but log warning
        }
      } else if (selectedParty) {
        orderData.party_id = selectedParty;
        
        // For salesman orders, fetch party data to get distributor_id
        // For distributor orders, distributor_id comes from logged-in user (handled below)
        if (isSalesman) {
          try {
            const partyData = await getPartyById(selectedParty);
            
            if (partyData) {
              // Get distributor_id from party data first
              const partyDistributorId = partyData?.distributor_id || 
                                   partyData?.distributorId || 
                                   partyData?.distributor?.distributor_id || 
                                   partyData?.distributor?.id ||
                                   null;
              
              // Fetch all distributors to get distributor_id
              if (partyDistributorId) {
                try {
                  console.log('[Cart] Fetching all distributors for selected party...');
                  // Fetch countries if not already available
                  let countriesList = countries;
                  if (!countriesList || countriesList.length === 0) {
                    countriesList = await getCountries();
                    setCountries(countriesList);
                  }
                  
                  const allDistributorsMap = new Map(); // Use Map to avoid duplicates
                  
                  // Fetch distributors for all countries
                  for (const country of countriesList) {
                    try {
                      const countryId = country.id || country.country_id;
                      if (!countryId) continue;
                      
                      const distributorsData = await getDistributors(countryId);
                      
                      // Add all distributors to map (keyed by distributor_id to avoid duplicates)
                      if (Array.isArray(distributorsData)) {
                        distributorsData.forEach(d => {
                          if (d) {
                            const dId = d.distributor_id || d.id;
                            if (dId && !allDistributorsMap.has(dId)) {
                              allDistributorsMap.set(dId, d);
                            }
                          }
                        });
                      }
                    } catch (err) {
                      console.warn(`[Cart] Failed to fetch distributors for country ${country.id}:`, err);
                    }
                  }
                  
                  const allDistributors = Array.from(allDistributorsMap.values());
                  console.log(`[Cart] Collected ${allDistributors.length} unique distributors from all countries`);
                  
                  // Find distributor by ID from party data
                  const distributorData = allDistributors.find(d => {
                    const dId = d.distributor_id || d.id;
                    return dId && String(dId) === String(partyDistributorId);
                  });
                  
                  if (distributorData) {
                    const distributorId = distributorData.distributor_id || distributorData.id || null;
                    orderData.distributor_id = distributorId;
                    console.log('[Cart] Found distributor_id from all distributors:', distributorId);
                  } else {
                    // If not found, use the one from party data
                    orderData.distributor_id = partyDistributorId;
                    console.log('[Cart] Distributor not found in all distributors list, using party distributor_id:', partyDistributorId);
                  }
                } catch (err) {
                  console.warn('[Cart] Failed to fetch all distributors:', err);
                  // Fallback to distributor_id from party data
                  if (partyDistributorId) {
                    orderData.distributor_id = partyDistributorId;
                    console.log('[Cart] Using distributor_id from party data:', partyDistributorId);
                  }
                }
              }
            }
          } catch (err) {
            console.warn('[Cart] Failed to fetch party data for distributor_id:', err);
            // Continue without distributor_id - not critical
          }
        }
        // For distributor orders, party_id is set above, but distributor_id will be set from logged-in user below
      }

      // Set distributor_id for distributor role (from user object)
      // For distributor orders, distributor_id MUST come from the logged-in distributor user
      if (isDistributor) {
        const userDistributorId = user?.distributor_id || 
                                   user?.distributorId || 
                                   user?.distributor?.distributor_id || 
                                   user?.distributor?.id ||
                                   user?.id || // Sometimes user.id is the distributor_id
                                   null;
        
        if (userDistributorId) {
          // Always use the distributor_id from the logged-in user for distributor orders
          // Don't let party selection override this
          orderData.distributor_id = userDistributorId;
          console.log('[Cart] Using distributor_id from logged-in distributor user:', userDistributorId);
        } else {
          console.error('[Cart] Distributor ID not found in user object:', user);
          showError('Distributor ID is required. Please contact support.');
          setLoading(false);
          return;
        }
      }

      // Set salesman_id
      if (isSalesman && user?.salesman_id) {
        orderData.salesman_id = user.salesman_id;
      }

      // Set event_id
      if (isSalesman && orderType === 'event_order' && selectedEvent) {
        orderData.event_id = selectedEvent;
      }

      // Format order_date to match backend format (YYYY-MM-DDTHH:mm:ss)
      const orderDate = new Date(orderData.order_date);
      const formattedDate = orderDate.toISOString().split('.')[0]; // Remove milliseconds
      orderData.order_date = formattedDate;

      // Add optional order_notes
      orderData.order_notes = orderData.order_notes || 'Order placed from cart';

      console.log('[Cart] Creating order with data:', orderData);

      // Create order via API
      const createdOrder = await createOrder(orderData);
      
      console.log('[Cart] Order created successfully:', createdOrder);
      
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
