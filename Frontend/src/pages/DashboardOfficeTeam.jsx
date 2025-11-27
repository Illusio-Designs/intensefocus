import React, { useMemo, useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';
import DropdownSelector from '../components/ui/DropdownSelector';
import { register, getRoles, getUsers, updateUser, deleteUser } from '../services/apiService';
import { showSuccess, showError } from '../services/notificationService';

const DashboardOfficeTeam = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    roleId: '',
  });
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    roleId: '',
    isActive: true,
  });

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        console.log('Roles API Response:', response); // Debug log
        
        // Handle different response structures
        let rolesArray = [];
        if (Array.isArray(response)) {
          rolesArray = response;
        } else if (response && Array.isArray(response.data)) {
          rolesArray = response.data;
        } else if (response && Array.isArray(response.roles)) {
          rolesArray = response.roles;
        } else if (response && response.data && Array.isArray(response.data.roles)) {
          rolesArray = response.data.roles;
        }
        
        console.log('Extracted roles array:', rolesArray); // Debug log
        setRoles(rolesArray);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setRoles([]);
      }
    };
    fetchRoles();
  }, []);

  // Update edit form data when editRow changes
  useEffect(() => {
    if (editRow) {
      setEditFormData({
        fullName: editRow.fullName || '',
        roleId: editRow.roleId || '',
        isActive: editRow.isActive !== undefined ? editRow.isActive : true,
      });
    }
  }, [editRow]);

  // Function to format role name: capitalize first letter and replace underscores with spaces
  const formatRoleName = (name) => {
    if (!name) return '';
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Helper function to map users array to table rows format
  const mapUsersToRows = (usersArray) => {
    return usersArray.map(user => {
      // Find role name for display
      const userRole = roles.find(r => {
        const roleId = r.role_id || r.id || r.roleId || r._id || r.uuid || r.ID;
        return roleId === user.role_id;
      });
      const roleName = userRole 
        ? formatRoleName(userRole.role_name || userRole.name || userRole.roleName || userRole.title || userRole.role || userRole.Name || userRole.RoleName)
        : 'Unknown Role';
      
      return {
        id: user.user_id || user.id,
        fullName: user.full_name || user.fullName || user.name || '',
        phoneNumber: user.phone || user.phoneNumber || '',
        role: roleName,
        roleId: user.role_id || user.roleId,
        status: user.is_active ? 'Active' : 'Inactive',
        isActive: user.is_active || false,
        profile_image: user.profile_image || '',
        email: user.email || '',
      };
    });
  };

  const roleOptions = useMemo(() => {
    if (!roles || roles.length === 0) {
      console.log('No roles available');
      return [];
    }
    
    // Roles to exclude from the dropdown
    const excludedRoles = ['distributor', 'salesman', 'party'];
    
    const options = roles
      .map((role) => {
        // Try multiple possible property names for ID (including snake_case)
        const roleId = role.role_id || role.id || role.roleId || role._id || role.uuid || role.ID;
        // Try multiple possible property names for name (including snake_case)
        const roleName = role.role_name || role.name || role.roleName || role.title || role.role || role.Name || role.RoleName;
        
        // Only return if we have a valid ID
        if (!roleId) {
          return null;
        }
        
        // Exclude specific roles
        if (roleName && excludedRoles.includes(roleName.toLowerCase())) {
          return null;
        }
        
        return {
          value: roleId,
          label: formatRoleName(roleName) || roleId, // Format the role name properly
        };
      })
      .filter(opt => opt !== null); // Filter out null entries
    
    console.log('Role options:', options); // Debug log
    return options;
  }, [roles]);

  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch users on component mount and after operations
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers();
        console.log('Users API Response:', response); // Debug log
        
        // Handle different response structures
        let usersArray = [];
        if (Array.isArray(response)) {
          usersArray = response;
        } else if (response && Array.isArray(response.data)) {
          usersArray = response.data;
        } else if (response && Array.isArray(response.users)) {
          usersArray = response.users;
        }
        
        setUsers(usersArray);
        setRows(mapUsersToRows(usersArray));
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch users if roles are loaded (to properly map role names)
    if (roles.length > 0) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles]);

  const filteredRowsByTab = useMemo(() => {
    let filtered = [];
    if (activeTab === 'All') {
      filtered = rows;
    } else if (activeTab === 'Activate') {
      filtered = rows.filter(r => r.isActive);
    } else if (activeTab === 'Deactivate') {
      filtered = rows.filter(r => !r.isActive);
    } else {
      filtered = rows;
    }
    
    return filtered;
  }, [rows, activeTab]);

  const columns = useMemo(() => ([
    { key: 'fullName', label: 'FULL NAME' },
    { key: 'phoneNumber', label: 'PHONE NUMBER' },
    { key: 'role', label: 'ROLE' },
    { key: 'status', label: 'STATUS' },
    { key: 'action', label: 'ACTION', render: (_v, row) => (
      <RowActions onEdit={() => setEditRow(row)} onDelete={() => handleDelete(row)} />
    ) },
  ]), []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Format phone number to E.164 format if needed
      let phoneNumber = formData.phoneNumber.trim();
      if (!phoneNumber.startsWith('+')) {
        // If it doesn't start with +, assume it's an Indian number and add +91
        phoneNumber = phoneNumber.replace(/^0+/, ''); // Remove leading zeros
        if (!phoneNumber.startsWith('91')) {
          phoneNumber = `91${phoneNumber}`;
        }
        phoneNumber = `+${phoneNumber}`;
      }

      const userData = {
        phoneNumber,
        fullName: formData.fullName.trim(),
        roleId: formData.roleId,
      };

      await register(userData);
      
      // Reset form and close modal
      setFormData({
        fullName: '',
        phoneNumber: '',
        roleId: '',
      });
      setOpenAdd(false);
      
      // Refresh users list
      const response = await getUsers();
      let usersArray = [];
      if (Array.isArray(response)) {
        usersArray = response;
      } else if (response && Array.isArray(response.data)) {
        usersArray = response.data;
      } else if (response && Array.isArray(response.users)) {
        usersArray = response.users;
      }
      
      setUsers(usersArray);
      setRows(mapUsersToRows(usersArray));
      
      showSuccess('User registered successfully!');
    } catch (error) {
      console.error('Error registering user:', error);
      showError(error.message || 'Failed to register user');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editRow) return;
    
    setLoading(true);
    try {
      const userData = {
        name: editFormData.fullName,
        email: editRow.email || '',
        profile_image: '', // Legacy field, kept empty
        is_active: editFormData.isActive,
        image_url: editRow.profile_image || '',
        role_id: editFormData.roleId,
      };

      await updateUser(editRow.id, userData);
      
      // Refresh users list
      const response = await getUsers();
      let usersArray = [];
      if (Array.isArray(response)) {
        usersArray = response;
      } else if (response && Array.isArray(response.data)) {
        usersArray = response.data;
      } else if (response && Array.isArray(response.users)) {
        usersArray = response.users;
      }
      
      setUsers(usersArray);
      setRows(mapUsersToRows(usersArray));
      setEditRow(null);
      
      showSuccess('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      showError(error.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    setLoading(true);
    try {
      await deleteUser(row.id);
      
      // Refresh users list
      const response = await getUsers();
      let usersArray = [];
      if (Array.isArray(response)) {
        usersArray = response;
      } else if (response && Array.isArray(response.data)) {
        usersArray = response.data;
      } else if (response && Array.isArray(response.users)) {
        usersArray = response.users;
      }
      
      setUsers(usersArray);
      setRows(mapUsersToRows(usersArray));
      
      showSuccess('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      showError(error.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="order-tabs-container">
            {['All', 'Activate', 'Deactivate'].map(tab => (
              <button
                key={tab}
                className={`order-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="dash-row">
          <div className="dash-card full">
            <TableWithControls
              title="Office Team"
              columns={columns}
              rows={filteredRowsByTab}
              onAddNew={() => setOpenAdd(true)}
              addNewText="Add New User"
              searchPlaceholder="Search users"
            />
          </div>
        </div>
      </div>
      <Modal
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          setFormData({
            fullName: '',
            phoneNumber: '',
            roleId: '',
          });
        }}
        title="Add New User"
        footer={(
          <>
            <button 
              className="ui-btn ui-btn--secondary" 
              onClick={() => {
                setOpenAdd(false);
                setFormData({
                  fullName: '',
                  phoneNumber: '',
                  roleId: '',
                });
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="ui-btn ui-btn--primary" 
              onClick={handleSubmit}
              disabled={loading || !formData.fullName || !formData.phoneNumber || !formData.roleId}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </>
        )}
      >
        <form className="ui-form" onSubmit={handleSubmit}>
          <div className="form-group form-group--full">
            <label className="ui-label">Full Name *</label>
            <input 
              className="ui-input" 
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              required
            />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Phone Number *</label>
            <PhoneInput
              country={'in'}
              value={formData.phoneNumber}
              onChange={(value) => handleInputChange('phoneNumber', value)}
              inputProps={{
                required: true,
                placeholder: 'Enter your phone number',
              }}
              containerClass="phone-input-container"
              inputClass="phone-input-field"
              buttonClass="phone-input-button"
              dropdownClass="phone-input-dropdown"
              disableDropdown={false}
              disableCountryGuess={false}
            />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Role *</label>
            <DropdownSelector
              options={roleOptions}
              value={formData.roleId}
              onChange={(value) => handleInputChange('roleId', value)}
              placeholder="Select a role"
            />
          </div>
        </form>
      </Modal>
      <Modal
        open={!!editRow}
        onClose={() => {
          setEditRow(null);
          setEditFormData({
            fullName: '',
            roleId: '',
            isActive: true,
          });
        }}
        title="Edit User"
        footer={(
          <>
            <button 
              className="ui-btn ui-btn--secondary" 
              onClick={() => {
                setEditRow(null);
                setEditFormData({
                  fullName: '',
                  roleId: '',
                  isActive: true,
                });
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="ui-btn ui-btn--primary" 
              onClick={handleEditSubmit}
              disabled={loading || !editFormData.fullName || !editFormData.roleId}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </>
        )}
      >
        <form className="ui-form" onSubmit={handleEditSubmit}>
          <div className="form-group form-group--full">
            <label className="ui-label">Full Name *</label>
            <input 
              className="ui-input" 
              placeholder="Enter full name"
              value={editFormData.fullName}
              onChange={(e) => setEditFormData(prev => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Phone Number</label>
            <input 
              className="ui-input" 
              value={editRow?.phoneNumber || ''}
              disabled
              readOnly
            />
            <small style={{ color: '#666', fontSize: '12px' }}>Phone number cannot be changed</small>
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Role *</label>
            <DropdownSelector
              options={roleOptions}
              value={editFormData.roleId}
              onChange={(value) => setEditFormData(prev => ({ ...prev, roleId: value }))}
              placeholder="Select a role"
            />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Status</label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editFormData.isActive}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                />
                <span>Active</span>
              </label>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardOfficeTeam;

