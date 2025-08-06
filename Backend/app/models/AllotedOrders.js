const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AllotedOrders = sequelize.define('AllotedOrders', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    distributor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    retailor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    salesman_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    alloted_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    completed_date: {
        type: DataTypes.DATE,
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
    tableName: 'allotedorders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = AllotedOrders; 