import React, { useMemo, useState, useEffect, useRef } from 'react';
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
  uploadProductImage,
  bulkUploadProducts,
} from '../services/apiService';

const DashboardProducts = () => {
  const [activeTab, setActiveTab] = useState('Products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBulk, setUploadingBulk] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedBulkFile, setSelectedBulkFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const imageInputRef = useRef(null);
  
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
        // Backend may send total_qty or qty; prefer total_qty and fall back to qty
        stock: product.total_qty || product.qty || 0,
        mrp: `₹${parseFloat(product.mrp || 0).toLocaleString('en-IN')}`,
        whp: `₹${parseFloat(product.whp || 0).toLocaleString('en-IN')}`,
        status: product.status || 'draft',
        hasUploadedMedia: !!product.image_url,
        data: product,
      };
    });
  }, [products, brands, collections]);

  const uploadedProducts = useMemo(
    () => products.filter(p => !!p.image_url),
    [products]
  );

  const unuploadedRows = useMemo(
    () => rows.filter(r => !r.data?.image_url),
    [rows]
  );

  const filteredRowsByTab = useMemo(() => {
    if (activeTab === 'Products') return rows;
    if (activeTab === 'Unuploaded Media Gallery') return unuploadedRows;
    return rows;
  }, [rows, unuploadedRows, activeTab]);

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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate all files
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Please select valid image files only');
      return;
    }

    // Validate file sizes (max 10MB each)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Some images exceed 10MB size limit. Please select smaller files.');
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);
      setSelectedImages(files);
      
      const response = await uploadProductImage(files);
      
      // If upload successful, refresh products to get updated image URLs
      await fetchProducts();
      
      const fileCount = files.length;
      setUploadProgress({
        success: true,
        message: fileCount === 1 
          ? 'Image uploaded successfully!' 
          : `${fileCount} images uploaded successfully!`,
      });
      
      // Clear selection after 3 seconds
      setTimeout(() => {
        setSelectedImages([]);
        setUploadProgress(null);
        // Reset file input
        if (e.target) {
          e.target.value = '';
        }
      }, 3000);
    } catch (error) {
      console.error('Error uploading images:', error);
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        setError(`Failed to upload images: ${error.message}`);
      }
      setSelectedImages([]);
      // Reset file input on error
      if (e.target) {
        e.target.value = '';
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedBulkFile) {
      setError('Please select an Excel file to upload');
      return;
    }

    // Validate file type
    const validExtensions = ['.xlsx', '.xls'];
    const fileName = selectedBulkFile.name.toLowerCase();
    const isValidFile = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValidFile) {
      setError('Please select a valid Excel file (.xlsx or .xls)');
      return;
    }

    try {
      setUploadingBulk(true);
      setError(null);
      
      const response = await bulkUploadProducts(selectedBulkFile);
      
      // Show success message with details
      const successMessage = response.message || 'Bulk upload completed successfully!';
      const details = response.data ? 
        `Created: ${response.data.successCount || 0}, Errors: ${response.data.errorCount || 0}` : '';
      
      setUploadProgress({
        success: true,
        message: successMessage,
        details: details,
      });
      
      // Refresh products list
      await fetchProducts();
      
      // Clear selection and close modal after 3 seconds
      setTimeout(() => {
        setSelectedBulkFile(null);
        setUploadProgress(null);
        setOpenBulkUpload(false);
      }, 3000);
    } catch (error) {
      console.error('Error uploading bulk file:', error);
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        setError(`Failed to upload file: ${error.message}`);
      }
    } finally {
      setUploadingBulk(false);
    }
  };

  const handleBulkFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedBulkFile(file);
      setError(null);
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
            {activeTab === 'Media Gallery' ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  padding: '8px'
                }}
              >
                {uploadedProducts.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
                    No uploaded images found.
                  </div>
                )}
                {uploadedProducts.map(product => (
                  <div
                    key={product.product_id || product.id}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                    }}
                  >
                    <div style={{ width: '100%', aspectRatio: '4/3', background: '#f5f5f5' }}>
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.model_no || 'Product image'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#999',
                          fontSize: '14px'
                        }}>
                          No Image
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600, marginBottom: '6px' }}>
                        {product.model_no || 'No Model'}
                      </div>
                      <div style={{ fontSize: '13px', color: '#555', marginBottom: '4px' }}>
                        Brand: {product.brand_name || product.brand || 'N/A'}
                      </div>
                      <div style={{ fontSize: '13px', color: '#555', marginBottom: '8px' }}>
                        Collection: {product.collection_name || product.collection || 'N/A'}
                      </div>
                      <button
                        className="ui-btn ui-btn--danger"
                        style={{ width: '100%' }}
                        onClick={() => handleDelete({ id: product.product_id || product.id, model_no: product.model_no, type: 'Product' })}
                        disabled={loading}
                      >
                        {loading ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
            <TableWithControls
              title={activeTab === 'Unuploaded Media Gallery' ? 'Unuploaded Media Gallery' : 'Products'}
              columns={columns}
              rows={filteredRowsByTab}
              onAddNew={handleAdd}
              addNewText="Add New Product"
              onImport={() => setOpenBulkUpload(true)}
              importText="Bulk Upload Products"
              secondaryActions={[
                {
                  label: uploadingImage 
                    ? `Uploading ${selectedImages.length > 0 ? `${selectedImages.length} ` : ''}Image${selectedImages.length > 1 ? 's' : ''}...` 
                    : 'Upload Product Images',
                  onClick: () => imageInputRef.current?.click(),
                  disabled: uploadingImage,
                },
              ]}
              searchPlaceholder="Search products"
            />
            )}
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
        open={openBulkUpload}
        onClose={() => {
          setOpenBulkUpload(false);
          setSelectedBulkFile(null);
          setError(null);
          setUploadProgress(null);
        }}
        title="Bulk Upload Products"
        footer={(
          <>
            <button 
              className="ui-btn ui-btn--secondary" 
              onClick={() => {
                setOpenBulkUpload(false);
                setSelectedBulkFile(null);
                setError(null);
                setUploadProgress(null);
              }}
              disabled={uploadingBulk}
            >
              Cancel
            </button>
            <button 
              className="ui-btn ui-btn--primary" 
              onClick={handleBulkUpload}
              disabled={uploadingBulk || !selectedBulkFile}
            >
              {uploadingBulk ? 'Uploading...' : 'Upload File'}
            </button>
          </>
        )}
      >
        <div className="ui-form">
          <div className="form-group form-group--full">
            <label className="ui-label">Select Excel File (.xlsx or .xls) *</label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleBulkFileSelect}
              className="ui-input"
              disabled={uploadingBulk}
            />
            {selectedBulkFile && (
              <p style={{ marginTop: '8px', color: '#666', fontSize: '14px' }}>
                Selected: {selectedBulkFile.name} ({(selectedBulkFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
          {uploadProgress && (
            <div style={{
              padding: '12px',
              backgroundColor: uploadProgress.success ? '#d4edda' : '#f8d7da',
              border: `1px solid ${uploadProgress.success ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '8px',
              marginTop: '16px',
              color: uploadProgress.success ? '#155724' : '#721c24'
            }}>
              <strong>{uploadProgress.success ? 'Success!' : 'Error:'}</strong> {uploadProgress.message}
              {uploadProgress.details && (
                <div style={{ marginTop: '8px', fontSize: '14px' }}>
                  {uploadProgress.details}
                </div>
              )}
          </div>
          )}
        </div>
      </Modal>
      <input
        ref={imageInputRef}
        id="product-image-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        disabled={uploadingImage}
      />
    </div>
  );
};

export default DashboardProducts;

