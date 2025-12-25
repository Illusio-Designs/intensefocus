import React, { useEffect, useMemo, useState } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';
import StatusBadge from '../components/ui/StatusBadge';
import DropdownSelector from '../components/ui/DropdownSelector';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../services/apiService';
import { showSuccess, showError } from '../services/notificationService';
import '../styles/pages/dashboard.css';
import '../styles/pages/dashboard-orders.css';

const EventStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Helper function to get status label
const getStatusLabel = (status) => {
  switch (status?.toLowerCase()) {
    case EventStatus.ACTIVE:
      return 'Active';
    case EventStatus.COMPLETED:
      return 'Completed';
    case EventStatus.CANCELLED:
      return 'Cancelled';
    default:
      return status || 'Active';
  }
};

const DashboardEvents = () => {
  const [dateRange, setDateRange] = useState('Feb 25, 2025 - Mar 25, 2025');
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ 
    event_name: '', 
    event_date: new Date().toISOString().split('T')[0],
    latitude: '',
    longitude: '',
    event_status: EventStatus.ACTIVE 
  });
  const [error, setError] = useState(null);

  const columns = useMemo(() => ([
    { key: 'event_name', label: 'EVENT NAME' },
    { 
      key: 'event_date', 
      label: 'EVENT DATE',
      render: (_v, row) => {
        if (!row.event_date) return 'N/A';
        try {
          const date = new Date(row.event_date);
          return date.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
        } catch (e) {
          return row.event_date;
        }
      }
    },
    { 
      key: 'location', 
      label: 'LOCATION',
      render: (_v, row) => {
        const lat = row.latitude;
        const lng = row.longitude;
        if (lat && lng) {
          return `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
        }
        return 'N/A';
      }
    },
    { 
      key: 'event_status', 
      label: 'STATUS',
      render: (_v, row) => {
        const status = row.event_status || EventStatus.ACTIVE;
        return <StatusBadge status={status.toLowerCase()}>{getStatusLabel(status)}</StatusBadge>;
      }
    },
    {
      key: 'action',
      label: 'ACTIONS',
      render: (_v, row) => (
        <RowActions
          onEdit={() => openEdit(row)}
          onDownload={null}
          onDelete={() => handleDelete(row)}
        />
      ),
    },
  ]), []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err.message || 'Failed to load events';
      setError(message);
      setEvents([]);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => setForm({ 
    event_name: '', 
    event_date: new Date().toISOString().split('T')[0],
    latitude: '',
    longitude: '',
    event_status: EventStatus.ACTIVE 
  });

  const handleSubmitNew = async () => {
    if (!form.event_name.trim()) {
      setError('Event name is required');
      return;
    }
    if (!form.event_date) {
      setError('Event date is required');
      return;
    }
    if (!form.latitude || !form.longitude) {
      setError('Latitude and longitude are required');
      return;
    }
    
    setSaving(true);
    setError(null);
    try {
      const eventData = {
        event_name: form.event_name.trim(),
        event_date: new Date(form.event_date).toISOString(),
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        event_status: form.event_status,
      };
      await createEvent(eventData);
      showSuccess('Event created successfully');
      await fetchEvents();
      setOpenAdd(false);
      resetForm();
    } catch (err) {
      const message = err.message || 'Failed to create event';
      setError(message);
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (row) => {
    setEditRow(row);
    const eventDate = row.event_date ? new Date(row.event_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    setForm({
      event_name: row.event_name || '',
      event_date: eventDate,
      latitude: row.latitude?.toString() || '',
      longitude: row.longitude?.toString() || '',
      event_status: row.event_status || EventStatus.ACTIVE,
    });
  };

  const handleUpdate = async () => {
    const eventId = editRow?.event_id || editRow?.id;
    if (!eventId) return;
    if (!form.event_name.trim()) {
      setError('Event name is required');
      return;
    }
    if (!form.event_date) {
      setError('Event date is required');
      return;
    }
    if (!form.latitude || !form.longitude) {
      setError('Latitude and longitude are required');
      return;
    }
    
    setSaving(true);
    setError(null);
    try {
      const eventData = {
        event_name: form.event_name.trim(),
        event_date: new Date(form.event_date).toISOString(),
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        event_status: form.event_status,
      };
      await updateEvent(eventId, eventData);
      showSuccess('Event updated successfully');
      await fetchEvents();
      setEditRow(null);
      resetForm();
    } catch (err) {
      const message = err.message || 'Failed to update event';
      setError(message);
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    const eventId = row?.event_id || row?.id;
    if (!eventId) return;
    const confirmed = window.confirm(`Delete event "${row.event_name}"?`);
    if (!confirmed) return;
    setSaving(true);
    setError(null);
    try {
      await deleteEvent(eventId);
      showSuccess('Event deleted successfully');
      await fetchEvents();
    } catch (err) {
      const message = err.message || 'Failed to delete event';
      setError(message);
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const rows = useMemo(() => events, [events]);

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="dash-card full">
            <TableWithControls
              title="Event Management"
              columns={columns}
              rows={rows}
              selectable={!loading}
              onAddNew={() => setOpenAdd(true)}
              addNewText="Add New Event"
              onImport={fetchEvents}
              importText="Refresh"
              dateRange={dateRange}
              onDateChange={setDateRange}
              itemName="Event"
              loading={loading}
            />
          </div>
        </div>
      </div>
      
      {/* Add Event Modal */}
      <Modal
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          resetForm();
          setError(null);
        }}
        title="Add New Event"
        footer={(
          <>
            <button className="ui-btn ui-btn--secondary" onClick={() => { resetForm(); setOpenAdd(false); setError(null); }}>Cancel</button>
            <button className="ui-btn ui-btn--primary" disabled={saving} onClick={handleSubmitNew}>Save</button>
          </>
        )}
      >
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Event Name <span style={{ color: 'red' }}>*</span></label>
            <input
              className="ui-input"
              placeholder="Enter event name"
              value={form.event_name}
              onChange={(e) => setForm((p) => ({ ...p, event_name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Event Date <span style={{ color: 'red' }}>*</span></label>
            <input
              type="date"
              className="ui-input"
              value={form.event_date}
              onChange={(e) => setForm((p) => ({ ...p, event_date: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Latitude <span style={{ color: 'red' }}>*</span></label>
            <input
              type="number"
              step="any"
              className="ui-input"
              placeholder="Enter latitude"
              value={form.latitude}
              onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Longitude <span style={{ color: 'red' }}>*</span></label>
            <input
              type="number"
              step="any"
              className="ui-input"
              placeholder="Enter longitude"
              value={form.longitude}
              onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Status</label>
            <DropdownSelector
              options={[
                { value: EventStatus.ACTIVE, label: 'Active' },
                { value: EventStatus.COMPLETED, label: 'Completed' },
                { value: EventStatus.CANCELLED, label: 'Cancelled' }
              ]}
              value={form.event_status}
              onChange={(value) => setForm((p) => ({ ...p, event_status: value }))}
              placeholder="Select status"
            />
          </div>
        </div>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        open={!!editRow}
        onClose={() => {
          setEditRow(null);
          resetForm();
          setError(null);
        }}
        title="Edit Event"
        footer={(
          <>
            <button className="ui-btn ui-btn--secondary" onClick={() => { setEditRow(null); resetForm(); setError(null); }}>Cancel</button>
            <button className="ui-btn ui-btn--primary" disabled={saving} onClick={handleUpdate}>Update</button>
          </>
        )}
      >
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Event Name <span style={{ color: 'red' }}>*</span></label>
            <input
              className="ui-input"
              value={form.event_name}
              onChange={(e) => setForm((p) => ({ ...p, event_name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Event Date <span style={{ color: 'red' }}>*</span></label>
            <input
              type="date"
              className="ui-input"
              value={form.event_date}
              onChange={(e) => setForm((p) => ({ ...p, event_date: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Latitude <span style={{ color: 'red' }}>*</span></label>
            <input
              type="number"
              step="any"
              className="ui-input"
              placeholder="Enter latitude"
              value={form.latitude}
              onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Longitude <span style={{ color: 'red' }}>*</span></label>
            <input
              type="number"
              step="any"
              className="ui-input"
              placeholder="Enter longitude"
              value={form.longitude}
              onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Status</label>
            <DropdownSelector
              options={[
                { value: EventStatus.ACTIVE, label: 'Active' },
                { value: EventStatus.COMPLETED, label: 'Completed' },
                { value: EventStatus.CANCELLED, label: 'Cancelled' }
              ]}
              value={form.event_status}
              onChange={(value) => setForm((p) => ({ ...p, event_status: value }))}
              placeholder="Select status"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardEvents;
