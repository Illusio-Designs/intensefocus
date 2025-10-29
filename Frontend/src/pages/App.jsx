'use client';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import AuthLayout from '../layouts/AuthLayout';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import '../styles/globals.css';
import Loader from '../components/Loader';

// Auth Pages
import Login from './Login';
import Register from './Register';

// Public Pages
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Cart from './Cart';
import Products from './Products';

// Dashboard Pages
import Dashboard from './Dashboard';
import DashboardProducts from './DashboardProducts';
import DashboardOrders from './DashboardOrders';
import DashboardClients from './DashboardClients';
import DashboardSuppliers from './DashboardSuppliers';
import AnalyticsReports from './AnalyticsReports';
import DashboardSupport from './DashboardSupport';
import DashboardSettings from './DashboardSettings';

const App = ({ initialPage = 'home' }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentLayout, setCurrentLayout] = useState('public');
  const [isLoading, setIsLoading] = useState(false);

  // Update URL when page or layout changes
  const handlePageChange = (page) => {
    if (page === currentPage) return;
    flushSync(() => setIsLoading(true));

    // Determine layout based on page
    let layout = 'public';
    if (['login', 'register'].includes(page)) {
      layout = 'auth';
    } else if (['dashboard', 'dashboard-products', 'orders', 'clients', 'suppliers', 'analytics', 'support', 'settings'].includes(page)) {
      layout = 'dashboard';
    }

    // Delay rendering new page for 2 seconds to show loader first
    setTimeout(() => {
      setCurrentPage(page);
      setCurrentLayout(layout);
      setIsLoading(false);
    }, 2000);
  };

  const renderPage = () => {
    switch (currentPage) {
      // Auth Pages
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      
      // Public Pages
      case 'home':
        return <Home />;
      case 'products':
        return <Products />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'cart':
        return <Cart />;
      
      // Dashboard Pages
      case 'dashboard':
        return <Dashboard />;
      case 'dashboard-products':
        return <DashboardProducts />;
      case 'orders':
        return <DashboardOrders />;
      case 'clients':
        return <DashboardClients />;
      case 'suppliers':
        return <DashboardSuppliers />;
      case 'analytics':
        return <AnalyticsReports />;
      case 'support':
        return <DashboardSupport />;
      case 'settings':
        return <DashboardSettings />;
      
      default:
        return <Home />;
    }
  };

  const renderLayout = () => {
    const pageContent = renderPage();
    
    switch (currentLayout) {
      case 'auth':
        return <AuthLayout>{pageContent}</AuthLayout>;
      case 'dashboard':
        return <DashboardLayout currentPage={currentPage} onPageChange={handlePageChange}>{pageContent}</DashboardLayout>;
      case 'public':
      default:
        return <PublicLayout onPageChange={handlePageChange} currentPage={currentPage}>{pageContent}</PublicLayout>;
    }
  };

  return (
    <div className="app">
      {isLoading ? <Loader isLoading={true} /> : renderLayout()}
    </div>
  );
};

export default App;
