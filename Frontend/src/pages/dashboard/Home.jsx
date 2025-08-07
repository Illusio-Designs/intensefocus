import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  People, 
  AttachMoney,
  Visibility,
  Star,
  LocalShipping,
  Assignment
} from '@mui/icons-material';
import '../../styles/pages/dashboard/Home.css';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setStats({
        totalSales: 1247,
        totalOrders: 89,
        totalCustomers: 156,
        totalRevenue: 45678
      });

      setRecentOrders([
        {
          id: 1,
          customer: 'John Doe',
          product: 'Classic Aviator Sunglasses',
          amount: 129.99,
          status: 'Delivered',
          date: '2024-01-15'
        },
        {
          id: 2,
          customer: 'Jane Smith',
          product: 'Modern Round Eyeglasses',
          amount: 89.99,
          status: 'Shipped',
          date: '2024-01-14'
        },
        {
          id: 3,
          customer: 'Mike Johnson',
          product: 'Sport Contact Lenses',
          amount: 49.99,
          status: 'Processing',
          date: '2024-01-13'
        },
        {
          id: 4,
          customer: 'Sarah Wilson',
          product: 'Designer Sunglasses',
          amount: 199.99,
          status: 'Delivered',
          date: '2024-01-12'
        }
      ]);

      setTopProducts([
        {
          id: 1,
          name: 'Classic Aviator Sunglasses',
          sales: 45,
          revenue: 5849.55,
          rating: 4.8
        },
        {
          id: 2,
          name: 'Modern Round Eyeglasses',
          sales: 38,
          revenue: 3419.62,
          rating: 4.6
        },
        {
          id: 3,
          name: 'Sport Contact Lenses',
          sales: 32,
          revenue: 1599.68,
          rating: 4.7
        },
        {
          id: 4,
          name: 'Designer Sunglasses',
          sales: 28,
          revenue: 5599.72,
          rating: 4.9
        }
      ]);
    };

    loadDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'status-delivered';
      case 'Shipped':
        return 'status-shipped';
      case 'Processing':
        return 'status-processing';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="dashboard-home">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1 className="welcome-title">Welcome back, Admin!</h1>
        <p className="welcome-subtitle">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon sales">
            <AttachMoney />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">₹{stats.totalRevenue.toLocaleString()}</h3>
            <p className="stat-label">Total Revenue</p>
            <div className="stat-change positive">
              <TrendingUp />
              <span>+12.5%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <ShoppingCart />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalOrders}</h3>
            <p className="stat-label">Total Orders</p>
            <div className="stat-change positive">
              <TrendingUp />
              <span>+8.2%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon customers">
            <People />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalCustomers}</h3>
            <p className="stat-label">Total Customers</p>
            <div className="stat-change positive">
              <TrendingUp />
              <span>+15.3%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon products">
            <Visibility />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalSales}</h3>
            <p className="stat-label">Products Sold</p>
            <div className="stat-change positive">
              <TrendingUp />
              <span>+6.7%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content-grid">
        {/* Recent Orders */}
        <div className="content-card orders-card">
          <div className="card-header">
            <h2 className="card-title">Recent Orders</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="orders-list">
            {recentOrders.map(order => (
              <div key={order.id} className="order-item">
                <div className="order-info">
                  <h4 className="order-customer">{order.customer}</h4>
                  <p className="order-product">{order.product}</p>
                  <span className="order-date">{order.date}</span>
                </div>
                <div className="order-details">
                  <span className="order-amount">₹{order.amount}</span>
                  <span className={`order-status ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="content-card products-card">
          <div className="card-header">
            <h2 className="card-title">Top Products</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="products-list">
            {topProducts.map(product => (
              <div key={product.id} className="product-item">
                <div className="product-info">
                  <h4 className="product-name">{product.name}</h4>
                  <div className="product-stats">
                    <span className="product-sales">{product.sales} sold</span>
                    <span className="product-rating">
                      <Star />
                      {product.rating}
                    </span>
                  </div>
                </div>
                <div className="product-revenue">
                  <span className="revenue-amount">₹{product.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="content-card actions-card">
          <div className="card-header">
            <h2 className="card-title">Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <button className="action-btn">
              <ShoppingCart />
              <span>Add New Product</span>
            </button>
            <button className="action-btn">
              <Assignment />
              <span>View Reports</span>
            </button>
            <button className="action-btn">
              <LocalShipping />
              <span>Manage Orders</span>
            </button>
            <button className="action-btn">
              <People />
              <span>Customer List</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 