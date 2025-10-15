const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cities = sequelize.define('Cities', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  city: {
    type: DataTypes.STRING(211),
    allowNull: false,
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
  updated_at: {
    type: DataTypes.STRING(211),
    allowNull: true,
  },
}, {
  tableName: 'cities',
  timestamps: false, // This table doesn't use standard timestamps
  indexes: [
    {
      unique: true,
      fields: ['city', 'state_id'],
      name: 'cities_city_state_unique'
    }
  ]
});

// Define associations
Cities.associate = function(models) {
  Cities.hasMany(models.Zone, {
    foreignKey: 'city_id',
    as: 'zones'
  });
  
  Cities.belongsTo(models.State, {
    foreignKey: 'state_id',
    as: 'state'
  });
};

// Static method to get cities by state with zones
Cities.getCitiesByStateWithZones = async function(stateId) {
  return await this.findAll({ 
    where: { 
      state_id: stateId,
      status: true 
    },
    include: [{
      model: sequelize.models.Zone,
      as: 'zones',
      where: { status: true },
      required: false
    }],
    order: [['city', 'ASC'], ['zones', 'sort_order', 'ASC']]
  });
};

// Static method to get cities by state
Cities.getCitiesByState = async function(stateId) {
  return await this.findAll({ 
    where: { 
      state_id: stateId,
      status: true 
    },
    order: [['city', 'ASC']]
  });
};

// Static method to get city by name
Cities.getCityByName = async function(cityName, stateId = null) {
  const whereClause = { 
    city: cityName,
    status: true 
  };
  
  if (stateId) {
    whereClause.state_id = stateId;
  }
  
  return await this.findOne({ where: whereClause });
};

// Static method to get city with zones
Cities.getCityWithZones = async function(cityId) {
  return await this.findOne({
    where: { 
      id: cityId,
      status: true 
    },
    include: [{
      model: sequelize.models.Zone,
      as: 'zones',
      where: { status: true },
      required: false
    }]
  });
};

// Static method to search cities by name (for auto-complete)
Cities.searchCities = async function(searchTerm, limit = 10) {
  return await this.findAll({
    where: {
      city: {
        [sequelize.Op.like]: `%${searchTerm}%`
      },
      status: true
    },
    limit: limit,
    order: [['city', 'ASC']]
  });
};

module.exports = Cities; 