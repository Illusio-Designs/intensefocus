const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  sale_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  brand_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'brands',
      key: 'id'
    }
  },
  collection_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'collections',
      key: 'id'
    }
  },
  shape_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'shape',
      key: 'id'
    }
  },
  gender_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'gender',
      key: 'id'
    }
  },
  lens_material_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'lens_material',
      key: 'id'
    }
  },
  lens_color_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'lens_color',
      key: 'id'
    }
  },
  frame_material_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'frame_material',
      key: 'id'
    }
  },
  frame_color_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'frame_color',
      key: 'id'
    }
  },
  type_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'type',
      key: 'id'
    }
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  meta_title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  meta_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  meta_keywords: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Product; 