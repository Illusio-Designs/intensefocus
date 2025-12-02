import React, { useMemo, useState, useEffect } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';
import {
  getDistributors,
  createDistributor,
  updateDistributor,
  deleteDistributor,
  getCountries,
} from '../services/apiService';

const DashboardDistributor = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [distributors, setDistributors] = useState([]);
  const [countries, setCountries] = useState([]);
  
  const [formData, setFormData] = useState({
    distributor_name: '',
    trade_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    country_id: '',
    pincode: '',
    territory: '',
    commission_rate: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get all countries
      const countriesData = await getCountries();
      setCountries(countriesData || []);
      
      // Fetch distributors for all countries
      if (countriesData && countriesData.length > 0) {
        const distributorsPromises = countriesData.map(country => 
          getDistributors(country.id).catch((err) => {
            // Log error but don't break the entire fetch
            console.warn(`Failed to fetch distributors for country ${country.id}:`, err.message);
            return [];
          })
        );
        const distributorsArrays = await Promise.all(distributorsPromises);
        const allDistributors = distributorsArrays.flat();
        setDistributors(allDistributors);
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
    { key: 'distributor_name', label: 'DISTRIBUTOR NAME' },
    { key: 'trade_name', label: 'TRADE NAME' },
    { key: 'contact_person', label: 'CONTACT PERSON' },
    { key: 'phone', label: 'PHONE' },
    { key: 'action', label: 'ACTION', render: (_v, row) => (
      <RowActions 
        onEdit={() => handleEdit(row)} 
        onDelete={() => handleDelete(row)} 
      />
    ) },
  ]), []);

  const rows = useMemo(() => {
    return distributors.map(distributor => ({
      ...distributor,
      isActive: distributor.is_active !== false,
    }));
  }, [distributors]);

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
      distributor_name: '',
      trade_name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      country_id: '',
      pincode: '',
      territory: '',
      commission_rate: '',
    });
  };

  const handleAdd = () => {
    resetForm();
    setOpenAdd(true);
  };

  const handleEdit = (row) => {
    setFormData({
      distributor_name: row.distributor_name || '',
      trade_name: row.trade_name || '',
      contact_person: row.contact_person || '',
      email: row.email || '',
      phone: row.phone || '',
      address: row.address || '',
      country_id: row.country_id || '',
      pincode: row.pincode || '',
      territory: row.territory || '',
      commission_rate: row.commission_rate || '',
    });
    setEditRow(row);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete this distributor?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteDistributor(row.id);
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
    
    // Validate required fields
    if (!formData.distributor_name || formData.distributor_name.trim() === '') {
      setError('Please enter distributor name');
      return;
    }
    if (!formData.trade_name || formData.trade_name.trim() === '') {
      setError('Please enter trade name');
      return;
    }
    if (!formData.contact_person || formData.contact_person.trim() === '') {
      setError('Please enter contact person');
      return;
    }
    if (!formData.email || formData.email.trim() === '') {
      setError('Please enter email');
      return;
    }
    if (!formData.phone || formData.phone.trim() === '') {
      setError('Please enter phone number');
      return;
    }
    if (!formData.country_id) {
      setError('Please select a country');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const dataToSend = {
        distributor_name: formData.distributor_name.trim(),
        trade_name: formData.trade_name.trim(),
        contact_person: formData.contact_person.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address ? formData.address.trim() : '',
        country_id: formData.country_id,
        state_id: '',
        city_id: '',
        zone_id: '',
        pincode: formData.pincode ? formData.pincode.trim() : '',
        gstin: '',
        pan: '',
        territory: formData.territory ? formData.territory.trim() : '',
        commission_rate: parseFloat(formData.commission_rate) || 0,
      };

      if (editRow) {
        await updateDistributor(editRow.id, { 
          ...dataToSend, 
          is_active: editRow.is_active !== undefined ? editRow.is_active : true 
        });
      } else {
        await createDistributor(dataToSend);
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
              title="Distributors"
              columns={columns}
              rows={filteredRowsByTab}
              onAddNew={handleAdd}
              addNewText="Add New Distributor"
              onImport={() => {
                setError(null);
                fetchData();
              }}
              importText="Refresh Data"
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
        title="Add New Distributor"
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
            <label className="ui-label">Distributor Name *</label>
            <input 
              className="ui-input" 
              placeholder="Distributor name"
              value={formData.distributor_name}
              onChange={(e) => handleInputChange('distributor_name', e.target.value)}
              required
            />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Trade Name *</label>
            <input 
              className="ui-input" 
              placeholder="Trade name"
              value={formData.trade_name}
              onChange={(e) => handleInputChange('trade_name', e.target.value)}
              required
            />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Contact Person *</label>
            <input 
              className="ui-input" 
              placeholder="Contact person"
              value={formData.contact_person}
              onChange={(e) => handleInputChange('contact_person', e.target.value)}
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
            <label className="ui-label">Country *</label>
            <select
              className="ui-input"
              value={formData.country_id}
              onChange={(e) => handleInputChange('country_id', e.target.value)}
              required
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="ui-label">Territory</label>
            <input 
              className="ui-input" 
              placeholder="Territory"
              value={formData.territory}
              onChange={(e) => handleInputChange('territory', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Commission Rate</label>
            <input 
              className="ui-input" 
              type="number"
              step="0.01"
              placeholder="Commission rate"
              value={formData.commission_rate}
              onChange={(e) => handleInputChange('commission_rate', e.target.value)}
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
          <div className="form-group">
            <label className="ui-label">Pincode</label>
            <input 
              className="ui-input" 
              placeholder="Pincode"
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
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
        title="Edit Distributor"
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
            <label className="ui-label">Distributor Name *</label>
            <input 
              className="ui-input" 
              placeholder="Distributor name"
              value={formData.distributor_name}
              onChange={(e) => handleInputChange('distributor_name', e.target.value)}
              required
            />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Trade Name *</label>
            <input 
              className="ui-input" 
              placeholder="Trade name"
              value={formData.trade_name}
              onChange={(e) => handleInputChange('trade_name', e.target.value)}
              required
            />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Contact Person *</label>
            <input 
              className="ui-input" 
              placeholder="Contact person"
              value={formData.contact_person}
              onChange={(e) => handleInputChange('contact_person', e.target.value)}
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
            <label className="ui-label">Country *</label>
            <select
              className="ui-input"
              value={formData.country_id}
              onChange={(e) => handleInputChange('country_id', e.target.value)}
              required
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="ui-label">Territory</label>
            <input 
              className="ui-input" 
              placeholder="Territory"
              value={formData.territory}
              onChange={(e) => handleInputChange('territory', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Commission Rate</label>
            <input 
              className="ui-input" 
              type="number"
              step="0.01"
              placeholder="Commission rate"
              value={formData.commission_rate}
              onChange={(e) => handleInputChange('commission_rate', e.target.value)}
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
          <div className="form-group">
            <label className="ui-label">Pincode</label>
            <input 
              className="ui-input" 
              placeholder="Pincode"
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardDistributor;
