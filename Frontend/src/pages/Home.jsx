import React from 'react';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to IntenseFocus</h1>
          <p className="hero-subtitle">
            Discover our premium collection of eyewear designed for style and comfort
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-large">Shop Now</button>
            <button className="btn btn-secondary btn-large">Learn More</button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="featured-categories">
        <div className="container">
          <h2 className="section-title">Featured Categories</h2>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-image">
                <img src="/placeholder-sunglasses.jpg" alt="Sunglasses" />
              </div>
              <h3 className="category-title">Sunglasses</h3>
              <p className="category-description">Protect your eyes in style</p>
            </div>
            <div className="category-card">
              <div className="category-image">
                <img src="/placeholder-eyeglasses.jpg" alt="Eyeglasses" />
              </div>
              <h3 className="category-title">Eyeglasses</h3>
              <p className="category-description">Clear vision with elegance</p>
            </div>
            <div className="category-card">
              <div className="category-image">
                <img src="/placeholder-contact-lenses.jpg" alt="Contact Lenses" />
              </div>
              <h3 className="category-title">Contact Lenses</h3>
              <p className="category-description">Freedom and comfort</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">About IntenseFocus</h2>
              <p className="about-description">
                We are dedicated to providing the highest quality eyewear that combines 
                cutting-edge technology with timeless design. Our mission is to help 
                you see the world clearly while looking your best.
              </p>
              <div className="about-features">
                <div className="feature">
                  <h4>Premium Quality</h4>
                  <p>Only the finest materials and craftsmanship</p>
                </div>
                <div className="feature">
                  <h4>Expert Service</h4>
                  <p>Professional fitting and consultation</p>
                </div>
                <div className="feature">
                  <h4>Wide Selection</h4>
                  <p>Hundreds of styles to choose from</p>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img src="/placeholder-store.jpg" alt="Our Store" />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="section-title">Stay Updated</h2>
            <p className="newsletter-description">
              Subscribe to our newsletter for the latest styles and exclusive offers
            </p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="newsletter-input"
              />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 