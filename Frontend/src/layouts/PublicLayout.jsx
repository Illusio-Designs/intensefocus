import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const PublicLayout = ({ children, onPageChange, currentPage }) => {
  return (
    <div className="public-layout">
      <Header onPageChange={onPageChange} currentPage={currentPage} />
      <Breadcrumb currentPage={currentPage} onPageChange={onPageChange} />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
