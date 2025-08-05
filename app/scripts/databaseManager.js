const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const sequelize = require('../config/database');

const databaseManager = async () => {
  try {
    console.log('🗄️  Database Manager - All-in-One Tool');
    console.log('=====================================\n');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully\n');
    
    // Get all tables
    const [tables] = await sequelize.query("SHOW TABLES");
    const allTables = tables.map(table => Object.values(table)[0]);
    
    console.log(`📊 Total tables found: ${allTables.length}`);
    
    // Check for user's 21 models
    const userModels = [
      'users', 'products', 'product_images', 'brands', 'collections', 'shape', 'gender',
      'lens_material', 'lens_color', 'frame_material', 'frame_color', 'type', 'role_type',
      'slider_d2c', 'states', 'cities', 'zones', 'expenses', 'expensetypes', 'expense_bill', 'expense_backed_entry'
    ];
    
    console.log('\n📋 User\'s 21 Models Status:');
    userModels.forEach(model => {
      const exists = allTables.includes(model);
      const status = exists ? '✅' : '❌';
      console.log(`   ${status} ${model}`);
    });
    
    const missingModels = userModels.filter(model => !allTables.includes(model));
    const extraTables = allTables.filter(table => !userModels.includes(table));
    
    console.log(`\n📈 Summary:`);
    console.log(`   ✅ Available: ${userModels.filter(model => allTables.includes(model)).length}/21`);
    console.log(`   ❌ Missing: ${missingModels.length}`);
    console.log(`   🗑️  Extra tables: ${extraTables.length}`);
    
    // Drop extra tables (not in user's 21 models)
    if (extraTables.length > 0) {
      console.log('\n🗑️  Dropping extra tables...');
      for (const table of extraTables) {
        try {
          await sequelize.query(`DROP TABLE IF EXISTS \`${table}\``);
          console.log(`   ✅ Dropped: ${table}`);
        } catch (error) {
          console.log(`   ⚠️  Could not drop ${table}: ${error.message}`);
        }
      }
    }
    
    // Create missing tables if any
    if (missingModels.length > 0) {
      console.log('\n🔨 Creating missing tables...');
      
      for (const model of missingModels) {
        try {
          switch (model) {
            case 'product_images':
              await sequelize.query(`
                CREATE TABLE IF NOT EXISTS \`product_images\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`product_id\` int(11) NOT NULL,
                  \`image_path\` varchar(255) NOT NULL,
                  \`image_name\` varchar(255) DEFAULT NULL,
                  \`is_primary\` tinyint(1) DEFAULT 0,
                  \`sort_order\` int(11) DEFAULT 0,
                  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (\`id\`),
                  KEY \`product_id\` (\`product_id\`),
                  KEY \`is_primary\` (\`is_primary\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
              `);
              break;
              
            case 'expenses':
              await sequelize.query(`
                CREATE TABLE IF NOT EXISTS \`expenses\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`user_id\` int(11) NOT NULL,
                  \`date\` date NOT NULL,
                  \`expense_type\` varchar(255) DEFAULT NULL,
                  \`amount\` decimal(10,2) DEFAULT NULL,
                  \`remark\` text,
                  \`status\` enum('pending','approved','rejected') DEFAULT 'pending',
                  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (\`id\`),
                  KEY \`user_id\` (\`user_id\`),
                  KEY \`date\` (\`date\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
              `);
              break;
              
            case 'expensetypes':
              await sequelize.query(`
                CREATE TABLE IF NOT EXISTS \`expensetypes\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`name\` varchar(255) NOT NULL,
                  \`description\` text,
                  \`status\` tinyint(1) DEFAULT 1,
                  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (\`id\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
              `);
              break;
              
            case 'expense_bill':
              await sequelize.query(`
                CREATE TABLE IF NOT EXISTS \`expense_bill\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`expense_id\` int(11) NOT NULL,
                  \`amount\` decimal(10,2) NOT NULL,
                  \`expense_type\` varchar(255) DEFAULT NULL,
                  \`remark\` text,
                  \`bill\` varchar(255) DEFAULT NULL,
                  \`km\` decimal(10,2) DEFAULT NULL,
                  \`reject_reason\` text,
                  \`status\` enum('pending','approved','rejected') DEFAULT 'pending',
                  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (\`id\`),
                  KEY \`expense_id\` (\`expense_id\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
              `);
              break;
              
            case 'expense_backed_entry':
              await sequelize.query(`
                CREATE TABLE IF NOT EXISTS \`expense_backed_entry\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`user_id\` int(11) NOT NULL,
                  \`date\` date NOT NULL,
                  \`expense_type\` varchar(255) DEFAULT NULL,
                  \`amount\` decimal(10,2) DEFAULT NULL,
                  \`remark\` text,
                  \`status\` enum('pending','approved','rejected') DEFAULT 'pending',
                  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (\`id\`),
                  KEY \`user_id\` (\`user_id\`),
                  KEY \`date\` (\`date\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
              `);
              break;
          }
          console.log(`   ✅ Created: ${model}`);
        } catch (error) {
          console.log(`   ⚠️  Could not create ${model}: ${error.message}`);
        }
      }
      
      // Add default expense types
      if (missingModels.includes('expensetypes')) {
        const defaultTypes = [
          { name: 'Travel', description: 'Travel expenses including fuel, transport' },
          { name: 'Food', description: 'Food and meal expenses' },
          { name: 'Accommodation', description: 'Hotel and accommodation expenses' },
          { name: 'Office Supplies', description: 'Office and stationery expenses' },
          { name: 'Communication', description: 'Phone and internet expenses' },
          { name: 'Other', description: 'Other miscellaneous expenses' }
        ];
        
        for (const type of defaultTypes) {
          try {
            await sequelize.query(
              'INSERT IGNORE INTO `expensetypes` (`name`, `description`) VALUES (?, ?)',
              { replacements: [type.name, type.description] }
            );
            console.log(`   ✅ Added expense type: ${type.name}`);
          } catch (error) {
            console.log(`   ⚠️  Could not add expense type ${type.name}`);
          }
        }
      }
    }
    
    // Auto alter tables based on model definitions
    console.log('\n🔧 Checking for table alterations...');
    await autoAlterTables();
    
    // Final status
    const [finalTables] = await sequelize.query("SHOW TABLES");
    const finalTableNames = finalTables.map(table => Object.values(table)[0]);
    
    console.log('\n🎉 Database Manager completed!');
    console.log(`📊 Final status: ${finalTableNames.length} tables total`);
    
    const finalMissing = userModels.filter(model => !finalTableNames.includes(model));
    if (finalMissing.length === 0) {
      console.log('✅ All 21 models are now available!');
    } else {
      console.log(`⚠️  Still missing: ${finalMissing.join(', ')}`);
    }
    
  } catch (error) {
    console.error('❌ Database Manager Error:', error.message);
  } finally {
    await sequelize.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Auto alter tables function
const autoAlterTables = async () => {
  try {
    // Define table alterations here
    const alterations = [
      // Example: Add new column to users table
      // {
      //   table: 'users',
      //   query: 'ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `new_field` VARCHAR(255) DEFAULT NULL'
      // },
      
      // Example: Add new column to products table
      // {
      //   table: 'products',
      //   query: 'ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `new_field` INT DEFAULT 0'
      // }
    ];
    
    for (const alteration of alterations) {
      try {
        await sequelize.query(alteration.query);
        console.log(`   ✅ Altered: ${alteration.table}`);
      } catch (error) {
        console.log(`   ⚠️  Could not alter ${alteration.table}: ${error.message}`);
      }
    }
    
    if (alterations.length === 0) {
      console.log('   ℹ️  No table alterations needed');
    }
    
  } catch (error) {
    console.log(`   ⚠️  Auto alter error: ${error.message}`);
  }
};

// Export for use in server.js
module.exports = { databaseManager, autoAlterTables };

// Run the script if called directly
if (require.main === module) {
  databaseManager();
} 