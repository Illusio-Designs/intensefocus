import React from 'react';
import '../styles/pages/PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">
      <section className="privacy-body">
        <div className="privacy-content">
          <h1>Privacy Policy</h1>
          <p>We respect your privacy. This policy explains what data we collect, how we use it, and your choices.</p>

          <h2>Information We Collect</h2>
          <p>We collect information you provide directly (such as contact details) and technical data (such as device and usage information) to operate and improve our services.</p>

          <h2>How We Use Your Data</h2>
          <p>We use your data to fulfill orders, provide support, communicate updates, enhance product experience, and comply with legal obligations.</p>

          <h2>Your Rights</h2>
          <p>You may request access, correction, or deletion of your personal data where applicable. For requests, contact support@stallion.com.</p>

          <h2>Contact</h2>
          <p>If you have any questions about this policy, contact us at support@stallion.com.</p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;


