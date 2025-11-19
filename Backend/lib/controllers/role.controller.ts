import prisma from "../constants/prisma";

class RoleController {

    async createDefaultRoles() {
        try {
            console.log('Creating default roles...');
            const existingRoles = await prisma.roleType.findMany();
            console.log('Existing roles: ' + existingRoles.length);
            if (existingRoles.length > 0) {
                return;
            }
            console.log('Creating default roles...');
            const roles = await prisma.roleType.createMany({
                data: [
                    {
                        type: 'Admin',
                        flag: 10,
                        description: 'System Administrator with full access',
                        status: 'active'
                    },
                    { type: 'Order Manager', flag: 8, description: 'Manages orders and order processing', status: 'active' },
                    { type: 'Inventory Manager', flag: 7, description: 'Manages inventory and stock', status: 'active' },
                    { type: 'Tray Manager', flag: 6, description: 'Manages tray allotments and transfers', status: 'active' },
                    { type: 'Retailor Manager', flag: 5, description: 'Manages retailor operations', status: 'active' },
                    { type: 'Distributor Manager', flag: 4, description: 'Manages distributor operations', status: 'active' },
                    { type: 'Sales Manager', flag: 3, description: 'Manages sales operations and targets', status: 'active' },
                    { type: 'Distributor', flag: 2, description: 'Distributor user with limited access', status: 'active' },
                    { type: 'Retailor', flag: 1, description: 'Retailor user with limited access', status: 'active' },
                    { type: 'Salesman', flag: 0, description: 'Salesman with subrole capabilities', status: 'active' },
                ]
            });
            console.log('Default roles created successfully');
            return roles;
        } catch (error: any) {
            console.error('Error creating default roles: ' + error.message);
        }
    }
}
const roleController = new RoleController();

export default roleController;