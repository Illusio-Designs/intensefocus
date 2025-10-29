'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
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
import ProductDetail from './ProductDetail';

// Dashboard Pages
import Dashboard from './Dashboard';
import DashboardProducts from './DashboardProducts';
import DashboardOrders from './DashboardOrders';
import DashboardClients from './DashboardClients';
import DashboardSuppliers from './DashboardSuppliers';
import AnalyticsReports from './AnalyticsReports';
import DashboardSupport from './DashboardSupport';
import DashboardSettings from './DashboardSettings';

const App = ({ initialPage = 'home', productId: initialProductId = null }) => {
  const router = useRouter();
  
  // Get page from URL on mount and when props change
  const getPageFromUrl = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const page = path.slice(1) || 'home';
      return page === '' ? 'home' : page;
    }
    return initialPage;
  };
  
  // Get productId from URL on mount and when props change
  const getProductIdFromUrl = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      return id ? parseInt(id) : null;
    }
    return initialProductId;
  };
  
  // Helper to determine layout from page
  const getLayoutFromPage = (page) => {
    if (['login', 'register'].includes(page)) {
      return 'auth';
    } else if (['dashboard', 'dashboard-products', 'orders', 'clients', 'suppliers', 'analytics', 'support', 'settings'].includes(page)) {
      return 'dashboard';
    }
    return 'public';
  };

  const [currentPage, setCurrentPage] = useState(() => {
    // Use initialPage if provided, otherwise try to get from URL
    return initialPage || getPageFromUrl();
  });
  const [currentProductId, setCurrentProductId] = useState(() => {
    // Use initialProductId if provided, otherwise try to get from URL
    return initialProductId !== null ? initialProductId : getProductIdFromUrl();
  });
  const [currentLayout, setCurrentLayout] = useState(() => {
    // Initialize layout based on initial page
    const page = initialPage || getPageFromUrl();
    return getLayoutFromPage(page);
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync with prop changes (which come from URL changes)
  useEffect(() => {
    if (initialPage && initialPage !== currentPage) {
      setCurrentPage(initialPage);
    }
    if (initialProductId !== null && initialProductId !== currentProductId) {
      setCurrentProductId(initialProductId);
    }
  }, [initialPage, initialProductId]);

  // Update URL when page or layout changes
  const handlePageChange = (page, productId = null) => {
    if (page === currentPage && productId === currentProductId) return;
    
    // Update URL using Next.js router
    let url = `/${page}`;
    if (productId) {
      url += `?id=${productId}`;
    }
    
    router.push(url);
    
    setIsLoading(true);

    // Determine layout based on page
    const layout = getLayoutFromPage(page);

    // Delay rendering new page for 2 seconds to show loader first
    setTimeout(() => {
      setCurrentPage(page);
      setCurrentProductId(productId);
      setCurrentLayout(layout);
      setIsLoading(false);
    }, 2000);
  };

  const renderPage = () => {
    switch (currentPage) {
      // Auth Pages
      case 'login':
        return <Login onPageChange={handlePageChange} />;
      case 'register':
        return <Register />;
      
      // Public Pages
      case 'home':
        return <Home />;
      case 'products':
        return <Products />;
      case 'product-detail':
        return <ProductDetail productId={currentProductId || initialProductId} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'cart':
        return <Cart onPageChange={handlePageChange} />;
      
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
