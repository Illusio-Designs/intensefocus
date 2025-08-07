import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Login from './pages/Login';
import { PublicLayout, AuthLayout, DashboardLayout } from './layouts';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          } />
          <Route path="/shop" element={
            <PublicLayout>
              <Shop />
            </PublicLayout>
          } />
          <Route path="/cart" element={
            <PublicLayout>
              <Cart />
            </PublicLayout>
          } />
          
          {/* Auth Routes */}
          <Route path="/login" element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={
            <PublicLayout>
              <div className="not-found">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <Link to="/" className="btn btn-primary">Go Home</Link>
              </div>
            </PublicLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
