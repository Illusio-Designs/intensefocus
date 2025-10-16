import React from 'react';
import '../styles/pages/Home.css';

const Home = () => {
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
      
     
    </div>
  );
};

export default Home;


