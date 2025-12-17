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
import { showSuccess, showError } from '../services/notificationService';

const DashboardProducts = () => {
  const [activeTab, setActiveTab] = useState('Products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);
  const [openImageSelectModal, setOpenImageSelectModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBulk, setUploadingBulk] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedBulkFile, setSelectedBulkFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [imageTargetProduct, setImageTargetProduct] = useState(null);
  const [orphanedImages, setOrphanedImages] = useState([]); // Images uploaded without product_id
  const [invalidImageUrls, setInvalidImageUrls] = useState(new Set()); // Track images that failed to load
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

  // Load orphaned images from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('orphanedImages');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter out temporary blob URLs that won't work after refresh
        const validImages = parsed.filter(img => 
          img.url && !img.url.startsWith('blob:') && !img.isTemporary
        );
        if (validImages.length > 0) {
          setOrphanedImages(validImages);
        }
      }
    } catch (e) {
      console.error('Error loading orphaned images from localStorage:', e);
    }
  }, []);

  // Save orphaned images to localStorage whenever they change
  useEffect(() => {
    try {
      // Only save non-temporary images
      const toSave = orphanedImages.filter(img => !img.isTemporary || !img.url.startsWith('blob:'));
      if (toSave.length > 0) {
        localStorage.setItem('orphanedImages', JSON.stringify(toSave));
      } else {
        localStorage.removeItem('orphanedImages');
      }
    } catch (e) {
      console.error('Error saving orphaned images to localStorage:', e);
    }
  }, [orphanedImages]);

  // Note: We don't fetch products when Media Gallery tab opens
  // Products are already loaded on component mount
  // Media Gallery shows both product images and orphaned images

  // Cleanup object URLs when component unmounts or images are removed
  useEffect(() => {
    return () => {
      orphanedImages.forEach(img => {
        if (img.isTemporary && img.url && img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [orphanedImages]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data || []);
      
      // After fetching products, try to verify orphaned images
      // by checking if any match the pattern of existing product images
      if (orphanedImages.length > 0 && data && data.length > 0) {
        // Find a product with an image to understand the URL pattern
        const productWithImage = data.find(p => p.image_url);
        if (productWithImage && productWithImage.image_url) {
          // Extract the base path pattern from existing product images
          const imageUrl = productWithImage.image_url;
          const urlParts = imageUrl.split('/');
          const basePath = urlParts.slice(0, -1).join('/'); // Everything except filename
          
          // Update orphaned images with potential URLs based on product image pattern
          setOrphanedImages(prev => prev.map(img => {
            if (img.isTemporary && img.fileName && !img.verified) {
              // Construct URL using the same pattern as product images
              const constructedUrl = `${basePath}/${img.fileName}`;
              return {
                ...img,
                potentialUrls: [constructedUrl, ...(img.potentialUrls || [])]
              };
            }
            return img;
          }));
          
          // Verify the constructed URLs asynchronously
          setTimeout(async () => {
            setOrphanedImages(currentImages => {
              // Verify URLs asynchronously
              Promise.all(
                currentImages.map(async (img) => {
                  if (img.isTemporary && img.potentialUrls && !img.verified) {
                    for (const potentialUrl of img.potentialUrls) {
                      try {
                        const testResponse = await fetch(potentialUrl, { method: 'HEAD' });
                        if (testResponse.ok) {
                          URL.revokeObjectURL(img.url);
                          return {
                            ...img,
                            url: potentialUrl,
                            isTemporary: false,
                            verified: true
                          };
                        }
                      } catch (e) {
                        continue;
                      }
                    }
                  }
                  return img;
                })
              ).then(verifiedImages => {
                setOrphanedImages(verifiedImages);
              });
              
              return currentImages; // Return current state while verifying
            });
          }, 500);
        }
      }
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

  const handleAttachImage = (row) => {
    // Save the product we want to attach an image to, then open the modal
    setImageTargetProduct(row);
    setError(null);
    setOpenImageSelectModal(true);
  };

  const handleAttachExistingImage = async (imageItem) => {
    if (!imageTargetProduct || !imageItem || !imageItem.image_url) {
      setError('Invalid image or product selected');
      return;
    }

    const productId = imageTargetProduct.id || imageTargetProduct.product_id || imageTargetProduct.data?.product_id || imageTargetProduct.data?.id;
    if (!productId) {
      setError('Product ID not found');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Extract the image filename from the URL
      const imageUrl = imageItem.image_url;
      let filename = null;
      
      // Try to extract filename from URL
      if (imageUrl.includes('/uploads/products/')) {
        filename = imageUrl.split('/uploads/products/')[1]?.split('?')[0];
      } else if (imageUrl.includes('/')) {
        filename = imageUrl.split('/').pop()?.split('?')[0];
      }

      if (!filename && imageItem.fileName) {
        filename = imageItem.fileName;
      }

      if (!filename) {
        setError('Could not determine image filename. Please upload the image directly to the product.');
        return;
      }

      // Create a File object from the image URL
      // Handle blob URLs
      if (imageUrl.startsWith('blob:')) {
        setError('Cannot attach blob URL. Please upload the image directly.');
        return;
      }
      
      // Get the live API base URL
      const getLiveApiBaseUrl = () => {
        if (typeof window === 'undefined') return '';
        const envUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stallion.nishree.com/api';
        let baseUrl = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
        // Remove /api if present, images are served from root
        if (baseUrl.endsWith('/api')) {
          baseUrl = baseUrl.slice(0, -4);
        }
        return baseUrl;
      };
      
      // Construct the full image URL if it's relative
      let fullImageUrl = imageUrl;
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        const baseUrl = getLiveApiBaseUrl();
        if (imageUrl.startsWith('/uploads')) {
          fullImageUrl = `${baseUrl}${imageUrl}`;
        } else if (imageUrl.startsWith('/')) {
          fullImageUrl = `${baseUrl}${imageUrl}`;
        } else {
          fullImageUrl = `${baseUrl}/uploads/products/${imageUrl}`;
        }
      }
      
      // Fetch the image directly from the live API
      let response;
      try {
        response = await fetch(fullImageUrl, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (fetchError) {
        console.error('Error fetching image from live API:', fetchError);
        console.error('Image URL:', fullImageUrl);
        
        // Provide a helpful error message
        const errorMessage = fetchError.message || 'Unknown error';
        throw new Error(
          `Unable to fetch the image: ${errorMessage}. ` +
          `Please try uploading the image directly using the "Upload New Image" button.`
        );
      }

      const blob = await response.blob();
      
      // Validate that we got an image blob
      if (blob.size === 0) {
        throw new Error('The fetched file is empty');
      }
      
      // Use the content-type from response or default to image/jpeg
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      if (!contentType.startsWith('image/')) {
        console.warn('Content-type is not an image, but proceeding:', contentType);
      }
      
      const file = new File([blob], filename, { 
        type: contentType 
      });

      // Upload the image to the product
      await uploadProductImage(file, productId);
      
      // Refresh products to get updated image URLs
      await fetchProducts();
      
      // Remove the image from orphaned images if it was orphaned
      if (imageItem.type === 'orphaned') {
        setOrphanedImages(prev => prev.filter(img => {
          const imgUrl = img.url || img.image_url;
          return imgUrl !== imageUrl;
        }));
      }

      showSuccess(`Image attached to product ${imageTargetProduct.model_no || imageTargetProduct.data?.model_no || 'successfully'}!`);
      setOpenImageSelectModal(false);
      setImageTargetProduct(null);
    } catch (error) {
      console.error('Error attaching image:', error);
      const message = `Failed to attach image: ${error.message}`;
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

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

  // Helper function to convert image URLs to use live API
  const normalizeImageUrl = (url) => {
    if (!url) return null;

    // Temporary blob URLs render as-is
    if (url.startsWith('blob:')) return url;

    // Absolute URLs pass through
    if (url.startsWith('http://') || url.startsWith('https://')) return url;

    // Resolve base for images:
    // 1) NEXT_PUBLIC_IMAGE_BASE_URL (if provided)
    // 2) NEXT_PUBLIC_API_URL (strip /api)
    // 3) fallback to live API URL
    const getImageBase = () => {
      if (typeof window === 'undefined') return '';
      const imgEnv = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
      if (imgEnv) return imgEnv.replace(/\/$/, '');

      const apiEnv = process.env.NEXT_PUBLIC_API_URL || '';
      if (apiEnv) return apiEnv.replace(/\/api\/?$/, '').replace(/\/$/, '');

      // Default to live API URL
      return 'https://stallion.nishree.com';
    };

    const base = getImageBase();

    // Paths starting with /uploads should be served from base root
    if (url.startsWith('/uploads')) {
      return `${base}${url}`;
    }

    // Bare filenames or relative paths -> assume uploads/products
    if (!url.startsWith('/')) {
      return `${base}/uploads/products/${url}`;
    }

    // Generic relative path
    return `${base}${url}`;
  };

  // Combine product images with orphaned images for Media Gallery display
  const allMediaImages = useMemo(() => {
    const productImages = uploadedProducts.map(p => ({
      id: p.product_id || p.id,
      image_url: normalizeImageUrl(p.image_url),
      model_no: p.model_no,
      brand_name: p.brand_name || p.brand,
      collection_name: p.collection_name || p.collection,
      type: 'product'
    }));
    
    const orphaned = orphanedImages.map((img, idx) => {
      // Get the image URL - prefer verified URLs over temporary blob URLs
      const imageUrl = img.url || img.image_url || (typeof img === 'string' ? img : null);
      return {
        id: `orphaned-${idx}-${img.uploadedAt || Date.now()}`,
        image_url: normalizeImageUrl(imageUrl),
        model_no: img.model_no || 'Unassigned',
        brand_name: img.brand_name || 'N/A',
        collection_name: img.collection_name || 'N/A',
        type: 'orphaned',
        isTemporary: img.isTemporary,
        fileName: img.fileName
      };
    });
    
    return [...productImages, ...orphaned];
  }, [uploadedProducts, orphanedImages]);

  // Get only orphaned/unassigned images for the modal
  // Filter to only show images that are in uploads/products directory and are valid
  const orphanedMediaImages = useMemo(() => {
    return orphanedImages
      .filter((img) => {
        const imageUrl = img.url || img.image_url || (typeof img === 'string' ? img : null);
        if (!imageUrl) return false;
        
        // Exclude blob URLs (temporary)
        if (imageUrl.startsWith('blob:')) return false;
        
        // Exclude images that failed to load
        const normalizedUrl = normalizeImageUrl(imageUrl);
        if (invalidImageUrls.has(normalizedUrl) || invalidImageUrls.has(imageUrl)) {
          return false;
        }
        
        // Check if the image is in uploads/products directory
        // Accept if URL contains /uploads/products/ or has a valid filename
        const hasUploadsProducts = normalizedUrl.includes('/uploads/products/') || 
                                   imageUrl.includes('/uploads/products/') ||
                                   (img.fileName && img.fileName.length > 0);
        
        return hasUploadsProducts;
      })
      .map((img, idx) => {
        const imageUrl = img.url || img.image_url || (typeof img === 'string' ? img : null);
        const normalizedUrl = normalizeImageUrl(imageUrl);
        
        return {
          id: `orphaned-${idx}-${img.uploadedAt || Date.now()}`,
          image_url: normalizedUrl,
          model_no: img.model_no || 'Unassigned',
          brand_name: img.brand_name || 'N/A',
          collection_name: img.collection_name || 'N/A',
          type: 'orphaned',
          isTemporary: img.isTemporary,
          fileName: img.fileName || (normalizedUrl.includes('/uploads/products/') 
            ? normalizedUrl.split('/uploads/products/')[1]?.split('?')[0] 
            : null)
        };
      });
  }, [orphanedImages, invalidImageUrls]);

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
      showSuccess('Product deleted successfully');
    } catch (error) {
      if (!error.message?.toLowerCase().includes('token expired') && 
          !error.message?.toLowerCase().includes('unauthorized')) {
        console.error('Error deleting product:', error);
        const message = `Failed to delete product: ${error.message}`;
        setError(message);
        showError(message);
      }
    } finally {
      setLoading(false);
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
        onUpload={(!row.data?.image_url && activeTab === 'Unuploaded Media Gallery') 
          ? () => handleAttachImage(row) 
          : undefined}
      />
    ) },
  ]), [handleEdit, handleDelete, handleAttachImage, activeTab]);

  const handleOpenMediaUpload = () => {
    // Media gallery allows generic uploads (no product binding)
    setImageTargetProduct(null);
    setError(null);
    imageInputRef.current?.click();
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
      
      // Include tray_qty and total_qty only when updating (edit mode)
      if (editRow) {
        dataToSend.tray_qty = parseInt(formData.tray_qty) || 0;
        dataToSend.total_qty = parseInt(formData.total_qty) || 0;
        await updateProduct(editRow.id, dataToSend);
        showSuccess('Product updated successfully');
      } else {
        await createProduct(dataToSend);
        showSuccess('Product created successfully');
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
        const message = `Failed to save product: ${error.message}`;
        setError(message);
        showError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const targetProduct = imageTargetProduct;
    const targetProductId = targetProduct?.id 
      || targetProduct?.product_id 
      || targetProduct?.data?.product_id 
      || targetProduct?.data?.id;
    const targetLabel = targetProduct?.model_no 
      || targetProduct?.data?.model_no 
      || (activeTab === 'Media Gallery' ? 'media' : 'product');

    const isMediaUpload = activeTab === 'Media Gallery';

    if (!targetProductId && !isMediaUpload) {
      setError('Please pick a product to attach images to (use Upload action in Unuploaded Media Gallery).');
      if (e.target) {
        e.target.value = '';
      }
      return;
    }

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
      
      const response = await uploadProductImage(files, targetProductId);
      
      // Log full response for debugging
      console.log('Image upload response:', response);
      console.log('Response keys:', response ? Object.keys(response) : 'No response');
      
      // If upload successful, refresh products to get updated image URLs
      // Only refresh if we uploaded to a specific product
      if (targetProductId) {
        await fetchProducts();
      }
      
      // Handle orphaned images (uploaded without product_id)
      if (isMediaUpload && !targetProductId) {
        // Extract image filenames from response - check all possible structures
        let imageFiles = [];
        
        // Log the full response structure for debugging
        console.log('Processing orphaned image upload response:', JSON.stringify(response, null, 2));
        
        // Get backend base URL for constructing image URLs
        const getBackendBaseUrl = () => {
          if (typeof window === 'undefined') return '';
          const envUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stallion.nishree.com/api';
          if (envUrl) {
            let backendUrl = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
            // Remove /api if present, images are typically served from /uploads
            if (backendUrl.endsWith('/api')) {
              backendUrl = backendUrl.slice(0, -4);
            }
            return backendUrl;
          }
          // Default to live API URL
          return 'https://stallion.nishree.com';
        };
        
        const backendBaseUrl = getBackendBaseUrl();
        
        // Check different possible response structures
        if (response?.data) {
          if (Array.isArray(response.data)) {
            // Response has data array with file info
            imageFiles = response.data.map(item => ({
              filename: item.filename || item.originalName || item.name,
              path: item.path,
              url: item.image_url || item.url || null
            }));
          } else if (response.data.filename) {
            imageFiles = [{
              filename: response.data.filename,
              path: response.data.path,
              url: response.data.image_url || response.data.url || null
            }];
          }
        }
        
        // If no files extracted from response, use uploaded file names
        if (imageFiles.length === 0 && files.length > 0) {
          imageFiles = files.map(file => ({
            filename: file.name,
            path: null,
            url: null
          }));
        }
        
        // Construct accessible image URLs from filenames
        if (imageFiles.length > 0) {
          const newOrphanedImages = imageFiles
            .filter(file => file && file.filename)
            .map(file => {
              // Construct accessible URL from filename
              // Images are typically served from /uploads/products/ directory
              const imageUrl = `${backendBaseUrl}/uploads/products/${file.filename}`;
              
              return {
                url: imageUrl,
                filename: file.filename,
                uploadedAt: new Date().toISOString(),
                isTemporary: false,
                verified: false
              };
            });
          
          setOrphanedImages(prev => [...prev, ...newOrphanedImages]);
          
          // Verify URLs work (optional, can be done in background)
          setTimeout(async () => {
            const verifiedImages = await Promise.all(
              newOrphanedImages.map(async (img) => {
                try {
                  const testResponse = await fetch(img.url, { method: 'HEAD' });
                  if (testResponse.ok) {
                    return { ...img, verified: true };
                  }
                } catch (e) {
                  console.warn('Image URL verification failed:', img.url, e);
                }
                return img;
              })
            );
            
            // Update with verified status
            setOrphanedImages(current => {
              return current.map(curr => {
                const verified = verifiedImages.find(v => v.filename === curr.filename);
                return verified || curr;
              });
            });
          }, 500);
        }
      }
      
      const fileCount = files.length;
      setUploadProgress({
        success: true,
        message: fileCount === 1 
          ? (isMediaUpload ? 'Image uploaded successfully!' : `Image attached to ${targetLabel} successfully!`) 
          : (isMediaUpload ? `${fileCount} images uploaded successfully!` : `${fileCount} images attached to ${targetLabel} successfully!`),
      });
      showSuccess(isMediaUpload ? 'Images uploaded successfully' : 'Images attached to product successfully');
      
      // Close the modal if it was open
      if (openImageSelectModal) {
        setOpenImageSelectModal(false);
      }
      setImageTargetProduct(null);
      
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
        const message = `Failed to upload images: ${error.message}`;
        setError(message);
        showError(message);
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
      showSuccess(successMessage);
      
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
        const message = `Failed to upload file: ${error.message}`;
        setError(message);
        showError(message);
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
        <div className="dash-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          {activeTab === 'Media Gallery' && (
            <button
              className="ui-btn ui-btn--primary"
              onClick={handleOpenMediaUpload}
              disabled={uploadingImage}
              style={{ whiteSpace: 'nowrap', padding: '10px 16px' }}
            >
              {uploadingImage ? 'Uploading...' : 'Upload Images'}
            </button>
          )}
        </div>
        {uploadProgress && (
          <div className="dash-row">
            <div className="dash-card full">
              <div style={{ 
                padding: '12px',
                backgroundColor: uploadProgress.success ? '#d4edda' : '#f8d7da',
                border: `1px solid ${uploadProgress.success ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '8px',
                color: uploadProgress.success ? '#155724' : '#721c24'
              }}>
                <strong>{uploadProgress.success ? 'Success:' : 'Error:'}</strong> {uploadProgress.message}
                {uploadProgress.details && (
                  <div style={{ marginTop: '6px', fontSize: '14px' }}>
                    {uploadProgress.details}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="dash-row">
          <div className="dash-card full">
            {activeTab === 'Media Gallery' ? (
              <div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '16px',
                    padding: '8px'
                  }}
                >
                  {allMediaImages.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
                      No uploaded images found.
                    </div>
                  )}
                  {allMediaImages.map(item => (
                    <div
                      key={item.id}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        position: 'relative'
                      }}
                    >
                      {item.type === 'orphaned' && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          background: '#ff9800',
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          zIndex: 2
                        }}>
                          Unassigned
                        </div>
                      )}
                      <button
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: '#f44336',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                        }}
                        onClick={() => {
                          if (item.type === 'product') {
                            handleDelete({ id: item.id, model_no: item.model_no, type: 'Product' });
                          } else {
                            setOrphanedImages(prev => prev.filter((_, idx) => `orphaned-${idx}` !== item.id));
                          }
                        }}
                        disabled={loading}
                        aria-label="Delete image"
                        title="Delete image"
                      >
                        ✕
                      </button>
                      <div style={{ width: '100%', aspectRatio: '4/3', background: '#f5f5f5', position: 'relative' }}>
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.model_no || 'Product image'}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover',
                              display: 'block'
                            }}
                            onError={(e) => {
                              console.error('Image failed to load:', item.image_url);
                              e.target.style.display = 'none';
                              const errorDiv = e.target.nextElementSibling;
                              if (errorDiv) {
                                errorDiv.style.display = 'flex';
                                errorDiv.textContent = item.isTemporary 
                                  ? 'Image uploading...' 
                                  : 'Image not found';
                              }
                            }}
                            onLoad={() => {
                              const errorDiv = document.querySelector(`[data-image-error="${item.id}"]`);
                              if (errorDiv) {
                                errorDiv.style.display = 'none';
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          data-image-error={item.id}
                          style={{
                            width: '100%',
                            height: '100%',
                            display: item.image_url ? 'none' : 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999',
                            fontSize: '14px',
                            position: 'absolute',
                            top: 0,
                            left: 0
                          }}
                        >
                          {item.isTemporary ? 'Loading...' : 'No Image'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
              secondaryActions={[]}
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
      <Modal
        open={openImageSelectModal}
        onClose={() => {
          setOpenImageSelectModal(false);
          setImageTargetProduct(null);
          setError(null);
        }}
        title={`Attach Image to Product: ${imageTargetProduct?.model_no || imageTargetProduct?.data?.model_no || ''}`}
        footer={(
          <>
            <button 
              className="ui-btn ui-btn--secondary" 
              onClick={() => {
                setOpenImageSelectModal(false);
                setImageTargetProduct(null);
                setError(null);
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="ui-btn ui-btn--primary" 
              onClick={() => {
                imageInputRef.current?.click();
              }}
              disabled={loading || uploadingImage}
            >
              Upload New Image
            </button>
          </>
        )}
      >
        <div style={{ padding: '16px' }}>
          {orphanedMediaImages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>No unassigned images available.</p>
              <p style={{ marginTop: '8px', fontSize: '14px' }}>
                Click "Upload New Image" to upload an image for this product.
              </p>
            </div>
          ) : (
            <>
              <p style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}>
                Select an image from the gallery below to attach to this product, or upload a new image.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '16px',
                  maxHeight: '500px',
                  overflowY: 'auto',
                  padding: '8px'
                }}
              >
                {orphanedMediaImages.map(item => (
                  <div
                    key={item.id}
                    style={{
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => handleAttachExistingImage(item)}
                  >
                    <div style={{ width: '100%', aspectRatio: '4/3', background: '#f5f5f5', position: 'relative' }}>
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.model_no || 'Unassigned image'}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            display: 'block'
                          }}
                          onError={(e) => {
                            // Mark this image URL as invalid
                            setInvalidImageUrls(prev => new Set([...prev, item.image_url]));
                            e.target.style.display = 'none';
                            const errorDiv = e.target.nextElementSibling;
                            if (errorDiv) {
                              errorDiv.style.display = 'flex';
                            }
                          }}
                          onLoad={() => {
                            // Image loaded successfully, ensure it's not marked as invalid
                            setInvalidImageUrls(prev => {
                              const newSet = new Set(prev);
                              newSet.delete(item.image_url);
                              return newSet;
                            });
                          }}
                        />
                      ) : null}
                      <div 
                        style={{
                          width: '100%',
                          height: '100%',
                          display: item.image_url ? 'none' : 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#999',
                          fontSize: '12px',
                          position: 'absolute',
                          top: 0,
                          left: 0
                        }}
                      >
                        No Image
                      </div>
                    </div>
                    <div style={{ 
                      padding: '8px', 
                      background: '#ff9800', 
                      color: '#fff', 
                      fontSize: '11px', 
                      fontWeight: 600,
                      textAlign: 'center'
                    }}>
                      Unassigned
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: 'rgba(59, 130, 246, 0.9)',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 600,
                      pointerEvents: 'none'
                    }}>
                      Click to Attach
                    </div>
                  </div>
                ))}
              </div>
            </>
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

