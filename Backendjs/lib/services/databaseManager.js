const { DataTypes } = require('sequelize');
const sequelize = require('../constants/database');

class DatabaseManager {
    static async initialize() {
        try {
            console.log('🔄 Checking database tables...');

            // Define table schemas
            const schemas = {
                users: {
                    user_id: {
                        type: DataTypes.UUID,
                        primaryKey: true,
                        defaultValue: DataTypes.UUIDV4
                    },
                    email: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        unique: true
                    },
                    phone: {
                        type: DataTypes.STRING(20),
                        allowNull: false,
                        unique: true
                    },
                    full_name: {
                        type: DataTypes.STRING(255),
                        allowNull: false
                    },
                    profile_image: {
                        type: DataTypes.STRING(500),
                        allowNull: true
                    },
                    is_active: {
                        type: DataTypes.BOOLEAN,
                        allowNull: false,
                        defaultValue: true
                    },
                    created_at: {
                        type: DataTypes.DATE,
                        allowNull: false,
                        defaultValue: DataTypes.NOW
                    },
                    updated_at: {
                        type: DataTypes.DATE,
                        allowNull: false,
                        defaultValue: DataTypes.NOW
                    },
                    last_login: {
                        type: DataTypes.DATE,
                        allowNull: true
                    }
                },
                roles: {
                    role_id: {
                        type: DataTypes.UUID,
                        primaryKey: true,
                        defaultValue: DataTypes.UUIDV4
                    },
                    role_name: {
                        type: DataTypes.STRING(100),
                        allowNull: false,
                        unique: true
                    },
                    description: {
                        type: DataTypes.TEXT,
                        allowNull: true
                    },
                    created_at: {
                        type: DataTypes.DATE,
                        allowNull: false,
                        defaultValue: DataTypes.NOW
                    }
                },
                user_roles: {
                    user_role_id: {
                        type: DataTypes.UUID,
                        primaryKey: true,
                        defaultValue: DataTypes.UUIDV4
                    },
                    user_id: {
                        type: DataTypes.UUID,
                        allowNull: false,
                        references: {
                            model: 'users',
                            key: 'user_id'
                        }
                    },
                    role_id: {
                        type: DataTypes.UUID,
                        allowNull: false,
                        references: {
                            model: 'roles',
                            key: 'role_id'
                        }
                    },
                    assigned_at: {
                        type: DataTypes.DATE,
                        allowNull: false,
                        defaultValue: DataTypes.NOW
                    },
                    assigned_by: {
                        type: DataTypes.UUID,
                        allowNull: true,
                        references: {
                            model: 'users',
                            key: 'user_id'
                        }
                    }
                }
            };

            // Default roles
            const defaultRoles = [
                { role_name: 'sales_manager', description: 'Manages sales operations and team' },
                { role_name: 'expense_manager', description: 'Manages company expenses' },
                { role_name: 'tray_manager', description: 'Manages tray inventory' },
                { role_name: 'order_manager', description: 'Manages customer orders' },
                { role_name: 'reports_manager', description: 'Manages reports' },
                { role_name: 'product_manager', description: 'Manages product catalog' },
                { role_name: 'party_manager', description: 'Manages parties' },
                { role_name: 'distributor_manager', description: 'Manages distributors' },
                { role_name: 'salesman', description: 'Field salesman mapped to zones' }
            ];

            // Check and create tables
            for (const [tableName, schema] of Object.entries(schemas)) {
                const tableExists = await this.checkTableExists(tableName);

                if (!tableExists) {
                    console.log(`📦 Creating table: ${tableName}`);
                    await sequelize.getQueryInterface().createTable(tableName, schema);

                    // Insert default roles if creating roles table
                    if (tableName === 'roles') {
                        try {
                            const Role = require('../models/Role');
                            for (const roleData of defaultRoles) {
                                await Role.findOrCreate({
                                    where: { role_name: roleData.role_name },
                                    defaults: roleData
                                });
                            }
                            console.log('👥 Default roles created');
                        } catch (error) {
                            console.log('⚠️ Error creating default roles:', error.message);
                        }
                    }

                    // Unique constraint on (user_id, role_id) is handled by the model definition
                    // No need to create it separately as Sequelize handles it
                } else {
                    console.log(`✅ Table exists: ${tableName}`);

                    // Check and add missing columns
                    const currentColumns = await this.getTableColumns(tableName);
                    for (const [columnName, columnDef] of Object.entries(schema)) {
                        if (!currentColumns.includes(columnName)) {
                            console.log(`📝 Adding column: ${tableName}.${columnName}`);
                            await sequelize.getQueryInterface().addColumn(tableName, columnName, columnDef);
                        }
                    }
                }
            }

            // Create default admin if not exists
            const User = require('../models/User');
            const Role = require('../models/Role');
            const UserRole = require('../models/UserRole');

            const adminExists = await User.findOne({
                where: {
                    email: 'office.intensefocus.01@gmail.com'
                }
            });

            if (!adminExists) {
                // Find or create admin role (using sales_manager as default admin role)
                let adminRole = await Role.findOne({
                    where: { role_name: 'sales_manager' }
                });

                if (!adminRole) {
                    adminRole = await Role.create({
                        role_name: 'sales_manager',
                        description: 'Manages sales operations and team'
                    });
                }

                const adminUser = await User.create({
                    full_name: 'Superadmin',
                    email: 'office.intensefocus.01@gmail.com',
                    phone: '9179388646',
                    is_active: true
                });

                // Assign role to admin user
                await UserRole.create({
                    user_id: adminUser.user_id,
                    role_id: adminRole.role_id
                });

                console.log('👤 Default admin user created');
            }

            console.log('✨ Database initialization completed');
            return true;
        } catch (error) {
            console.error('❌ Database initialization error:', error);
            throw error;
        }
    }

    static async checkTableExists(tableName) {
        try {
            await sequelize.getQueryInterface().showTable(tableName);
            return true;
        } catch (error) {
            return false;
        }
    }

    static async getTableColumns(tableName) {
        const tableInfo = await sequelize.getQueryInterface().describeTable(tableName);
        return Object.keys(tableInfo);
    }

    static async addMissingColumns(tableName, schema) {
        const currentColumns = await this.getTableColumns(tableName);

        for (const [columnName, columnDef] of Object.entries(schema)) {
            if (!currentColumns.includes(columnName)) {
                await sequelize.getQueryInterface().addColumn(tableName, columnName, columnDef);
            }
        }
    }
}

module.exports = DatabaseManager;
