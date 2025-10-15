const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RetailorWorkingState = sequelize.define('RetailorWorkingState', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    retailor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    state_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'states',
            key: 'id'
        }
    },
    zone_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'zones',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    },
    assigned_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    territory_description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    commission_rate: {
        type: DataTypes.DECIMAL(5, 2),
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
    tableName: 'retailor_workingstate',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Define associations
RetailorWorkingState.associate = function(models) {
    RetailorWorkingState.belongsTo(models.User, {
        foreignKey: 'retailor_id',
        as: 'retailor'
    });

    RetailorWorkingState.belongsTo(models.State, {
        foreignKey: 'state_id',
        as: 'state'
    });

    RetailorWorkingState.belongsTo(models.Zone, {
        foreignKey: 'zone_id',
        as: 'zone'
    });
};

// Static method to find retailers by zone
RetailorWorkingState.findByZone = async function(zoneId) {
    return await this.findAll({
        where: { 
            zone_id: zoneId,
            status: 'active'
        },
        include: [
            {
                model: sequelize.models.User,
                as: 'retailor',
                where: { status: true }
            },
            {
                model: sequelize.models.Zone,
                as: 'zone'
            }
        ],
        order: [['assigned_date', 'DESC']]
    });
};

// Static method to get active zones for a retailer
RetailorWorkingState.getRetailorZones = async function(retailorId) {
    return await this.findAll({
        where: { 
            retailor_id: retailorId,
            status: 'active'
        },
        include: [
            {
                model: sequelize.models.Zone,
                as: 'zone',
                where: { status: true }
            }
        ]
    });
};

module.exports = RetailorWorkingState; 