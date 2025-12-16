import React, { useEffect, useMemo, useState } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';
import {
  createTray,
  deleteTray,
  getProductsInTray,
  getTrays,
  updateTray,
} from '../services/apiService';
import '../styles/pages/dashboard.css';

const DashboardTray = () => {
  const [dateRange, setDateRange] = useState('Feb 25, 2025 - Mar 25, 2025');
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [trays, setTrays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ tray_name: '', tray_status: 'OPEN' });
  const [error, setError] = useState(null);

  const columns = useMemo(() => ([
    { key: 'tray_name', label: 'TRAY NAME' },
    { key: 'tray_status', label: 'STATUS' },
    { key: 'items', label: 'ITEMS' },
    { key: 'assigned_to', label: 'ASSIGNED TO' },
    {
      key: 'action',
      label: 'ACTION',
      render: (_v, row) => (
        <RowActions
          onView={() => handleView(row)}
          onEdit={() => openEdit(row)}
          onDownload={null}
          onDelete={() => handleDelete(row)}
        />
      ),
    },
  ]), []);

  const fetchTrays = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTrays();
      const normalized = (data || []).map((t) => ({
        ...t,
        id: t.id || t.tray_id,
        tray_name: t.tray_name || t.name || 'Tray',
        tray_status: (t.tray_status || t.status || 'OPEN').toUpperCase(),
        items: t.items || t.products_count || t.qty || '-',
        assigned_to: t.assigned_to || t.salesman_name || '—',
      }));
      setTrays(normalized);
    } catch (err) {
      setError(err.message || 'Failed to load trays');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrays();
  }, []);

  const resetForm = () => setForm({ tray_name: '', tray_status: 'OPEN' });

  const handleSubmitNew = async () => {
    if (!form.tray_name.trim()) {
      setError('Tray name is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createTray({
        tray_name: form.tray_name.trim(),
        tray_status: form.tray_status,
      });
      await fetchTrays();
      resetForm();
      setOpenAdd(false);
    } catch (err) {
      setError(err.message || 'Failed to create tray');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (row) => {
    setEditRow(row);
    setForm({
      tray_name: row.tray_name || '',
      tray_status: row.tray_status || 'OPEN',
    });
  };

  const handleUpdate = async () => {
    if (!editRow?.id) return;
    if (!form.tray_name.trim()) {
      setError('Tray name is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateTray(editRow.id, {
        tray_name: form.tray_name.trim(),
        tray_status: form.tray_status,
      });
      await fetchTrays();
      setEditRow(null);
    } catch (err) {
      setError(err.message || 'Failed to update tray');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!row?.id) return;
    const confirmed = window.confirm(`Delete tray "${row.tray_name}"?`);
    if (!confirmed) return;
    setSaving(true);
    setError(null);
    try {
      await deleteTray(row.id);
      await fetchTrays();
    } catch (err) {
      setError(err.message || 'Failed to delete tray');
    } finally {
      setSaving(false);
    }
  };

  const handleView = async (row) => {
    if (!row?.id) return;
    setSaving(true);
    setError(null);
    try {
      const items = await getProductsInTray(row.id);
      const total = Array.isArray(items) ? items.length : 0;
      alert(`Tray "${row.tray_name}" has ${total} product(s).`);
    } catch (err) {
      setError(err.message || 'Failed to fetch tray products');
    } finally {
      setSaving(false);
    }
  };

  const rows = useMemo(() => trays, [trays]);

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-row">
          <div className="dash-card full">
            <TableWithControls
              title="Tray Management"
              columns={columns}
              rows={rows}
              selectable={!loading}
              onAddNew={() => setOpenAdd(true)}
              addNewText="Add New Tray"
              onImport={fetchTrays}
              importText="Refresh"
              dateRange={dateRange}
              onDateChange={setDateRange}
              itemName="Tray"
            />
            {loading && <div style={{ padding: 12 }}>Loading trays...</div>}
            {error && <div style={{ padding: 12, color: 'red' }}>{error}</div>}
          </div>
        </div>
      </div>
      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Add New Tray"
        footer={(
          <>
            <button className="ui-btn ui-btn--secondary" onClick={() => { resetForm(); setOpenAdd(false); }}>Cancel</button>
            <button className="ui-btn ui-btn--primary" disabled={saving} onClick={handleSubmitNew}>Save</button>
          </>
        )}
      >
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Title</label>
            <input
              className="ui-input"
              placeholder="Tray title"
              value={form.tray_name}
              onChange={(e) => setForm((p) => ({ ...p, tray_name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Status</label>
            <select
              className="ui-select"
              value={form.tray_status}
              onChange={(e) => setForm((p) => ({ ...p, tray_status: e.target.value }))}
            >
              <option value="OPEN">OPEN</option>
              <option value="IN-PROGRESS">IN-PROGRESS</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>
      </Modal>
      <Modal
        open={!!editRow}
        onClose={() => setEditRow(null)}
        title="Edit Tray"
        footer={(
          <>
            <button className="ui-btn ui-btn--secondary" onClick={() => { setEditRow(null); resetForm(); }}>Cancel</button>
            <button className="ui-btn ui-btn--primary" disabled={saving} onClick={handleUpdate}>Update</button>
          </>
        )}
      >
        <div className="ui-form">
          <div className="form-group">
            <label className="ui-label">Title</label>
            <input
              className="ui-input"
              value={form.tray_name}
              onChange={(e) => setForm((p) => ({ ...p, tray_name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Status</label>
            <select
              className="ui-select"
              value={form.tray_status}
              onChange={(e) => setForm((p) => ({ ...p, tray_status: e.target.value }))}
            >
              <option value="OPEN">OPEN</option>
              <option value="IN-PROGRESS">IN-PROGRESS</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardTray;
