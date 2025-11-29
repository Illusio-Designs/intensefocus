import React, { useMemo, useState, useEffect } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';
import {
  getParties,
  createParty,
  updateParty,
  deleteParty,
} from '../services/apiService';

const DashboardClients = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parties, setParties] = useState([]);
  
  const [formData, setFormData] = useState({
    party_name: '',
    trade_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const partiesData = await getParties().catch(() => []);
      setParties(partiesData || []);
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
    { key: 'id', label: 'PARTY ID', render: (_v, row) => row.id?.substring(0, 8) || 'N/A' },
    { key: 'party_name', label: 'PARTY NAME' },
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
    return parties.map(party => ({
      ...party,
      isActive: party.is_active !== false,
    }));
  }, [parties]);

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
      party_name: '',
      trade_name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      pincode: '',
    });
  };

  const handleAdd = () => {
    resetForm();
    setOpenAdd(true);
  };

  const handleEdit = (row) => {
    setFormData({
      party_name: row.party_name || '',
      trade_name: row.trade_name || '',
      contact_person: row.contact_person || '',
      email: row.email || '',
      phone: row.phone || '',
      address: row.address || '',
      pincode: row.pincode || '',
    });
    setEditRow(row);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete this party?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteParty(row.id);
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
        party_name: formData.party_name,
        trade_name: formData.trade_name,
        contact_person: formData.contact_person,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || '',
        country_id: '',
        state_id: '',
        city_id: '',
        zone_id: '',
        pincode: formData.pincode || '',
        gstin: '',
        pan: '',
      };

      if (editRow) {
        await updateParty(editRow.id, dataToSend);
      } else {
        await createParty(dataToSend);
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
              title="Party"
              columns={columns}
              rows={filteredRowsByTab}
              onAddNew={handleAdd}
              addNewText="Add New Party"
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
        title="Add New Party"
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
            <label className="ui-label">Party Name *</label>
            <input 
              className="ui-input" 
              placeholder="Party name"
              value={formData.party_name}
              onChange={(e) => handleInputChange('party_name', e.target.value)}
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
        title="Edit Party"
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
            <label className="ui-label">Party Name *</label>
            <input 
              className="ui-input" 
              placeholder="Party name"
              value={formData.party_name}
              onChange={(e) => handleInputChange('party_name', e.target.value)}
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

export default DashboardClients;

