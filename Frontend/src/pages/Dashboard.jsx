import React, { useMemo, useState, useEffect } from 'react';
import '../styles/pages/dashboard.css';
import SalesRevenueChart from '../components/charts/SalesRevenueChart';
import RowActions from '../components/ui/RowActions';
import StatusBadge from '../components/ui/StatusBadge';
import { getOrders, getProducts } from '../services/apiService';
import { getUserRole, getUser } from '../services/authService';

const Dashboard = () => {
  const [period, setPeriod] = useState('Monthly');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = getUserRole();
  const user = getUser();
  const isAdmin = userRole === 'admin';
  const isDistributor = userRole === 'distributor';
  const isParty = userRole === 'party';
  const isSalesman = userRole === 'salesman';

  // Fetch orders and products on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersData, productsData] = await Promise.all([
          getOrders(),
          getProducts()
        ]);
        
        // Filter orders based on role
        let filteredOrders = Array.isArray(ordersData) ? ordersData : [];
        
        if (isDistributor && user?.distributor_id) {
          // Filter orders for this distributor
          filteredOrders = filteredOrders.filter(order => 
            order.distributor_id === user.distributor_id || 
            order.distributor?.distributor_id === user.distributor_id ||
            order.distributor?.id === user.distributor_id
          );
        } else if (isParty && user?.party_id) {
          // Filter orders for this party
          filteredOrders = filteredOrders.filter(order => 
            order.party_id === user.party_id || 
            order.party?.party_id === user.party_id ||
            order.party?.id === user.party_id
          );
        } else if (isSalesman && user?.salesman_id) {
          // Filter orders for this salesman
          filteredOrders = filteredOrders.filter(order => 
            order.salesman_id === user.salesman_id || 
            order.salesman?.salesman_id === user.salesman_id ||
            order.salesman?.id === user.salesman_id
          );
        }
        
        setOrders(filteredOrders);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setOrders([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole, user, isDistributor, isParty, isSalesman]);

  // Calculate dashboard statistics
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Filter orders for current month
    const currentMonthOrders = orders.filter(order => {
      if (!order.order_date) return false;
      const orderDate = new Date(order.order_date);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });
    
    // Calculate total sales for current month
    const totalSales = currentMonthOrders.reduce((sum, order) => {
      return sum + (order.total_value || order.total_amount || 0);
    }, 0);
    
    // Calculate total orders
    const totalOrders = orders.length;
    
    // Count by order type
    const retailOrders = orders.filter(o => 
      o.order_type?.includes('retail') || o.order_type === 'retail_order'
    ).length;
    const bulkOrders = orders.filter(o => 
      o.order_type?.includes('bulk') || o.order_type === 'bulk_order'
    ).length;
    
    // Calculate completed orders value
    const completedOrders = orders.filter(o => 
      o.order_status?.toLowerCase() === 'completed'
    );
    const completedValue = completedOrders.reduce((sum, o) => {
      return sum + (o.total_value || o.total_amount || 0);
    }, 0);
    
    // Calculate pending payments (orders that are not completed)
    const pendingOrders = orders.filter(o => 
      o.order_status?.toLowerCase() !== 'completed' && 
      o.order_status?.toLowerCase() !== 'cancelled'
    );
    const pendingPayments = pendingOrders.reduce((sum, o) => {
      return sum + (o.total_value || o.total_amount || 0);
    }, 0);
    
    // Get unique clients count
    const uniqueClients = new Set();
    orders.forEach(order => {
      if (order.party_id) uniqueClients.add(order.party_id);
      if (order.party?.party_id) uniqueClients.add(order.party.party_id);
      if (order.party?.id) uniqueClients.add(order.party.id);
    });
    
    return {
      totalSales,
      totalOrders,
      retailOrders,
      bulkOrders,
      completedValue,
      pendingPayments,
      activeClients: uniqueClients.size
    };
  }, [orders]);

  // Get recent orders for table (limit to 5)
  const recentOrders = useMemo(() => {
    return orders
      .sort((a, b) => {
        const dateA = new Date(a.order_date || 0);
        const dateB = new Date(b.order_date || 0);
        return dateB - dateA;
      })
      .slice(0, 5)
      .map(order => {
        const orderId = order.order_id || order.id;
        const partyName = order.party?.party_name || order.party_name || 'N/A';
        const orderItems = Array.isArray(order.order_items) ? order.order_items : [];
        const firstItem = orderItems[0] || {};
        const productName = firstItem.product?.model_no || firstItem.product_name || 'N/A';
        const quantity = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const status = order.order_status?.toUpperCase() || 'PENDING';
        const value = order.total_value || order.total_amount || 0;
        
        return {
          id: `#${orderId?.toString().slice(-6) || 'N/A'}`,
          client: partyName,
          product: productName,
          qty: quantity,
          status: status,
          value: `₹${value.toLocaleString('en-IN')}`
        };
      });
  }, [orders]);

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="dash-card metric">
            <h4>Total Sales (This Month)</h4>
            <div className="metric-value">
              {loading ? 'Loading...' : `₹${stats.totalSales.toLocaleString('en-IN')}`}
            </div>
            <div className="metric-sub green">↑ 12% vs last month</div>
          </div>
          <div className="dash-card metric">
            <h4>Total Orders</h4>
            <div className="metric-value">
              {loading ? 'Loading...' : `${stats.totalOrders} Orders`}
            </div>
            <div className="metric-sub">Retail {stats.retailOrders} | Bulk {stats.bulkOrders}</div>
          </div>
          <div className="dash-card metric">
            <h4>Active Clients</h4>
            <div className="metric-value">
              {loading ? 'Loading...' : stats.activeClients}
            </div>
            <div className="metric-sub">Optical Stores + Enterprises</div>
          </div>
          <div className="dash-card metric">
            <h4>Pending Payments</h4>
            <div className="metric-value">
              {loading ? 'Loading...' : `₹${stats.pendingPayments.toLocaleString('en-IN')}`}
            </div>
            <div className="metric-sub red">↓ 10% vs last month</div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-card tall equal">
            <div className="chart-header" style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6}}>
              <h4 style={{color: '#000000', fontSize: '14px', fontWeight: '700'}}>Sales & Revenue</h4>
              <select className="ui-select ui-pill chart-period-select" value={period} onChange={(e)=>setPeriod(e.target.value)} style={{height:28, padding:'0px 10px', fontSize:'12px'}}>
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Yearly</option>
              </select>
            </div>
            <SalesRevenueChart data={useMemo(() => ([
              { label: 'Jan', sales: 24, revenue: 18 },
              { label: 'Feb', sales: 32, revenue: 22 },
              { label: 'Mar', sales: 28, revenue: 20 },
              { label: 'Apr', sales: 36, revenue: 27 },
              { label: 'May', sales: 40, revenue: 34 },
              { label: 'Jun', sales: 30, revenue: 25 },
              { label: 'Jul', sales: 42, revenue: 33 },
              { label: 'Aug', sales: 26, revenue: 19 },
              { label: 'Sep', sales: 34, revenue: 29 },
              { label: 'Oct', sales: 38, revenue: 31 },
              { label: 'Nov', sales: 29, revenue: 24 },
              { label: 'Dec', sales: 44, revenue: 36 },
            ]), [])} height={220} />
          </div>
          <div className="dash-card side equal">
            <h4 style={{color: '#000000', fontSize: '14px', fontWeight: '700'}}>Quick Actions</h4>
            <div className="btn-col">
              <button className="ui-btn ui-btn--primary">Add New Product</button>
              <button className="ui-btn ui-btn--primary">Create Bulk Order</button>
              <button className="ui-btn ui-btn--primary">Generate Report</button>
              <button className="ui-btn ui-btn--primary">Manage Discounts</button>
            </div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-card">
            <h4 className="card-title">Top Selling Products</h4>
            <div className="mini-list">
              {[
                {img:'/images/products/spac1.webp', name:'Anti-Fog Safety Goggles', units:'320 Units'},
                {img:'/images/products/spac2.webp', name:'Anti-Fog Safety Goggles', units:'275 Units'},
                {img:'/images/products/spac3.webp', name:'Anti-Fog Safety Goggles', units:'145 Units'},
              ].map((p,i)=> (
                <div key={i} className="row">
                  <img src={p.img} alt={p.name} className="prod-icon" />
                  <div className="name">{p.name}</div>
                  <div className="units">{p.units}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="dash-card">
            <h4 className="card-title">Inventory Alerts</h4>
            <div className="inv-list">
              {[
                {tag:'LOW STOCKS', type:'warn', img:'/images/products/spac1.webp', name:'Anti-Fog Safety Goggles', left:'43 Left'},
                {tag:'OUT OF STOCKS', type:'danger', img:'/images/products/spac2.webp', name:'Anti-Fog Safety Goggles', left:'0 Left'},
                {tag:'OUT OF STOCKS', type:'danger', img:'/images/products/spac3.webp', name:'Anti-Fog Safety Goggles', left:'0 Left'},
              ].map((r,i)=> (
                <div key={i} className="row">
                  <span className={`stock-badge ${r.type}`}>{r.tag}</span>
                  <img src={r.img} alt={r.name} className="prod-icon" />
                  <div className="name">{r.name}</div>
                  <div className="units">{r.left}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-card" style={{gridColumn:'span 12'}}>
            <h4 style={{color: '#000000', fontSize: '14px', fontWeight: '700', marginBottom:'10px'}}>Order Overview</h4>
            <div className="ui-table__scroll">
              <table style={{width:'100%', borderCollapse:'separate', borderSpacing:0}}>
                <thead>
                  <tr>
                    {['ORDER ID','CLIENT NAME','PRODUCT','QTY','STATUS','VALUE','ACTION'].map((h)=> (
                      <th key={h} style={{textAlign:'left', padding:'10px 0', fontSize:11, color:'#000', borderBottom:'1px solid #E0E0E0', fontWeight:'600'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" style={{padding:'16px', textAlign:'center', color:'#6b7280', fontSize:'13px'}}>
                        Loading orders...
                      </td>
                    </tr>
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{padding:'16px', textAlign:'center', color:'#6b7280', fontSize:'13px'}}>
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((r,i)=> (
                      <tr key={i}>
                        <td style={{padding:'10px 0', fontSize:'13px'}}>{r.id}</td>
                        <td style={{padding:'10px 0', fontSize:'13px'}}>{r.client}</td>
                        <td style={{padding:'10px 0', color:'#6b7280', fontSize:'13px'}}>{r.product}</td>
                        <td style={{padding:'10px 0', fontSize:'13px'}}>{r.qty}</td>
                        <td style={{padding:'10px 0'}}>
                          <StatusBadge status={r.status.toLowerCase().replace(/\s+/g, '-')}>
                            {r.status}
                          </StatusBadge>
                        </td>
                        <td style={{padding:'10px 0', fontSize:'13px'}}>{r.value}</td>
                        <td style={{padding:'10px 0'}}>
                          <RowActions onView={()=>console.log('view', r)} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
