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
    
    // Check for user's 26 models (17 core + 9 business) - excluding expense models for now
    const userModels = [
      // Core 17 models
      'users', 'products', 'product_images', 'brands', 'collections', 'shape', 'gender',
      'lens_material', 'lens_color', 'frame_material', 'frame_color', 'type', 'role_type',
      'slider_d2c', 'states', 'cities', 'zones',
      
      // Business 9 models
      'allotedorders', 'distributor_brands', 'distributor_workingstate', 'retailor_workingstate',
      'tray_allotment', 'salesman_target', 'order_details', 'notifications', 'loginhistory'
    ];
    
    console.log('\n📋 User\'s 26 Models Status (excluding expense models for now):');
    userModels.forEach(model => {
      const exists = allTables.includes(model);
      const status = exists ? '✅' : '❌';
      console.log(`   ${status} ${model}`);
    });
    
    const missingModels = userModels.filter(model => !allTables.includes(model));
    const extraTables = allTables.filter(table => !userModels.includes(table));
    
    console.log(`\n📈 Summary:`);
    console.log(`   ✅ Available: ${userModels.filter(model => allTables.includes(model)).length}/26`);
    console.log(`   ❌ Missing: ${missingModels.length}`);
    console.log(`   🗑️  Extra tables: ${extraTables.length}`);
    
    // Drop extra tables (not in user's 26 models)
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
              
            case 'allotedorders':
              await sequelize.query(`
                CREATE TABLE IF NOT EXISTS \`allotedorders\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`order_id\` int(11) NOT NULL,
                  \`distributor_id\` int(11) NOT NULL,
                  \`retailor_id\` int(11) NOT NULL,
                  \`salesman_id\` int(11) NOT NULL,
                  \`status\` enum('pending','processing','completed','cancelled') DEFAULT 'pending',
                  \`alloted_date\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`completed_date\` timestamp NULL DEFAULT NULL,
                  \`notes\` text,
                  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (\`id\`),
                  KEY \`order_id\` (\`order_id\`),
                  KEY \`distributor_id\` (\`distributor_id\`),
                  KEY \`retailor_id\` (\`retailor_id\`),
                  KEY \`salesman_id\` (\`salesman_id\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
              `);
              break;
              
            case 'distributor_brands':
              await sequelize.query(`
                CREATE TABLE IF NOT EXISTS \`distributor_brands\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`distributor_id\` int(11) NOT NULL,
                  \`brand_id\` int(11) NOT NULL,
                  \`status\` enum('active','inactive') DEFAULT 'active',
                  \`assigned_date\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`commission_rate\` decimal(5,2) DEFAULT NULL,
                  \`notes\` text,
                  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (\`id\`),
                  KEY \`distributor_id\` (\`distributor_id\`),
                  KEY \`brand_id\` (\`brand_id\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
              `);
              break;
              
            case 'distributor_workingstate':
              await sequelize.query(`
                CREATE TABLE IF NOT EXISTS \`distributor_workingstate\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`distributor_id\` int(11) NOT NULL,
                  \`state_id\` int(11) NOT NULL,
                  \`status\` enum('active','inactive') DEFAULT 'active',
                  \`assigned_date\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`territory_description\` text,
                  \`commission_rate\` decimal(5,2) DEFAULT NULL,
                  \`notes\` text,
                  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (\`id\`),
                  KEY \`distributor_id\` (\`distributor_id\`),
                  KEY \`state_id\` (\`state_id\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
              `);
              break;
              
            case 'retailor_workingstate':
              await sequelize.query(`
                CREATE TABLE IF NOT EXISTS \`retailor_workingstate\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`retailor_id\` int(11) NOT NULL,
                  \`state_id\` int(11) NOT NULL,
                  \`status\` enum('active','inactive') DEFAULT 'active',
                  \`assigned_date\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`territory_description\` text,
                  \`commission_rate\` decimal(5,2) DEFAULT NULL,
                  \`notes\` text,
                  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (\`id\`),
                  KEY \`retailor_id\` (\`retailor_id\`),
                  KEY \`state_id\` (\`state_id\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
              `);
              break;
              
            case 'tray_allotment':
              await sequelize.query(`
                CREATE TABLE IF NOT EXISTS \`tray_allotment\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`tray_id\` int(11) NOT NULL,
                  \`user_id\` int(11) NOT NULL,
                  \`user_type\` enum('distributor','retailor','salesman') NOT NULL,
                  \`status\` enum('allocated','returned','damaged') DEFAULT 'allocated',
                  \`allocated_date\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`return_date\` timestamp NULL DEFAULT NULL,
                  \`deposit_amount\` decimal(10,2) DEFAULT NULL,
                  \`notes\` text,
                  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (\`id\`),
                  KEY \`tray_id\` (\`tray_id\`),
                  KEY \`user_id\` (\`user_id\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
              `);
              break;
              
            case 'salesman_target':
              await sequelize.query(`
                CREATE TABLE IF NOT EXISTS \`salesman_target\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`salesman_id\` int(11) NOT NULL,
                  \`target_month\` int(11) NOT NULL,
                  \`target_year\` int(11) NOT NULL,
                  \`target_amount\` decimal(12,2) NOT NULL,
                  \`achieved_amount\` decimal(12,2) DEFAULT 0.00,
                  \`target_orders\` int(11) NOT NULL,
                  \`achieved_orders\` int(11) DEFAULT 0,
                  \`status\` enum('active','completed','cancelled') DEFAULT 'active',
                  \`notes\` text,
                  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (\`id\`),
                  KEY \`salesman_id\` (\`salesman_id\`),
                  KEY \`target_month\` (\`target_month\`),
                  KEY \`target_year\` (\`target_year\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
              `);
              break;
              
            case 'products_image':
              await sequelize.query(`
                CREATE TABLE IF NOT EXISTS \`products_image\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`product_id\` int(11) NOT NULL,
                  \`image_name\` varchar(255) NOT NULL,
                  \`image_path\` varchar(500) NOT NULL,
                  \`image_type\` enum('main','gallery','thumbnail') DEFAULT 'gallery',
                  \`sort_order\` int(11) DEFAULT 0,
                  \`status\` enum('active','inactive') DEFAULT 'active',
                  \`alt_text\` varchar(255) DEFAULT NULL,
                  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (\`id\`),
                  KEY \`product_id\` (\`product_id\`),
                  KEY \`image_type\` (\`image_type\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
              `);
              break;
              
            case 'order_details':
              await sequelize.query(`
                CREATE TABLE IF NOT EXISTS \`order_details\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`order_id\` int(11) NOT NULL,
                  \`product_id\` int(11) NOT NULL,
                  \`quantity\` int(11) NOT NULL DEFAULT 1,
                  \`unit_price\` decimal(10,2) NOT NULL,
                  \`total_price\` decimal(10,2) NOT NULL,
                  \`discount_amount\` decimal(10,2) DEFAULT 0.00,
                  \`discount_percentage\` decimal(5,2) DEFAULT 0.00,
                  \`final_price\` decimal(10,2) NOT NULL,
                  \`status\` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
                  \`notes\` text,
                  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (\`id\`),
                  KEY \`order_id\` (\`order_id\`),
                  KEY \`product_id\` (\`product_id\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
              `);
              break;
              
            case 'notifications':
              await sequelize.query(`
                CREATE TABLE IF NOT EXISTS \`notifications\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`user_id\` int(11) NOT NULL,
                  \`user_type\` enum('admin','distributor','retailor','salesman','consumer') NOT NULL,
                  \`title\` varchar(255) NOT NULL,
                  \`message\` text NOT NULL,
                  \`type\` enum('info','success','warning','error','order','system') DEFAULT 'info',
                  \`is_read\` tinyint(1) DEFAULT 0,
                  \`read_at\` timestamp NULL DEFAULT NULL,
                  \`related_id\` int(11) DEFAULT NULL,
                  \`related_type\` varchar(50) DEFAULT NULL,
                  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (\`id\`),
                  KEY \`user_id\` (\`user_id\`),
                  KEY \`user_type\` (\`user_type\`),
                  KEY \`is_read\` (\`is_read\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
              `);
              break;
              
            case 'loginhistory':
              await sequelize.query(`
                CREATE TABLE IF NOT EXISTS \`loginhistory\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`user_id\` int(11) NOT NULL,
                  \`user_type\` enum('admin','distributor','retailor','salesman','consumer') NOT NULL,
                  \`login_time\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`logout_time\` timestamp NULL DEFAULT NULL,
                  \`ip_address\` varchar(45) DEFAULT NULL,
                  \`user_agent\` text,
                  \`device_type\` enum('desktop','mobile','tablet') DEFAULT NULL,
                  \`browser\` varchar(100) DEFAULT NULL,
                  \`os\` varchar(100) DEFAULT NULL,
                  \`status\` enum('success','failed','logout') DEFAULT 'success',
                  \`session_duration\` int(11) DEFAULT NULL,
                  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (\`id\`),
                  KEY \`user_id\` (\`user_id\`),
                  KEY \`user_type\` (\`user_type\`),
                  KEY \`login_time\` (\`login_time\`)
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
      console.log('✅ All 26 models are now available!');
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