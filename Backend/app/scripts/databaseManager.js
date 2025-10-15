const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class DatabaseManager {
    static async initialize() {
        try {
            console.log('🔄 Checking database tables...');

            // Define table schemas
            const schemas = {
                role_type: {
                    id: {
                        type: DataTypes.BIGINT.UNSIGNED,
                        primaryKey: true,
                        autoIncrement: true
                    },
                    type: {
                        type: DataTypes.STRING(255),
                        allowNull: false,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    flag: {
                        type: DataTypes.INTEGER,
                        allowNull: false,
                        defaultValue: 0
                    },
                    subroles: {
                        type: DataTypes.JSON,
                        allowNull: true
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
                    }
                },
                users: {
                    id: {
                        type: DataTypes.BIGINT.UNSIGNED,
                        primaryKey: true,
                        autoIncrement: true
                    },
                    name: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    mobile: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    email: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    password: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    flag: {
                        type: DataTypes.INTEGER,
                        allowNull: false,
                        defaultValue: 1
                    },
                    otp: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    otp_verified: {
                        type: DataTypes.INTEGER,
                        allowNull: false,
                        defaultValue: 0
                    },
                    company_name: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    trade_name: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    party_name: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    pan_number: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    gst_number: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    owner_name: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    owner_mobile: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    address: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    city: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    state: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    pincode: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    zone: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    religion: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    party_logo: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    credit_limit: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    category: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    commission: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    business_type: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    distributorsbrands: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    working_states: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    working_zones: {
                        type: DataTypes.STRING(211),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    zone_id: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        references: {
                            model: 'zones',
                            key: 'id'
                        }
                    },
                    id_proof_photo: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    id_proof_number: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    designation: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    tray: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    tray_id: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    target: {
                        type: DataTypes.STRING(255),
                        allowNull: false,
                        defaultValue: '',
                        collate: 'utf8mb4_unicode_ci'
                    },
                    category_type: {
                        type: DataTypes.STRING(24),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    reason: {
                        type: DataTypes.TEXT('LONG'),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
                    },
                    access: {
                        type: DataTypes.STRING(211),
                        allowNull: true,
                        collate: 'utf8mb4_unicode_ci'
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
                    role_id: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    subrole: {
                        type: DataTypes.JSON,
                        allowNull: true
                    },
                    state_id: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    city_id: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    country_id: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    }
                }
            };

            // Default role types with timestamps
            const now = new Date();
            const defaultRoles = [
                { type: 'Admin', flag: 10, created_at: now, updated_at: now },
                { type: 'Order Manager', flag: 8, created_at: now, updated_at: now },
                { type: 'Inventory Manager', flag: 8, created_at: now, updated_at: now },
                { type: 'Tray Manager', flag: 7, created_at: now, updated_at: now },
                { type: 'Retailor Manager', flag: 7, created_at: now, updated_at: now },
                { type: 'Distributor Manager', flag: 7, created_at: now, updated_at: now },
                { type: 'Sales Manager', flag: 6, created_at: now, updated_at: now },
                { type: 'Distributor', flag: 4, created_at: now, updated_at: now },
                { type: 'Retailor', flag: 3, created_at: now, updated_at: now },
                { type: 'Salesman', flag: 2, created_at: now, updated_at: now }
            ];

            // Check and create tables
            for (const [tableName, schema] of Object.entries(schemas)) {
                const tableExists = await this.checkTableExists(tableName);
                
                if (!tableExists) {
                    console.log(`📦 Creating table: ${tableName}`);
                    await sequelize.getQueryInterface().createTable(tableName, schema);
                    
                    // Insert default roles if creating role_type table
                    if (tableName === 'role_type') {
                        try {
                            await sequelize.query(`
                                INSERT INTO role_type (type, flag, created_at, updated_at)
                                VALUES
                                ('Admin', 10, NOW(), NOW()),
                                ('Order Manager', 8, NOW(), NOW()),
                                ('Inventory Manager', 8, NOW(), NOW()),
                                ('Tray Manager', 7, NOW(), NOW()),
                                ('Retailor Manager', 7, NOW(), NOW()),
                                ('Distributor Manager', 7, NOW(), NOW()),
                                ('Sales Manager', 6, NOW(), NOW()),
                                ('Distributor', 4, NOW(), NOW()),
                                ('Retailor', 3, NOW(), NOW()),
                                ('Salesman', 2, NOW(), NOW())
                            `);
                            console.log('👥 Default roles created');
                        } catch (error) {
                            console.log('⚠️ Error creating default roles:', error.message);
                        }
                    }
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
            const adminExists = await sequelize.models.User.findOne({
                where: {
                    email: 'office.intensefocus.01@gmail.com'
                }
            });

            if (!adminExists) {
                const adminRole = await sequelize.models.RoleType.findOne({
                    where: { type: 'Admin' }
                });

                if (adminRole) {
                    await sequelize.models.User.create({
                        name: 'Superadmin',
                        email: 'office.intensefocus.01@gmail.com',
                        mobile: '9179388646',
                        role_id: adminRole.id,
                        password: await require('bcryptjs').hash('admin123', 10), // Default password: admin123
                        flag: 0
                    });
                    console.log('👤 Default admin user created');
                }
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
