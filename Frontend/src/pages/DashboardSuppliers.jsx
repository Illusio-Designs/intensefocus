import React, { useMemo, useState, useEffect } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';
import {
  getSalesmen,
  createSalesman,
  updateSalesman,
  deleteSalesman,
  getCountries,
} from '../services/apiService';

const DashboardSuppliers = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [salesmen, setSalesmen] = useState([]);
  const [countries, setCountries] = useState([]);
  
  const [formData, setFormData] = useState({
    employee_code: '',
    full_name: '',
    email: '',
    phone: '',
    alternate_phone: '',
    address: '',
    country_id: '',
    joining_date: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const countriesData = await getCountries().catch(() => []);
      setCountries(countriesData || []);
      
      // Fetch salesmen for all countries
      if (countriesData && countriesData.length > 0) {
        const salesmenPromises = countriesData.map(country => 
          getSalesmen(country.id).catch(() => [])
        );
        const salesmenArrays = await Promise.all(salesmenPromises);
        const allSalesmen = salesmenArrays.flat();
        setSalesmen(allSalesmen);
      }
    } catch (error) {
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        setError(`Failed to load data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(() => ([
    { key: 'employee_code', label: 'EMPLOYEE CODE' },
    { key: 'full_name', label: 'NAME' },
    { key: 'phone', label: 'PHONE' },
    { key: 'email', label: 'EMAIL' },
    { key: 'action', label: 'ACTION', render: (_v, row) => (
      <RowActions 
        onEdit={() => handleEdit(row)} 
        onDelete={() => handleDelete(row)} 
      />
    ) },
  ]), []);

  const rows = useMemo(() => {
    return salesmen.map(salesman => ({
      ...salesman,
      isActive: salesman.is_active !== false,
    }));
  }, [salesmen]);

  const filteredRowsByTab = useMemo(() => {
    if (activeTab === 'All') return rows;
    if (activeTab === 'Activate') return rows.filter(r => r.isActive);
    if (activeTab === 'Deactivate') return rows.filter(r => !r.isActive);
    return rows;
  }, [rows, activeTab]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      employee_code: '',
      full_name: '',
      email: '',
      phone: '',
      alternate_phone: '',
      address: '',
      country_id: '',
      joining_date: '',
    });
  };

  const handleAdd = () => {
    resetForm();
    setOpenAdd(true);
  };

  const handleEdit = (row) => {
    setFormData({
      employee_code: row.employee_code || '',
      full_name: row.full_name || '',
      email: row.email || '',
      phone: row.phone || '',
      alternate_phone: row.alternate_phone || '',
      address: row.address || '',
      country_id: row.country_id || '',
      joining_date: row.joining_date || '',
    });
    setEditRow(row);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete this salesman?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteSalesman(row.id);
      await fetchData();
      setError(null);
    } catch (error) {
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        setError(`Failed to delete: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const dataToSend = {
        user_id: editRow?.user_id || '',
        employee_code: formData.employee_code,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        alternate_phone: formData.alternate_phone || '',
        address: formData.address || '',
        country_id: formData.country_id,
        state_id: '',
        city_id: '',
        zone_preference: '',
        reporting_manager: '',
        joining_date: formData.joining_date || new Date().toISOString(),
      };

      if (editRow) {
        await updateSalesman(editRow.id, dataToSend);
      } else {
        await createSalesman(dataToSend);
      }
      
      await fetchData();
      setError(null);
      setOpenAdd(false);
      setEditRow(null);
      resetForm();
    } catch (error) {
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        setError(`Failed to save: ${error.message}`);
      }
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
        {error && (
          <div className="dash-row">
            <div className="dash-card full">
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#fee', 
                border: '1px solid #fcc', 
                borderRadius: '8px',
                color: '#c33',
                marginBottom: '16px'
              }}>
                <strong>Error:</strong> {error}
                <button 
                  onClick={() => setError(null)}
                  style={{
                    float: 'right',
                    background: 'none',
                    border: 'none',
                    color: '#c33',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="dash-row">
          <div className="dash-card full">
            <TableWithControls
              title="Salesmen"
              columns={columns}
              rows={filteredRowsByTab}
              onAddNew={handleAdd}
              addNewText="Add New Salesman"
              onImport={() => {
                setError(null);
                fetchData();
              }}
              importText="Refresh Data"
              searchPlaceholder="Search salesmen"
            />
          </div>
        </div>
      </div>
      <Modal
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          resetForm();
        }}
        title="Add New Salesman"
        footer={(
          <>
            <button 
              className="ui-btn ui-btn--secondary" 
              onClick={() => {
                setOpenAdd(false);
                resetForm();
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="ui-btn ui-btn--primary" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </>
        )}
      >
        <form className="ui-form" onSubmit={handleSubmit}>
          <div className="form-group form-group--full">
            <label className="ui-label">Employee Code *</label>
            <input 
              className="ui-input" 
              placeholder="Employee code"
              value={formData.employee_code}
              onChange={(e) => handleInputChange('employee_code', e.target.value)}
              required
            />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Full Name *</label>
            <input 
              className="ui-input" 
              placeholder="Full name"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Email *</label>
            <input 
              className="ui-input" 
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Phone *</label>
            <input 
              className="ui-input" 
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Alternate Phone</label>
            <input 
              className="ui-input" 
              placeholder="Alternate phone"
              value={formData.alternate_phone}
              onChange={(e) => handleInputChange('alternate_phone', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Joining Date</label>
            <input 
              className="ui-input" 
              type="date"
              value={formData.joining_date}
              onChange={(e) => handleInputChange('joining_date', e.target.value)}
            />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Address</label>
            <input 
              className="ui-input" 
              placeholder="Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
        </form>
      </Modal>
      <Modal
        open={!!editRow}
        onClose={() => {
          setEditRow(null);
          resetForm();
        }}
        title="Edit Salesman"
        footer={(
          <>
            <button 
              className="ui-btn ui-btn--secondary" 
              onClick={() => {
                setEditRow(null);
                resetForm();
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="ui-btn ui-btn--primary" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </>
        )}
      >
        <form className="ui-form" onSubmit={handleSubmit}>
          <div className="form-group form-group--full">
            <label className="ui-label">Employee Code *</label>
            <input 
              className="ui-input" 
              placeholder="Employee code"
              value={formData.employee_code}
              onChange={(e) => handleInputChange('employee_code', e.target.value)}
              required
            />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Full Name *</label>
            <input 
              className="ui-input" 
              placeholder="Full name"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Email *</label>
            <input 
              className="ui-input" 
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Phone *</label>
            <input 
              className="ui-input" 
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Alternate Phone</label>
            <input 
              className="ui-input" 
              placeholder="Alternate phone"
              value={formData.alternate_phone}
              onChange={(e) => handleInputChange('alternate_phone', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Joining Date</label>
            <input 
              className="ui-input" 
              type="date"
              value={formData.joining_date}
              onChange={(e) => handleInputChange('joining_date', e.target.value)}
            />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Address</label>
            <input 
              className="ui-input" 
              placeholder="Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardSuppliers;

