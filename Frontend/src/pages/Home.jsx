import React, { useState } from 'react';
import '../styles/pages/Home.css';
import ProductCard from '../components/ProductCard';

const Home = ({ onPageChange }) => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [expandedFaq, setExpandedFaq] = useState(0);

  const handleFilterClick = (filterName) => {
    setActiveFilter(filterName);
  };

  const handleViewMore = (productId) => {
    if (onPageChange) {
      onPageChange('product-detail', productId);
    } else if (typeof window !== 'undefined') {
      window.location.href = `/product-detail?id=${productId}`;
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is your minimum order quantity (MOQ)?",
      answer: "We typically supply bulk orders starting from 500 units, but requirements may vary by product category."
    },
    {
      question: "Do you offer bulk pricing or distributor discounts?",
      answer: "Yes, we provide competitive pricing for bulk orders and special discounts for distributors."
    },
    {
      question: "Can we customize goggles with our company logo or specific requirements?",
      answer: "Absolutely! We offer customization services including logo printing and specific design requirements."
    },
    {
      question: "How do you handle large-scale procurement contracts?",
      answer: "We have dedicated teams to manage large-scale contracts with flexible payment terms and delivery schedules."
    },
    {
      question: "Can we request product samples before placing a bulk order?",
      answer: "Yes, we can provide product samples for evaluation before you commit to a bulk order."
    }
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
          <button className="view-all-button" onClick={() => onPageChange ? onPageChange('products') : (window.location.href = '/products')}>
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
            <ProductCard
              key={item}
              productId={item}
              productName="Anti-Fog Safety Goggles"
              productImage={`/images/products/spac${item}.webp`}
              onViewMore={handleViewMore}
            />
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

      {/* FAQ Section */}
      <section className="faq-section" id="faq-section">
        <h2 className="faq-title">FAQs</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                <div className="faq-question-content">
                  <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{faq.question}</h3>
                </div>
                <button className="faq-toggle">
                  {expandedFaq === index ? '-' : '+'}
                </button>
              </div>
              {expandedFaq === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
     
    </div>
  );
};

export default Home;


