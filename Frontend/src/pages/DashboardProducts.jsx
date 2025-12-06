import React, { useMemo, useState, useEffect } from 'react';
import '../styles/pages/dashboard-products.css';
import '../styles/pages/dashboard-orders.css';
import TableWithControls from '../components/ui/TableWithControls';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import RowActions from '../components/ui/RowActions';
import DropdownSelector from '../components/ui/DropdownSelector';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getBrands,
  getCollections,
  getGenders,
  getColorCodes,
  getShapes,
  getLensColors,
  getFrameColors,
  getFrameTypes,
  getLensMaterials,
  getFrameMaterials,
} from '../services/apiService';

const DashboardProducts = () => {
  const [activeTab, setActiveTab] = useState('Products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  
  // Related data for dropdowns
  const [brands, setBrands] = useState([]);
  const [collections, setCollections] = useState([]);
  const [genders, setGenders] = useState([]);
  const [colorCodes, setColorCodes] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [lensColors, setLensColors] = useState([]);
  const [frameColors, setFrameColors] = useState([]);
  const [frameTypes, setFrameTypes] = useState([]);
  const [lensMaterials, setLensMaterials] = useState([]);
  const [frameMaterials, setFrameMaterials] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    model_no: '',
    gender_id: '',
    color_code_id: '',
    shape_id: '',
    lens_color_id: '',
    frame_color_id: '',
    frame_type_id: '',
    lens_material_id: '',
    frame_material_id: '',
    mrp: '',
    whp: '',
    size_mm: '',
    brand_id: '',
    collection_id: '',
    warehouse_qty: '',
    tray_qty: '',
    total_qty: '',
    status: 'draft',
  });

  // Fetch products and related data
  useEffect(() => {
    fetchProducts();
    fetchRelatedData();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        setError(`Failed to load products: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedData = async () => {
    try {
      const [
        brandsData,
        collectionsData,
        gendersData,
        colorCodesData,
        shapesData,
        lensColorsData,
        frameColorsData,
        frameTypesData,
        lensMaterialsData,
        frameMaterialsData,
      ] = await Promise.all([
        getBrands().catch(() => []),
        getCollections().catch(() => []),
        getGenders().catch(() => []),
        getColorCodes().catch(() => []),
        getShapes().catch(() => []),
        getLensColors().catch(() => []),
        getFrameColors().catch(() => []),
        getFrameTypes().catch(() => []),
        getLensMaterials().catch(() => []),
        getFrameMaterials().catch(() => []),
      ]);
      
      setBrands(brandsData || []);
      setCollections(collectionsData || []);
      setGenders(gendersData || []);
      setColorCodes(colorCodesData || []);
      setShapes(shapesData || []);
      setLensColors(lensColorsData || []);
      setFrameColors(frameColorsData || []);
      setFrameTypes(frameTypesData || []);
      setLensMaterials(lensMaterialsData || []);
      setFrameMaterials(frameMaterialsData || []);
    } catch (error) {
      console.error('Error fetching related data:', error);
    }
  };

  const columns = useMemo(() => ([
    { key: 'model_no', label: 'MODEL NO' },
    { key: 'brand', label: 'BRAND' },
    { key: 'collection', label: 'COLLECTION' },
    { key: 'stock', label: 'STOCK' },
    { key: 'mrp', label: 'MRP' },
    { key: 'whp', label: 'WHP' },
    { key: 'status', label: 'STATUS' },
    { key: 'action', label: 'ACTION', render: (_v, row) => (
      <RowActions 
        onEdit={() => handleEdit(row)} 
        onDelete={() => handleDelete(row)} 
      />
    ) },
  ]), []);

  const rows = useMemo(() => {
    return products.map(product => {
      const brand = brands.find(b => (b.brand_id || b.id) === product.brand_id);
      const collection = collections.find(c => (c.collection_id || c.id) === product.collection_id);
      
      return {
        id: product.product_id || product.id,
        model_no: product.model_no || '',
        brand: brand?.brand_name || 'N/A',
        collection: collection?.collection_name || 'N/A',
        stock: product.total_qty || 0,
        mrp: `₹${parseFloat(product.mrp || 0).toLocaleString('en-IN')}`,
        whp: `₹${parseFloat(product.whp || 0).toLocaleString('en-IN')}`,
        status: product.status || 'draft',
        hasUploadedMedia: !!product.image_url,
        data: product,
      };
    });
  }, [products, brands, collections]);

  const filteredRowsByTab = useMemo(() => {
    if (activeTab === 'Products') return rows;
    if (activeTab === 'Media Gallery') return rows.filter(row => row.hasUploadedMedia);
    if (activeTab === 'Unuploaded Media Gallery') return rows.filter(row => !row.hasUploadedMedia);
    return rows;
  }, [rows, activeTab]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      model_no: '',
      gender_id: '',
      color_code_id: '',
      shape_id: '',
      lens_color_id: '',
      frame_color_id: '',
      frame_type_id: '',
      lens_material_id: '',
      frame_material_id: '',
      mrp: '',
      whp: '',
      size_mm: '',
      brand_id: '',
      collection_id: '',
      warehouse_qty: '',
      tray_qty: '',
      total_qty: '',
      status: 'draft',
    });
  };

  const handleAdd = () => {
    resetForm();
    setOpenAdd(true);
  };

  const handleEdit = (row) => {
    const product = row.data;
    setFormData({
      model_no: product.model_no || '',
      gender_id: product.gender_id || '',
      color_code_id: product.color_code_id || '',
      shape_id: product.shape_id || '',
      lens_color_id: product.lens_color_id || '',
      frame_color_id: product.frame_color_id || '',
      frame_type_id: product.frame_type_id || '',
      lens_material_id: product.lens_material_id || '',
      frame_material_id: product.frame_material_id || '',
      mrp: product.mrp || '',
      whp: product.whp || '',
      size_mm: product.size_mm || '',
      brand_id: product.brand_id || '',
      collection_id: product.collection_id || '',
      warehouse_qty: product.warehouse_qty || '',
      tray_qty: product.tray_qty || '',
      total_qty: product.total_qty || '',
      status: product.status || 'draft',
    });
    setEditRow(row);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete product ${row.model_no}?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteProduct(row.id);
      await fetchProducts();
      setError(null);
    } catch (error) {
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        console.error('Error deleting product:', error);
        setError(`Failed to delete product: ${error.message}`);
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
        model_no: formData.model_no,
        gender_id: parseInt(formData.gender_id) || 0,
        color_code_id: parseInt(formData.color_code_id) || 0,
        shape_id: parseInt(formData.shape_id) || 0,
        lens_color_id: parseInt(formData.lens_color_id) || 0,
        frame_color_id: parseInt(formData.frame_color_id) || 0,
        frame_type_id: parseInt(formData.frame_type_id) || 0,
        lens_material_id: parseInt(formData.lens_material_id) || 0,
        frame_material_id: parseInt(formData.frame_material_id) || 0,
        mrp: parseFloat(formData.mrp) || 0,
        whp: parseFloat(formData.whp) || 0,
        size_mm: formData.size_mm,
        brand_id: formData.brand_id,
        collection_id: formData.collection_id,
        warehouse_qty: parseInt(formData.warehouse_qty) || 0,
        tray_qty: parseInt(formData.tray_qty) || 0,
        total_qty: parseInt(formData.total_qty) || 0,
        status: formData.status,
      };
      
      if (editRow) {
        await updateProduct(editRow.id, dataToSend);
      } else {
        await createProduct(dataToSend);
      }
      
      await fetchProducts();
      setError(null);
      setOpenAdd(false);
      setEditRow(null);
      resetForm();
    } catch (error) {
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        console.error('Error saving product:', error);
        setError(`Failed to save product: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-container">
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
          <div className="order-tabs-container">
            {['Products', 'Media Gallery', 'Unuploaded Media Gallery'].map(tab => (
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
              title="Products"
              columns={columns}
              rows={filteredRowsByTab}
              onAddNew={handleAdd}
              addNewText="Add New Product"
              onImport={fetchProducts}
              importText="Refresh Products"
              searchPlaceholder="Search products"
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
        title="Add New Product"
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
            <label className="ui-label">Model No *</label>
            <input
              className="ui-input"
              placeholder="Enter model number"
              value={formData.model_no}
              onChange={(e) => handleInputChange('model_no', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Brand *</label>
            <DropdownSelector
              options={brands.map(b => ({ 
                value: b.brand_id || b.id, 
                label: b.brand_name 
              }))}
              value={formData.brand_id}
              onChange={(value) => handleInputChange('brand_id', value)}
              placeholder="Select brand"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Collection *</label>
            <DropdownSelector
              options={collections.map(c => ({ 
                value: c.collection_id || c.id, 
                label: c.collection_name 
              }))}
              value={formData.collection_id}
              onChange={(value) => handleInputChange('collection_id', value)}
              placeholder="Select collection"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Gender *</label>
            <DropdownSelector
              options={genders.map(g => ({ 
                value: g.gender_id || g.id, 
                label: g.gender_name 
              }))}
              value={formData.gender_id}
              onChange={(value) => handleInputChange('gender_id', value)}
              placeholder="Select gender"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Color Code *</label>
            <DropdownSelector
              options={colorCodes.map(c => ({ 
                value: c.color_code_id || c.id, 
                label: c.color_code 
              }))}
              value={formData.color_code_id}
              onChange={(value) => handleInputChange('color_code_id', value)}
              placeholder="Select color code"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Shape *</label>
            <DropdownSelector
              options={shapes.map(s => ({ 
                value: s.shape_id || s.id, 
                label: s.shape_name 
              }))}
              value={formData.shape_id}
              onChange={(value) => handleInputChange('shape_id', value)}
              placeholder="Select shape"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Lens Color *</label>
            <DropdownSelector
              options={lensColors.map(l => ({ 
                value: l.lens_color_id || l.id, 
                label: l.lens_color 
              }))}
              value={formData.lens_color_id}
              onChange={(value) => handleInputChange('lens_color_id', value)}
              placeholder="Select lens color"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Frame Color *</label>
            <DropdownSelector
              options={frameColors.map(f => ({ 
                value: f.frame_color_id || f.id, 
                label: f.frame_color 
              }))}
              value={formData.frame_color_id}
              onChange={(value) => handleInputChange('frame_color_id', value)}
              placeholder="Select frame color"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Frame Type *</label>
            <DropdownSelector
              options={frameTypes.map(f => ({ 
                value: f.frame_type_id || f.id, 
                label: f.frame_type 
              }))}
              value={formData.frame_type_id}
              onChange={(value) => handleInputChange('frame_type_id', value)}
              placeholder="Select frame type"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Lens Material *</label>
            <DropdownSelector
              options={lensMaterials.map(l => ({ 
                value: l.lens_material_id || l.id, 
                label: l.lens_material 
              }))}
              value={formData.lens_material_id}
              onChange={(value) => handleInputChange('lens_material_id', value)}
              placeholder="Select lens material"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Frame Material *</label>
            <DropdownSelector
              options={frameMaterials.map(f => ({ 
                value: f.frame_material_id || f.id, 
                label: f.frame_material 
              }))}
              value={formData.frame_material_id}
              onChange={(value) => handleInputChange('frame_material_id', value)}
              placeholder="Select frame material"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">MRP *</label>
            <input
              className="ui-input"
              type="number"
              step="0.01"
              placeholder="Enter MRP"
              value={formData.mrp}
              onChange={(e) => handleInputChange('mrp', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">WHP *</label>
            <input
              className="ui-input"
              type="number"
              step="0.01"
              placeholder="Enter WHP"
              value={formData.whp}
              onChange={(e) => handleInputChange('whp', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Size (mm) *</label>
            <input
              className="ui-input"
              placeholder="Enter size in mm"
              value={formData.size_mm}
              onChange={(e) => handleInputChange('size_mm', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Warehouse Qty *</label>
            <input
              className="ui-input"
              type="number"
              placeholder="Enter warehouse quantity"
              value={formData.warehouse_qty}
              onChange={(e) => handleInputChange('warehouse_qty', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Tray Qty *</label>
            <input
              className="ui-input"
              type="number"
              placeholder="Enter tray quantity"
              value={formData.tray_qty}
              onChange={(e) => handleInputChange('tray_qty', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Total Qty *</label>
            <input
              className="ui-input"
              type="number"
              placeholder="Enter total quantity"
              value={formData.total_qty}
              onChange={(e) => handleInputChange('total_qty', e.target.value)}
              required
            />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Status *</label>
            <select
              className="ui-input"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              required
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
        </div>
        </form>
      </Modal>
      <Modal
        open={!!editRow}
        onClose={() => {
          setEditRow(null);
          resetForm();
        }}
        title="Edit Product"
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
            <label className="ui-label">Model No *</label>
            <input
              className="ui-input"
              placeholder="Enter model number"
              value={formData.model_no}
              onChange={(e) => handleInputChange('model_no', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Brand *</label>
            <DropdownSelector
              options={brands.map(b => ({ 
                value: b.brand_id || b.id, 
                label: b.brand_name 
              }))}
              value={formData.brand_id}
              onChange={(value) => handleInputChange('brand_id', value)}
              placeholder="Select brand"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Collection *</label>
            <DropdownSelector
              options={collections.map(c => ({ 
                value: c.collection_id || c.id, 
                label: c.collection_name 
              }))}
              value={formData.collection_id}
              onChange={(value) => handleInputChange('collection_id', value)}
              placeholder="Select collection"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Gender *</label>
            <DropdownSelector
              options={genders.map(g => ({ 
                value: g.gender_id || g.id, 
                label: g.gender_name 
              }))}
              value={formData.gender_id}
              onChange={(value) => handleInputChange('gender_id', value)}
              placeholder="Select gender"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Color Code *</label>
            <DropdownSelector
              options={colorCodes.map(c => ({ 
                value: c.color_code_id || c.id, 
                label: c.color_code 
              }))}
              value={formData.color_code_id}
              onChange={(value) => handleInputChange('color_code_id', value)}
              placeholder="Select color code"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Shape *</label>
            <DropdownSelector
              options={shapes.map(s => ({ 
                value: s.shape_id || s.id, 
                label: s.shape_name 
              }))}
              value={formData.shape_id}
              onChange={(value) => handleInputChange('shape_id', value)}
              placeholder="Select shape"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Lens Color *</label>
            <DropdownSelector
              options={lensColors.map(l => ({ 
                value: l.lens_color_id || l.id, 
                label: l.lens_color 
              }))}
              value={formData.lens_color_id}
              onChange={(value) => handleInputChange('lens_color_id', value)}
              placeholder="Select lens color"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Frame Color *</label>
            <DropdownSelector
              options={frameColors.map(f => ({ 
                value: f.frame_color_id || f.id, 
                label: f.frame_color 
              }))}
              value={formData.frame_color_id}
              onChange={(value) => handleInputChange('frame_color_id', value)}
              placeholder="Select frame color"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Frame Type *</label>
            <DropdownSelector
              options={frameTypes.map(f => ({ 
                value: f.frame_type_id || f.id, 
                label: f.frame_type 
              }))}
              value={formData.frame_type_id}
              onChange={(value) => handleInputChange('frame_type_id', value)}
              placeholder="Select frame type"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Lens Material *</label>
            <DropdownSelector
              options={lensMaterials.map(l => ({ 
                value: l.lens_material_id || l.id, 
                label: l.lens_material 
              }))}
              value={formData.lens_material_id}
              onChange={(value) => handleInputChange('lens_material_id', value)}
              placeholder="Select lens material"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Frame Material *</label>
            <DropdownSelector
              options={frameMaterials.map(f => ({ 
                value: f.frame_material_id || f.id, 
                label: f.frame_material 
              }))}
              value={formData.frame_material_id}
              onChange={(value) => handleInputChange('frame_material_id', value)}
              placeholder="Select frame material"
            />
          </div>
          <div className="form-group">
            <label className="ui-label">MRP *</label>
            <input
              className="ui-input"
              type="number"
              step="0.01"
              placeholder="Enter MRP"
              value={formData.mrp}
              onChange={(e) => handleInputChange('mrp', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">WHP *</label>
            <input
              className="ui-input"
              type="number"
              step="0.01"
              placeholder="Enter WHP"
              value={formData.whp}
              onChange={(e) => handleInputChange('whp', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Size (mm) *</label>
            <input
              className="ui-input"
              placeholder="Enter size in mm"
              value={formData.size_mm}
              onChange={(e) => handleInputChange('size_mm', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Warehouse Qty *</label>
            <input
              className="ui-input"
              type="number"
              placeholder="Enter warehouse quantity"
              value={formData.warehouse_qty}
              onChange={(e) => handleInputChange('warehouse_qty', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Tray Qty *</label>
            <input
              className="ui-input"
              type="number"
              placeholder="Enter tray quantity"
              value={formData.tray_qty}
              onChange={(e) => handleInputChange('tray_qty', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="ui-label">Total Qty *</label>
            <input
              className="ui-input"
              type="number"
              placeholder="Enter total quantity"
              value={formData.total_qty}
              onChange={(e) => handleInputChange('total_qty', e.target.value)}
              required
            />
          </div>
          <div className="form-group form-group--full">
            <label className="ui-label">Status *</label>
            <select
              className="ui-input"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              required
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
        </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardProducts;

