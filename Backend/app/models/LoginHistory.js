const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoginHistory = sequelize.define('LoginHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_type: {
        type: DataTypes.ENUM('admin', 'distributor', 'retailor', 'salesman', 'consumer'),
        allowNull: false
    },
    login_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    logout_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    device_type: {
        type: DataTypes.ENUM('desktop', 'mobile', 'tablet'),
        allowNull: true
    },
    browser: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    os: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('success', 'failed', 'logout'),
        defaultValue: 'success'
    },
    session_duration: {
        type: DataTypes.INTEGER, // in seconds
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
    tableName: 'loginhistory',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = LoginHistory; 