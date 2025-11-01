import React, { useEffect, useMemo, useState } from 'react';
import Button from '../components/ui/Button';
import { showSuccess } from '../services/notificationService';
import '../styles/pages/dashboard-settings.css';

const DashboardSettings = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(''); // data URL for preview

  const initial = useMemo(() => ({ name: '', email: '', phone: '', avatar: '' }), []);
  const [initialData, setInitialData] = useState(initial);

  useEffect(() => {
    try {
      const storedName = typeof window !== 'undefined' ? window.localStorage.getItem('userName') : '';
      const storedAvatar = typeof window !== 'undefined' ? window.localStorage.getItem('userAvatarUrl') : '';
      const userStr = typeof window !== 'undefined' ? window.localStorage.getItem('user') : null;
      let next = { name: storedName || '', email: '', phone: '', avatar: storedAvatar || '' };
      if (userStr) {
        const u = JSON.parse(userStr);
        next = {
          name: storedName || u?.name || '',
          email: u?.email || '',
          phone: u?.phone || '',
          avatar: storedAvatar || u?.avatar || '',
        };
      }
      setUserName(next.name);
      setEmail(next.email);
      setPhone(next.phone);
      setAvatar(next.avatar);
      setInitialData(next);
    } catch (_) {}
  }, []);

  const handleAvatarChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(String(reader.result || ''));
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setUserName(initialData.name || '');
    setEmail(initialData.email || '');
    setPhone(initialData.phone || '');
    setAvatar(initialData.avatar || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Persist minimal fields used by header
      window.localStorage.setItem('userName', userName || '');
      if (avatar) window.localStorage.setItem('userAvatarUrl', avatar);
      // Merge into user object if exists
      const userStr = window.localStorage.getItem('user');
      const u = userStr ? JSON.parse(userStr) : {};
      const next = { ...u, name: userName, email, phone, avatar: avatar || u.avatar };
      window.localStorage.setItem('user', JSON.stringify(next));
      // Notify others
      window.dispatchEvent(new Event('authChange'));
      showSuccess('Profile updated');
      setInitialData(next);
    } catch (_) {}
  };

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="dash-card full settings">
            <div className="settings-header">
              <div>
                <h4 className="settings-title">Profile Settings</h4>
                <p className="settings-subtitle">Update your personal information and profile photo.</p>
              </div>
            </div>

            <div className="settings-grid">
              <aside className="settings-sidebar">
                <div className="settings-avatar__preview settings-avatar__preview--lg">
                  {avatar ? <img src={avatar} alt="Avatar" /> : <span>No Image</span>}
                </div>
                <div className="settings-avatar__actions">
                  <input id="avatar-input" type="file" accept="image/*" className="hidden-input" onChange={(e) => handleAvatarChange(e.target.files?.[0])} />
                  <Button type="button" onClick={() => document.getElementById('avatar-input').click()} size="sm">Change Photo</Button>
                  {avatar && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setAvatar('')}>Remove</Button>
                  )}
                  <div className="settings-hint">JPG, PNG up to ~2MB recommended.</div>
                </div>
              </aside>

              <form onSubmit={handleSubmit} className="settings-form ui-form">
                <div className="form-group">
                  <label className="ui-label">User Name</label>
                  <input className="ui-input" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your name" required />
                </div>
                <div className="form-group">
                  <label className="ui-label">Email</label>
                  <input className="ui-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="form-group">
                  <label className="ui-label">Phone Number</label>
                  <input className="ui-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91-XXXXXXXXXX" />
                </div>

                <div className="settings-actions">
                  <Button type="button" variant="secondary" onClick={handleReset}>Reset</Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;

