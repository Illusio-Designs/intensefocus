const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductImages = sequelize.define('ProductImages', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  image_path: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  image_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  sort_order: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'product_images',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Static method to get images by product
ProductImages.getImagesByProduct = async function(productId) {
  return await this.findAll({ 
    where: { product_id: productId },
    order: [['sort_order', 'ASC'], ['is_primary', 'DESC']]
  });
};

// Static method to get primary image for product
ProductImages.getPrimaryImage = async function(productId) {
  return await this.findOne({ 
    where: { 
      product_id: productId,
      is_primary: true 
    }
  });
};

// Static method to set primary image
ProductImages.setPrimaryImage = async function(imageId, productId) {
  // First, unset all primary images for this product
  await this.update(
    { is_primary: false },
    { where: { product_id: productId } }
  );
  
  // Then set the specified image as primary
  return await this.update(
    { is_primary: true },
    { where: { id: imageId, product_id: productId } }
  );
};

// Static method to add image to product
ProductImages.addImage = async function(productId, imagePath, imageName, isPrimary = false, sortOrder = 0) {
  return await this.create({
    product_id: productId,
    image_path: imagePath,
    image_name: imageName,
    is_primary: isPrimary,
    sort_order: sortOrder
  });
};

module.exports = ProductImages;