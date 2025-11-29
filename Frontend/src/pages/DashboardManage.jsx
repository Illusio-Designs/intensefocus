import React, { useMemo, useState, useEffect } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';
import DropdownSelector from '../components/ui/DropdownSelector';
import {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
  getStates,
  createState,
  updateState,
  deleteState,
  getCities,
  createCity,
  updateCity,
  deleteCity,
  getZones,
  createZone,
  updateZone,
  deleteZone,
} from '../services/apiService';
import '../styles/pages/dashboard-orders.css';

const DashboardManage = () => {
  const [activeTab, setActiveTab] = useState('Country');
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  
  // Form states
  const [formData, setFormData] = useState({
    type: 'Country',
    // Country fields
    name: '',
    code: '',
    phone_code: '',
    currency: '',
    // State fields
    country_id: '',
    // City fields
    state_id: '',
    // Zone fields
    city_id: '',
    description: '',
    zone_code: '',
  });
  
  // Options for dropdowns
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  // Fetch data based on active tab
  useEffect(() => {
    fetchDataForTab(activeTab);
  }, [activeTab]);

  // Update dropdown options when data changes
  useEffect(() => {
    setCountryOptions(countries.map(c => ({ value: c.id, label: c.name })));
  }, [countries]);

  useEffect(() => {
    if (formData.country_id) {
      fetchStates(formData.country_id);
    } else {
      setStateOptions([]);
      setStates([]);
    }
  }, [formData.country_id]);

  useEffect(() => {
    if (formData.state_id) {
      fetchCities(formData.state_id);
    } else {
      setCityOptions([]);
      setCities([]);
    }
  }, [formData.state_id]);

  useEffect(() => {
    if (formData.city_id) {
      fetchZones(formData.city_id);
    } else {
      setZones([]);
    }
  }, [formData.city_id]);

  const fetchDataForTab = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      switch (tab) {
        case 'Country':
          const countriesData = await getCountries().catch((error) => {
            if (!error.message?.toLowerCase().includes('token expired') && 
                !error.message?.toLowerCase().includes('unauthorized')) {
              console.error('Error fetching countries:', error);
              if (error.message?.toLowerCase().includes("doesn't exist") || 
                  error.message?.toLowerCase().includes('table')) {
                setError('Database tables not found. Please contact the administrator to set up the database tables.');
              } else {
                setError(`Failed to load countries: ${error.message}`);
              }
            }
            return [];
          });
          setCountries(countriesData || []);
          break;
        
        case 'State':
          // First fetch countries to get country IDs, then fetch states
          const countriesForStates = await getCountries().catch(() => []);
          setCountries(countriesForStates || []);
          
          if (countriesForStates && countriesForStates.length > 0) {
            const statesPromises = countriesForStates.map(country => 
              getStates(country.id).catch((error) => {
                if (!error.message?.toLowerCase().includes('token expired') && 
                    !error.message?.toLowerCase().includes('unauthorized')) {
                  console.error('Error fetching states:', error);
                }
                return [];
              })
            );
            const statesArrays = await Promise.all(statesPromises);
            const allStates = statesArrays.flat();
            setStates(allStates);
          } else {
            setStates([]);
          }
          break;
        
        case 'City':
          // Fetch countries and states first
          const countriesForCities = await getCountries().catch(() => []);
          setCountries(countriesForCities || []);
          
          if (countriesForCities && countriesForCities.length > 0) {
            const statesPromises = countriesForCities.map(country => 
              getStates(country.id).catch(() => [])
            );
            const statesArrays = await Promise.all(statesPromises);
            const allStatesForCities = statesArrays.flat();
            setStates(allStatesForCities);
            
            if (allStatesForCities.length > 0) {
              const citiesPromises = allStatesForCities.map(state => 
                getCities(state.id).catch((error) => {
                  if (!error.message?.toLowerCase().includes('token expired') && 
                      !error.message?.toLowerCase().includes('unauthorized')) {
                    console.error('Error fetching cities:', error);
                  }
                  return [];
                })
              );
              const citiesArrays = await Promise.all(citiesPromises);
              const allCities = citiesArrays.flat();
              setCities(allCities);
            } else {
              setCities([]);
            }
          } else {
            setStates([]);
            setCities([]);
          }
          break;
        
        case 'Zone':
          // Fetch countries, states, and cities first
          const countriesForZones = await getCountries().catch(() => []);
          setCountries(countriesForZones || []);
          
          if (countriesForZones && countriesForZones.length > 0) {
            const statesPromises = countriesForZones.map(country => 
              getStates(country.id).catch(() => [])
            );
            const statesArrays = await Promise.all(statesPromises);
            const allStatesForZones = statesArrays.flat();
            setStates(allStatesForZones);
            
            if (allStatesForZones.length > 0) {
              const citiesPromises = allStatesForZones.map(state => 
                getCities(state.id).catch(() => [])
              );
              const citiesArrays = await Promise.all(citiesPromises);
              const allCitiesForZones = citiesArrays.flat();
              setCities(allCitiesForZones);
              
              if (allCitiesForZones.length > 0) {
                const zonesPromises = allCitiesForZones.map(city => 
                  getZones(city.id).catch((error) => {
                    if (!error.message?.toLowerCase().includes('token expired') && 
                        !error.message?.toLowerCase().includes('unauthorized')) {
                      console.error('Error fetching zones:', error);
                    }
                    return [];
                  })
                );
                const zonesArrays = await Promise.all(zonesPromises);
                const allZones = zonesArrays.flat();
                setZones(allZones);
              } else {
                setZones([]);
              }
            } else {
              setCities([]);
              setZones([]);
            }
          } else {
            setStates([]);
            setCities([]);
            setZones([]);
          }
          break;
        
        default:
          break;
      }
    } catch (error) {
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        console.error('Error fetching data:', error);
        if (error.message?.toLowerCase().includes("doesn't exist") || 
            error.message?.toLowerCase().includes('table')) {
          setError('Database tables not found. Please contact the administrator to set up the database tables.');
        } else {
          setError(`Failed to load data: ${error.message}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async (countryId) => {
    try {
      const statesData = await getStates(countryId);
      setStates(statesData || []);
      setStateOptions((statesData || []).map(s => ({ value: s.id, label: s.name })));
    } catch (error) {
      // Don't log token expiration errors as they're handled by apiService
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        console.error('Error fetching states:', error);
      }
      setStates([]);
      setStateOptions([]);
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const citiesData = await getCities(stateId);
      setCities(citiesData || []);
      setCityOptions((citiesData || []).map(c => ({ value: c.id, label: c.name })));
    } catch (error) {
      // Don't log token expiration errors as they're handled by apiService
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        console.error('Error fetching cities:', error);
      }
      setCities([]);
      setCityOptions([]);
    }
  };

  const fetchZones = async (cityId) => {
    try {
      const zonesData = await getZones(cityId);
      setZones(zonesData || []);
    } catch (error) {
      // Don't log token expiration errors as they're handled by apiService
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        console.error('Error fetching zones:', error);
      }
      setZones([]);
    }
  };

  // Combine all data into rows
  const rows = useMemo(() => {
    const allRows = [];
    
    countries.forEach(country => {
      allRows.push({
        id: country.id,
        type: 'Country',
        name: country.name,
        code: country.code,
        phone_code: country.phone_code,
        currency: country.currency,
        details: `${country.code} | ${country.phone_code} | ${country.currency}`,
        data: country,
      });
    });
    
    states.forEach(state => {
      const country = countries.find(c => c.id === state.country_id);
      allRows.push({
        id: state.id,
        type: 'State',
        name: state.name,
        details: `${state.code} | ${country?.name || 'N/A'}`,
        data: state,
      });
    });
    
    cities.forEach(city => {
      const state = states.find(s => s.id === city.state_id);
      allRows.push({
        id: city.id,
        type: 'City',
        name: city.name,
        details: state?.name || 'N/A',
        data: city,
      });
    });
    
    zones.forEach(zone => {
      const city = cities.find(c => c.id === zone.city_id);
      allRows.push({
        id: zone.id,
        type: 'Zone',
        name: zone.name,
        details: `${zone.zone_code || 'N/A'} | ${city?.name || 'N/A'}`,
        data: zone,
      });
    });
    
    return allRows;
  }, [countries, states, cities, zones]);

  const columns = useMemo(() => {
    // Different columns for different tabs
    if (activeTab === 'Country') {
      return [
        { key: 'name', label: 'NAME' },
        { key: 'code', label: 'CODE' },
        { key: 'phone_code', label: 'PHONE CODE' },
        { key: 'currency', label: 'CURRENCY' },
        { key: 'action', label: 'ACTION', render: (_v, row) => (
          <RowActions 
            onEdit={() => handleEdit(row)} 
            onDelete={() => handleDelete(row)} 
          />
        ) },
      ];
    }
    // Default columns for other tabs
    return [
      { key: 'type', label: 'TYPE' },
      { key: 'name', label: 'NAME' },
      { key: 'details', label: 'DETAILS' },
      { key: 'action', label: 'ACTION', render: (_v, row) => (
        <RowActions 
          onEdit={() => handleEdit(row)} 
          onDelete={() => handleDelete(row)} 
        />
      ) },
    ];
  }, [activeTab]);

  const tabs = useMemo(() => (['Country', 'State', 'City', 'Zone']), []);

  const filteredRowsByTab = useMemo(() => {
    return rows.filter(row => row.type === activeTab);
  }, [rows, activeTab]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset dependent fields when parent changes
      ...(field === 'country_id' && { state_id: '', city_id: '' }),
      ...(field === 'state_id' && { city_id: '' }),
    }));
  };

  const resetForm = () => {
    setFormData({
      type: 'Country',
      name: '',
      code: '',
      phone_code: '',
      currency: '',
      country_id: '',
      state_id: '',
      city_id: '',
      description: '',
      zone_code: '',
    });
  };

  const handleAdd = () => {
    resetForm();
    setFormData(prev => ({ ...prev, type: activeTab }));
    setOpenAdd(true);
  };

  const handleEdit = async (row) => {
    const { type, data } = row;
    const editData = {
      type,
      name: data.name || '',
      code: data.code || '',
      phone_code: data.phone_code || '',
      currency: data.currency || '',
      country_id: data.country_id || '',
      state_id: data.state_id || '',
      city_id: data.city_id || '',
      description: data.description || '',
      zone_code: data.zone_code || '',
    };
    
    setFormData(editData);
    setEditRow(row);
    
    // Load dependent data for dropdowns
    if (editData.country_id) {
      await fetchStates(editData.country_id);
      if (editData.state_id) {
        await fetchCities(editData.state_id);
        if (editData.city_id) {
          await fetchZones(editData.city_id);
        }
      }
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete this ${row.type}?`)) {
      return;
    }

    try {
      setLoading(true);
      switch (row.type) {
        case 'Country':
          await deleteCountry(row.id);
          break;
        case 'State':
          await deleteState(row.id);
          break;
        case 'City':
          await deleteCity(row.id);
          break;
        case 'Zone':
          await deleteZone(row.id);
          break;
      }
      await fetchDataForTab(activeTab);
      setError(null); // Clear any previous errors
    } catch (error) {
      // Don't show alert for token expiration as user will be redirected
      if (error.message?.toLowerCase().includes('token expired') || 
          error.message?.toLowerCase().includes('unauthorized')) {
        // Token expiration is handled by apiService, just return
        return;
      }
      console.error('Error deleting:', error);
      // Check for database errors
      if (error.message?.toLowerCase().includes("doesn't exist") || 
          error.message?.toLowerCase().includes('table')) {
        setError('Database tables not found. Please contact the administrator to set up the database tables.');
      } else {
        setError(`Failed to delete item: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { type } = formData;
      let dataToSend = {};
      
      switch (type) {
        case 'Country':
          dataToSend = {
            name: formData.name,
            code: formData.code,
            phone_code: formData.phone_code,
            currency: formData.currency,
          };
          if (editRow) {
            await updateCountry(editRow.id, dataToSend);
          } else {
            await createCountry(dataToSend);
          }
          break;
        case 'State':
          dataToSend = {
            name: formData.name,
            code: formData.code,
            country_id: formData.country_id,
          };
          if (editRow) {
            await updateState(editRow.id, dataToSend);
          } else {
            await createState(dataToSend);
          }
          break;
        case 'City':
          dataToSend = {
            name: formData.name,
            state_id: formData.state_id,
          };
          if (editRow) {
            await updateCity(editRow.id, dataToSend);
          } else {
            await createCity(dataToSend);
          }
          break;
        case 'Zone':
          dataToSend = {
            name: formData.name,
            description: formData.description || '',
            city_id: formData.city_id,
            state_id: formData.state_id,
            country_id: formData.country_id,
            zone_code: formData.zone_code || '',
          };
          if (editRow) {
            await updateZone(editRow.id, dataToSend);
          } else {
            await createZone(dataToSend);
          }
          break;
      }
      
      await fetchDataForTab(activeTab);
      setError(null); // Clear any previous errors
      setOpenAdd(false);
      setEditRow(null);
      resetForm();
    } catch (error) {
      // Don't show alert for token expiration as user will be redirected
      if (error.message?.toLowerCase().includes('token expired') || 
          error.message?.toLowerCase().includes('unauthorized')) {
        // Token expiration is handled by apiService, just return
        return;
      }
      console.error('Error saving:', error);
      // Check for database errors
      if (error.message?.toLowerCase().includes("doesn't exist") || 
          error.message?.toLowerCase().includes('table')) {
        setError('Database tables not found. Please contact the administrator to set up the database tables.');
      } else {
        setError(`Failed to save item: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    const { type } = formData;
    
    switch (type) {
      case 'Country':
        return (
          <>
            <div className="form-group form-group--full">
              <label className="ui-label">Country Name *</label>
              <input
                className="ui-input"
                placeholder="Enter country name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="ui-label">Country Code *</label>
              <input
                className="ui-input"
                placeholder="e.g., IN, US"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="ui-label">Phone Code *</label>
              <input
                className="ui-input"
                placeholder="e.g., +91, +1"
                value={formData.phone_code}
                onChange={(e) => handleInputChange('phone_code', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="ui-label">Currency *</label>
              <input
                className="ui-input"
                placeholder="e.g., INR, USD"
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                required
              />
            </div>
          </>
        );
      
      case 'State':
        return (
          <>
            <div className="form-group form-group--full">
              <label className="ui-label">Country *</label>
              <DropdownSelector
                options={countryOptions}
                value={formData.country_id}
                onChange={(value) => handleInputChange('country_id', value)}
                placeholder="Select country"
              />
            </div>
            <div className="form-group form-group--full">
              <label className="ui-label">State Name *</label>
              <input
                className="ui-input"
                placeholder="Enter state name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div className="form-group form-group--full">
              <label className="ui-label">State Code *</label>
              <input
                className="ui-input"
                placeholder="e.g., GJ, MH"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                required
              />
            </div>
          </>
        );
      
      case 'City':
        return (
          <>
            <div className="form-group form-group--full">
              <label className="ui-label">Country *</label>
              <DropdownSelector
                options={countryOptions}
                value={formData.country_id}
                onChange={(value) => handleInputChange('country_id', value)}
                placeholder="Select country"
              />
            </div>
            <div className="form-group form-group--full">
              <label className="ui-label">State *</label>
              <DropdownSelector
                options={stateOptions}
                value={formData.state_id}
                onChange={(value) => handleInputChange('state_id', value)}
                placeholder="Select state"
                disabled={!formData.country_id}
              />
            </div>
            <div className="form-group form-group--full">
              <label className="ui-label">City Name *</label>
              <input
                className="ui-input"
                placeholder="Enter city name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
          </>
        );
      
      case 'Zone':
        return (
          <>
            <div className="form-group form-group--full">
              <label className="ui-label">Country *</label>
              <DropdownSelector
                options={countryOptions}
                value={formData.country_id}
                onChange={(value) => handleInputChange('country_id', value)}
                placeholder="Select country"
              />
            </div>
            <div className="form-group form-group--full">
              <label className="ui-label">State *</label>
              <DropdownSelector
                options={stateOptions}
                value={formData.state_id}
                onChange={(value) => handleInputChange('state_id', value)}
                placeholder="Select state"
                disabled={!formData.country_id}
              />
            </div>
            <div className="form-group form-group--full">
              <label className="ui-label">City *</label>
              <DropdownSelector
                options={cityOptions}
                value={formData.city_id}
                onChange={(value) => handleInputChange('city_id', value)}
                placeholder="Select city"
                disabled={!formData.state_id}
              />
            </div>
            <div className="form-group form-group--full">
              <label className="ui-label">Zone Name *</label>
              <input
                className="ui-input"
                placeholder="Enter zone name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div className="form-group form-group--full">
              <label className="ui-label">Zone Code</label>
              <input
                className="ui-input"
                placeholder="Enter zone code"
                value={formData.zone_code}
                onChange={(e) => handleInputChange('zone_code', e.target.value)}
              />
            </div>
            <div className="form-group form-group--full">
              <label className="ui-label">Description</label>
              <input
                className="ui-input"
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="order-tabs-container">
            {tabs.map(tab => (
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
              title="Manage"
              columns={columns}
              rows={filteredRowsByTab}
              onAddNew={handleAdd}
              addNewText="Add Item"
              onImport={() => {
                setError(null);
                fetchDataForTab(activeTab);
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
        title={`Add ${activeTab}`}
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
          {renderFormFields()}
        </form>
      </Modal>
      <Modal
        open={!!editRow}
        onClose={() => {
          setEditRow(null);
          resetForm();
        }}
        title={`Edit ${editRow?.type || ''}`}
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
          {renderFormFields()}
        </form>
      </Modal>
    </div>
  );
};

export default DashboardManage;
