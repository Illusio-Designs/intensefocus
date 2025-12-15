
const { DataTypes } = require('sequelize');
const sequelize = require('../constants/database');
const Order = require('./Order');
const Product = require('./Product');

const OrderOperation = sequelize.define('OrderOperation', {
    order_operation_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'order',
            key: 'order_id'
        }
    },
    warehouse_reduced_qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tray_reduced_qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_reduced_qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tray_ids: {
        type: DataTypes.JSON,
        allowNull: false
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'product',
            key: 'product_id'
        }
    },
}, {
    tableName: 'order_operation',
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

OrderOperation.belongsTo(Order, {
    foreignKey: 'order_id',
    targetKey: 'order_id'
});
OrderOperation.belongsTo(Product, {
    foreignKey: 'product_id',
    targetKey: 'product_id'
});

module.exports = OrderOperation;
