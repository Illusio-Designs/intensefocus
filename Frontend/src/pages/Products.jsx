import React, { useState, useEffect, useCallback } from 'react';
import '../styles/pages/Products.css';
import ProductCard from '../components/ProductCard';
import {
  getProducts,
  getBrands,
  getGenders,
  getShapes,
  getLensColors,
  getFrameColors,
  getLensMaterials,
  getFrameMaterials,
  getFrameTypes,
} from '../services/apiService';

const Products = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFrameMaterials, setSelectedFrameMaterials] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedType, setSelectedType] = useState('Full Frame');
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedLensColor, setSelectedLensColor] = useState(null);
  const [selectedLensMaterial, setSelectedLensMaterial] = useState([]);
  const [selectedFrameColor, setSelectedFrameColor] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState([]);
  
  // API data states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  
  // Lookup data states
  const [brandsData, setBrandsData] = useState([]);
  const [gendersData, setGendersData] = useState([]);
  const [shapesData, setShapesData] = useState([]);
  const [lensColorsData, setLensColorsData] = useState([]);
  const [frameColorsData, setFrameColorsData] = useState([]);
  const [lensMaterialsData, setLensMaterialsData] = useState([]);
  const [frameMaterialsData, setFrameMaterialsData] = useState([]);
  const [frameTypesData, setFrameTypesData] = useState([]);
  
  // Dropdown states for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    frameMaterial: false,
    shape: false,
    type: false,
    gender: false,
    lensColor: false,
    lensMaterial: false,
    frameColor: false,
    productType: false
  });

  // Static data for filters (will be replaced with API data)
  const types = ['Full Frame', 'Half Frame', 'Rimless'];
  const productTypes = ['Sunglasses', 'Eyeglasses', 'Riding Goggles', 'Safety Goggles'];
  
  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'Dark Blue', hex: '#1E3A8A' },
    { name: 'Light Blue', hex: '#60A5FA' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Yellow', hex: '#FBBF24' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Grey', hex: '#9CA3AF' },
    { name: 'White', hex: '#FFFFFF' }
  ];

  // Fetch lookup data on mount
  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const [brands, genders, shapes, lensColors, frameColors, lensMaterials, frameMaterials, frameTypes] = await Promise.all([
          getBrands(),
          getGenders(),
          getShapes(),
          getLensColors(),
          getFrameColors(),
          getLensMaterials(),
          getFrameMaterials(),
          getFrameTypes(),
        ]);
        
        setBrandsData(Array.isArray(brands) ? brands : []);
        setGendersData(Array.isArray(genders) ? genders : []);
        setShapesData(Array.isArray(shapes) ? shapes : []);
        setLensColorsData(Array.isArray(lensColors) ? lensColors : []);
        setFrameColorsData(Array.isArray(frameColors) ? frameColors : []);
        setLensMaterialsData(Array.isArray(lensMaterials) ? lensMaterials : []);
        setFrameMaterialsData(Array.isArray(frameMaterials) ? frameMaterials : []);
        setFrameTypesData(Array.isArray(frameTypes) ? frameTypes : []);
      } catch (err) {
        console.error('Error fetching lookup data:', err);
      }
    };
    
    fetchLookupData();
  }, []);

  // Helper function to map filter values to IDs
  const mapFilterToIds = useCallback((filterValues, lookupData, nameKey, idKey) => {
    if (!Array.isArray(filterValues) || filterValues.length === 0) return undefined;
    
    const ids = filterValues
      .map(value => {
        const item = lookupData.find(item => 
          (item[nameKey] || '').toLowerCase() === (value || '').toLowerCase()
        );
        return item?.[idKey] || item?.id;
      })
      .filter(id => id !== undefined);
    
    return ids.length > 0 ? (ids.length === 1 ? ids[0] : ids) : undefined;
  }, []);

  // Build filter object for API
  const buildFilters = useCallback(() => {
    const filters = {};
    
    // Map brands
    if (selectedBrands.length > 0) {
      const brandIds = mapFilterToIds(selectedBrands, brandsData, 'brand_name', 'brand_id');
      if (brandIds) filters.brand_id = brandIds;
    }
    
    // Map genders
    if (selectedGender.length > 0) {
      const genderIds = mapFilterToIds(selectedGender, gendersData, 'gender_name', 'gender_id');
      if (genderIds) filters.gender_id = genderIds;
    }
    
    // Map shapes
    if (selectedShape) {
      const shapeMap = {
        'cateye': 'Cat Eye',
        'phantos': 'Phantos',
        'geometric': 'Geometric',
        'oval': 'Oval'
      };
      const shapeName = shapeMap[selectedShape];
      if (shapeName) {
        const shape = shapesData.find(s => 
          (s.shape_name || '').toLowerCase() === shapeName.toLowerCase()
        );
        if (shape?.shape_id || shape?.id) {
          filters.shape_id = shape.shape_id || shape.id;
        }
      }
    }
    
    // Map frame type
    if (selectedType && selectedType !== 'Full Frame') {
      const frameType = frameTypesData.find(ft => 
        (ft.frame_type_name || '').toLowerCase() === selectedType.toLowerCase()
      );
      if (frameType?.frame_type_id || frameType?.id) {
        filters.frame_type_id = frameType.frame_type_id || frameType.id;
      }
    }
    
    // Map lens color
    if (selectedLensColor) {
      const lensColor = lensColorsData.find(lc => 
        (lc.lens_color_name || '').toLowerCase() === selectedLensColor.toLowerCase()
      );
      if (lensColor?.lens_color_id || lensColor?.id) {
        filters.lens_color_id = lensColor.lens_color_id || lensColor.id;
      }
    }
    
    // Map frame color
    if (selectedFrameColor) {
      const frameColor = frameColorsData.find(fc => 
        (fc.frame_color_name || '').toLowerCase() === selectedFrameColor.toLowerCase()
      );
      if (frameColor?.frame_color_id || frameColor?.id) {
        filters.frame_color_id = frameColor.frame_color_id || frameColor.id;
      }
    }
    
    // Map lens materials
    if (selectedLensMaterial.length > 0) {
      const lensMaterialIds = mapFilterToIds(selectedLensMaterial, lensMaterialsData, 'lens_material_name', 'lens_material_id');
      if (lensMaterialIds) filters.lens_material_id = lensMaterialIds;
    }
    
    // Map frame materials
    if (selectedFrameMaterials.length > 0) {
      const frameMaterialIds = mapFilterToIds(selectedFrameMaterials, frameMaterialsData, 'frame_material_name', 'frame_material_id');
      if (frameMaterialIds) filters.frame_material_id = frameMaterialIds;
    }
    
    // Price filter
    if (minPrice > 0 || maxPrice < 10000) {
      filters.price = {
        min: minPrice,
        max: maxPrice
      };
    }
    
    return filters;
  }, [
    selectedBrands, selectedGender, selectedShape, selectedType,
    selectedLensColor, selectedFrameColor, selectedLensMaterial,
    selectedFrameMaterials, minPrice, maxPrice,
    brandsData, gendersData, shapesData, lensColorsData,
    frameColorsData, lensMaterialsData, frameMaterialsData,
    frameTypesData, mapFilterToIds
  ]);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const filters = buildFilters();
        const data = await getProducts(1, 1000, filters);
        
        setProducts(Array.isArray(data) ? data : []);
        setTotalResults(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to fetch products');
        setProducts([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [buildFilters]);

  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(10000);
    setSelectedBrands([]);
    setSelectedFrameMaterials([]);
    setSelectedShape(null);
    setSelectedType('Full Frame');
    setSelectedGender([]);
    setSelectedLensColor(null);
    setSelectedLensMaterial([]);
    setSelectedFrameColor(null);
    setSelectedProductType([]);
  };

  const toggleSelection = (item, selectedItems, setSelectedItems) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleViewMore = (productId) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/product-detail?id=${productId}`;
    }
  };

  // Helper function to get product image
  const getProductImage = (product) => {
    if (!product) return '/images/products/spac1.webp';
    
    // Handle image_urls array
    if (product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
      const firstImage = product.image_urls[0];
      // If it's a full path, use it; otherwise prepend base URL if needed
      if (firstImage.startsWith('http') || firstImage.startsWith('/')) {
        return firstImage;
      }
      return `/${firstImage}`;
    }
    
    // Handle single image_url string
    if (product.image_url) {
      if (product.image_url.startsWith('http') || product.image_url.startsWith('/')) {
        return product.image_url;
      }
      return `/${product.image_url}`;
    }
    
    // Default fallback
    return '/images/products/spac1.webp';
  };

  const minPercent = (minPrice / 10000) * 100;
  const maxPercent = (maxPrice / 10000) * 100;

  const FilterContent = () => (
    <>
      <div className="filter-header">
        <h2>Filter</h2>
        <button className="reset-button" onClick={handleReset}>RESET</button>
      </div>

      {/* Price Filter */}
      <div className="filter-section">
        <h3>Price</h3>
        <div className="price-slider-container">
          <div className="price-range-track"></div>
          <div
            className="price-range-fill"
            style={{ left: `${minPercent}%`, width: `${Math.max(0, maxPercent - minPercent)}%` }}
          ></div>
          <input 
            type="range" 
            min="0" 
            max="10000" 
            value={minPrice}
            onChange={(e) => setMinPrice(Math.min(parseInt(e.target.value), maxPrice - 1))}
            className="price-range-input"
            id="min-price"
          />
          <input 
            type="range" 
            min="0" 
            max="10000" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(Math.max(parseInt(e.target.value), minPrice + 1))}
            className="price-range-input"
            id="max-price"
          />
        </div>
        <div className="price-inputs">
          <input type="text" value={`₹${minPrice}`} readOnly />
          <input type="text" value={`₹${maxPrice}`} readOnly />
        </div>
      </div>

      {/* Brands Filter */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection('brands')}>
          <h3>Brands</h3>
          <span className={`chevron ${expandedSections.brands ? 'expanded' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        {expandedSections.brands && (
          <div className="filter-section-content">
            {brandsData.map(brand => {
              const brandName = brand.brand_name || brand.name || '';
              return (
                <label key={brand.brand_id || brand.id || brandName} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={selectedBrands.includes(brandName)}
                    onChange={() => toggleSelection(brandName, selectedBrands, setSelectedBrands)}
                  />
                  <span>{brandName}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Frame Material Filter */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection('frameMaterial')}>
          <h3>Frame Material</h3>
          <span className={`chevron ${expandedSections.frameMaterial ? 'expanded' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        {expandedSections.frameMaterial && (
          <div className="filter-section-content">
            {frameMaterialsData.map(material => {
              const materialName = material.frame_material_name || material.name || '';
              return (
                <label key={material.frame_material_id || material.id || materialName} className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={selectedFrameMaterials.includes(materialName)}
                    onChange={() => toggleSelection(materialName, selectedFrameMaterials, setSelectedFrameMaterials)}
                  />
                  <span>{materialName}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Shape Filter */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection('shape')}>
          <h3>Shape</h3>
          <span className={`chevron ${expandedSections.shape ? 'expanded' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        {expandedSections.shape && (
          <div className="filter-section-content">
            <div className="shape-grid">
              {[
                { id: 'cateye', name: 'Cat Eye', image: '/images/productshape/cateye.webp' },
                { id: 'phantos', name: 'Phantos', image: '/images/productshape/phantos.webp' },
                { id: 'geometric', name: 'Geometric', image: '/images/productshape/geomatric.webp' },
                { id: 'oval', name: 'Oval', image: '/images/productshape/oval.webp' }
              ].map(shape => (
                <div 
                  key={shape.id}
                  className={`shape-card ${selectedShape === shape.id ? 'active' : ''}`}
                  onClick={() => setSelectedShape(shape.id)}
                >
                  <div className="shape-image-container">
                    <img src={shape.image} alt={shape.name} className="shape-image" />
                  </div>
                  <span className="shape-name">{shape.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Type Filter */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection('type')}>
          <h3>Type</h3>
          <span className={`chevron ${expandedSections.type ? 'expanded' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        {expandedSections.type && (
          <div className="filter-section-content">
            {types.map(type => (
              <label key={type} className="radio-label">
                <input 
                  type="radio" 
                  name="type"
                  checked={selectedType === type}
                  onChange={() => setSelectedType(type)}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Gender Filter */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection('gender')}>
          <h3>Gender</h3>
          <span className={`chevron ${expandedSections.gender ? 'expanded' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        {expandedSections.gender && (
          <div className="filter-section-content">
            {gendersData.map(gender => {
              const genderName = gender.gender_name || gender.name || '';
              return (
                <label key={gender.gender_id || gender.id || genderName} className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={selectedGender.includes(genderName)}
                    onChange={() => toggleSelection(genderName, selectedGender, setSelectedGender)}
                  />
                  <span>{genderName}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Lens Colour Filter */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection('lensColor')}>
          <h3>Lens Colour</h3>
          <span className={`chevron ${expandedSections.lensColor ? 'expanded' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        {expandedSections.lensColor && (
          <div className="filter-section-content">
            <div className="color-swatches">
              {lensColorsData.length > 0 ? (
                lensColorsData.map(color => {
                  const colorName = color.lens_color_name || color.name || '';
                  // Try to find matching color in static colors array for hex value
                  const staticColor = colors.find(c => c.name.toLowerCase() === colorName.toLowerCase());
                  return (
                    <div
                      key={color.lens_color_id || color.id || colorName}
                      className={`color-swatch ${selectedLensColor === colorName ? 'active' : ''}`}
                      style={{ backgroundColor: staticColor?.hex || '#CCCCCC' }}
                      onClick={() => setSelectedLensColor(colorName)}
                      title={colorName}
                    ></div>
                  );
                })
              ) : (
                colors.map(color => (
                  <div
                    key={color.name}
                    className={`color-swatch ${selectedLensColor === color.name ? 'active' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedLensColor(color.name)}
                    title={color.name}
                  ></div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lens Material Filter */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection('lensMaterial')}>
          <h3>Lens Material</h3>
          <span className={`chevron ${expandedSections.lensMaterial ? 'expanded' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        {expandedSections.lensMaterial && (
          <div className="filter-section-content">
            {lensMaterialsData.map(material => {
              const materialName = material.lens_material_name || material.name || '';
              return (
                <label key={material.lens_material_id || material.id || materialName} className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={selectedLensMaterial.includes(materialName)}
                    onChange={() => toggleSelection(materialName, selectedLensMaterial, setSelectedLensMaterial)}
                  />
                  <span>{materialName}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Frame Colour Filter */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection('frameColor')}>
          <h3>Frame Colour</h3>
          <span className={`chevron ${expandedSections.frameColor ? 'expanded' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        {expandedSections.frameColor && (
          <div className="filter-section-content">
            <div className="color-swatches">
              {frameColorsData.length > 0 ? (
                frameColorsData.map(color => {
                  const colorName = color.frame_color_name || color.name || '';
                  // Try to find matching color in static colors array for hex value
                  const staticColor = colors.find(c => c.name.toLowerCase() === colorName.toLowerCase());
                  return (
                    <div
                      key={color.frame_color_id || color.id || colorName}
                      className={`color-swatch ${selectedFrameColor === colorName ? 'active' : ''}`}
                      style={{ backgroundColor: staticColor?.hex || '#CCCCCC' }}
                      onClick={() => setSelectedFrameColor(colorName)}
                      title={colorName}
                    ></div>
                  );
                })
              ) : (
                colors.map(color => (
                  <div
                    key={color.name}
                    className={`color-swatch ${selectedFrameColor === color.name ? 'active' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedFrameColor(color.name)}
                    title={color.name}
                  ></div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Type Filter */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection('productType')}>
          <h3>Product Type</h3>
          <span className={`chevron ${expandedSections.productType ? 'expanded' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        {expandedSections.productType && (
          <div className="filter-section-content">
            {productTypes.map(type => (
              <label key={type} className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedProductType.includes(type)}
                  onChange={() => toggleSelection(type, selectedProductType, setSelectedProductType)}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="products-page">
      <div className="products-container">
        {/* Desktop Filter Sidebar (kept for larger viewports) */}
        <aside className="filter-sidebar">
          <FilterContent />
        </aside>

        {/* Mobile filter toggle - visible via CSS on small screens */}
        <button className="filter-toggle-btn" onClick={() => setMobileFilterOpen(true)}>
          Filters ▾
        </button>

        {/* Mobile centered modal for filter (closes when clicking backdrop) */}
        {mobileFilterOpen && (
          <div className={`mobile-filter-modal open`} onClick={() => setMobileFilterOpen(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <aside className="filter-sidebar">
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <button className="reset-button" onClick={() => setMobileFilterOpen(false)}>Close ✕</button>
                </div>
                <FilterContent />
              </aside>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <main className="products-main">
          <div className="products-header">
            <h2>{loading ? 'Loading...' : error ? 'Error loading products' : `${totalResults} results`}</h2>
          </div>
          {error && (
            <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
              {error}
            </div>
          )}
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              Loading products...
            </div>
          ) : (
            <div className="products-grid-container">
              {products.length > 0 ? (
                products.map(product => {
                  const productId = product.product_id || product.id;
                  const productName = product.model_no || product.name || 'Product';
                  const productImage = getProductImage(product);
                  
                  return (
                    <ProductCard
                      key={productId}
                      productId={productId}
                      productName={productName}
                      productImage={productImage}
                      onViewMore={handleViewMore}
                    />
                  );
                })
              ) : (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  No products found
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
