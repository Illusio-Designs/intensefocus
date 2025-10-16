'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthLayout from '../layouts/AuthLayout';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import '../styles/globals.css';

// Auth Pages
import Login from './Login';
import Register from './Register';

// Public Pages
import Home from './Home';
import Collection from './Collection';
import About from './About';
import Contact from './Contact';
import Cart from './Cart';
import Products from './Products';

// Dashboard Pages
import Dashboard from './Dashboard';
import Orders from './Orders';
import Clients from './Clients';
import Suppliers from './Suppliers';
import AnalyticsReports from './AnalyticsReports';
import Support from './Support';
import Settings from './Settings';

const App = ({ initialPage = 'home' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentLayout, setCurrentLayout] = useState('public');

  // Handle URL routing
  useEffect(() => {
    const page = searchParams.get('page');
    const layout = searchParams.get('layout');
    if (page) setCurrentPage(page);
    if (layout) setCurrentLayout(layout);
  }, [searchParams]);

  // Update URL when page or layout changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Determine layout based on page
    let layout = 'public';
    if (['login', 'register'].includes(page)) {
      layout = 'auth';
    } else if (['dashboard', 'products', 'orders', 'clients', 'suppliers', 'analytics', 'support', 'settings'].includes(page)) {
      layout = 'dashboard';
    }
    setCurrentLayout(layout);
    
    // Update URL without page reload
    router.push(`/${page}`);
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
      case 'collection':
        return <Collection />;
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
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'clients':
        return <Clients />;
      case 'suppliers':
        return <Suppliers />;
      case 'analytics':
        return <AnalyticsReports />;
      case 'support':
        return <Support />;
      case 'settings':
        return <Settings />;
      
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
      {renderLayout()}
    </div>
  );
};

export default App;
