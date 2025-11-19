import { Request, Response } from 'express';
import httpStatus from 'http-status';
import prisma from '../constants/prisma';

class RoleTypeController {

    // Get all role types
    getAllRoleTypes = async (req: Request, res: Response) => {
        try {
            const roleTypes = await prisma.roleType.findMany({
                orderBy: {
                    flag: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: roleTypes,
                message: 'Role types retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving role types',
                error: error.message as string
            });
        }
    };

    // Get single role type by ID
    getRoleTypeById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const roleType = await prisma.roleType.findUnique({
                where: { id: parseInt(id) }
            });

            if (!roleType) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Role type not found'
                });
            }

            res.status(httpStatus.OK).json({
                success: true,
                data: roleType,
                message: 'Role type retrieved successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving role type',
                error: error.message as string
            });
        }
    };

    // Create new role type
    createRoleType = async (req: Request, res: Response) => {
        try {
            const { name, description, permissions, status } = req.body;

            // Check if role type already exists
            const existingRoleType = await prisma.roleType.findFirst({ where: { type: name } });
            if (existingRoleType) {
                return res.status(400).json({
                    success: false,
                    message: 'Role type with this name already exists'
                });
            }

            const roleType = await prisma.roleType.create({
                data: {
                    type: name,
                    description,
                    status: status !== undefined ? status : true
                }
            });

            res.status(httpStatus.CREATED).json({
                success: true,
                data: roleType,
                message: 'Role type created successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error creating role type',
                error: error.message as string
            });
        }
    };

    // Update role type
    updateRoleType = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, description, permissions, status } = req.body;

            const roleType = await prisma.roleType.findUnique({ where: { id: parseInt(id) } });
            if (!roleType) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Role type not found'
                });
            }

            // Check if name is being changed and if it already exists
            if (name && name !== roleType.type) {
                const existingRoleType = await prisma.roleType.findFirst({ where: { type: name } });
                if (existingRoleType) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        success: false,
                        message: 'Role type with this name already exists'
                    });
                }
            }

            // Prepare update data
            const updateData: any = {};
            if (name) updateData.type = name;
            if (description !== undefined) updateData.description = description;
            // if (permissions !== undefined) updateData.permissions = permissions;
            if (status !== undefined) updateData.status = status;

            await prisma.roleType.update({ where: { id: parseInt(id) }, data: updateData });

            res.status(httpStatus.OK).json({
                success: true,
                data: roleType,
                message: 'Role type updated successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error updating role type',
                error: error.message as string
            });
        }
    };

    // Get active role types only
    getActiveRoleTypes = async (req: Request, res: Response) => {
        try {
            const roleTypes = await prisma.roleType.findMany({
                where: { status: 'active' },
                orderBy: {
                    flag: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: roleTypes,
                message: 'Active role types retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving active role types',
                error: error.message as string
            });
        }
    };

    // Search role types
    searchRoleTypes = async (req: Request, res: Response) => {
        try {
            const { search, status } = req.query;

            let whereClause: any = {};

            if (search) {
                whereClause.type = { contains: search as string };
            }

            if (status !== undefined) {
                whereClause.status = status === 'true' ? 'active' : 'inactive';
            }

            const roleTypes = await prisma.roleType.findMany({
                where: whereClause,
                orderBy: {
                    flag: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: roleTypes,
                message: 'Role types searched successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error searching role types',
                error: error.message
            });
        }
    };

}
const roleTypeController = new RoleTypeController();
export default roleTypeController;