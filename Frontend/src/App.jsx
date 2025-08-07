import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Login from './pages/Login';
import ComponentsDemo from './pages/ComponentsDemo';
import { Home as DashboardHome } from './pages/dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
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
                  <Route path="/components" element={
                    <PublicLayout>
                      <ComponentsDemo />
                    </PublicLayout>
                  } />
                  <Route path="/shop" element={
                    <ProtectedRoute>
                      <PublicLayout>
                        <Shop />
                      </PublicLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <PublicLayout>
                        <Cart />
                      </PublicLayout>
                    </ProtectedRoute>
                  } />
          
          {/* Auth Routes */}
          <Route path="/login" element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
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
