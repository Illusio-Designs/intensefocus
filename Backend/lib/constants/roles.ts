export const role_permissions: Record<string, string[]> = {
    'Admin': [
        'full_system_access',
        'user_management',
        'role_management',
        'system_settings',
        'all_reports',
        'data_export_import'
    ],
    'Order Manager': [
        'order_management',
        'order_processing',
        'order_reports',
        'inventory_view'
    ],
    'Inventory Manager': [
        'inventory_management',
        'stock_management',
        'product_management',
        'inventory_reports'
    ],
    'Tray Manager': [
        'tray_management',
        'tray_allotment',
        'tray_transfer',
        'tray_reports'
    ],
    'Retailor Manager': [
        'retailor_management',
        'retailor_operations',
        'retailor_reports'
    ],
    'Distributor Manager': [
        'distributor_management',
        'distributor_operations',
        'distributor_reports'
    ],
    'Sales Manager': [
        'sales_management',
        'target_management',
        'sales_reports',
        'team_management'
    ],
    'Distributor': [
        'order_placement',
        'inventory_view',
        'sales_reports',
        'customer_management'
    ],
    'Retailor': [
        'order_placement',
        'product_catalog',
        'basic_reports'
    ],
    'Salesman': [
        'order_placement',
        'customer_management',
        'sales_tracking',
        'subrole_permissions'
    ]
};

export const role_descriptions: Record<string, string> = {
    'Admin': 'System Administrator with full access',
    'Order Manager': 'Manages orders and order processing',
    'Inventory Manager': 'Manages inventory and stock',
    'Tray Manager': 'Manages tray allotments and transfers',
    'Retailor Manager': 'Manages retailor operations',
    'Distributor Manager': 'Manages distributor operations',
    'Sales Manager': 'Manages sales operations and targets',
    'Distributor': 'Distributor user with limited access',
    'Retailor': 'Retailor user with limited access',
    'Salesman': 'Salesman with subrole capabilities',
};

export const role_hierarchy: Record<number, string> = {
    10: 'System Administrator',
    8: 'Senior Manager',
    7: 'Manager',
    6: 'Sales Manager',
    4: 'Distributor',
    3: 'Retailor',
    2: 'Salesman',
    1: 'Basic User'
};