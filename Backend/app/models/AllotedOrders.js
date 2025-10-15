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
    json_data: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    distributor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
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
        type: DataTypes.ENUM(
            'Pending',
            'Processing', 
            'Dispatch',
            'Partially Dispatch',
            'Processed',
            'On Hold',
            'Hold By Trey',
            'Cancelled',
            'Completed'
        ),
        defaultValue: 'Pending'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'allotedorders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false // This table doesn't have updated_at column
});

module.exports = AllotedOrders; 