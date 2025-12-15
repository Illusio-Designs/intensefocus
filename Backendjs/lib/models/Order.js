
const { DataTypes } = require('sequelize');
const sequelize = require('../constants/database');

const Order = sequelize.define('Order', {
    order_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    order_number: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    order_type: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    party_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'parties',
            key: 'party_id'
        }
    },
    distributor_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'distributors',
            key: 'distributor_id'
        }
    },
    salesman_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'salesmen',
            key: 'salesman_id'
        }
    },
    event_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'event',
            key: 'event_id'
        }
    },
    order_status: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    order_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    order_items: {
        type: DataTypes.JSON,
        allowNull: false
    },
    order_notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    courier_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    courier_tracking_number: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    partial_dispatch_qty: {
        type: DataTypes.INTEGER,
        allowNull: true
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
    }
}, {
    tableName: 'order',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Order;