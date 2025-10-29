import React from 'react';
import '../styles/components/Breadcrumb.css';

const Breadcrumb = ({ currentPage, onPageChange }) => {
  // Define breadcrumb paths for each page
  const getBreadcrumbPath = (page) => {
    const breadcrumbMap = {
      'collection': [
        { id: 'home', text: 'Home' },
        { id: 'collection', text: 'Collection' }
      ],
      'products': [
        { id: 'home', text: 'Home' },
        { id: 'products', text: 'Shop' }
      ],
      'about': [
        { id: 'home', text: 'Home' },
        { id: 'about', text: 'About' }
      ],
      'contact': [
        { id: 'home', text: 'Home' },
        { id: 'contact', text: 'Contact' }
      ],
      'cart': [
        { id: 'home', text: 'Home' },
        { id: 'cart', text: 'Cart' }
      ]
    };

    return breadcrumbMap[page] || [];
  };

  const breadcrumbItems = getBreadcrumbPath(currentPage);

  // Don't render breadcrumbs for home page
  if (currentPage === 'home' || breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav className="breadcrumb">
      <div className="breadcrumb-content">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && (
              <span className="breadcrumb-separator">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
            <span 
              className={`breadcrumb-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => currentPage !== item.id && onPageChange(item.id)}
            >
              {item.text}
            </span>
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumb;
