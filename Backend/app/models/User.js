const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const jwt = require('jsonwebtoken');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  mobile: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user', 'distributor', 'retailer'),
    defaultValue: 'user',
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  profile_image: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email_verified_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  remember_token: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Generate JWT token for user
User.prototype.generateToken = function() {
  return jwt.sign(
    { 
      id: this.id, 
      mobile: this.mobile,
      email: this.email,
      role: this.role 
    },
    process.env.JWT_SECRET || 'default_jwt_secret',
    { expiresIn: '24h' }
  );
};

module.exports = User; 