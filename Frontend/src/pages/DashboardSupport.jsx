import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { showSuccess, showError } from '../services/notificationService';
import '../styles/pages/dashboard-support.css';

const DashboardSupport = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!name || !email || !query) {
      showError('Please fill out all fields.');
      return;
    }
    try {
      const subject = encodeURIComponent(`Support Query from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${query}`);
      const mailto = `mailto:illusiodesigns@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = mailto;
      showSuccess('Opening your email client to send the message...');
    } catch (_) {
      showError('Could not open email client.');
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="dash-card full support">
            <div className="support-header">
              <div>
                <h4 className="support-title">Contact Support</h4>
                <p className="support-subtitle">Send us your query and we will get back to you.</p>
              </div>
            </div>

            <form onSubmit={handleSend} className="ui-form support-form">
              <div className="form-group">
                <label className="ui-label" htmlFor="support-name">Your Name</label>
                <input id="support-name" className="ui-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
              </div>
              <div className="form-group">
                <label className="ui-label" htmlFor="support-email">Email</label>
                <input id="support-email" className="ui-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="form-group" style={{gridColumn:'1 / -1'}}>
                <label className="ui-label" htmlFor="support-query">Query</label>
                <textarea id="support-query" className="ui-input" rows={6} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Write your question here..." required />
              </div>

              <div className="support-form-actions" style={{gridColumn:'1 / -1'}}>
                <Button type="submit">Send</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSupport;

