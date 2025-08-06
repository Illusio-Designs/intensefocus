import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Shop, Cart, Login } from './pages';
import { DashboardDemo } from './components';
import './styles/index.css';

// Navigation Component
const Navigation = () => {
  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <h1>IntenseFocus</h1>
          </Link>
        </div>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/cart" className="nav-link">Cart</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
};

// Layout Component
const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Navigation />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          
          <Route path="/shop" element={
            <Layout>
              <Shop />
            </Layout>
          } />
          
          <Route path="/cart" element={
            <Layout>
              <Cart />
            </Layout>
          } />
          
          <Route path="/login" element={
            <Layout>
              <Login />
            </Layout>
          } />
          
          <Route path="/dashboard" element={
            <Layout>
              <DashboardDemo />
            </Layout>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={
            <Layout>
              <div className="not-found">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <Link to="/" className="btn btn-primary">Go Home</Link>
              </div>
            </Layout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
