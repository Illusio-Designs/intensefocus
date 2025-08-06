const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DistributorWorkingState = sequelize.define('DistributorWorkingState', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    distributor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    state_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    },
    assigned_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    territory_description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    commission_rate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'distributor_workingstate',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = DistributorWorkingState; 