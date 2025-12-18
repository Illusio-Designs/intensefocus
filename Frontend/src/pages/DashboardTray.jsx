import React, { useEffect, useMemo, useState } from 'react';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';
import RowActions from '../components/ui/RowActions';
import DropdownSelector from '../components/ui/DropdownSelector';
import {
  getProducts,
  getBrands,
  getCollections,
  getTrays,
  updateTray,
  deleteTray,
  getProductsInTray,
  addProductToTray,
  updateProductInTray,
  deleteProductFromTray,
} from '../services/apiService';
import { showSuccess, showError } from '../services/notificationService';
import '../styles/pages/dashboard.css';
import '../styles/pages/dashboard-orders.css';

const TrayStatus = {
  AVAILABLE: 'available',
  ASSIGNED: 'assigned',
  CLOSED: 'closed'
};

const DashboardTray = () => {
  const [activeTab, setActiveTab] = useState('all-trays');
  const [dateRange, setDateRange] = useState('Feb 25, 2025 - Mar 25, 2025');
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [trays, setTrays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ tray_name: '', tray_status: TrayStatus.AVAILABLE });
  const [error, setError] = useState(null);
  
  // Product assignment tab state
  const [selectedTray, setSelectedTray] = useState('');
  const [trayProducts, setTrayProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [brands, setBrands] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productQty, setProductQty] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductQty, setEditProductQty] = useState(1);

  const columns = useMemo(() => ([
    { key: 'tray_name', label: 'TRAY NAME' },
    { 
      key: 'tray_status', 
      label: 'STATUS',
      render: (_v, row) => {
        const status = row.tray_status || '';
        if (status === TrayStatus.AVAILABLE) return 'AVAILABLE';
        if (status === TrayStatus.ASSIGNED) return 'ASSIGNED';
        if (status === TrayStatus.CLOSED) return 'CLOSED';
        return status.toUpperCase();
      }
    },
    { 
      key: 'product_count', 
      label: 'PRODUCTS',
      render: (_v, row) => row.product_count || 0
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

  const fetchTrays = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTrays();
      setTrays(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load trays');
      setTrays([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const data = await getProducts();
      setAllProducts(data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setAllProducts([]);
    }
  };

  const fetchBrands = async () => {
    try {
      const data = await getBrands();
      setBrands(data || []);
    } catch (err) {
      console.error('Failed to load brands:', err);
      setBrands([]);
    }
  };

  const fetchCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data || []);
    } catch (err) {
      console.error('Failed to load collections:', err);
      setCollections([]);
    }
  };

  useEffect(() => {
    fetchTrays();
    fetchAllProducts();
    fetchBrands();
    fetchCollections();
  }, []);

  const resetForm = () => setForm({ tray_name: '', tray_status: TrayStatus.AVAILABLE });

  const handleSubmitNew = async () => {
    if (!form.tray_name.trim()) {
      setError('Tray name is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      // Tray APIs have been removed
      setError('Tray APIs have been removed. Cannot create tray.');
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
      tray_status: row.tray_status || TrayStatus.AVAILABLE,
    });
  };

  const handleUpdate = async () => {
    const trayId = editRow?.tray_id || editRow?.id;
    if (!trayId) return;
    if (!form.tray_name.trim()) {
      setError('Tray name is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateTray(trayId, {
        tray_name: form.tray_name.trim(),
        tray_status: form.tray_status,
      });
      showSuccess('Tray updated successfully');
      await fetchTrays();
      setEditRow(null);
      resetForm();
    } catch (err) {
      const message = err.message || 'Failed to update tray';
      setError(message);
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    const trayId = row?.tray_id || row?.id;
    if (!trayId) return;
    const confirmed = window.confirm(`Delete tray "${row.tray_name}"?`);
    if (!confirmed) return;
    setSaving(true);
    setError(null);
    try {
      await deleteTray(trayId);
      showSuccess('Tray deleted successfully');
      await fetchTrays();
    } catch (err) {
      const message = err.message || 'Failed to delete tray';
      setError(message);
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleTrayChange = async (trayId) => {
    setSelectedTray(trayId);
    if (!trayId) {
      setTrayProducts([]);
      return;
    }
    setError(null);
    setLoadingProducts(true);
    try {
      // Ensure products, brands, and collections are loaded before fetching tray products
      if (allProducts.length === 0) {
        await fetchAllProducts();
      }
      if (brands.length === 0) {
        await fetchBrands();
      }
      if (collections.length === 0) {
        await fetchCollections();
      }
      const items = await getProductsInTray(trayId);
      setTrayProducts(Array.isArray(items) ? items : []);
    } catch (err) {
      const message = err.message || 'Failed to fetch tray products';
      setError(message);
      showError(message);
      setTrayProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedTray) {
      setError('Please select a tray');
      return;
    }
    if (!selectedProduct) {
      setError('Please select a product');
      return;
    }
    if (!productQty || productQty < 1) {
      setError('Quantity must be at least 1');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await addProductToTray({
        tray_id: selectedTray,
        product_id: selectedProduct,
        qty: parseInt(productQty),
        status: 'alloted',
      });
      showSuccess('Product added to tray successfully');
      const items = await getProductsInTray(selectedTray);
      setTrayProducts(Array.isArray(items) ? items : []);
      await fetchTrays(); // Refresh tray list to update product count
      setSelectedProduct('');
      setProductQty(1);
    } catch (err) {
      const message = err.message || 'Failed to add product to tray';
      setError(message);
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProductQty = async (trayProduct) => {
    if (!trayProduct?.product_id || !selectedTray) return;
    if (!editProductQty || editProductQty < 1) {
      setError('Quantity must be at least 1');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateProductInTray({
        tray_id: selectedTray,
        product_id: trayProduct.product_id,
        qty: parseInt(editProductQty),
        status: trayProduct.status || 'alloted',
      });
      showSuccess('Product quantity updated successfully');
      const items = await getProductsInTray(selectedTray);
      setTrayProducts(Array.isArray(items) ? items : []);
      setEditingProduct(null);
      setEditProductQty(1);
      await fetchTrays(); // Refresh tray list
    } catch (err) {
      const message = err.message || 'Failed to update product quantity';
      setError(message);
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveProduct = async (trayProduct) => {
    if (!trayProduct?.product_id || !selectedTray) return;
    const confirmed = window.confirm(`Remove product from tray?`);
    if (!confirmed) return;
    setSaving(true);
    setError(null);
    try {
      await deleteProductFromTray({
        tray_id: selectedTray,
        product_id: trayProduct.product_id,
      });
      showSuccess('Product removed from tray successfully');
      const items = await getProductsInTray(selectedTray);
      setTrayProducts(Array.isArray(items) ? items : []);
      await fetchTrays(); // Refresh tray list
    } catch (err) {
      const message = err.message || 'Failed to remove product from tray';
      setError(message);
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const startEditProduct = (trayProduct) => {
    setEditingProduct(trayProduct);
    setEditProductQty(trayProduct.qty || 1);
  };

  const cancelEditProduct = () => {
    setEditingProduct(null);
    setEditProductQty(1);
  };

  const rows = useMemo(() => trays, [trays]);

  // Reset selected tray when switching tabs
  useEffect(() => {
    if (activeTab === 'assign-products') {
      // Load products, brands, and collections when switching to assign products tab
      if (allProducts.length === 0) {
        fetchAllProducts();
      }
      if (brands.length === 0) {
        fetchBrands();
      }
      if (collections.length === 0) {
        fetchCollections();
      }
    } else {
      // Reset state when switching away from assign products tab
      setSelectedTray('');
      setTrayProducts([]);
      setSelectedProduct('');
      setProductQty(1);
      setEditingProduct(null);
    }
  }, [activeTab]);

  return (
    <div className="dash-page">
      <div className="dash-container">
        {/* Tab Navigation */}
        <div className="dash-row">
          <div className="order-tabs-container">
            <button
              className={`order-tab ${activeTab === 'all-trays' ? 'active' : ''}`}
              onClick={() => setActiveTab('all-trays')}
            >
              All Trays
            </button>
            <button
              className={`order-tab ${activeTab === 'assign-products' ? 'active' : ''}`}
              onClick={() => setActiveTab('assign-products')}
            >
              Assign Products
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'all-trays' && (
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
              {error && <div style={{ padding: 12, color: 'red' }}>{error}</div>}
            </div>
          </div>
        )}

        {activeTab === 'assign-products' && (
          <div className="dash-row">
            <div className="dash-card full">
              <div style={{ padding: '20px' }}>
                <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Assign Products to Tray</h2>
                
                {error && <div style={{ padding: 12, color: 'red', marginBottom: 12, backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '8px' }}>{error}</div>}
                
                {/* Tray Selection */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="ui-label">Select Tray</label>
                  <DropdownSelector
                    options={trays.map(t => ({ 
                      value: t.tray_id || t.id, 
                      label: `${t.tray_name || 'N/A'} (${t.product_count || 0} products)`
                    }))}
                    value={selectedTray}
                    onChange={handleTrayChange}
                    placeholder="Select a tray"
                  />
                </div>

                {selectedTray && (
                  <>
                    {/* Add Product Section */}
                    <div style={{ marginBottom: 30, padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                      <h3 style={{ marginTop: 0, marginBottom: 15 }}>Add Product to Tray</h3>
                      <div className="form-group">
                        <label className="ui-label">Product</label>
                        <DropdownSelector
                          options={allProducts.map(p => ({ 
                            value: p.id || p.product_id, 
                            label: `${p.model_no || 'N/A'} - ${p.brand_name || ''} ${p.collection_name || ''}`.trim() || 'Product'
                          }))}
                          value={selectedProduct}
                          onChange={setSelectedProduct}
                          placeholder="Select Product"
                        />
                      </div>
                      <div className="form-group">
                        <label className="ui-label">Quantity</label>
                        <input
                          type="number"
                          className="ui-input"
                          min="1"
                          value={productQty}
                          onChange={(e) => setProductQty(parseInt(e.target.value) || 1)}
                          style={{ maxWidth: '200px' }}
                        />
                      </div>
                      <button 
                        className="ui-btn ui-btn--primary" 
                        disabled={saving || !selectedProduct} 
                        onClick={handleAddProduct}
                      >
                        Add Product
                      </button>
                    </div>

                    {/* Products List */}
                    <div>
                      <h3 style={{ marginTop: 0, marginBottom: 15 }}>
                        Products in Tray ({trayProducts.length})
                      </h3>
                      {loadingProducts ? (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>Loading products...</p>
                      ) : trayProducts.length === 0 ? (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>No products in this tray</p>
                      ) : (
                        <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#f0f0f0', position: 'sticky', top: 0 }}>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>MODEL NO</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>BRAND</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>COLLECTION</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>MRP</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>WHP</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>QUANTITY</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>STATUS</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ACTIONS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {trayProducts.map((tp) => {
                                // Match product by product_id - try both id and product_id fields
                                const productId = tp.product_id || tp.product?.product_id || tp.product?.id;
                                const product = allProducts.find(p => {
                                  const pId = p.product_id || p.id;
                                  return pId && productId && String(pId).toLowerCase() === String(productId).toLowerCase();
                                });
                                
                                // If product not found, try to get brand and collection from nested product object
                                const productData = product || tp.product;
                                const brandId = productData?.brand_id;
                                const collectionId = productData?.collection_id;
                                
                                const brand = brandId ? brands.find(b => {
                                  const bId = b.brand_id || b.id;
                                  return bId && String(bId).toLowerCase() === String(brandId).toLowerCase();
                                }) : null;
                                
                                const collection = collectionId ? collections.find(c => {
                                  const cId = c.collection_id || c.id;
                                  return cId && String(cId).toLowerCase() === String(collectionId).toLowerCase();
                                }) : null;
                                
                                const isEditing = editingProduct?.id === tp.id;
                                
                                return (
                                  <tr key={tp.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>
                                      {productData?.model_no || 'N/A'}
                                      {!product && productId && (
                                        <span style={{ fontSize: '10px', color: '#999', display: 'block' }}>
                                          (ID: {productId.substring(0, 8)}...)
                                        </span>
                                      )}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                      {brand?.brand_name || productData?.brand_name || 'N/A'}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                      {collection?.collection_name || productData?.collection_name || 'N/A'}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                      {productData?.mrp ? `₹${parseFloat(productData.mrp || 0).toLocaleString('en-IN')}` : 'N/A'}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                      {productData?.whp ? `₹${parseFloat(productData.whp || 0).toLocaleString('en-IN')}` : 'N/A'}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                      {isEditing ? (
                                        <input
                                          type="number"
                                          className="ui-input"
                                          min="1"
                                          value={editProductQty}
                                          onChange={(e) => setEditProductQty(parseInt(e.target.value) || 1)}
                                          style={{ width: '80px' }}
                                        />
                                      ) : (
                                        tp.qty || 0
                                      )}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                      <span style={{ 
                                        padding: '4px 8px', 
                                        borderRadius: '4px', 
                                        fontSize: '12px',
                                        backgroundColor: tp.status === 'alloted' ? '#e3f2fd' : '#f5f5f5',
                                        color: tp.status === 'alloted' ? '#1976d2' : '#666'
                                      }}>
                                        {tp.status || 'alloted'}
                                      </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                      {isEditing ? (
                                        <>
                                          <button 
                                            className="ui-btn ui-btn--primary" 
                                            style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}
                                            disabled={saving}
                                            onClick={() => handleUpdateProductQty(tp)}
                                          >
                                            Save
                                          </button>
                                          <button 
                                            className="ui-btn ui-btn--secondary" 
                                            style={{ padding: '5px 10px', fontSize: '12px' }}
                                            disabled={saving}
                                            onClick={cancelEditProduct}
                                          >
                                            Cancel
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button 
                                            className="ui-btn ui-btn--secondary" 
                                            style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}
                                            disabled={saving}
                                            onClick={() => startEditProduct(tp)}
                                          >
                                            Edit Qty
                                          </button>
                                          <button 
                                            className="ui-btn ui-btn--secondary" 
                                            style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}
                                            disabled={saving}
                                            onClick={() => handleRemoveProduct(tp)}
                                          >
                                            Remove
                                          </button>
                                        </>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {!selectedTray && (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    <p>Please select a tray to assign products</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
              <option value={TrayStatus.AVAILABLE}>AVAILABLE</option>
              <option value={TrayStatus.ASSIGNED}>ASSIGNED</option>
              <option value={TrayStatus.CLOSED}>CLOSED</option>
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
              <option value={TrayStatus.AVAILABLE}>AVAILABLE</option>
              <option value={TrayStatus.ASSIGNED}>ASSIGNED</option>
              <option value={TrayStatus.CLOSED}>CLOSED</option>
            </select>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default DashboardTray;
