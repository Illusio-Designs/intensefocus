import React, { useEffect, useMemo, useState } from 'react';
import Button from '../components/ui/Button';
import { showSuccess, showError } from '../services/notificationService';
import { updateUser, getUsers } from '../services/apiService';
import { getUser } from '../services/authService';
import '../styles/pages/dashboard-settings.css';

const DashboardSettings = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(''); // data URL for preview
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const [isActive, setIsActive] = useState(true);

  const initial = useMemo(() => ({ name: '', email: '', phone: '', avatar: '' }), []);
  const [initialData, setInitialData] = useState(initial);

  // Fetch current user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const currentUser = getUser();
        if (!currentUser || !currentUser.id) {
          // No user ID found - this is expected if user is not logged in
          // Fallback to localStorage
          loadFromLocalStorage();
          return;
        }

        setCurrentUserId(currentUser.id);
        
        // Fetch all users to find current user's data
        const usersResponse = await getUsers();
        let usersArray = [];
        if (Array.isArray(usersResponse)) {
          usersArray = usersResponse;
        } else if (usersResponse && Array.isArray(usersResponse.data)) {
          usersArray = usersResponse.data;
        } else if (usersResponse && Array.isArray(usersResponse.users)) {
          usersArray = usersResponse.users;
        }

        // Find current user in the list
        const userData = usersArray.find(u => 
          (u.user_id || u.id) === currentUser.id
        );

        if (userData) {
          // Check localStorage for avatar first (in case user uploaded a new image)
          const storedAvatar = typeof window !== 'undefined' ? window.localStorage.getItem('userAvatarUrl') : null;
          
          setUserName(userData.full_name || userData.name || userData.fullName || '');
          setEmail(userData.email || '');
          setPhone(userData.phone || userData.phoneNumber || '');
          
          // Only use avatar if it's a valid non-empty value
          // Prefer storedAvatar (uploaded image), then API profile_image, but only if non-empty
          const apiProfileImage = userData.profile_image && userData.profile_image.trim() !== '' 
            ? userData.profile_image 
            : null;
          const validStoredAvatar = storedAvatar && storedAvatar.trim() !== '' 
            ? storedAvatar 
            : null;
          const avatarValue = validStoredAvatar || apiProfileImage || '';
          
          setAvatar(avatarValue);
          setIsActive(userData.is_active !== undefined ? userData.is_active : true);
          setCurrentRoleId(userData.role_id || userData.roleId || null);
          
          // Update initial data
          const next = {
            name: userData.full_name || userData.name || userData.fullName || '',
            email: userData.email || '',
            phone: userData.phone || userData.phoneNumber || '',
            avatar: avatarValue,
          };
          setInitialData(next);
          
          // Also update localStorage for header display (only if we have a valid avatar)
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('userName', next.name);
            if (avatarValue && avatarValue.trim() !== '') {
              window.localStorage.setItem('userAvatarUrl', avatarValue);
            } else {
              // Remove avatar from localStorage if it's empty
              window.localStorage.removeItem('userAvatarUrl');
            }
          }
        } else {
          // Fallback to localStorage if user not found in API
          loadFromLocalStorage();
        }
      } catch (error) {
        // Silently handle API errors - fallback to localStorage
        // This is expected if API is not available or user is offline
        console.warn('Could not fetch user data from API, using localStorage:', error.message);
        // Fallback to localStorage on error
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const storedName = typeof window !== 'undefined' ? window.localStorage.getItem('userName') : '';
        const storedAvatar = typeof window !== 'undefined' ? window.localStorage.getItem('userAvatarUrl') : '';
        const userStr = typeof window !== 'undefined' ? window.localStorage.getItem('user') : null;
        
        // Only use avatar if it's a valid non-empty value
        const validStoredAvatar = storedAvatar && storedAvatar.trim() !== '' ? storedAvatar : '';
        const userAvatar = userStr ? (() => {
          try {
            const u = JSON.parse(userStr);
            return (u?.avatar && u.avatar.trim() !== '') ? u.avatar : '';
          } catch {
            return '';
          }
        })() : '';
        
        const avatarValue = validStoredAvatar || userAvatar || '';
        
        let next = { 
          name: storedName || '', 
          email: '', 
          phone: '', 
          avatar: avatarValue 
        };
        
        if (userStr) {
          const u = JSON.parse(userStr);
          next = {
            name: storedName || u?.name || '',
            email: u?.email || '',
            phone: u?.phone || '',
            avatar: avatarValue,
          };
          // Set user ID and role ID from localStorage if available
          setCurrentUserId(u?.id || null);
          // Try to get role_id from user object (might be stored during login)
          if (u?.role_id || u?.roleId) {
            setCurrentRoleId(u?.role_id || u?.roleId);
          }
        }
        setUserName(next.name);
        setEmail(next.email);
        setPhone(next.phone);
        setAvatar(next.avatar);
        setInitialData(next);
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    };

    fetchUserData();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    // Always save to localStorage first (works even if API fails)
    const saveToLocalStorage = () => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('userName', userName || '');
        // Only save avatar to localStorage if it's a valid non-empty value
        if (avatar && avatar.trim() !== '') {
          window.localStorage.setItem('userAvatarUrl', avatar);
        } else {
          // Remove avatar from localStorage if it's empty
          window.localStorage.removeItem('userAvatarUrl');
        }
        
        // Update user object in localStorage
        const userStr = window.localStorage.getItem('user');
        const u = userStr ? JSON.parse(userStr) : {};
        const avatarValue = (avatar && avatar.trim() !== '') ? avatar : (u?.avatar && u.avatar.trim() !== '' ? u.avatar : '');
        const next = { ...u, name: userName, email, phone, avatar: avatarValue };
        window.localStorage.setItem('user', JSON.stringify(next));
      }
    };

    // Try to update via API if we have the required data
    if (currentUserId && currentRoleId) {
      try {
        // Send the avatar as image_url (can be a URL or data URL)
        // Backend expects image_url field for profile image
        const imageUrl = avatar || '';

        const userData = {
          name: userName.trim(),
          email: email.trim() || '',
          phone: phone.trim() || '',
          profile_image: '', // Legacy field, kept empty
          is_active: isActive,
          image_url: imageUrl,
          role_id: currentRoleId,
        };

        await updateUser(currentUserId, userData);
        
        // Save to localStorage after successful API update
        saveToLocalStorage();
        
        // Notify others
        window.dispatchEvent(new Event('authChange'));
        showSuccess('Profile updated successfully');
      } catch (error) {
        console.warn('API update failed, saving to localStorage only:', error.message);
        // Still save to localStorage even if API fails
        saveToLocalStorage();
        
        // Notify others
        window.dispatchEvent(new Event('authChange'));
        showSuccess('Profile saved locally (API unavailable)');
      }
    } else {
      // No API credentials, just save to localStorage
      saveToLocalStorage();
      
      // Notify others
      window.dispatchEvent(new Event('authChange'));
      showSuccess('Profile saved locally');
    }
    
    // Update initial data
    const next = {
      name: userName,
      email,
      phone,
      avatar: avatar || initialData.avatar,
    };
    setInitialData(next);
    
    setLoading(false);
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
                  <input 
                    className="ui-input" 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>

                <div className="settings-actions">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={handleReset}
                    disabled={loading}
                  >
                    Reset
                  </Button>
                  <Button 
                    type="submit"
                    disabled={loading || !userName.trim()}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
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

