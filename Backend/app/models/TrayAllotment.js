const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrayAllotment = sequelize.define('TrayAllotment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tray_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_type: {
        type: DataTypes.ENUM('distributor', 'retailor', 'salesman'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('allocated', 'returned', 'damaged'),
        defaultValue: 'allocated'
    },
    allocated_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    return_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    deposit_amount: {
        type: DataTypes.DECIMAL(10, 2),
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
    tableName: 'tray_allotment',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = TrayAllotment; 