
const { DataTypes } = require('sequelize');
const sequelize = require('../constants/database');

const Event = sequelize.define('Event', {
    event_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    event_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    },
    event_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    event_status: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
    tableName: 'event',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Event;