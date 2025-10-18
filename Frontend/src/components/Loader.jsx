import React from 'react';
import '../styles/components/Loader.css';

const Loader = ({ isLoading = true }) => {
  if (!isLoading) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader-icon">
          <div className="loader-arc loader-arc-1"></div>
          <div className="loader-arc loader-arc-2"></div>
          <img src="/favicon.png" alt="Loading..." className="loader-image" />
        </div>
        <div className="loader-text">LOADING</div>
      </div>
    </div>
  );
};

export default Loader;
