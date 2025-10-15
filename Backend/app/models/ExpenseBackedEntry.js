const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExpenseBackedEntry = sequelize.define('ExpenseBackedEntry', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    from_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    to_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    expiry_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    added_by_admin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    remark: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0 // 0: Pending, 1: Approved, 2: Rejected
    }
}, {
    tableName: 'expense_backed_entry',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Define associations
ExpenseBackedEntry.associate = function(models) {
    ExpenseBackedEntry.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    ExpenseBackedEntry.belongsTo(models.User, {
        foreignKey: 'added_by_admin',
        as: 'admin'
    });
};

// Static method to get entries by user
ExpenseBackedEntry.getEntriesByUser = async function(userId, options = {}) {
    return await this.findAll({
        where: { 
            user_id: userId,
            ...options.where 
        },
        include: [
            {
                model: sequelize.models.User,
                as: 'admin',
                attributes: ['id', 'name', 'email']
            }
        ],
        order: options.order || [['from_date', 'DESC']]
    });
};

// Static method to get active entries
ExpenseBackedEntry.getActiveEntries = async function(date = new Date()) {
    return await this.findAll({
        where: {
            status: 1,
            expiry_date: {
                [sequelize.Op.gte]: date
            }
        },
        include: [
            {
                model: sequelize.models.User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            },
            {
                model: sequelize.models.User,
                as: 'admin',
                attributes: ['id', 'name', 'email']
            }
        ],
        order: [['expiry_date', 'ASC']]
    });
};

// Static method to check if user has active entry
ExpenseBackedEntry.hasActiveEntry = async function(userId, date = new Date()) {
    const entry = await this.findOne({
        where: {
            user_id: userId,
            status: 1,
            from_date: {
                [sequelize.Op.lte]: date
            },
            to_date: {
                [sequelize.Op.gte]: date
            },
            expiry_date: {
                [sequelize.Op.gte]: date
            }
        }
    });
    return !!entry;
};

module.exports = ExpenseBackedEntry;
