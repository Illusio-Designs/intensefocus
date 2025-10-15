const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const State = sequelize.define('State', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: true,
    unique: true,
  },
  country_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'countries',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
}, {
  tableName: 'states',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Static method to get states by country
State.getStatesByCountry = async function(countryId) {
  return await this.findAll({ 
    where: { 
      country_id: countryId,
      status: true 
    },
    order: [['name', 'ASC']]
  });
};

// Static method to get state by name
State.getStateByName = async function(stateName, countryId = null) {
  const whereClause = { 
    name: stateName,
    status: true 
  };
  
  if (countryId) {
    whereClause.country_id = countryId;
  }
  
  return await this.findOne({ where: whereClause });
};

module.exports = State; 