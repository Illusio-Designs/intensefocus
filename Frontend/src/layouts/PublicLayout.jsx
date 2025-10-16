import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/pages/public.css';

const PublicLayout = ({ children, onPageChange, currentPage }) => {
  return (
    <div className="public-layout">
      <Header onPageChange={onPageChange} currentPage={currentPage} />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
