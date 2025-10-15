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
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    location: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    logintime: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    reason: {
        type: DataTypes.STRING(211),
        allowNull: true
    },
    partyname: {
        type: DataTypes.STRING(211),
        allowNull: true
    },
    party_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING(211),
        allowNull: true
    },
    lat: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    long: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'loginhistory',
    timestamps: false // This table doesn't use standard timestamps
});

module.exports = LoginHistory; 