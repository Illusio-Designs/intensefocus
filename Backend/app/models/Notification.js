const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    by_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    to_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    readed: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    created_at: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    updated_at: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Notification; 