const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const jwt = require('jsonwebtoken');

// Import models
const Zone = require('./Zone');
const Cities = require('./Cities');
const State = require('./State');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  mobile: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  phone: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  flag: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  otp: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  otp_verified: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  otp_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reset_token: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  reset_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  google_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  trade_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  party_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  pan_number: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  gst_number: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  owner_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  owner_mobile: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  city: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  state: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  pincode: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  zone: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  religion: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  party_logo: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  credit_limit: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  category: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  commission: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  business_type: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  distributorsbrands: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  working_states: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  working_zones: {
    type: DataTypes.STRING(211),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  zone_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'zones',
      key: 'id'
    }
  },
  id_proof_photo: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  id_proof_number: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  designation: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  tray: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  tray_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  target: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: '',
    collate: 'utf8mb4_unicode_ci'
  },
  category_type: {
    type: DataTypes.STRING(24),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  reason: {
    type: DataTypes.TEXT('LONG'),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  access: {
    type: DataTypes.STRING(211),
    allowNull: true,
    collate: 'utf8mb4_unicode_ci'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  subrole: {
    type: DataTypes.JSON,
    allowNull: true
  },
  state_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  city_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  country_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Define associations
User.associate = function(models) {
  User.belongsTo(models.Zone, {
    foreignKey: 'zone_id',
    as: 'zone'
  });
  
  User.belongsTo(models.Cities, {
    foreignKey: 'city_id',
    as: 'city'
  });

  User.belongsTo(models.State, {
    foreignKey: 'state_id',
    as: 'state'
  });
};

// Helper method to get user's location details
User.prototype.getLocationDetails = async function() {
  const zone = this.zone_id ? await Zone.findByPk(this.zone_id) : null;
  const city = this.city_id ? await Cities.findByPk(this.city_id) : null;
  const state = this.state_id ? await State.findByPk(this.state_id) : null;

  return {
    zone: zone ? { id: zone.id, name: zone.name, code: zone.zone_code } : null,
    city: city ? { id: city.id, name: city.city } : null,
    state: state ? { id: state.id, name: state.name, code: state.code } : null
  };
};

// Static method to find users by zone
User.findByZone = async function(zoneId, options = {}) {
  return await this.findAll({
    where: { 
      zone_id: zoneId,
      flag: 1,
      ...options.where 
    },
    include: options.include || [],
    order: options.order || [['name', 'ASC']]
  });
};

// Generate JWT token for user
User.prototype.generateToken = async function() {
  // Get role information
  const RoleType = require('./RoleType');
  const role = await RoleType.findByPk(this.role_id);
  
  return jwt.sign(
    { 
      id: this.id, 
      phone: this.phone || this.mobile,
      email: this.email,
      role_id: this.role_id,
      role_name: role ? role.type : 'Unknown',
      subrole: this.subrole,
      permission_level: role ? role.flag : 1
    },
    process.env.JWT_SECRET || 'default_jwt_secret',
    { expiresIn: '24h' }
  );
};

// Instance method to get user's role information
User.prototype.getRoleInfo = async function() {
  const RoleType = require('./RoleType');
  const role = await RoleType.findByPk(this.role_id);
  return {
    role_id: this.role_id,
    role_name: role ? role.type : 'Unknown',
    role_description: role ? role.description : '',
    permission_level: role ? role.flag : 1,
    subrole: this.subrole
  };
};

// Instance method to set subrole for Salesman
User.prototype.setSubrole = async function(subroleName, subroleData = {}) {
  const RoleType = require('./RoleType');
  const role = await RoleType.findByPk(this.role_id);
  
  if (role && role.type === 'Salesman') {
    this.subrole = {
      name: subroleName,
      data: subroleData,
      assigned_at: new Date()
    };
    return this.save();
  }
  throw new Error('Subroles can only be assigned to Salesman users');
};

// Instance method to check if user has permission level
User.prototype.hasPermissionLevel = async function(requiredLevel) {
  const RoleType = require('./RoleType');
  const role = await RoleType.findByPk(this.role_id);
  return role ? role.flag >= requiredLevel : false;
};

// Instance method to check if user is active
User.prototype.isActive = function() {
  return this.flag === 1;
};

module.exports = User; 