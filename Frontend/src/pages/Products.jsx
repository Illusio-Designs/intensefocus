import React, { useState } from 'react';
import '../styles/pages/Products.css';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFrameMaterials, setSelectedFrameMaterials] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedType, setSelectedType] = useState('Full Frame');
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedLensColor, setSelectedLensColor] = useState(null);
  const [selectedLensMaterial, setSelectedLensMaterial] = useState([]);
  const [selectedFrameColor, setSelectedFrameColor] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState([]);
  
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

  const brands = ['Coolay', 'Fastrack', 'Jos Block', 'Cosso'];
  const frameMaterials = ['Metal', 'High Acetate', 'Titanium', 'Urban'];
  const types = ['Full Frame', 'Half Frame', 'Rimless'];
  const genders = ['Men', 'Women', 'Kids'];
  const lensMaterials = ['Trivex', 'High-Index Plastic', 'Glass', 'Nylon'];
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

  const handleReset = () => {
    setPriceRange([0, 10000]);
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

  const handleViewMore = (productId) => {
    console.log('View more clicked for product:', productId);
  };

  // Generate dummy products
  const products = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    name: 'Anti-Fog Safety Goggles',
    image: `/images/products/spac${(i % 6) + 1}.webp`
  }));

  return (
    <div className="products-page">
      <div className="products-container">
        {/* Filter Sidebar */}
        <aside className="filter-sidebar">
          <div className="filter-header">
            <h2>Filter</h2>
            <button className="reset-button" onClick={handleReset}>RESET</button>
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <h3>Price</h3>
            <div className="price-slider">
              <input 
                type="range" 
                min="0" 
                max="10000" 
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              />
            </div>
            <div className="price-inputs">
              <input type="text" value={priceRange[0]} readOnly />
              <input type="text" placeholder="Price" value={priceRange[1]} readOnly />
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
                {brands.map(brand => (
                  <label key={brand} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleSelection(brand, selectedBrands, setSelectedBrands)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
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
                {frameMaterials.map(material => (
                  <label key={material} className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={selectedFrameMaterials.includes(material)}
                      onChange={() => toggleSelection(material, selectedFrameMaterials, setSelectedFrameMaterials)}
                    />
                    <span>{material}</span>
                  </label>
                ))}
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
                  {[1, 2, 3, 4].map(shape => (
                    <div 
                      key={shape}
                      className={`shape-icon ${selectedShape === shape ? 'active' : ''}`}
                      onClick={() => setSelectedShape(shape)}
                    >
                      <div className="shape-placeholder"></div>
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
                {genders.map(gender => (
                  <label key={gender} className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={selectedGender.includes(gender)}
                      onChange={() => toggleSelection(gender, selectedGender, setSelectedGender)}
                    />
                    <span>{gender}</span>
                  </label>
                ))}
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
                  {colors.map(color => (
                    <div
                      key={color.name}
                      className={`color-swatch ${selectedLensColor === color.name ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedLensColor(color.name)}
                      title={color.name}
                    ></div>
                  ))}
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
                {lensMaterials.map(material => (
                  <label key={material} className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={selectedLensMaterial.includes(material)}
                      onChange={() => toggleSelection(material, selectedLensMaterial, setSelectedLensMaterial)}
                    />
                    <span>{material}</span>
                  </label>
                ))}
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
                  {colors.map(color => (
                    <div
                      key={color.name}
                      className={`color-swatch ${selectedFrameColor === color.name ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedFrameColor(color.name)}
                      title={color.name}
                    ></div>
                  ))}
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
        </aside>

        {/* Products Grid */}
        <main className="products-main">
          <div className="products-header">
            <h2>1356 results</h2>
          </div>
          <div className="products-grid-container">
            {products.map(product => (
              <ProductCard
                key={product.id}
                productId={product.id}
                productName={product.name}
                productImage={product.image}
                onViewMore={handleViewMore}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
