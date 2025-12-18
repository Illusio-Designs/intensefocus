import React, { useMemo, useState, useEffect } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';
import { getOrders, updateOrderStatus, deleteOrder } from '../services/apiService';
import { showSuccess, showError } from '../services/notificationService';
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
  const [activeTab, setActiveTab] = useState('All');
  const [dateRange, setDateRange] = useState('Feb 24, 2023 - Mar 15, 2023');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrders();
      setOrders(Array.isArray(response) ? response : []);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to fetch orders';
      setError(message);
      showError(message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Transform orders data to table rows
  const rows = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const tableRows = [];
    orders.forEach(order => {
      const orderId = order.order_id || order.id;
      const partyName = order.party?.party_name || order.party_name || 'N/A';
      const orderStatus = mapApiStatusToUI(order.order_status);
      const orderItems = order.order_items || [];

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
            {loading && filteredRowsByTab.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>Loading orders...</div>
            ) : (
              <TableWithControls
                title="Order Overview"
                columns={columns}
                rows={filteredRowsByTab}
                onImport={() => console.log('import orders')}
                importText="Import All Orders Data"
                dateRange={dateRange}
                onDateChange={setDateRange}
                itemName="Order"
              />
            )}
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default DashboardOrders;

