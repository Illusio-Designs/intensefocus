const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SalesmanTarget = sequelize.define('SalesmanTarget', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    salesman_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    target_month: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    target_year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    target_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    achieved_amount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0.00
    },
    target_orders: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    achieved_orders: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('active', 'completed', 'cancelled'),
        defaultValue: 'active'
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
    tableName: 'salesman_target',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = SalesmanTarget; 