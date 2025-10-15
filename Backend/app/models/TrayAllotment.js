const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrayAllotment = sequelize.define('TrayAllotment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    salesman_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    party_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    couriror_name: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    barcodeids: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    shipping_id: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'tray_allotment',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = TrayAllotment; 