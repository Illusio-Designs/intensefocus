import React from 'react';
import { Header, Footer } from '../components/public';
import '../styles/layouts/PublicLayout.css';

const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="public-main">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout; 