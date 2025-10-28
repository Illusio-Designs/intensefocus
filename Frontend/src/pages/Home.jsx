import React, { useState } from 'react';
import '../styles/pages/Home.css';

const Home = () => {
  const [activeColors, setActiveColors] = useState({});
  const [activeFilter, setActiveFilter] = useState('ALL');

  const handleColorClick = (productId, colorIndex) => {
    setActiveColors(prev => ({
      ...prev,
      [productId]: colorIndex
    }));
  };

  const handleFilterClick = (filterName) => {
    setActiveFilter(filterName);
  };

  const colors = [
    { color: '#000000', name: 'Black' },
    { color: '#E5E5E5', name: 'Grey' },
    { color: '#FFB6C1', name: 'Pink' }
  ];

  const filters = [
    'ALL',
    'Deal of the day',
    'Men',
    'Women',
    'Computer glasses',
    'Safety glasses',
    'Rimless sunglass'
  ];

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-background">
          <img src="/images/banners/hero background.webp" alt="Hero Background" className="hero-bg-image" />
        </div>
        <div className="hero-left-image">
          <img src="/images/banners/spacs.webp" alt="Eyewear" className="hero-side-image" />
        </div>
        <div className="hero-content">
          <h1>Bulk Safety Goggles Supply For Industries & Enterprises</h1>
          <p>Certified eye protection solutions for businesses, delivered at scale with competitive pricing and reliable supply chain support.</p>
          <button className="cta-button">SHOP NOW</button>
          <button className="cta-button-border"></button>
        </div>
        <div className="banner-slider">
        <div className="infinite-slider">
          <div className="slider-track">
            <img src="/images/banners/hero1.webp" alt="Eyewear Collection 1" className="slider-image" />
            <img src="/images/banners/hero2.webp" alt="Eyewear Collection 2" className="slider-image" />
            <img src="/images/banners/hero3.webp" alt="Eyewear Collection 3" className="slider-image" />
            <img src="/images/banners/hero4.webp" alt="Eyewear Collection 4" className="slider-image" />
            <img src="/images/banners/hero5.webp" alt="Eyewear Collection 5" className="slider-image" />
            {/* Duplicate for seamless loop */}
            <img src="/images/banners/hero1.webp" alt="Eyewear Collection 1" className="slider-image" />
            <img src="/images/banners/hero2.webp" alt="Eyewear Collection 2" className="slider-image" />
            <img src="/images/banners/hero3.webp" alt="Eyewear Collection 3" className="slider-image" />
            <img src="/images/banners/hero4.webp" alt="Eyewear Collection 4" className="slider-image" />
            <img src="/images/banners/hero5.webp" alt="Eyewear Collection 5" className="slider-image" />
          </div>
        </div>
      </div>
      </div>

      {/* Our Collection Section */}
      <section className="collection-section">
        <div className="collection-header">
          <h2>Our Collection</h2>
          <button className="view-all-button" onClick={() => window.location.href = '/products'}>
            VIEW ALL
            <div className="arrow-with-star">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>

        <div className="collection-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="product-card">
              <div className="product-image">
                <img src={`/images/products/spac${item}.webp`} alt="Anti-Fog Safety Goggles" />
              </div>
              <h3 className="product-name">Anti-Fog Safety Goggles</h3>
              <div className="color-options">
                {colors.map((colorItem, index) => (
                  <div
                    key={index}
                    className={`color-swatch ${(activeColors[item] === undefined && index === 0) || activeColors[item] === index ? 'active' : ''}`}
                    style={{backgroundColor: colorItem.color}}
                    onClick={() => handleColorClick(item, index)}
                    title={colorItem.name}
                  ></div>
                ))}
              </div>
              <div className="button-container">
                <button className="view-more-button">VIEW MORE</button>
                <button className="view-more-button-border"></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-image">
            <img src="/images/banners/hero3.webp" alt="About Us" />
            <div className="about-image-overlay"></div>
          </div>
          <div className="about-content">
            <div className="about-goggles-icon">
              <img src="/images/banners/spacs.webp" alt="Goggles" />
            </div>
            <h2>About Us</h2>
            <p>
              At Stallion, we specialize in providing high-quality safety goggles designed for industrial, corporate, and institutional use. Our focus is not retail sales, but long-term B2B partnerships with organizations that prioritize workforce safety and compliance.
            </p>
            <p>
              With years of expertise in manufacturing and global distribution, we supply goggles that meet international safety standards such as ANSI, EN166, and ISI. From manufacturing plants and construction sites to laboratories and healthcare facilities, our products are trusted by industries worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Our B2B Advantage Section */}
      <section className="b2b-advantage-section">
        <h2 className="b2b-advantage-title">Our B2B Advantage</h2>
        <div className="b2b-advantage-container">
          <div className="b2b-advantage-card">
            <div className="b2b-icon">
              <img src="/images/icons/package.webp" alt="Package" />
            </div>
            <h3>Bulk Order Fulfilment</h3>
          </div>
          <div className="b2b-advantage-card">
            <div className="b2b-icon">
              <img src="/images/icons/bank-note-01.webp" alt="Bank Note" />
            </div>
            <h3>Competitive Pricing</h3>
          </div>
          <div className="b2b-advantage-card">
            <div className="b2b-icon">
              <img src="/images/icons/globe-01.webp" alt="Globe" />
            </div>
            <h3>Global Shipping</h3>
          </div>
        </div>
      </section>
     
    </div>
  );
};

export default Home;


