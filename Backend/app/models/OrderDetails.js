const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderDetails = sequelize.define('OrderDetails', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.STRING(255),
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
    json_data: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM(
            'Pending',
            'Processing',
            'Dispatch', 
            'Partially Dispatch',
            'Processed',
            'On Hold',
            'Hold By Trey',
            'Cancelled',
            'Completed'
        ),
        defaultValue: 'Pending'
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    totalamount: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    event_type: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    event_visit_type: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    alloted_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    party_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    partallydispacthed: {
        type: DataTypes.STRING(211),
        allowNull: true
    },
    onholdreason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cancelreason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    agencyname: {
        type: DataTypes.STRING(211),
        allowNull: true
    },
    docketnumber: {
        type: DataTypes.STRING(211),
        allowNull: true
    },
    holdbytray: {
        type: DataTypes.STRING(211),
        allowNull: true
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ordernewtype: {
        type: DataTypes.STRING(211),
        allowNull: true
    },
    userlocation: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    email_sent: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'order_details',
    timestamps: false // This table doesn't use standard timestamps
});

module.exports = OrderDetails; 