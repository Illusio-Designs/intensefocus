const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DistributorWorkingState = sequelize.define('DistributorWorkingState', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    distributor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    state: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'distributor_workingstate',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false // No updated_at column in table
});

// Define associations
DistributorWorkingState.associate = function(models) {
    DistributorWorkingState.belongsTo(models.User, {
        foreignKey: 'distributor_id',
        as: 'distributor'
    });
};

// Static Methods

/**
 * Get all working states for a distributor
 * @param {number} distributorId - The distributor's user ID
 */
DistributorWorkingState.getDistributorStates = async function(distributorId) {
    return await this.findAll({
        where: { distributor_id: distributorId },
        order: [['created_at', 'DESC']]
    });
};

/**
 * Get all distributors working in a state
 * @param {string} state - The state name
 */
DistributorWorkingState.getDistributorsByState = async function(state) {
    return await this.findAll({
        where: { state },
        include: [{
            model: sequelize.models.User,
            as: 'distributor',
            attributes: ['id', 'name', 'email', 'mobile']
        }],
        order: [['created_at', 'DESC']]
    });
};

/**
 * Check if distributor works in a state
 * @param {number} distributorId - The distributor's user ID
 * @param {string} state - The state name
 */
DistributorWorkingState.isDistributorInState = async function(distributorId, state) {
    const count = await this.count({
        where: {
            distributor_id: distributorId,
            state: state
        }
    });
    return count > 0;
};

// Instance Methods

/**
 * Check if this working state can be modified by a user
 * @param {number} userId - The user's ID
 * @param {string} userRole - The user's role
 */
DistributorWorkingState.prototype.canModify = function(userId, userRole) {
    return userRole === 'Admin' || 
           userRole === 'Distributor Manager' || 
           this.distributor_id === userId;
};

module.exports = DistributorWorkingState;
