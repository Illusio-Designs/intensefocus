import React, { useMemo, useState, useEffect, useCallback } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';
import { 
  getOrders, 
  createOrder, 
  updateOrderStatus, 
  deleteOrder,
  getParties,
  getDistributors,
  getSalesmen,
  getEvents,
  getProducts,
  getCountries
} from '../services/apiService';
import { showSuccess, showError } from '../services/notificationService';
import { getUserRole, getUser } from '../services/authService';
import '../styles/pages/dashboard-orders.css';

// Map API status to UI status
const mapApiStatusToUI = (apiStatus) => {
  const statusMap = {
    'pending': 'PENDING',
    'processed': 'PROCESSING',
    'hold_by_tray': 'HOLD BY TREY',
    'partially_dispatched': 'PARTIALLY DISPATCH',
    'dispatched': 'DISPATCH',
    'completed': 'COMPLETED',
    'cancelled': 'CANCEL'
  };
  return statusMap[apiStatus?.toLowerCase()] || apiStatus?.toUpperCase() || 'PENDING';
};

// Map UI tab to API status
const mapUITabToApiStatus = (tab) => {
  const tabMap = {
    'Pending': 'pending',
    'Processing': 'processed',
    'Hold by Trey': 'hold_by_tray',
    'Partially Dispatch': 'partially_dispatched',
    'Dispatch': 'dispatched',
    'Completed': 'completed',
    'Cancel': 'cancelled'
  };
  return tabMap[tab];
};

const DashboardOrders = () => {
  const [editRow, setEditRow] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [dateRange, setDateRange] = useState('Feb 24, 2023 - Mar 15, 2023');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userRole = getUserRole();
  const user = getUser();
  const isAdmin = userRole === 'admin';
  const isDistributor = userRole === 'distributor';
  const isParty = userRole === 'party';
  const isSalesman = userRole === 'salesman';
  
  // Dropdown data
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [allParties, setAllParties] = useState([]); // Store all parties fetched from API
  const [parties, setParties] = useState([]); // Filtered parties to display
  const [distributors, setDistributors] = useState([]);
  const [salesmen, setSalesmen] = useState([]);
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Create order form data
  // Auto-set order_type based on role
  // Distributor can select order type, but defaults to distributor_order
  const getInitialOrderType = () => {
    if (isParty) return 'party_order';
    // Distributor can select, but default is distributor_order
    if (isDistributor) return 'distributor_order';
    return '';
  };

  const [createFormData, setCreateFormData] = useState({
    order_type: getInitialOrderType(),
    party_id: '',
    distributor_id: '',
    salesman_id: '',
    event_id: '',
    order_items: [{ product_id: '', quantity: 1, price: 0 }],
    order_notes: ''
  });

  // Fetch orders from API
  const fetchOrders = async (suppressError = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrders();
      let allOrders = Array.isArray(response) ? response : [];
      
      // Filter orders based on role - only show orders created by the logged-in user
      if (isDistributor && user?.distributor_id) {
        // Filter orders for this distributor
        const distributorId = String(user.distributor_id).trim();
        allOrders = allOrders.filter(order => {
          const orderDistributorId = order.distributor_id || order.distributor?.distributor_id || order.distributor?.id;
          return orderDistributorId && String(orderDistributorId).trim() === distributorId;
        });
        console.log('[fetchOrders] Filtered orders for distributor:', distributorId, 'Total:', allOrders.length);
      } else if (isParty && user?.party_id) {
        // Filter orders for this party
        const partyId = String(user.party_id).trim();
        allOrders = allOrders.filter(order => {
          const orderPartyId = order.party_id || order.party?.party_id || order.party?.id;
          return orderPartyId && String(orderPartyId).trim() === partyId;
        });
        console.log('[fetchOrders] Filtered orders for party:', partyId, 'Total:', allOrders.length);
      } else if (isSalesman && user?.salesman_id) {
        // Filter orders for this salesman
        const salesmanId = String(user.salesman_id).trim();
        allOrders = allOrders.filter(order => {
          const orderSalesmanId = order.salesman_id || order.salesman?.salesman_id || order.salesman?.id;
          return orderSalesmanId && String(orderSalesmanId).trim() === salesmanId;
        });
        console.log('[fetchOrders] Filtered orders for salesman:', salesmanId, 'Total:', allOrders.length);
      }
      // Admin sees all orders (no filtering)
      
      setOrders(allOrders);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to fetch orders';
      const errorMessage = (message || '').toLowerCase();
      
      // Don't show error for "not found" cases - it's a valid empty state
      const isNotFoundError = errorMessage.includes('orders not found') ||
                             errorMessage.includes('no orders found') ||
                             errorMessage.includes('order not found') ||
                             err.statusCode === 404;
      
      if (isNotFoundError) {
        // Just set empty array, don't show error
        setOrders([]);
        setError(null);
      } else {
        // Only show error if not suppressed and not a "not found" error
        setError(message);
        if (!suppressError) {
          showError(message);
        }
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
    fetchInitialData();
  }, []);

  // Fetch initial data for dropdowns
  const fetchInitialData = async () => {
    try {
      const [countriesData, productsData] = await Promise.all([
        getCountries(),
        getProducts()
      ]);
      setCountries(countriesData || []);
      setProducts(productsData || []);
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    }
  };

  // Fetch events only when event_order is selected
  const fetchEvents = useCallback(async () => {
    try {
      const eventsData = await getEvents();
      setEvents(eventsData || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setEvents([]);
    }
  }, []);

  // Fetch events when event_order is selected
  useEffect(() => {
    if (createFormData.order_type === 'event_order' && events.length === 0) {
      fetchEvents();
    }
  }, [createFormData.order_type, events.length, fetchEvents]);

  // Filter parties based on salesman zone and order type
  const filterPartiesByZone = useCallback((partiesList, orderType) => {
    if (!isSalesman || !user?.zone_preference) {
      // Not a salesman or no zone preference, show all parties
      setParties(partiesList);
      return;
    }

    const salesmanZone = String(user.zone_preference).trim();
    
    // For event_order, show all parties regardless of zone
    if (orderType === 'event_order') {
      setParties(partiesList);
      return;
    }

    // For visit_order and whatsapp_order, filter by zone
    if (orderType === 'visit_order' || orderType === 'whatsapp_order') {
      const filteredParties = partiesList.filter(party => {
        const partyZoneId = party.zone_id || party.zoneId;
        if (!partyZoneId) return false;
        return String(partyZoneId).trim() === salesmanZone;
      });
      console.log('[filterPartiesByZone] Filtered parties for zone:', salesmanZone, 'Order type:', orderType, 'Total:', partiesList.length, 'Filtered:', filteredParties.length);
      setParties(filteredParties);
      return;
    }

    // For other order types, show all parties
    setParties(partiesList);
  }, [isSalesman, user]);

  // Fetch parties when country is selected
  const fetchPartiesForCountry = useCallback(async (countryId) => {
    if (!countryId) {
      setAllParties([]);
      setParties([]);
      return;
    }
    
    try {
      const cleanCountryId = String(countryId).trim();
      if (!cleanCountryId || cleanCountryId === 'undefined' || cleanCountryId === 'null') {
        console.error('[fetchPartiesForCountry] Invalid country ID:', countryId);
        setAllParties([]);
        setParties([]);
        return;
      }
      
      console.log('[fetchPartiesForCountry] Fetching parties for country:', cleanCountryId);
      const partiesData = await getParties(cleanCountryId);
      console.log('[fetchPartiesForCountry] Received', partiesData?.length || 0, 'parties');
      setAllParties(partiesData || []);
      // Apply filtering based on order type and salesman zone
      filterPartiesByZone(partiesData || [], createFormData.order_type);
    } catch (err) {
      console.error('Failed to fetch parties:', err);
      setAllParties([]);
      setParties([]);
    }
  }, [filterPartiesByZone, createFormData.order_type]);

  // Fetch distributors when country is selected
  const fetchDistributorsForCountry = useCallback(async (countryId) => {
    if (!countryId) {
      setDistributors([]);
      return;
    }
    
    try {
      const cleanCountryId = String(countryId).trim();
      if (!cleanCountryId || cleanCountryId === 'undefined' || cleanCountryId === 'null') {
        console.error('[fetchDistributorsForCountry] Invalid country ID:', countryId);
        setDistributors([]);
        return;
      }
      
      console.log('[fetchDistributorsForCountry] Fetching distributors for country:', cleanCountryId);
      const distributorsData = await getDistributors(cleanCountryId);
      console.log('[fetchDistributorsForCountry] Received', distributorsData?.length || 0, 'distributors');
      setDistributors(distributorsData || []);
    } catch (err) {
      console.error('Failed to fetch distributors:', err);
      setDistributors([]);
    }
  }, []);

  // Fetch salesmen when country is selected
  const fetchSalesmenForCountry = useCallback(async (countryId) => {
    if (!countryId) {
      setSalesmen([]);
      return;
    }
    
    try {
      const cleanCountryId = String(countryId).trim();
      if (!cleanCountryId || cleanCountryId === 'undefined' || cleanCountryId === 'null') {
        console.error('[fetchSalesmenForCountry] Invalid country ID:', countryId);
        setSalesmen([]);
        return;
      }
      
      console.log('[fetchSalesmenForCountry] Fetching salesmen for country:', cleanCountryId);
      const salesmenData = await getSalesmen(cleanCountryId);
      console.log('[fetchSalesmenForCountry] Received', salesmenData?.length || 0, 'salesmen');
      setSalesmen(salesmenData || []);
    } catch (err) {
      console.error('Failed to fetch salesmen:', err);
      setSalesmen([]);
    }
  }, []);

  // Apply filtering when order type changes (for salesman)
  useEffect(() => {
    if (isSalesman && allParties.length > 0) {
      filterPartiesByZone(allParties, createFormData.order_type);
    }
  }, [createFormData.order_type, isSalesman, allParties, filterPartiesByZone]);

  // Fetch parties when country is selected
  useEffect(() => {
    if (selectedCountry) {
      fetchPartiesForCountry(selectedCountry);
    } else {
      setAllParties([]);
      setParties([]);
    }
  }, [selectedCountry, fetchPartiesForCountry]);

  // Fetch distributors when country is selected
  useEffect(() => {
    if (selectedCountry) {
      fetchDistributorsForCountry(selectedCountry);
    } else {
      setDistributors([]);
    }
  }, [selectedCountry, fetchDistributorsForCountry]);

  // Fetch salesmen when country is selected
  useEffect(() => {
    if (selectedCountry) {
      fetchSalesmenForCountry(selectedCountry);
    } else {
      setSalesmen([]);
    }
  }, [selectedCountry, fetchSalesmenForCountry]);

  // Transform orders data to table rows
  const rows = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const tableRows = [];
    orders.forEach(order => {
      const orderId = order.order_id || order.id;
      const partyName = order.party?.party_name || order.party_name || 'N/A';
      const orderStatus = mapApiStatusToUI(order.order_status);
      
      // Ensure orderItems is always an array
      let orderItems = order.order_items;
      if (!Array.isArray(orderItems)) {
        // If it's not an array, try to convert it or default to empty array
        if (orderItems && typeof orderItems === 'object') {
          // If it's an object, try to get values or wrap in array
          orderItems = Object.values(orderItems);
        } else {
          orderItems = [];
        }
      }

      if (orderItems.length === 0) {
        // If no items, create a single row for the order
        const totalValue = order.total_value || order.total_amount || 0;
        tableRows.push({
          id: orderId,
          orderId: `#${orderId?.toString().slice(-6) || 'N/A'}`,
          client: partyName,
          product: 'No items',
          qty: 0,
          status: orderStatus,
          value: `₹${totalValue.toLocaleString('en-IN')}`,
          originalOrder: order
        });
      } else {
        // Create a row for each order item
        orderItems.forEach((item, index) => {
          const productName = item.product?.model_no || item.product_name || 'Unknown Product';
          const quantity = item.quantity || 0;
          const price = item.price || 0;
          const itemValue = quantity * price;

          tableRows.push({
            id: `${orderId}-${index}`,
            orderId: `#${orderId?.toString().slice(-6) || 'N/A'}`,
            client: partyName,
            product: productName,
            qty: quantity,
            status: orderStatus,
            value: `₹${itemValue.toLocaleString('en-IN')}`,
            originalOrder: order,
            orderItem: item
          });
        });
      }
    });

    return tableRows;
  }, [orders]);

  // Filter rows by active tab
  const filteredRowsByTab = useMemo(() => {
    if (activeTab === 'All') return rows;
    const apiStatus = mapUITabToApiStatus(activeTab);
    if (!apiStatus) return rows;
    
    return rows.filter(row => {
      const rowStatus = row.originalOrder?.order_status?.toLowerCase();
      return rowStatus === apiStatus;
    });
  }, [rows, activeTab]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.order_status?.toLowerCase() === 'pending').length;
    const completedOrders = orders.filter(o => o.order_status?.toLowerCase() === 'completed');
    const completedValue = completedOrders.reduce((sum, o) => {
      return sum + (o.total_value || o.total_amount || 0);
    }, 0);
    const totalRevenue = orders.reduce((sum, o) => {
      return sum + (o.total_value || o.total_amount || 0);
    }, 0);

    // Count by order type
    const retailOrders = orders.filter(o => o.order_type?.includes('retail') || o.order_type === 'retail_order').length;
    const bulkOrders = orders.filter(o => o.order_type?.includes('bulk') || o.order_type === 'bulk_order').length;

    return {
      totalOrders,
      pendingOrders,
      completedValue,
      totalRevenue,
      retailOrders,
      bulkOrders
    };
  }, [orders]);

  // Handle delete order
  const handleDelete = async (row) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      setLoading(true);
      const orderId = row.originalOrder?.order_id || row.originalOrder?.id;
      if (!orderId) {
        showError('Order ID not found');
        return;
      }

      await deleteOrder(orderId);
      showSuccess('Order deleted successfully');
      await fetchOrders();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to delete order';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle update order status
  const handleUpdateStatus = async (row, newStatus) => {
    try {
      setLoading(true);
      const orderId = row.originalOrder?.order_id || row.originalOrder?.id;
      if (!orderId) {
        showError('Order ID not found');
        return;
      }

      // Map UI status back to API status
      const statusMap = {
        'PENDING': 'pending',
        'PROCESSING': 'processed',
        'HOLD BY TREY': 'hold_by_tray',
        'PARTIALLY DISPATCH': 'partially_dispatched',
        'DISPATCH': 'dispatched',
        'COMPLETED': 'completed',
        'CANCEL': 'cancelled'
      };

      const apiStatus = statusMap[newStatus] || newStatus.toLowerCase();
      await updateOrderStatus(orderId, { order_status: apiStatus });
      showSuccess('Order status updated successfully');
      await fetchOrders();
      setEditRow(null);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to update order status';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle create order
  const handleCreateOrder = async () => {
    try {
      // Order type validation
      // Admin doesn't need order type
      // Distributor can select or defaults to distributor_order
      // Party auto-sets to party_order
      // Salesman must select order type
      if (!isAdmin && !isDistributor && !isParty && !createFormData.order_type) {
        showError('Order type is required');
        return;
      }
      
      // For distributor, if no order type selected, default to distributor_order
      if (isDistributor && !createFormData.order_type) {
        createFormData.order_type = 'distributor_order';
      }
      if (createFormData.order_items.length === 0 || 
          createFormData.order_items.some(item => !item.product_id || !item.quantity || !item.price)) {
        showError('Please add at least one valid order item');
        return;
      }

      // Validate conditional fields based on order type
      const orderType = createFormData.order_type;
      
      // Skip validation for distributor and party roles (they auto-set their IDs)
      // Salesman auto-sets their ID, but still needs party and distributor for their order types
      if (!isDistributor && !isParty) {
        if (['event_order', 'party_order', 'visit_order', 'whatsapp_order'].includes(orderType) && !createFormData.party_id) {
          showError('Party is required for this order type');
          return;
        }
        if (['event_order', 'party_order', 'distributor_order', 'visit_order', 'whatsapp_order'].includes(orderType) && !createFormData.distributor_id) {
          showError('Distributor is required for this order type');
          return;
        }
        // Salesman ID is auto-set for salesman role, but still validate for other roles
        if (!isSalesman && ['event_order', 'visit_order', 'whatsapp_order'].includes(orderType) && !createFormData.salesman_id) {
          showError('Salesman is required for this order type');
          return;
        }
        if (orderType === 'event_order' && !createFormData.event_id) {
          showError('Event is required for event orders');
          return;
        }
      }

      setLoading(true);
      
      // Prepare order data - order_date is automatically set to current date/time
      const orderData = {
        order_date: new Date().toISOString(),
        order_items: createFormData.order_items.map(item => ({
          product_id: item.product_id,
          quantity: Number(item.quantity),
          price: Number(item.price)
        }))
      };
      
      // Include order_type
      // For distributor, if not selected, default to distributor_order
      const finalOrderType = createFormData.order_type || (isDistributor ? 'distributor_order' : '');
      if (finalOrderType) {
        orderData.order_type = finalOrderType;
      }

      // Auto-set distributor_id for distributor role
      if (isDistributor && user?.distributor_id) {
        orderData.distributor_id = user.distributor_id;
      } else if (createFormData.distributor_id) {
        orderData.distributor_id = createFormData.distributor_id;
      }

      // Auto-set party_id for party role
      if (isParty && user?.party_id) {
        orderData.party_id = user.party_id;
      } else if (createFormData.party_id) {
        orderData.party_id = createFormData.party_id;
      }

      // Auto-set salesman_id for salesman role
      if (isSalesman && user?.salesman_id) {
        orderData.salesman_id = user.salesman_id;
      } else if (createFormData.salesman_id) {
        orderData.salesman_id = createFormData.salesman_id;
      }
      if (createFormData.event_id) orderData.event_id = createFormData.event_id;
      if (createFormData.order_notes) orderData.order_notes = createFormData.order_notes;

      await createOrder(orderData);
      showSuccess('Order created successfully');
      setCreateModalOpen(false);
      resetCreateForm();
      // Suppress error notification when refreshing after create (in case of temporary "not found")
      await fetchOrders(true);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to create order';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  // Reset create form
  const resetCreateForm = () => {
    setCreateFormData({
      order_type: getInitialOrderType(),
      party_id: '',
      distributor_id: '',
      salesman_id: '',
      event_id: '',
      order_items: [{ product_id: '', quantity: 1, price: 0 }],
      order_notes: ''
    });
    setSelectedCountry(null);
  };

  // Add order item
  const addOrderItem = () => {
    setCreateFormData(prev => ({
      ...prev,
      order_items: [...prev.order_items, { product_id: '', quantity: 1, price: 0 }]
    }));
  };

  // Remove order item
  const removeOrderItem = (index) => {
    setCreateFormData(prev => ({
      ...prev,
      order_items: prev.order_items.filter((_, i) => i !== index)
    }));
  };

  // Update order item
  const updateOrderItem = (index, field, value) => {
    setCreateFormData(prev => ({
      ...prev,
      order_items: prev.order_items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Get product price when product is selected
  const handleProductSelect = (itemIndex, productId) => {
    const product = products.find(p => (p.product_id || p.id) === productId);
    if (product) {
      const price = product.price || product.selling_price || 0;
      updateOrderItem(itemIndex, 'product_id', productId);
      updateOrderItem(itemIndex, 'price', price);
    } else {
      updateOrderItem(itemIndex, 'product_id', productId);
    }
  };

  // Check if field is required based on order type
  const isFieldRequired = (field) => {
    const orderType = createFormData.order_type;
    switch (field) {
      case 'party_id':
        return ['event_order', 'party_order', 'visit_order', 'whatsapp_order'].includes(orderType);
      case 'distributor_id':
        return ['event_order', 'party_order', 'distributor_order', 'visit_order', 'whatsapp_order'].includes(orderType);
      case 'salesman_id':
        return ['event_order', 'visit_order', 'whatsapp_order'].includes(orderType);
      case 'event_id':
        return orderType === 'event_order';
      default:
        return false;
    }
  };

  const columns = useMemo(() => ([
    { key: 'orderId', label: 'ORDER ID' },
    { key: 'client', label: 'CLIENT NAME' },
    { key: 'product', label: 'PRODUCT' },
    { key: 'qty', label: 'QTY' },
    { key: 'status', label: 'STATUS', render: (v) => <StatusBadge status={String(v).toLowerCase().replace(/\s+/g, '-')}>{v}</StatusBadge> },
    { key: 'value', label: 'VALUE' },
    { key: 'action', label: 'ACTION', render: (_v, row) => (
      <RowActions 
        onView={() => console.log('view', row)} 
        onEdit={() => setEditRow(row)} 
        onDownload={() => console.log('download', row)} 
        onDelete={() => handleDelete(row)} 
      />
    ) },
  ]), []);

  return (
    <div className="dash-page">
      <div className="dash-container">
        {/* Summary Cards */}
        <div className="dash-row orders-summary">
          <div className="dash-card metric orders-card">
            <h4>Total Orders</h4>
            <div className="metric-value">{loading ? 'Loading...' : `${summaryStats.totalOrders} Orders`}</div>
            <div className="metric-sub">Retail {summaryStats.retailOrders} | Bulk {summaryStats.bulkOrders}</div>
          </div>
          <div className="dash-card metric orders-card">
            <h4>Pending Orders</h4>
            <div className="metric-value">{loading ? 'Loading...' : summaryStats.pendingOrders}</div>
            <div className="metric-sub green">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              12% vs last month
            </div>
          </div>
          <div className="dash-card metric orders-card">
            <h4>Completed Orders</h4>
            <div className="metric-value">{loading ? 'Loading...' : `₹${summaryStats.completedValue.toLocaleString('en-IN')}`}</div>
            <div className="metric-sub red">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              10% vs last month
            </div>
          </div>
          <div className="dash-card metric orders-card">
            <h4>Total Revenue</h4>
            <div className="metric-value">{loading ? 'Loading...' : `₹${summaryStats.totalRevenue.toLocaleString('en-IN')}`}</div>
            <div className="metric-sub green">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              12% vs last month
            </div>
          </div>
        </div>

        {/* Order Status Tabs */}
        <div className="dash-row">
          <div className="order-tabs-container">
            {['All', 'Pending', 'Processing', 'Hold by Trey', 'Partially Dispatch', 'Dispatch', 'Completed', 'Cancel'].map(tab => (
              <button
                key={tab}
                className={`order-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Order Overview Table */}
        <div className="dash-row">
          <div className="dash-card full">
            <TableWithControls
              title="Order Overview"
              columns={columns}
              rows={filteredRowsByTab}
              onAddNew={() => setCreateModalOpen(true)}
              addNewText="Create Order"
              onImport={() => console.log('import orders')}
              importText="Import All Orders Data"
              dateRange={dateRange}
              onDateChange={setDateRange}
              itemName="Order"
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Edit Order Status Modal */}
      <Modal open={!!editRow} onClose={() => setEditRow(null)} title="Edit Order Status" footer={(
        <>
          <Button variant="secondary" onClick={() => setEditRow(null)} disabled={loading}>Cancel</Button>
          <Button 
            onClick={() => {
              const selectElement = document.getElementById('edit-order-status');
              const newStatus = selectElement?.value;
              if (newStatus && editRow) {
                handleUpdateStatus(editRow, newStatus);
              }
            }} 
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </>
      )}>
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Order ID</label>
            <input className="ui-input" value={editRow?.orderId || ''} disabled />
          </div>
          <div className="form-group">
            <label className="ui-label">Client</label>
            <input className="ui-input" value={editRow?.client || ''} disabled />
          </div>
          <div className="form-group">
            <label className="ui-label">Product</label>
            <input className="ui-input" value={editRow?.product || ''} disabled />
          </div>
          <div className="form-group">
            <label className="ui-label">Quantity</label>
            <input type="number" className="ui-input" value={editRow?.qty || ''} disabled />
          </div>
          <div className="form-group">
            <label className="ui-label">Status</label>
            <select 
              id="edit-order-status"
              className="ui-select" 
              defaultValue={editRow?.status || 'PENDING'}
            >
              <option value="PENDING">PENDING</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="HOLD BY TREY">HOLD BY TREY</option>
              <option value="PARTIALLY DISPATCH">PARTIALLY DISPATCH</option>
              <option value="DISPATCH">DISPATCH</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCEL">CANCEL</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Create Order Modal */}
      <Modal 
        open={createModalOpen} 
        onClose={() => {
          setCreateModalOpen(false);
          resetCreateForm();
        }} 
        title="Create New Order"
        footer={(
          <>
            <Button 
              variant="secondary" 
              onClick={() => {
                setCreateModalOpen(false);
                resetCreateForm();
              }} 
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateOrder} 
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Order'}
            </Button>
          </>
        )}
      >
        <div className="ui-form" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Order Type - Hidden for admin and party roles */}
          {/* Salesman and Distributor can see order type dropdown */}
          {!isAdmin && !isParty && (
            <div className="form-group">
              <label className="ui-label">
                Order Type 
                {!isDistributor && <span style={{ color: 'red' }}>*</span>}
                {isDistributor && <span style={{ color: '#666', fontSize: '12px' }}> (Default: Distributor Order)</span>}
              </label>
              <select 
                className="ui-select"
                value={createFormData.order_type}
                onChange={(e) => {
                  const newOrderType = e.target.value;
                  setCreateFormData(prev => ({ 
                    ...prev, 
                    order_type: newOrderType,
                    party_id: '',
                    distributor_id: '',
                    salesman_id: '',
                    event_id: ''
                  }));
                  // Re-filter parties when order type changes (for salesman)
                  if (isSalesman && allParties.length > 0) {
                    filterPartiesByZone(allParties, newOrderType);
                  }
                }}
                required={!isDistributor}
              >
                <option value="">Select Order Type</option>
                {isSalesman ? (
                  // Salesman can only create these 3 order types
                  <>
                    <option value="visit_order">Visit Order</option>
                    <option value="whatsapp_order">WhatsApp Order</option>
                    <option value="event_order">Event Order</option>
                  </>
                ) : isDistributor ? (
                  // Distributor can create distributor_order or party_order
                  <>
                    <option value="distributor_order">Distributor Order</option>
                    <option value="party_order">Party Order</option>
                  </>
                ) : (
                  // Other roles see all order types
                  <>
                    <option value="event_order">Event Order</option>
                    <option value="party_order">Party Order</option>
                    <option value="distributor_order">Distributor Order</option>
                    <option value="visit_order">Visit Order</option>
                    <option value="whatsapp_order">WhatsApp Order</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* Country Selection (for fetching parties, distributors, salesmen) */}
          <div className="form-group">
            <label className="ui-label">Country</label>
            <select 
              className="ui-select"
              value={selectedCountry || ''}
              onChange={(e) => setSelectedCountry(e.target.value || null)}
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country.id || country.country_id} value={country.id || country.country_id}>
                  {country.country_name || country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Party ID - Conditional */}
          {(isFieldRequired('party_id') || createFormData.party_id) && (
            <div className="form-group">
              <label className="ui-label">
                Party {isFieldRequired('party_id') && <span style={{ color: 'red' }}>*</span>}
              </label>
              <select 
                className="ui-select"
                value={createFormData.party_id}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, party_id: e.target.value }))}
                required={isFieldRequired('party_id')}
                disabled={!selectedCountry}
              >
                <option value="">Select Party</option>
                {!selectedCountry ? (
                  <option value="" disabled>Please select a country first</option>
                ) : parties.length === 0 ? (
                  <option value="" disabled>No parties found for this country</option>
                ) : (
                  parties.map(party => (
                    <option key={party.id || party.party_id} value={party.id || party.party_id}>
                      {party.party_name}
                    </option>
                  ))
                )}
              </select>
              {!selectedCountry && (
                <small style={{ color: '#666', fontSize: '12px' }}>Please select a country first</small>
              )}
              {selectedCountry && parties.length === 0 && allParties.length > 0 && isSalesman && (createFormData.order_type === 'visit_order' || createFormData.order_type === 'whatsapp_order') && (
                <small style={{ color: '#666', fontSize: '12px' }}>No parties found in your zone for this order type</small>
              )}
              {selectedCountry && parties.length === 0 && allParties.length === 0 && (
                <small style={{ color: '#666', fontSize: '12px' }}>No parties available for this country</small>
              )}
              {selectedCountry && parties.length > 0 && isSalesman && (createFormData.order_type === 'visit_order' || createFormData.order_type === 'whatsapp_order') && (
                <small style={{ color: '#666', fontSize: '12px' }}>Showing parties from your zone only</small>
              )}
              {selectedCountry && parties.length > 0 && isSalesman && createFormData.order_type === 'event_order' && (
                <small style={{ color: '#666', fontSize: '12px' }}>Showing all parties for event orders</small>
              )}
            </div>
          )}

          {/* Distributor ID - Conditional */}
          {(isFieldRequired('distributor_id') || createFormData.distributor_id) && (
            <div className="form-group">
              <label className="ui-label">
                Distributor {isFieldRequired('distributor_id') && <span style={{ color: 'red' }}>*</span>}
              </label>
              <select 
                className="ui-select"
                value={createFormData.distributor_id}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, distributor_id: e.target.value }))}
                required={isFieldRequired('distributor_id')}
                disabled={!selectedCountry}
              >
                <option value="">Select Distributor</option>
                {!selectedCountry ? (
                  <option value="" disabled>Please select a country first</option>
                ) : distributors.length === 0 ? (
                  <option value="" disabled>No distributors found for this country</option>
                ) : (
                  distributors.map(distributor => (
                    <option key={distributor.id || distributor.distributor_id} value={distributor.id || distributor.distributor_id}>
                      {distributor.distributor_name || distributor.name}
                    </option>
                  ))
                )}
              </select>
              {!selectedCountry && (
                <small style={{ color: '#666', fontSize: '12px' }}>Please select a country first</small>
              )}
              {selectedCountry && distributors.length === 0 && (
                <small style={{ color: '#666', fontSize: '12px' }}>No distributors available for this country</small>
              )}
            </div>
          )}

          {/* Salesman ID - Conditional - Hidden for salesman role (auto-set) */}
          {!isSalesman && (isFieldRequired('salesman_id') || createFormData.salesman_id) && (
            <div className="form-group">
              <label className="ui-label">
                Salesman {isFieldRequired('salesman_id') && <span style={{ color: 'red' }}>*</span>}
              </label>
              <select 
                className="ui-select"
                value={createFormData.salesman_id}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, salesman_id: e.target.value }))}
                required={isFieldRequired('salesman_id')}
                disabled={!selectedCountry}
              >
                <option value="">Select Salesman</option>
                {!selectedCountry ? (
                  <option value="" disabled>Please select a country first</option>
                ) : salesmen.length === 0 ? (
                  <option value="" disabled>No salesmen found for this country</option>
                ) : (
                  salesmen.map(salesman => (
                    <option key={salesman.id || salesman.salesman_id} value={salesman.id || salesman.salesman_id}>
                      {salesman.salesman_name || salesman.name}
                    </option>
                  ))
                )}
              </select>
              {!selectedCountry && (
                <small style={{ color: '#666', fontSize: '12px' }}>Please select a country first</small>
              )}
              {selectedCountry && salesmen.length === 0 && (
                <small style={{ color: '#666', fontSize: '12px' }}>No salesmen available for this country</small>
              )}
            </div>
          )}

          {/* Event ID - Conditional - Only for event_order */}
          {createFormData.order_type === 'event_order' && (
            <div className="form-group">
              <label className="ui-label">
                Event <span style={{ color: 'red' }}>*</span>
              </label>
              <select 
                className="ui-select"
                value={createFormData.event_id}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, event_id: e.target.value }))}
                required
              >
                <option value="">Select Event</option>
                {events.length === 0 ? (
                  <option value="" disabled>Loading events...</option>
                ) : (
                  events.map(event => (
                    <option key={event.id || event.event_id} value={event.id || event.event_id}>
                      {event.event_name} {event.event_date ? `(${new Date(event.event_date).toLocaleDateString()})` : ''}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          {/* Order Items */}
          <div className="form-group">
            <label className="ui-label">
              Order Items <span style={{ color: 'red' }}>*</span>
            </label>
            <div style={{ border: '1px solid #E0E0E0', borderRadius: '8px', padding: '16px' }}>
              {createFormData.order_items.map((item, index) => (
                <div key={index} style={{ 
                  marginBottom: index < createFormData.order_items.length - 1 ? '16px' : 0,
                  paddingBottom: index < createFormData.order_items.length - 1 ? '16px' : 0,
                  borderBottom: index < createFormData.order_items.length - 1 ? '1px solid #E0E0E0' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong>Item {index + 1}</strong>
                    {createFormData.order_items.length > 1 && (
                      <Button 
                        variant="secondary" 
                        onClick={() => removeOrderItem(index)}
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Product</label>
                      <select 
                        className="ui-select"
                        value={item.product_id}
                        onChange={(e) => handleProductSelect(index, e.target.value)}
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map(product => (
                          <option key={product.id || product.product_id} value={product.id || product.product_id}>
                            {product.model_no || product.product_name || product.name} 
                            {product.price ? ` - ₹${product.price}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Quantity</label>
                      <input 
                        type="number"
                        className="ui-input"
                        value={item.quantity}
                        onChange={(e) => updateOrderItem(index, 'quantity', e.target.value)}
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Price</label>
                      <input 
                        type="number"
                        className="ui-input"
                        value={item.price}
                        onChange={(e) => updateOrderItem(index, 'price', e.target.value)}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="secondary" 
                onClick={addOrderItem}
                style={{ marginTop: '12px', width: '100%' }}
              >
                + Add Item
              </Button>
            </div>
          </div>

          {/* Order Notes */}
          <div className="form-group">
            <label className="ui-label">Order Notes</label>
            <textarea 
              className="ui-input"
              value={createFormData.order_notes}
              onChange={(e) => setCreateFormData(prev => ({ ...prev, order_notes: e.target.value }))}
              rows="3"
              placeholder="Optional notes about this order"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardOrders;

