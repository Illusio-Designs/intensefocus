const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoleType = sequelize.define('RoleType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM(
      'Admin',
      'Order Manager',
      'Inventory Manager',
      'Tray Manager',
      'Retailor Manager',
      'Distributor Manager',
      'Sales Manager',
      'Distributor',
      'Retailor',
      'Salesman'
    ),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // For Salesman subroles - JSON field to store subrole data
  subroles: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
    comment: 'JSON field to store subrole information for Salesman role'
  },
  // Permission level (1-10, where 10 is highest)
  flag: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 10
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  tableName: 'role_type',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  // Add instance methods for subrole management
  instanceMethods: {
    // Add subrole for Salesman
    addSubrole: function(subroleName, subroleDescription = '') {
      if (this.type === 'Salesman') {
        if (!this.subroles) {
          this.subroles = {};
        }
        this.subroles[subroleName] = {
          name: subroleName,
          description: subroleDescription,
          created_at: new Date()
        };
        return this.save();
      }
      throw new Error('Subroles can only be added to Salesman role');
    },
    
    // Remove subrole for Salesman
    removeSubrole: function(subroleName) {
      if (this.type === 'Salesman' && this.subroles && this.subroles[subroleName]) {
        delete this.subroles[subroleName];
        return this.save();
      }
      throw new Error('Subrole not found or not applicable');
    },
    
    // Get all subroles for Salesman
    getSubroles: function() {
      if (this.type === 'Salesman') {
        return this.subroles || {};
      }
      return {};
    }
  }
});

// Static method to get role by name
RoleType.getRoleByName = async function(roleName) {
  return await this.findOne({ where: { type: roleName, status: 'active' } });
};

// Static method to get all active roles
RoleType.getAllActiveRoles = async function() {
  return await this.findAll({ 
    where: { status: 'active' },
    order: [['flag', 'DESC'], ['type', 'ASC']]
  });
};

// Static method to initialize default roles
RoleType.initializeDefaultRoles = async function() {
  const defaultRoles = [
    { type: 'Admin', description: 'System Administrator with full access', flag: 10 },
    { type: 'Order Manager', description: 'Manages orders and order processing', flag: 8 },
    { type: 'Inventory Manager', description: 'Manages inventory and stock', flag: 8 },
    { type: 'Tray Manager', description: 'Manages tray allotments and transfers', flag: 7 },
    { type: 'Retailor Manager', description: 'Manages retailor operations', flag: 7 },
    { type: 'Distributor Manager', description: 'Manages distributor operations', flag: 7 },
    { type: 'Sales Manager', description: 'Manages sales operations and targets', flag: 6 },
    { type: 'Distributor', description: 'Distributor user with limited access', flag: 4 },
    { type: 'Retailor', description: 'Retailor user with limited access', flag: 3 },
    { type: 'Salesman', description: 'Salesman with subrole capabilities', flag: 2, subroles: {} }
  ];

  for (const role of defaultRoles) {
    await this.findOrCreate({
      where: { type: role.type },
      defaults: role
    });
  }
};

module.exports = RoleType; 