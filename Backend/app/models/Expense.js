const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');

// Expense Types as Constants
const EXPENSE_TYPES = [
    'HOTEL',
    'FOOD',
    'TOLL',
    'TRAVEL',
    'COURIER',
    'FUEL',
    'OTHER'
];

const Expense = sequelize.define('Expense', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    expense_type: {
        type: DataTypes.ENUM(...EXPENSE_TYPES),
        allowNull: false,
        defaultValue: 'OTHER'
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    km: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bill_image: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('bill_image');
            return rawValue ? `/uploads/bills/${rawValue}` : null;
        },
        set(value) {
            // Remove the /uploads/bills/ prefix if present
            if (value && value.startsWith('/uploads/bills/')) {
                value = value.replace('/uploads/bills/', '');
            }
            this.setDataValue('bill_image', value);
        }
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0: Pending, 1: Approved, 2: Rejected
        validate: {
            isIn: [[0, 1, 2]]
        }
    },
    remark: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    reject_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    added_by_admin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'expenses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Define associations
Expense.associate = function(models) {
    Expense.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    Expense.belongsTo(models.User, {
        foreignKey: 'added_by_admin',
        as: 'admin'
    });
};

// Static method to get expenses by user with role check
Expense.getExpensesByUser = async function(userId, userRole, options = {}) {
    const where = options.where || {};

    // If user is not admin/manager, only show their own expenses
    if (!['Admin', 'Manager'].includes(userRole)) {
        where.user_id = userId;
    }

    return await this.findAll({
        where,
        include: [
            {
                model: sequelize.models.User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }
        ],
        order: options.order || [['date', 'DESC']]
    });
};

// Static method to get expenses by type with role check
Expense.getExpensesByType = async function(type, userId, userRole, options = {}) {
    const where = { 
        expense_type: type,
        ...options.where 
    };

    // If user is not admin/manager, only show their own expenses
    if (!['Admin', 'Manager'].includes(userRole)) {
        where.user_id = userId;
    }

    return await this.findAll({
        where,
        include: [
            {
                model: sequelize.models.User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }
        ],
        order: options.order || [['date', 'DESC']]
    });
};

// Static method to get expense summary by type with role check
Expense.getExpenseSummaryByType = async function(startDate, endDate, userId, userRole) {
    const where = {
        date: {
            [Op.between]: [startDate, endDate]
        },
        status: 1 // Only approved expenses
    };

    // If user is not admin/manager, only show their own expenses
    if (!['Admin', 'Manager'].includes(userRole)) {
        where.user_id = userId;
    }

    const summary = await this.findAll({
        attributes: [
            'expense_type',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
            [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount']
        ],
        where,
        group: ['expense_type']
    });

    return summary.map(item => ({
        type: item.expense_type,
        count: parseInt(item.getDataValue('count')),
        total_amount: parseFloat(item.getDataValue('total_amount') || 0)
    }));
};

// Static method to get pending expenses with role check
Expense.getPendingExpenses = async function(userId, userRole) {
    const where = { status: 0 };

    // If user is not admin/manager, only show their own expenses
    if (!['Admin', 'Manager'].includes(userRole)) {
        where.user_id = userId;
    }

    return await this.findAll({
        where,
        include: [
            {
                model: sequelize.models.User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }
        ],
        order: [['date', 'ASC']]
    });
};

// Static method to get all expense types
Expense.getExpenseTypes = function() {
    return EXPENSE_TYPES;
};

// Instance method to check if user can modify expense
Expense.prototype.canModify = function(userId, userRole) {
    return (
        this.user_id === userId || // Own expense
        ['Admin', 'Manager'].includes(userRole) // Admin/Manager can modify any expense
    );
};

// Instance method to check if user can approve/reject expense
Expense.prototype.canApprove = function(userRole) {
    return ['Admin', 'Manager'].includes(userRole);
};

// Instance method to upload bill image
Expense.prototype.uploadBill = async function(file) {
    if (!file) return;

    const fileName = `${this.id}_${Date.now()}_${file.originalname}`;
    await file.mv(`./public/uploads/bills/${fileName}`);
    this.bill_image = fileName;
    await this.save();
};

// Instance method to delete bill image
Expense.prototype.deleteBill = async function() {
    if (!this.bill_image) return;

    const fs = require('fs').promises;
    const path = require('path');
    const filePath = path.join('./public/uploads/bills/', this.bill_image);
    
    try {
        await fs.unlink(filePath);
        this.bill_image = null;
        await this.save();
    } catch (error) {
        if (error.code !== 'ENOENT') { // Ignore if file doesn't exist
            throw error;
        }
    }
};

// Add expense types to the model
Expense.TYPES = EXPENSE_TYPES;

module.exports = Expense;