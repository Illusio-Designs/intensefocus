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

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={productImage} alt={productName} />
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

