import React, { useState } from 'react';

const ProductCard = ({ 
  productId, 
  productName, 
  productImage, 
  colors = [
    { color: '#000000', name: 'Black' },
    { color: '#E5E5E5', name: 'Grey' },
    { color: '#FFB6C1', name: 'Pink' }
  ],
  onViewMore 
}) => {
  const [activeColor, setActiveColor] = useState(0);

  const handleColorClick = (colorIndex) => {
    setActiveColor(colorIndex);
  };

  const handleViewMoreClick = () => {
    if (onViewMore) {
      onViewMore(productId);
    }
  };

  // Construct image URL - extract filename from path and use the specified format
  const getImageUrl = () => {
    if (!productImage) {
      return '/images/products/spac1.webp';
    }
    
    // If already a full URL (starts with http), use it as-is (but clean it first)
    if (productImage.startsWith('http')) {
      // Remove any trailing JSON syntax characters (backslashes, brackets, quotes)
      let cleaned = productImage.replace(/([\]"\\])+$/, '');
      return cleaned;
    }
    
    // Remove any query parameters or fragments
    let cleanPath = productImage.split('?')[0].split('#')[0];
    
    // Remove any trailing JSON syntax characters (like \]", ]", \", etc.)
    cleanPath = cleanPath.replace(/([\]"\\])+$/, '');
    
    // Extract filename from path
    // Handles paths like:
    // - "/uploads/products/spac2-1766058948930.webp" -> "spac2-1766058948930.webp"
    // - "/Users/.../uploads/products/filename.jpg" -> "filename.jpg"
    // - "filename.webp" -> "filename.webp"
    const parts = cleanPath.split('/');
    let filename = parts[parts.length - 1];
    
    // Clean filename: remove any remaining JSON syntax characters
    filename = filename.replace(/([\]"\\])+$/, '');
    
    // Make sure we got a valid filename (not empty, has extension)
    if (filename && filename.includes('.')) {
      // Use the specified URL format: https://stallion.nishree.com/uploads/products/${filename}
      return `https://stallion.nishree.com/uploads/products/${filename}`;
    }
    
    // Fallback to default image
    return '/images/products/spac1.webp';
  };

  const imageUrl = getImageUrl();
  
  const handleImageError = (e) => {
    console.error('[ProductCard] Image failed to load:', imageUrl);
    // Fallback to default image
    e.target.src = '/images/products/spac1.webp';
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={imageUrl} 
          alt={productName}
          onError={handleImageError}
        />
      </div>
      <h3 className="product-name">{productName}</h3>
      <div className="color-options">
        {colors.map((colorItem, index) => (
          <div
            key={index}
            className={`color-swatch ${activeColor === index ? 'active' : ''}`}
            style={{backgroundColor: colorItem.color}}
            onClick={() => handleColorClick(index)}
            title={colorItem.name}
          ></div>
        ))}
      </div>
      <div className="button-container">
        <button className="view-more-button" onClick={handleViewMoreClick}>
          VIEW MORE
        </button>
        <button className="view-more-button-border"></button>
      </div>
    </div>
  );
};

export default ProductCard;

