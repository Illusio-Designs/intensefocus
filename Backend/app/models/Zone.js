const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Zone = sequelize.define('Zone', {
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
  state_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'states',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  zone_code: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true,
  }
}, {
  tableName: 'zones',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['name', 'state_id'],
      name: 'zones_name_state_unique'
    }
  ]
});

// Static method to get zones by state
Zone.getZonesByState = async function(stateId) {
  return await this.findAll({ 
    where: { 
      state_id: stateId,
      status: true 
    },
    order: [['sort_order', 'ASC'], ['name', 'ASC']]
  });
};

// Static method to get zone by name in a state
Zone.getZoneByNameAndState = async function(zoneName, stateId) {
  return await this.findOne({ 
    where: { 
      name: zoneName,
      state_id: stateId,
      status: true 
    }
  });
};

module.exports = Zone; 