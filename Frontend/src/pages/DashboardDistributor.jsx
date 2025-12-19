import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';
import {
  getDistributors,
  createDistributor,
  updateDistributor,
  deleteDistributor,
  getCountries,
  getStates,
  getCities,
  getZones,
} from '../services/apiService';
import { showSuccess, showError } from '../services/notificationService';

const DashboardDistributor = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [distributors, setDistributors] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountryFilter, setSelectedCountryFilter] = useState(null); // For filter dropdown
  const [hasSearched, setHasSearched] = useState(false); // Track if we've searched for distributors
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  
  const [formData, setFormData] = useState({
    distributor_name: '',
    trade_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    country_id: '',
    state_id: '',
    city_id: '',
    zone_id: '',
    pincode: '',
    gstin: '',
    pan: '',
    territory: '',
    commission_rate: '',
  });

  const isInitializingEditRef = useRef(false);
  const prevCountryIdRef = useRef('');

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const countriesData = await getCountries();
      setCountries(countriesData || []);
    } catch (error) {
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        setError(`Failed to load countries: ${error.message}`);
      }
    }
  };

  const fetchDistributorsForCountry = useCallback(async (countryId) => {
    if (!countryId) {
      console.log('[fetchDistributorsForCountry] No country ID provided, clearing distributors');
      setDistributors([]);
      setHasSearched(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    setHasSearched(false);
    try {
      // Validate countryId before making API call
      const cleanCountryId = String(countryId).trim();
      if (!cleanCountryId || cleanCountryId === 'undefined' || cleanCountryId === 'null') {
        console.error('[fetchDistributorsForCountry] Invalid country ID:', countryId);
        setDistributors([]);
        setHasSearched(true);
        return;
      }
      
      console.log('[fetchDistributorsForCountry] ====== FETCHING ======');
      console.log('[fetchDistributorsForCountry] Requested country ID:', cleanCountryId);
      console.log('[fetchDistributorsForCountry] Current selectedCountryFilter:', selectedCountryFilter);
      
      const distributorsData = await getDistributors(cleanCountryId);
      
      console.log('[fetchDistributorsForCountry] Received', distributorsData?.length || 0, 'distributors from API');
      
      // CRITICAL: Backend returns wrong data, so we MUST filter strictly
      // Filter out ALL distributors that don't match the requested country
      const validDistributors = (distributorsData || []).filter(d => {
        if (!d) {
          console.warn('[fetchDistributorsForCountry] Skipping null/undefined distributor');
          return false;
        }
        
        const distributorCountryId = String(d.country_id || d.countryId || '').trim();
        const matches = distributorCountryId === cleanCountryId;
        
        if (!matches) {
          console.warn('[fetchDistributorsForCountry] ❌ REJECTING distributor - country mismatch:', {
            distributor_id: d.distributor_id || d.id,
            distributor_name: d.distributor_name,
            distributor_country_id: distributorCountryId,
            requested_country_id: cleanCountryId,
            match: false
          });
        } else {
          console.log('[fetchDistributorsForCountry] ✅ ACCEPTING distributor - country matches:', {
            distributor_id: d.distributor_id || d.id,
            distributor_name: d.distributor_name,
            country_id: distributorCountryId
          });
        }
        return matches;
      });
      
      const filteredOut = distributorsData.length - validDistributors.length;
      if (filteredOut > 0) {
        console.warn('[fetchDistributorsForCountry] ⚠️ Backend returned', filteredOut, 'distributors with WRONG country_id!');
        console.warn('[fetchDistributorsForCountry] This is a backend issue - it should filter by country_id');
      }
      
      if (validDistributors.length > 0) {
        console.log('[fetchDistributorsForCountry] ✅ Found', validDistributors.length, 'valid distributors for country:', cleanCountryId);
      } else {
        console.log('[fetchDistributorsForCountry] ℹ️ No distributors found for country:', cleanCountryId);
        console.log('[fetchDistributorsForCountry] Backend returned', distributorsData.length, 'distributors but none matched the requested country');
      }
      
      // Force update by creating a new array reference
      const newDistributors = Array.isArray(validDistributors) ? [...validDistributors] : [];
      console.log('[fetchDistributorsForCountry] Setting', newDistributors.length, 'distributors for country:', cleanCountryId);
      console.log('[fetchDistributorsForCountry] ====== END FETCH ======');
      setDistributors(newDistributors);
      setHasSearched(true); // Mark that we've completed a search - even if empty
    } catch (error) {
      console.error('[fetchDistributorsForCountry] Error:', error);
      // "Distributors not found" is handled by getDistributors and returns empty array
      // Only show error for actual failures, not "not found" cases
      const errorMessage = error.message?.toLowerCase() || '';
      const isNotFound = errorMessage.includes('distributors not found') || 
                        errorMessage.includes('no distributors found') ||
                        errorMessage.includes('distributor not found') ||
                        error.statusCode === 404;
      
      if (!isNotFound && 
          !errorMessage.includes('token expired') && 
          !errorMessage.includes('unauthorized')) {
        setError(`Failed to load distributors: ${error.message}`);
        showError(`Failed to load distributors: ${error.message}`);
      }
      // Always set empty array on error (getDistributors should handle "not found" but just in case)
      setDistributors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set India as default country filter (only once when countries are loaded)
  const hasSetDefaultCountry = useRef(false);
  useEffect(() => {
    if (countries.length > 0 && !selectedCountryFilter && !hasSetDefaultCountry.current) {
      const india = countries.find(c => 
        c.name?.toLowerCase() === 'india' || 
        c.code?.toLowerCase() === 'in'
      );
      if (india) {
        console.log('[Filter] Setting default country to India:', india.id);
        setSelectedCountryFilter(india.id);
        hasSetDefaultCountry.current = true;
      }
    }
  }, [countries, selectedCountryFilter]);

  // Fetch distributors when country filter changes
  useEffect(() => {
    if (selectedCountryFilter) {
      console.log('[Filter] Country changed, fetching distributors for:', selectedCountryFilter);
      fetchDistributorsForCountry(selectedCountryFilter);
    } else {
      // If no country selected (All Countries), clear distributors
      console.log('[Filter] No country selected (All Countries), clearing distributors');
      setDistributors([]);
      setLoading(false);
      setHasSearched(false);
    }
  }, [selectedCountryFilter, fetchDistributorsForCountry]);

  const fetchStates = async (countryId) => {
    if (!countryId) {
      setStates([]);
      return;
    }
    try {
      const statesData = await getStates(countryId);
      setStates(statesData || []);
    } catch (error) {
      console.error('Failed to load states:', error);
      setStates([]);
    }
  };

  const fetchCities = async (stateId) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    try {
      const citiesData = await getCities(stateId);
      setCities(citiesData || []);
    } catch (error) {
      console.error('Failed to load cities:', error);
      setCities([]);
    }
  };

  const fetchZones = async (cityId) => {
    if (!cityId) {
      setZones([]);
      return;
    }
    try {
      const zonesData = await getZones(cityId);
      setZones(zonesData || []);
    } catch (error) {
      console.error('Failed to load zones:', error);
      setZones([]);
    }
  };

  // Fetch states when country changes in form
  useEffect(() => {
    if (formData.country_id) {
      fetchStates(formData.country_id);
      // Only reset dependent fields if country actually changed by user (not during edit initialization)
      if (!isInitializingEditRef.current && prevCountryIdRef.current !== '' && prevCountryIdRef.current !== formData.country_id) {
        setFormData(prev => ({ ...prev, state_id: '', city_id: '', zone_id: '' }));
        setCities([]);
        setZones([]);
      }
      prevCountryIdRef.current = formData.country_id;
    } else {
      setStates([]);
      if (!isInitializingEditRef.current) {
        setCities([]);
        setZones([]);
      }
      prevCountryIdRef.current = '';
    }
  }, [formData.country_id]);

  // Fetch cities when state changes
  useEffect(() => {
    if (formData.state_id) {
      fetchCities(formData.state_id);
      if (!isInitializingEditRef.current) {
        setFormData(prev => ({ ...prev, city_id: '', zone_id: '' }));
        setZones([]);
      }
    } else {
      setCities([]);
      if (!isInitializingEditRef.current) {
        setZones([]);
      }
    }
  }, [formData.state_id]);

  // Fetch zones when city changes
  useEffect(() => {
    if (formData.city_id) {
      fetchZones(formData.city_id);
      if (!isInitializingEditRef.current) {
        setFormData(prev => ({ ...prev, zone_id: '' }));
      }
    } else {
      setZones([]);
    }
  }, [formData.city_id]);

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
    // CRITICAL: Backend returns wrong data, so we MUST filter strictly by country_id
    let filteredDistributors = [];
    
    if (selectedCountryFilter) {
      const cleanFilterId = String(selectedCountryFilter).trim();
      // Only show distributors that EXACTLY match the selected country
      filteredDistributors = distributors.filter(distributor => {
        if (!distributor) return false;
        const distributorCountryId = String(distributor.country_id || distributor.countryId || '').trim();
        const matches = distributorCountryId === cleanFilterId;
        
        if (!matches && distributor.distributor_name) {
          console.warn('[rows] ❌ Filtering out distributor with wrong country:', {
            name: distributor.distributor_name,
            distributor_country_id: distributorCountryId,
            selected_country_id: cleanFilterId
          });
        }
        return matches;
      });
      console.log('[rows] ✅ Displaying', filteredDistributors.length, 'distributors for country:', cleanFilterId, 'out of', distributors.length, 'total');
    } else {
      // If no country selected (All Countries), show nothing
      filteredDistributors = [];
      console.log('[rows] No country selected, showing no distributors');
    }
    
    return filteredDistributors.map(distributor => ({
      ...distributor,
      isActive: distributor.is_active !== false,
    }));
  }, [distributors, selectedCountryFilter]);

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
      state_id: '',
      city_id: '',
      zone_id: '',
      pincode: '',
      gstin: '',
      pan: '',
      territory: '',
      commission_rate: '',
    });
    setStates([]);
    setCities([]);
    setZones([]);
    prevCountryIdRef.current = '';
  };

  const handleAdd = () => {
    resetForm();
    setOpenAdd(true);
  };

  const handleEdit = async (row) => {
    // Validate that row has an ID - check multiple possible ID field names
    if (!row) {
      setError('Invalid distributor data: row is null or undefined');
      return;
    }
    
    const distributorId = row.id || row.distributor_id || row.distributorId;
    if (!distributorId) {
      console.error('Edit failed: Missing distributor ID', row);
      setError('Invalid distributor data: missing ID. Please refresh the page and try again.');
      return;
    }
    
    isInitializingEditRef.current = true;
    setFormData({
      distributor_name: row.distributor_name || '',
      trade_name: row.trade_name || '',
      contact_person: row.contact_person || '',
      email: row.email || '',
      phone: row.phone || '',
      address: row.address || '',
      country_id: row.country_id || '',
      state_id: row.state_id || '',
      city_id: row.city_id || '',
      zone_id: row.zone_id || '',
      pincode: row.pincode || '',
      gstin: row.gstin || '',
      pan: row.pan || '',
      territory: row.territory || '',
      commission_rate: row.commission_rate || '',
    });
    setEditRow(row);
    
    // Load dependent data for editing
    if (row.country_id) {
      await fetchStates(row.country_id);
      if (row.state_id) {
        await fetchCities(row.state_id);
        if (row.city_id) {
          await fetchZones(row.city_id);
        }
      }
    }
    
    // Reset the flag after a short delay to allow useEffect to process
    setTimeout(() => {
      isInitializingEditRef.current = false;
    }, 100);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete this distributor?`)) {
      return;
    }

    // Validate that row has an ID - check multiple possible ID field names
    const distributorId = row.id || row.distributor_id || row.distributorId;
    if (!distributorId) {
      console.error('Delete failed: Missing distributor ID', row);
      showError('Invalid distributor data: missing ID. Please refresh the page and try again.');
      return;
    }

    // Optimistically remove from table immediately
    const distributorName = row.distributor_name || 'Distributor';
    setDistributors(prev => prev.filter(d => {
      const id = d.id || d.distributor_id || d.distributorId;
      return id !== distributorId;
    }));

    try {
      setLoading(true);
      setError(null);
      console.log('Deleting distributor with ID:', distributorId);
      await deleteDistributor(distributorId);
      
      // Show success notification
      showSuccess('Distributor deleted successfully');
      setError(null);
    } catch (error) {
      console.error('Delete distributor error:', error);
      
      // Revert optimistic update on error
      if (selectedCountryFilter) {
        await fetchDistributorsForCountry(selectedCountryFilter);
      } else {
        // If no filter, we can't easily restore, so just show error
        setError(`Failed to delete: ${error.message}`);
      }
      
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        showError(`Failed to delete distributor: ${error.message}`);
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
        state_id: formData.state_id || '',
        city_id: formData.city_id || '',
        zone_id: formData.zone_id || '',
        pincode: formData.pincode ? formData.pincode.trim() : '',
        gstin: formData.gstin ? formData.gstin.trim() : '',
        pan: formData.pan ? formData.pan.trim() : '',
        territory: formData.territory ? formData.territory.trim() : '',
        commission_rate: parseFloat(formData.commission_rate) || 0,
      };

      if (editRow) {
        // Validate that editRow has an ID - check multiple possible ID field names
        const distributorId = editRow.id || editRow.distributor_id || editRow.distributorId;
        if (!distributorId) {
          console.error('Update failed: Missing distributor ID', editRow);
          showError('Invalid distributor data: missing ID. Please refresh the page and try again.');
          setLoading(false);
          return;
        }
        
        // Optimistically update the distributor in the table immediately
        const updatedDistributor = {
          ...editRow,
          ...dataToSend,
          is_active: editRow.is_active !== undefined ? editRow.is_active : true,
          id: distributorId,
        };
        
        setDistributors(prev => prev.map(d => {
          const id = d.id || d.distributor_id || d.distributorId;
          return id === distributorId ? updatedDistributor : d;
        }));
        
        console.log('Updating distributor with ID:', distributorId, 'Data:', dataToSend);
        
        try {
          await updateDistributor(distributorId, { 
          ...dataToSend, 
          is_active: editRow.is_active !== undefined ? editRow.is_active : true 
        });
          
          // Show success notification
          showSuccess('Distributor updated successfully');
          setError(null);
          setOpenAdd(false);
          setEditRow(null);
          resetForm();
        } catch (error) {
          console.error('Update distributor error:', error);
          
          // Revert optimistic update on error by refetching
          if (selectedCountryFilter) {
            await fetchDistributorsForCountry(selectedCountryFilter);
          }
          
          if (!error.message?.toLowerCase().includes('token expired') && 
              !error.message?.toLowerCase().includes('unauthorized')) {
            showError(`Failed to update distributor: ${error.message}`);
          }
          setLoading(false);
          return;
        }
      } else {
        // Create new distributor
        try {
          const newDistributor = await createDistributor(dataToSend);
          
          // Optimistically add to table if it matches the current filter
          if (selectedCountryFilter && newDistributor && newDistributor.country_id === selectedCountryFilter) {
            setDistributors(prev => [...prev, {
              ...newDistributor,
              id: newDistributor.id || newDistributor.distributor_id,
              isActive: newDistributor.is_active !== false,
            }]);
          } else if (selectedCountryFilter) {
            // If country doesn't match filter, just refresh
            await fetchDistributorsForCountry(selectedCountryFilter);
          }
          
          // Show success notification
          showSuccess('Distributor created successfully');
      setError(null);
      setOpenAdd(false);
      setEditRow(null);
      resetForm();
        } catch (createError) {
          console.error('Create distributor error:', createError);
          
          // Revert by refreshing if needed
          if (selectedCountryFilter) {
            await fetchDistributorsForCountry(selectedCountryFilter);
          }
          
          if (!createError.message?.toLowerCase().includes('token expired') && 
              !createError.message?.toLowerCase().includes('unauthorized')) {
            showError(`Failed to create distributor: ${createError.message}`);
            setError(`Failed to save: ${createError.message}`);
          }
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      // This catch block only handles create errors (update errors are handled above)
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        showError(`Failed to create distributor: ${error.message}`);
        setError(`Failed to save: ${error.message}`);
      }
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
                if (selectedCountryFilter) {
                  fetchDistributorsForCountry(selectedCountryFilter);
                }
              }}
              importText="Refresh Data"
              showFilter={true}
              filterContent={
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                    Filter by Country
                  </label>
                  <select
                    className="ui-input"
                    value={selectedCountryFilter || ''}
                    onChange={(e) => {
                      const newCountryId = e.target.value || null;
                      const oldCountryId = selectedCountryFilter;
                      console.log('[Filter] Country selection changed from', oldCountryId, 'to', newCountryId);
                      
                      // Clear distributors immediately when changing countries
                      setDistributors([]);
                      
                      // Update state - useEffect will handle fetching or clearing
                      setSelectedCountryFilter(newCountryId);
                      
                      // If "All Countries" is selected (empty), ensure distributors are cleared
                      if (!newCountryId) {
                        console.log('[Filter] All Countries selected - clearing distributors');
                        setDistributors([]);
                        setLoading(false);
                      }
                    }}
                    style={{ width: '100%', minWidth: '200px' }}
                  >
                    <option value="">All Countries</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              }
              loading={loading}
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
            <label className="ui-label">State</label>
            <select
              className="ui-input" 
              value={formData.state_id}
              onChange={(e) => handleInputChange('state_id', e.target.value)}
              disabled={!formData.country_id}
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="ui-label">City</label>
            <select
              className="ui-input" 
              value={formData.city_id}
              onChange={(e) => handleInputChange('city_id', e.target.value)}
              disabled={!formData.state_id}
            >
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="ui-label">Zone</label>
            <select
              className="ui-input" 
              value={formData.zone_id}
              onChange={(e) => handleInputChange('zone_id', e.target.value)}
              disabled={!formData.city_id}
            >
              <option value="">Select Zone</option>
              {zones.map(zone => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
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
          <div className="form-group">
            <label className="ui-label">GSTIN</label>
            <input 
              className="ui-input" 
              placeholder="GSTIN"
              value={formData.gstin}
              onChange={(e) => handleInputChange('gstin', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="ui-label">PAN</label>
            <input 
              className="ui-input" 
              placeholder="PAN"
              value={formData.pan}
              onChange={(e) => handleInputChange('pan', e.target.value)}
            />
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
            <label className="ui-label">State</label>
            <select
              className="ui-input" 
              value={formData.state_id}
              onChange={(e) => handleInputChange('state_id', e.target.value)}
              disabled={!formData.country_id}
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="ui-label">City</label>
            <select
              className="ui-input" 
              value={formData.city_id}
              onChange={(e) => handleInputChange('city_id', e.target.value)}
              disabled={!formData.state_id}
            >
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="ui-label">Zone</label>
            <select
              className="ui-input" 
              value={formData.zone_id}
              onChange={(e) => handleInputChange('zone_id', e.target.value)}
              disabled={!formData.city_id}
            >
              <option value="">Select Zone</option>
              {zones.map(zone => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
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
          <div className="form-group">
            <label className="ui-label">GSTIN</label>
            <input 
              className="ui-input" 
              placeholder="GSTIN"
              value={formData.gstin}
              onChange={(e) => handleInputChange('gstin', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="ui-label">PAN</label>
            <input 
              className="ui-input" 
              placeholder="PAN"
              value={formData.pan}
              onChange={(e) => handleInputChange('pan', e.target.value)}
            />
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
        </form>
      </Modal>
    </div>
  );
};

export default DashboardDistributor;
