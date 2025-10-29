import React, { useState, useRef, useEffect } from 'react';
import '../styles/pages/ProductDetail.css';
import { addToCart } from '../services/cartService';
import { showAddToCartSuccess } from '../services/notificationService';

// Shared state for viewMode to communicate with Breadcrumb
let sharedViewMode = 'grid';
let sharedSetViewMode = null;

export const getSharedViewMode = () => sharedViewMode;
export const setSharedViewMode = (mode) => {
  sharedViewMode = mode;
  if (sharedSetViewMode) sharedSetViewMode(mode);
};
export const registerViewModeSetter = (setter) => {
  sharedSetViewMode = setter;
};

const ProductDetail = ({ productId: propProductId = null }) => {
  // Get productId from URL if not provided as prop (for direct navigation)
  const [productId, setProductId] = useState(() => {
    if (propProductId) return propProductId;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      return id ? parseInt(id) : 1;
    }
    return 1;
  });
  const [viewMode, setViewMode] = useState(() => {
    const mode = sharedViewMode || 'grid';
    return mode;
  });
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [quantities, setQuantities] = useState({});
  
  // Register setter and sync with shared state
  useEffect(() => {
    registerViewModeSetter((mode) => {
      setViewMode(mode);
    });
  }, []);
  
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setSharedViewMode(mode);
  };
  const [sliderPosition, setSliderPosition] = useState(0);
  const sliderRef = useRef(null);

  // Quantity management functions
  const getQuantity = (variationId) => {
    return quantities[variationId] || 1;
  };

  const updateQuantity = (variationId, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1; // Minimum quantity is 1
    setQuantities(prev => ({
      ...prev,
      [variationId]: newQuantity
    }));
  };

  const handleQuantityIncrease = (variationId, e) => {
    e.stopPropagation(); // Prevent card click when clicking button
    const currentQty = getQuantity(variationId);
    updateQuantity(variationId, currentQty + 1);
  };

  const handleQuantityDecrease = (variationId, e) => {
    e.stopPropagation(); // Prevent card click when clicking button
    const currentQty = getQuantity(variationId);
    if (currentQty > 1) {
      updateQuantity(variationId, currentQty - 1);
    }
  };

  const handleAddToCart = (variation, e) => {
    if (e) {
      e.stopPropagation(); // Prevent card click when clicking button
    }
    const quantity = getQuantity(variation.id);
    addToCart({
      id: variation.id,
      name: variation.name,
      image: variation.image,
      lenseColour: variation.lenseColour,
      whp: variation.whp,
      quantity: quantity
    });
    // Show success notification
    showAddToCartSuccess(`${variation.name} (${variation.lenseColour})`, quantity);
  };

  // Mock product data with variations
  // In real app, this would come from API based on productId
  const productVariations = [
    {
      id: 1,
      name: 'Anti-Fog Safety Goggles',
      brand: 'Pepe Jeans',
      model: 'Anti-Fog Safety',
      type: 'Sunglass',
      gender: 'Man',
      shape: 'Aviator',
      frameColour: 'M/Black',
      frameMaterial: 'Tr90 With Metal',
      lenseColour: 'Black Gradient',
      lenseMaterial: 'Polycarbonate',
      size: '56-12-143',
      mrp: '₹5,058',
      whp: '₹2,090',
      qty: 'Full Quantity',
      image: '/images/products/spac1.webp'
    },
    {
      id: 2,
      name: 'Anti-Fog Safety Goggles',
      brand: 'Pepe Jeans',
      model: 'Anti-Fog Safety',
      type: 'Sunglass',
      gender: 'Man',
      shape: 'Aviator',
      frameColour: 'M/Black',
      frameMaterial: 'Tr90 With Metal',
      lenseColour: 'Orange Gradient',
      lenseMaterial: 'Polycarbonate',
      size: '56-12-143',
      mrp: '₹5,058',
      whp: '₹2,090',
      qty: 'Full Quantity',
      image: '/images/products/spac2.webp'
    },
    {
      id: 3,
      name: 'Anti-Fog Safety Goggles',
      brand: 'Pepe Jeans',
      model: 'Anti-Fog Safety',
      type: 'Sunglass',
      gender: 'Man',
      shape: 'Aviator',
      frameColour: 'M/Black',
      frameMaterial: 'Tr90 With Metal',
      lenseColour: 'Charcoal',
      lenseMaterial: 'Polycarbonate',
      size: '56-12-143',
      mrp: '₹5,058',
      whp: '₹2,090',
      qty: 'Full Quantity',
      image: '/images/products/spac3.webp'
    },
    {
      id: 4,
      name: 'Anti-Fog Safety Goggles',
      brand: 'Pepe Jeans',
      model: 'Anti-Fog Safety',
      type: 'Sunglass',
      gender: 'Man',
      shape: 'Aviator',
      frameColour: 'M/Black',
      frameMaterial: 'Tr90 With Metal',
      lenseColour: 'Brown Gradient',
      lenseMaterial: 'Polycarbonate',
      size: '56-12-143',
      mrp: '₹5,058',
      whp: '₹2,090',
      qty: 'Full Quantity',
      image: '/images/products/spac4.webp'
    },
    {
      id: 5,
      name: 'Anti-Fog Safety Goggles',
      brand: 'Pepe Jeans',
      model: 'Anti-Fog Safety',
      type: 'Sunglass',
      gender: 'Man',
      shape: 'Aviator',
      frameColour: 'M/Black',
      frameMaterial: 'Tr90 With Metal',
      lenseColour: 'Grey',
      lenseMaterial: 'Polycarbonate',
      size: '56-12-143',
      mrp: '₹5,058',
      whp: '₹2,090',
      qty: 'Full Quantity',
      image: '/images/products/spac5.webp'
    },
    {
      id: 6,
      name: 'Anti-Fog Safety Goggles',
      brand: 'Pepe Jeans',
      model: 'Anti-Fog Safety',
      type: 'Sunglass',
      gender: 'Man',
      shape: 'Aviator',
      frameColour: 'M/Black',
      frameMaterial: 'Tr90 With Metal',
      lenseColour: 'Blue',
      lenseMaterial: 'Polycarbonate',
      size: '56-12-143',
      mrp: '₹5,058',
      whp: '₹2,090',
      qty: 'Full Quantity',
      image: '/images/products/spac6.webp'
    }
  ];

  const currentProduct = productVariations[selectedVariation];
  const totalVariations = productVariations.length;
  
  // Update display variation based on selected variation
  useEffect(() => {
    // When variation is selected, ensure it's reflected in the display
  }, [selectedVariation]);

  // Slider logic - always show 3 cards per row in grid
  // For 4 variations: show first 3 in slider (no scrolling), 4th with details below
  // For 5 variations: show first 3, then 4th-5th when scrolled, 5th also with details below
  // For 6 variations: show first 3, then 4th-6th when scrolled, 6th also with details below
  const cardsPerRow = 3;
  const needsSliderArrows = totalVariations > 4; // Only need arrows for 5+ variations
  
  // For 4 variations: maxPos = 0 (no scrolling, just show first 3)
  // For 5 variations: maxPos = 1 (can scroll to see 4th-5th)
  // For 6 variations: maxPos = 1 (can scroll to see 4th-6th)  
  const maxSliderPosition = totalVariations > 4 ? 1 : 0;
  
  const scrollSlider = (direction) => {
    const newPosition = direction === 'next' 
      ? Math.min(sliderPosition + 1, maxSliderPosition)
      : Math.max(sliderPosition - 1, 0);
    setSliderPosition(newPosition);
  };

  const handleVariationClick = (index) => {
    setSelectedVariation(index);
  };

  const getVisibleVariations = () => {
    if (viewMode === 'list') {
      return productVariations;
    }
    // Grid view: 
    // - For 4 variations: show first 3 (indices 0-2)
    // - For 5 variations: show first 3 (indices 0-2) or last 2 (indices 3-4) when scrolled
    // - For 6 variations: show first 3 (indices 0-2) or last 3 (indices 3-5) when scrolled
    if (totalVariations === 4) {
      // Show first 3 variations
      return productVariations.slice(0, 3);
    } else if (totalVariations === 5) {
      // Show first 3 or last 2 based on slider position
      if (sliderPosition === 0) {
        return productVariations.slice(0, 3);
      } else {
        return productVariations.slice(3, 5);
      }
    } else if (totalVariations === 6) {
      // Show first 3 or last 3 based on slider position
      if (sliderPosition === 0) {
        return productVariations.slice(0, 3);
      } else {
        return productVariations.slice(3, 6);
      }
    }
    return productVariations.slice(0, Math.min(3, totalVariations));
  };

  const getDisplayVariation = () => {
    if (viewMode === 'list') {
      return null; // In list view, all variations are displayed
    }
    // Always show the selected variation's features
    // In grid view, always show currentProduct (selected variation) in features section
    return currentProduct;
  };

  const visibleVariations = getVisibleVariations();
  const displayVariation = getDisplayVariation();
  const needsSlider = viewMode === 'grid' && needsSliderArrows; // Only need slider arrows for 5-6 variations

  return (
    <div className="product-detail-page">

      {/* List View */}
      {viewMode === 'list' && (
        <div className="list-view-container">
          {productVariations.map((variation, index) => (
            <div key={variation.id} className="list-view-item">
              <div className="list-item-image">
                <img src={variation.image} alt={variation.name} />
              </div>
              <div className="list-item-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Brand:</span>
                    <span className="detail-value">{variation.brand}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Model:</span>
                    <span className="detail-value">{variation.model}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">{variation.type}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Gender:</span>
                    <span className="detail-value">{variation.gender}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Shape:</span>
                    <span className="detail-value">{variation.shape}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Frame Colour:</span>
                    <span className="detail-value">{variation.frameColour}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Frame Material:</span>
                    <span className="detail-value">{variation.frameMaterial}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Lense Colour:</span>
                    <span className="detail-value">{variation.lenseColour}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Lense Material:</span>
                    <span className="detail-value">{variation.lenseMaterial}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Size:</span>
                    <span className="detail-value">{variation.size}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">MRP:</span>
                    <span className="detail-value">{variation.mrp}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">WHP:</span>
                    <span className="detail-value">{variation.whp}</span>
                  </div>
                  {/* QTY label/value as a normal detail cell */}
                  <div className="detail-item">
                    <span className="detail-label">QTY:</span>
                    <span className="detail-value">{variation.qty}</span>
                  </div>
                  {/* Quantity selector in 5th column */}
                  <div className="quantity-selector-wrapper">
                    <div className="quantity-selector">
                      <button 
                        className="qty-btn minus" 
                        onClick={(e) => handleQuantityDecrease(variation.id, e)}
                      >-</button>
                      <span className="qty-number">
                        {String(getQuantity(variation.id)).padStart(2, '0')}
                      </span>
                      <button 
                        className="qty-btn plus" 
                        onClick={(e) => handleQuantityIncrease(variation.id, e)}
                      >+</button>
                    </div>
                  </div>
                  {/* Add to Cart button in 6th column */}
                  <div className="add-to-cart-wrapper">
                    <button 
                      className="add-to-cart-btn-list"
                      onClick={(e) => handleAddToCart(variation, e)}
                    >Add to Cart</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid-view-container">
          {/* Main Product Display Area */}
          <div className="grid-main-section">
            {/* Slider Section */}
            {totalVariations > 3 && (
              <div className="variation-slider-section">
                {needsSlider && (
                  <button
                    className="slider-arrow left"
                    onClick={() => scrollSlider('prev')}
                    disabled={sliderPosition === 0}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
                <div className="variation-slider" ref={sliderRef}>
                  <div className="variation-slider-track">
                    {visibleVariations.map((variation, index) => {
                      // Calculate actual index based on which variations are shown
                      let actualIndex;
                      if (totalVariations === 4) {
                        actualIndex = index; // indices 0, 1, 2
                      } else if (totalVariations === 5) {
                        actualIndex = sliderPosition === 0 ? index : (3 + index); // 0-2 or 3-4
                      } else if (totalVariations === 6) {
                        actualIndex = sliderPosition === 0 ? index : (3 + index); // 0-2 or 3-5
                      } else {
                        actualIndex = index;
                      }
                      return (
                        <div
                          key={variation.id}
                          className={`variation-card ${selectedVariation === actualIndex ? 'active' : ''}`}
                          onClick={() => handleVariationClick(actualIndex)}
                        >
                          <div className="variation-card-image">
                            <img src={variation.image} alt={variation.name} />
                          </div>
                          <div className="variation-card-details">
                            <h4 className="variation-card-title">{variation.name}</h4>
                            <div className="variation-specs">
                              <div className="variation-spec-item">
                                <span className="variation-spec-label">Frame Colour</span>
                                <span className="variation-spec-value">{variation.frameColour}</span>
                              </div>
                              <div className="variation-spec-item">
                                <span className="variation-spec-label">Lense Colour</span>
                                <span className="variation-spec-value">{variation.lenseColour}</span>
                              </div>
                            </div>
                            <div className="quantity-selector-small">
                              <button 
                                className="qty-btn-small minus" 
                                onClick={(e) => handleQuantityDecrease(variation.id, e)}
                              >-</button>
                              <span className="qty-number-small">
                                {String(getQuantity(variation.id)).padStart(2, '0')}
                              </span>
                              <button 
                                className="qty-btn-small plus" 
                                onClick={(e) => handleQuantityIncrease(variation.id, e)}
                              >+</button>
                            </div>
                            <button 
                              className="add-to-cart-btn-small"
                              onClick={(e) => handleAddToCart(variation, e)}
                            >Add to Cart</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {needsSlider && (
                  <button
                    className="slider-arrow right"
                    onClick={() => scrollSlider('next')}
                    disabled={sliderPosition >= maxSliderPosition}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Main Product Display */}
            <div className="main-product-display">
              <div className="main-product-image">
                <img src={currentProduct.image} alt={currentProduct.name} />
              </div>
              <div className="main-product-info">
                <h2 className="product-title">{currentProduct.name}</h2>
                <div className="color-selectors">
                  {productVariations.slice(0, 3).map((variation, index) => (
                    <div
                      key={variation.id}
                      className={`color-swatch ${selectedVariation === index ? 'active' : ''}`}
                      onClick={() => handleVariationClick(index)}
                      style={{
                        backgroundColor: index === 0 ? '#000000' : index === 1 ? '#FFFFFF' : '#FFB6C1'
                      }}
                    ></div>
                  ))}
                </div>
                <div className="price-info">
                  <div className="price-item">
                    <span className="price-label">MRP</span>
                    <span className="price-value">{currentProduct.mrp}</span>
                  </div>
                  <div className="price-item">
                    <span className="price-label">WHP</span>
                    <span className="price-value">{currentProduct.whp}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Variation Thumbnails */}
            <div className="variation-thumbnails">
              {productVariations.map((variation, index) => (
                <div
                  key={variation.id}
                  className={`thumbnail ${selectedVariation === index ? 'active' : ''}`}
                  onClick={() => handleVariationClick(index)}
                >
                  <img src={variation.image} alt={`${variation.name} - ${variation.lenseColour}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Features Box - Always shows selected variation's features */}
          {viewMode === 'grid' && displayVariation && (
            <div className="features-box-standalone">
              <h3 className="features-title">Features</h3>
              <div className="features-grid">
                <div className="features-column">
                  <div className="feature-item">
                    <span className="feature-label">Brand</span>
                    <span className="feature-separator">-</span>
                    <span className="feature-value">{displayVariation.brand}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Type</span>
                    <span className="feature-separator">-</span>
                    <span className="feature-value">{displayVariation.type}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Gender</span>
                    <span className="feature-separator">-</span>
                    <span className="feature-value">{displayVariation.gender}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Shape</span>
                    <span className="feature-separator">-</span>
                    <span className="feature-value">{displayVariation.shape}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Size</span>
                    <span className="feature-separator">-</span>
                    <span className="feature-value">{displayVariation.size}</span>
                  </div>
                </div>
                <div className="features-column">
                  <div className="feature-item">
                    <span className="feature-label">Frame Colour</span>
                    <span className="feature-separator">-</span>
                    <span className="feature-value">{displayVariation.frameColour}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Frame Material</span>
                    <span className="feature-separator">-</span>
                    <span className="feature-value">{displayVariation.frameMaterial}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Lense Colour</span>
                    <span className="feature-separator">-</span>
                    <span className="feature-value">{displayVariation.lenseColour}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Lense Material</span>
                    <span className="feature-separator">-</span>
                    <span className="feature-value">{displayVariation.lenseMaterial}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">QTY</span>
                    <span className="feature-separator">-</span>
                    <span className="feature-value">{displayVariation.qty}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

