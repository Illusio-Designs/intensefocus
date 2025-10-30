import React from 'react';
import { FiBox, FiTag, FiGlobe, FiTool, FiTruck, FiUsers } from 'react-icons/fi';
import '../styles/pages/About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <img src="/images/banners/hero1.webp" alt="About Stallion" />
          <div className="about-hero-overlay" />
        </div>
        <div className="about-hero-content container">
          <h1>About Stallion</h1>
          <p>
            We are a B2B-first brand supplying certified safety eyewear at scale to
            enterprises, factories, institutions, and government bodies.
          </p>
        </div>
      </section>

      {/* Story + Mission */}
      <section className="about-intro">
        <div className="container about-intro-grid">
          <div className="about-intro-image">
            <img src="/images/banners/hero4.webp" alt="Enterprise Safety Eyewear" />
            <div className="about-intro-overlay" />
          </div>
          <div className="about-intro-content">
            <h2>Built For Safety. Delivered For Scale.</h2>
            <p>
              At Stallion, our focus is enterprise-grade safety. We design and
              manufacture safety goggles that meet international standards like
              ANSI, EN166, and ISI, enabling organizations to protect their
              workforce without compromise.
            </p>
            <p>
              From heavy industries and construction to laboratories and
              healthcare, our eyewear is engineered for performance, comfort,
              and reliability in demanding environments.
            </p>
            <div className="about-highlights">
              <div className="highlight">
                <FiBox className="highlight-icon" aria-hidden="true" />
                <span>High-volume fulfilment</span>
              </div>
              <div className="highlight">
                <FiTag className="highlight-icon" aria-hidden="true" />
                <span>Enterprise pricing</span>
              </div>
              <div className="highlight">
                <FiGlobe className="highlight-icon" aria-hidden="true" />
                <span>Global shipping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="about-certifications">
        <div className="certifications-container container">
          <h2>Certifications</h2>
          <p>
            Our products are tested and compliant with the most widely accepted
            safety benchmarks.
          </p>
          <div className="certifications-grid">
            <div className="cert-badge">ANSI</div>
            <div className="cert-badge">EN166</div>
            <div className="cert-badge">ISI</div>
          </div>
        </div>
      </section>

      {/* Why Choose Stallion */}
      <section className="about-why">
        <div className="container why-grid">
          <div className="why-card">
            <h3>Industrial-Grade Quality</h3>
            <p>Impact-resistant lenses, anti-fog options, and comfortable fit for all-day use.</p>
          </div>
          <div className="why-card">
            <h3>Reliable Supply Chain</h3>
            <p>Consistent production capacity and on-time delivery for bulk orders.</p>
          </div>
          <div className="why-card">
            <h3>Customization</h3>
            <p>Logo printing, packaging, and specification-based configurations available.</p>
          </div>
        </div>
      </section>

      {/* Team (optional visuals) */}
      <section className="about-team">
        <div className="container">
          <h2>Leadership & Operations</h2>
          <div className="team-grid">
          <div className="team-member">
            <div className="team-avatar"><FiTool className="team-avatar-icon" aria-hidden="true" /></div>
            <h3>Manufacturing Lead</h3>
            <p>Oversees production quality and compliance.</p>
          </div>
          <div className="team-member">
            <div className="team-avatar"><FiTruck className="team-avatar-icon" aria-hidden="true" /></div>
            <h3>Supply Chain Head</h3>
            <p>Ensures reliable delivery for global orders.</p>
          </div>
          <div className="team-member">
            <div className="team-avatar"><FiUsers className="team-avatar-icon" aria-hidden="true" /></div>
            <h3>Enterprise Success</h3>
            <p>Drives long-term partnerships and support.</p>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
