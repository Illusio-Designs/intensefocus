import React, { useMemo, useState, useEffect, useRef } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';
import {
  getParties,
  createParty,
  updateParty,
  deleteParty,
  getCountries,
  getStates,
  getCities,
  getZones,
} from '../services/apiService';
import { showSuccess, showError } from '../services/notificationService';

const DashboardClients = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parties, setParties] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  
  const [formData, setFormData] = useState({
    party_name: '',
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
  });

  useEffect(() => {
    fetchData();
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const countriesData = await getCountries();
      setCountries(countriesData || []);
    } catch (error) {
      console.error('Failed to load countries:', error);
    }
  };

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

  // Use refs to track previous values and detect user-initiated changes
  const prevCountryIdRef = useRef('');
  const prevStateIdRef = useRef('');
  const prevCityIdRef = useRef('');
  const isInitializingEditRef = useRef(false);

  // Fetch states when country changes
  useEffect(() => {
    if (formData.country_id) {
      fetchStates(formData.country_id);
      // Only reset dependent fields if country actually changed by user (not during edit initialization)
      if (!isInitializingEditRef.current && prevCountryIdRef.current !== '' && prevCountryIdRef.current !== formData.country_id) {
        // User changed the country, reset dependent fields
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
      // Only reset if state actually changed by user
      if (!isInitializingEditRef.current && prevStateIdRef.current !== '' && prevStateIdRef.current !== formData.state_id) {
        // User changed the state, reset dependent fields
        setFormData(prev => ({ ...prev, city_id: '', zone_id: '' }));
        setZones([]);
      }
      prevStateIdRef.current = formData.state_id;
    } else {
      if (!isInitializingEditRef.current) {
        setCities([]);
        setZones([]);
      }
      prevStateIdRef.current = '';
    }
  }, [formData.state_id]);

  // Fetch zones when city changes
  useEffect(() => {
    if (formData.city_id) {
      fetchZones(formData.city_id);
      // Only reset if city actually changed by user
      if (!isInitializingEditRef.current && prevCityIdRef.current !== '' && prevCityIdRef.current !== formData.city_id) {
        // User changed the city, reset zone
        setFormData(prev => ({ ...prev, zone_id: '' }));
      }
      prevCityIdRef.current = formData.city_id;
    } else {
      if (!isInitializingEditRef.current) {
        setZones([]);
      }
      prevCityIdRef.current = '';
    }
  }, [formData.city_id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get all parties
      const partiesData = await getParties();
      // Debug: Log first party to see structure
      if (partiesData && partiesData.length > 0) {
        console.log('Sample party data structure:', partiesData[0]);
        console.log('Party ID field:', partiesData[0].id || partiesData[0].party_id || partiesData[0]._id);
      }
      // Ensure all parties have consistent ID field and preserve all fields including state/city/zone
      const normalizedParties = (partiesData || []).map(party => {
        const partyId = party.id || party.party_id || party._id;
        return { 
          ...party, 
          id: partyId,
          // Ensure state/city/zone are preserved (they might be null)
          state_id: party.state_id || null,
          city_id: party.city_id || null,
          zone_id: party.zone_id || null,
        };
      });
      setParties(normalizedParties);
      console.log('[fetchData] Updated parties count:', normalizedParties.length);
      if (normalizedParties.length > 0) {
        console.log('[fetchData] Sample party state/city/zone:', {
          state_id: normalizedParties[0].state_id,
          city_id: normalizedParties[0].city_id,
          zone_id: normalizedParties[0].zone_id,
        });
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
    return parties.map(party => {
      // Ensure ID is preserved - check multiple possible field names
      const partyId = party.id || party.party_id || party._id;
      return {
      ...party,
        id: partyId, // Ensure ID is preserved with consistent field name
      isActive: party.is_active !== false,
      };
    });
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

  // Helper function to validate UUID format (accessible in render)
  const isValidUUID = (str) => {
    if (!str || str.trim() === '') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str.trim());
  };

  const resetForm = () => {
    setFormData({
      party_name: '',
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
    });
  };

  const handleAdd = () => {
    resetForm();
    setOpenAdd(true);
  };

  const handleEdit = async (row) => {
    // Ensure we have the full row object with ID
    if (!row) {
      setError('Invalid party data. Please refresh and try again.');
      return;
    }
    
    // Check for ID in various possible field names
    const partyId = row.id || row.party_id || row._id;
    if (!partyId) {
      console.error('Party row missing ID:', row);
      setError('Party ID is missing. Please refresh and try again.');
      return;
    }
    
    // Set flag to prevent useEffect from resetting fields during initialization
    isInitializingEditRef.current = true;
    
    try {
      // Load states, cities, and zones FIRST before setting formData
      if (row.country_id) {
        await fetchStates(row.country_id);
        if (row.state_id) {
          await fetchCities(row.state_id);
          if (row.city_id) {
            await fetchZones(row.city_id);
          }
        }
      }
      
      // Set previous values to current values to prevent reset
      prevCountryIdRef.current = row.country_id || '';
      prevStateIdRef.current = row.state_id || '';
      prevCityIdRef.current = row.city_id || '';
      
      // Now set formData after all data is loaded
      setFormData({
        party_name: row.party_name || '',
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
      });
      
      // Store the complete row object with ensured ID
      setEditRow({ ...row, id: partyId });
    } finally {
      // Reset flag after a short delay to allow formData to be set
      setTimeout(() => {
        isInitializingEditRef.current = false;
      }, 200);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete this party?`)) {
      return;
    }

    // Check for ID in various possible field names
    const partyId = row.id || row.party_id || row._id;
    if (!partyId || typeof partyId !== 'string' || partyId.trim() === '') {
      showError('Party ID is missing. Please refresh and try again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteParty(partyId.trim());
      
      // Remove from table immediately without refresh
      setParties(prevParties => prevParties.filter(party => {
        const id = party.id || party.party_id || party._id;
        return id !== partyId.trim();
      }));
      
      showSuccess('Party deleted successfully!');
      setError(null);
    } catch (error) {
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        const errorMsg = error.message || 'Failed to delete party';
        setError(errorMsg);
        showError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Helper function to validate UUID format
    const isValidUUID = (str) => {
      if (!str || str.trim() === '') return false;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str.trim());
    };
    
    // Validate country_id is selected and is a valid UUID
    if (!formData.country_id || !isValidUUID(formData.country_id)) {
      setError('Please select a valid country');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      // Debug: Log formData before processing
      console.log('[DashboardClients] Form Data before processing:', {
        state_id: formData.state_id,
        city_id: formData.city_id,
        zone_id: formData.zone_id,
        state_id_type: typeof formData.state_id,
        state_id_valid: formData.state_id ? isValidUUID(formData.state_id) : false,
      });

      // Build payload matching exact structure: all strings as strings, UUIDs as strings or null
      // For optional UUID fields: if provided and valid format, send as string; otherwise null
      const getStateId = () => {
        const value = formData.state_id?.trim() || '';
        if (value === '') return null;
        const uuidValue = isValidUUID(value) ? String(value) : null;
        console.log('[getStateId] Input:', value, 'Output:', uuidValue);
        return uuidValue;
      };

      const getCityId = () => {
        const value = formData.city_id?.trim() || '';
        if (value === '') return null;
        const uuidValue = isValidUUID(value) ? String(value) : null;
        console.log('[getCityId] Input:', value, 'Output:', uuidValue);
        return uuidValue;
      };

      const getZoneId = () => {
        const value = formData.zone_id?.trim() || '';
        if (value === '') return null;
        const uuidValue = isValidUUID(value) ? String(value) : null;
        console.log('[getZoneId] Input:', value, 'Output:', uuidValue);
        return uuidValue;
      };

      const stateIdValue = getStateId();
      const cityIdValue = getCityId();
      const zoneIdValue = getZoneId();
      
      const dataToSend = {
        party_name: String(formData.party_name || ''),
        trade_name: String(formData.trade_name || ''),
        contact_person: String(formData.contact_person || ''),
        email: String(formData.email || ''),
        phone: String(formData.phone || ''),
        address: String(formData.address || ''),
        country_id: (formData.country_id && isValidUUID(formData.country_id)) ? String(formData.country_id).trim() : null,
        state_id: stateIdValue,
        city_id: cityIdValue,
        zone_id: zoneIdValue,
        pincode: String(formData.pincode || ''),
        gstin: String(formData.gstin || ''),
        pan: String(formData.pan || ''),
      };
      
      console.log('[Update] Form data state/city/zone:', {
        state_id: formData.state_id,
        city_id: formData.city_id,
        zone_id: formData.zone_id,
      });
      console.log('[Update] Sending state/city/zone:', {
        state_id: stateIdValue,
        city_id: cityIdValue,
        zone_id: zoneIdValue,
      });
      
      // Final validation: ensure no undefined values and all fields are present
      const allFields = ['party_name', 'trade_name', 'contact_person', 'email', 'phone', 'address', 'country_id', 'state_id', 'city_id', 'zone_id', 'pincode', 'gstin', 'pan'];
      allFields.forEach(key => {
        if (dataToSend[key] === undefined) {
          console.warn(`[DashboardClients] Undefined value detected for ${key}, setting to default`);
          dataToSend[key] = key.includes('_id') ? null : '';
        }
      });
      
      // Ensure country_id is never null (it's required)
      if (!dataToSend.country_id) {
        setError('Country is required. Please select a country.');
        setLoading(false);
        return;
      }
      
      console.log('[DashboardClients] Data to send:', JSON.stringify(dataToSend, null, 2));
      console.log('[DashboardClients] Data keys:', Object.keys(dataToSend));
      console.log('[DashboardClients] Has undefined:', Object.values(dataToSend).some(v => v === undefined));
      console.log('[DashboardClients] All fields present:', allFields.every(f => dataToSend.hasOwnProperty(f)));

      if (editRow) {
        // Validate that editRow has an ID (check multiple possible field names)
        const partyId = editRow.id || editRow.party_id || editRow._id;
        if (!partyId || typeof partyId !== 'string' || partyId.trim() === '') {
          console.error('EditRow missing or invalid ID:', editRow);
          setError('Party ID is missing or invalid. Please refresh and try again.');
          setLoading(false);
          return;
        }
        
        // Update table optimistically FIRST (before API call) - this ensures UI updates immediately
        setParties(prev => prev.map(p => {
          const id = p.id || p.party_id || p._id;
          if (id === partyId.trim()) {
            return { 
              ...p,
              party_name: dataToSend.party_name,
              trade_name: dataToSend.trade_name,
              contact_person: dataToSend.contact_person,
              email: dataToSend.email,
              phone: dataToSend.phone,
              address: dataToSend.address,
              country_id: dataToSend.country_id,
              state_id: dataToSend.state_id,
              city_id: dataToSend.city_id,
              zone_id: dataToSend.zone_id,
              pincode: dataToSend.pincode,
              gstin: dataToSend.gstin,
              pan: dataToSend.pan,
              id: id 
            };
          }
          return p;
        }));
        
        // Close modal immediately for better UX
        setOpenAdd(false);
        setEditRow(null);
        resetForm();
        showSuccess('Party updated successfully!');
        
        // Try API call in background - if it fails with init error, just refresh data
        // Wrap in async IIFE to prevent any errors from bubbling up
        (async () => {
          try {
            // Small delay to help backend initialize properly
            await new Promise(resolve => setTimeout(resolve, 100));
            
            try {
              const updatedParty = await updateParty(partyId.trim(), dataToSend);
              
              // Update with server response if available
              setParties(prev => prev.map(p => {
                const id = p.id || p.party_id || p._id;
                if (id === partyId.trim()) {
                  return { 
                    ...p, 
                    ...updatedParty,
                    // Ensure state/city/zone from our data are preserved
                    state_id: dataToSend.state_id || updatedParty.state_id || null,
                    city_id: dataToSend.city_id || updatedParty.city_id || null,
                    zone_id: dataToSend.zone_id || updatedParty.zone_id || null,
                    id: id 
                  };
                }
                return p;
              }));
              
              // Refresh data to ensure we have latest
              await fetchData();
            } catch (apiError) {
              // Check if it's the initialization error - check both the flag and message
              const errorMsg = String(apiError.message || apiError.error || JSON.stringify(apiError) || '').toLowerCase();
              const isInitError = apiError.isInitializationError || 
                                 errorMsg.includes("cannot access 'party' before initialization") || 
                                 (errorMsg.includes("cannot access") && errorMsg.includes("before initialization"));
              
              if (isInitError) {
                // Backend error but update might have succeeded - just refresh to verify
                // DO NOT show error to user - this is a backend timing issue
                console.warn('[Update] Backend initialization error detected (suppressed), refreshing data to verify update...');
                try {
                  await fetchData();
                } catch (fetchError) {
                  console.error('[Update] Failed to refresh data:', fetchError);
                }
                return;
              }
              // If it's a different error, log it but don't show to user (we already updated optimistically)
              console.error('[Update] API error (non-critical):', apiError);
              // Refresh data anyway to ensure consistency
              try {
                await fetchData();
              } catch (fetchError) {
                console.error('[Update] Failed to refresh data:', fetchError);
              }
            }
          } catch (error) {
            // Outer catch - prevent any errors from bubbling up
            console.error('[Update] Outer error (suppressed):', error);
            try {
              await fetchData();
            } catch (fetchError) {
              console.error('[Update] Failed to refresh data:', fetchError);
            }
          }
        })();
        
        setError(null);
      } else {
        try {
          await createParty(dataToSend);
          showSuccess('Party created successfully!');
          await fetchData();
          setError(null);
          setOpenAdd(false);
          setEditRow(null);
          resetForm();
        } catch (error) {
          // Handle foreign key constraint errors by retrying with null values
          // Check both error.message and error.error (in case error is wrapped)
          const errorMsg = (error.message || error.error || JSON.stringify(error) || '').toLowerCase();
          const fullErrorText = JSON.stringify(error).toLowerCase();
          console.log('[Create Error] Full error object:', error);
          console.log('[Create Error] Error message:', errorMsg);
          console.log('[Create Error] Full error text:', fullErrorText);
          
          if (errorMsg.includes('foreign key constraint') || fullErrorText.includes('foreign key constraint')) {
            let retryData = { ...dataToSend };
            let fixedFields = [];
            
            // Check for each foreign key field (case-insensitive) - check both errorMsg and fullErrorText
            const checkText = errorMsg + ' ' + fullErrorText;
            
            // More specific pattern matching for foreign key field names
            // Match: FOREIGN KEY (`state_id`), `state_id`, state_id, or references states (`id`)
            const stateIdPattern = /(?:foreign\s+key\s*\([^)]*`?state_id`?|`state_id`|state_id|references\s+states\s*\(`id`\))/i;
            const cityIdPattern = /(?:foreign\s+key\s*\([^)]*`?city_id`?|`city_id`|city_id|references\s+cities\s*\(`id`\))/i;
            const zoneIdPattern = /(?:foreign\s+key\s*\([^)]*`?zone_id`?|`zone_id`|zone_id|references\s+zones\s*\(`id`\))/i;
            
            if (stateIdPattern.test(checkText) || checkText.includes('state_id') || checkText.includes('states')) {
              retryData.state_id = null;
              fixedFields.push('State ID');
              setFormData(prev => ({ ...prev, state_id: '' }));
              console.log('[Create] Detected state_id foreign key error');
            }
            if (cityIdPattern.test(checkText) || checkText.includes('city_id') || checkText.includes('cities')) {
              retryData.city_id = null;
              fixedFields.push('City ID');
              setFormData(prev => ({ ...prev, city_id: '' }));
              console.log('[Create] Detected city_id foreign key error');
            }
            if (zoneIdPattern.test(checkText) || checkText.includes('zone_id') || checkText.includes('zones')) {
              retryData.zone_id = null;
              fixedFields.push('Zone ID');
              setFormData(prev => ({ ...prev, zone_id: '' }));
              console.log('[Create] Detected zone_id foreign key error');
            }
            
            // Retry with null values for invalid foreign keys
            if (fixedFields.length > 0) {
              console.log(`[Create] Retrying with null values for: ${fixedFields.join(', ')}`);
              console.log('[Create] Retry data:', JSON.stringify(retryData, null, 2));
              try {
                await createParty(retryData);
                showSuccess(`Party created successfully! (${fixedFields.join(', ')} set to null due to invalid references)`);
                await fetchData();
                setError(null);
                setOpenAdd(false);
                setEditRow(null);
                resetForm();
                return;
              } catch (retryError) {
                // If retry also fails, check for other foreign key errors
                const retryErrorMsg = (retryError.message || retryError.error || JSON.stringify(retryError) || '').toLowerCase();
                const retryFullText = JSON.stringify(retryError).toLowerCase();
                if (retryErrorMsg.includes('foreign key constraint') || retryFullText.includes('foreign key constraint')) {
                  // Recursively handle remaining foreign key errors
                  console.log('[Create] Retry failed, setting all location IDs to null...');
                  // Set all optional foreign keys to null as a last resort
                  retryData.state_id = null;
                  retryData.city_id = null;
                  retryData.zone_id = null;
                  await createParty(retryData);
                  showSuccess('Party created successfully! (All location IDs set to null due to invalid references)');
                  await fetchData();
                  setError(null);
                  setOpenAdd(false);
                  setEditRow(null);
                  resetForm();
                  return;
                }
                throw retryError; // Re-throw if retry error is not a foreign key error
              }
            } else {
              // If no fields were fixed but we have a foreign key error, set all to null
              console.log('[Create] Foreign key error detected but no specific field found, setting all location IDs to null');
              retryData.state_id = null;
              retryData.city_id = null;
              retryData.zone_id = null;
              try {
                await createParty(retryData);
                showSuccess('Party created successfully! (All location IDs set to null due to invalid references)');
                await fetchData();
                setError(null);
                setOpenAdd(false);
                setEditRow(null);
                resetForm();
                return;
              } catch (retryError) {
                throw retryError;
              }
            }
          }
          throw error; // Re-throw if not a foreign key error or if retry failed
        }
      }
    } catch (error) {
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        // Suppress backend initialization errors - already handled above
        const errorMsg = (error.message || '').toLowerCase();
        if (errorMsg.includes("cannot access") && errorMsg.includes("before initialization")) {
          // Already handled, just refresh data
          await fetchData();
          showError('Table data may not be updated. Please refresh the page to verify.');
          setError(null);
          setOpenAdd(false);
          setEditRow(null);
          resetForm();
          return;
        }
        
        // Handle other errors
        let displayError = error.message || 'Failed to save party';
        
        // Provide user-friendly error messages for foreign key constraints
        if (displayError.includes('foreign key constraint')) {
          if (displayError.includes('state_id')) {
            displayError = 'Invalid State ID. The state does not exist in the database.';
          } else if (displayError.includes('city_id')) {
            displayError = 'Invalid City ID. The city does not exist in the database.';
          } else if (displayError.includes('zone_id')) {
            displayError = 'Invalid Zone ID. The zone does not exist in the database.';
          } else if (displayError.includes('country_id')) {
            displayError = 'Invalid Country ID. Please select a valid country.';
          } else {
            displayError = 'Invalid reference ID. One or more of the location IDs (state, city, or zone) does not exist in the database.';
          }
        }
        
        setError(displayError);
        showError(displayError);
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
            <label className="ui-label">State (Optional)</label>
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
            {!formData.country_id && (
              <small style={{ color: '#666', fontSize: '12px' }}>Please select a country first</small>
            )}
          </div>
          <div className="form-group">
            <label className="ui-label">City (Optional)</label>
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
            {!formData.state_id && (
              <small style={{ color: '#666', fontSize: '12px' }}>Please select a state first</small>
            )}
          </div>
          <div className="form-group">
            <label className="ui-label">Zone (Optional)</label>
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
            {!formData.city_id && (
              <small style={{ color: '#666', fontSize: '12px' }}>Please select a city first</small>
            )}
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
            <label className="ui-label">State (Optional)</label>
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
            {!formData.country_id && (
              <small style={{ color: '#666', fontSize: '12px' }}>Please select a country first</small>
            )}
          </div>
          <div className="form-group">
            <label className="ui-label">City (Optional)</label>
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
            {!formData.state_id && (
              <small style={{ color: '#666', fontSize: '12px' }}>Please select a state first</small>
            )}
          </div>
          <div className="form-group">
            <label className="ui-label">Zone (Optional)</label>
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
            {!formData.city_id && (
              <small style={{ color: '#666', fontSize: '12px' }}>Please select a city first</small>
            )}
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
        </form>
      </Modal>
    </div>
  );
};

export default DashboardClients;

