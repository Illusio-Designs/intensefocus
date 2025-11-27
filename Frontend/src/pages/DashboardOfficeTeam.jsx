import React, { useMemo, useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';
import DropdownSelector from '../components/ui/DropdownSelector';
import { register, getRoles } from '../services/apiService';

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

  // Function to format role name: capitalize first letter and replace underscores with spaces
  const formatRoleName = (name) => {
    if (!name) return '';
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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

  const columns = useMemo(() => ([
    { key: 'id', label: 'USER ID' },
    { key: 'fullName', label: 'FULL NAME' },
    { key: 'phoneNumber', label: 'PHONE NUMBER' },
    { key: 'role', label: 'ROLE' },
    { key: 'status', label: 'STATUS' },
    { key: 'action', label: 'ACTION', render: (_v, row) => (
      <RowActions onView={() => console.log('view user', row)} onEdit={() => setEditRow(row)} onDelete={() => console.log('delete user', row)} />
    ) },
  ]), []);

  const filteredRowsByTab = useMemo(() => {
    if (activeTab === 'All') return rows;
    if (activeTab === 'Activate') return rows.filter(r => r.isActive);
    if (activeTab === 'Deactivate') return rows.filter(r => !r.isActive);
    return rows;
  }, [rows, activeTab]);

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
      
      // You might want to refresh the table data here
      // For now, we'll just show a success message
      alert('User registered successfully!');
    } catch (error) {
      console.error('Error registering user:', error);
      alert(`Error: ${error.message || 'Failed to register user'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement edit functionality with update API
    setEditRow(null);
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
        onClose={() => setEditRow(null)}
        title="Edit User"
        footer={(
          <>
            <button className="ui-btn ui-btn--secondary" onClick={() => setEditRow(null)}>Cancel</button>
            <button className="ui-btn ui-btn--primary" onClick={handleEditSubmit}>Update</button>
          </>
        )}
      >
        <form className="ui-form" onSubmit={handleEditSubmit}>
          <div className="form-group form-group--full">
            <label className="ui-label">Full Name</label>
            <input 
              className="ui-input" 
              defaultValue={editRow?.fullName}
            />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Phone Number</label>
            <input 
              className="ui-input" 
              defaultValue={editRow?.phoneNumber}
            />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Role</label>
            <DropdownSelector
              options={roleOptions}
              value={editRow?.roleId || ''}
              onChange={(value) => console.log('Role changed:', value)}
              placeholder="Select a role"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardOfficeTeam;

