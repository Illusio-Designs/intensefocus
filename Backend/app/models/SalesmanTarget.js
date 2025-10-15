const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SalesmanTarget = sequelize.define('SalesmanTarget', {
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
    zone_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'zones',
            key: 'id'
        }
    },
    target_month: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    target_year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    target_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    achieved_amount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0.00
    },
    target_orders: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    achieved_orders: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('active', 'completed', 'cancelled'),
        defaultValue: 'active'
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
    tableName: 'salesman_target',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Define associations
SalesmanTarget.associate = function(models) {
    SalesmanTarget.belongsTo(models.User, {
        foreignKey: 'salesman_id',
        as: 'salesman'
    });

    SalesmanTarget.belongsTo(models.Zone, {
        foreignKey: 'zone_id',
        as: 'zone'
    });
};

// Static method to get targets by zone
SalesmanTarget.getTargetsByZone = async function(zoneId, year, month = null) {
    const whereClause = {
        zone_id: zoneId,
        target_year: year,
        status: 'active'
    };

    if (month) {
        whereClause.target_month = month;
    }

    return await this.findAll({
        where: whereClause,
        include: [
            {
                model: sequelize.models.User,
                as: 'salesman',
                where: { status: true }
            },
            {
                model: sequelize.models.Zone,
                as: 'zone'
            }
        ],
        order: [
            ['target_year', 'DESC'],
            ['target_month', 'DESC']
        ]
    });
};

// Static method to get zone performance
SalesmanTarget.getZonePerformance = async function(zoneId, year, month = null) {
    const targets = await this.getTargetsByZone(zoneId, year, month);
    
    const totalTarget = targets.reduce((sum, target) => sum + parseFloat(target.target_amount), 0);
    const totalAchieved = targets.reduce((sum, target) => sum + parseFloat(target.achieved_amount), 0);
    const totalTargetOrders = targets.reduce((sum, target) => sum + target.target_orders, 0);
    const totalAchievedOrders = targets.reduce((sum, target) => sum + target.achieved_orders, 0);

    return {
        zone_id: zoneId,
        total_target: totalTarget,
        total_achieved: totalAchieved,
        achievement_percentage: totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0,
        total_target_orders: totalTargetOrders,
        total_achieved_orders: totalAchievedOrders,
        orders_achievement_percentage: totalTargetOrders > 0 ? (totalAchievedOrders / totalTargetOrders) * 100 : 0,
        period: month ? `${year}-${month}` : year.toString()
    };
};

module.exports = SalesmanTarget; 