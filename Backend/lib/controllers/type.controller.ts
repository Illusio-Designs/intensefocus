import { Request, Response } from 'express';

import httpStatus from 'http-status';
import prisma from '../constants/prisma';
class TypeController {

    // Get all types
    getAllTypes = async (req: Request, res: Response) => {
        try {
            const types = await prisma.type.findMany({
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: types,
                message: 'Types retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving types',
                error: error.message as string
            });
        }
    };

    // Get single type by ID
    getTypeById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const type = await prisma.type.findUnique({
                where: { id: parseInt(id) }
            });

            if (!type) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Type not found'
                });
            }

            res.status(httpStatus.OK).json({
                success: true,
                data: type,
                message: 'Type retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving type',
                error: error.message as string
            });
        }
    };

    // Create new type
    createType = async (req: Request, res: Response) => {
        try {
            const { name, description, status, sort_order } = req.body;

            // Check if type already exists
            const existingType = await prisma.type.findUnique({ where: { name } });
            if (existingType) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Type with this name already exists'
                });
            }

            const type = await prisma.type.create({
                data: {
                    name,
                    description,
                    status: status !== undefined ? status : true,
                    sort_order: sort_order || 0
                }
            });

            res.status(httpStatus.CREATED).json({
                success: true,
                data: type,
                message: 'Type created successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error creating type',
                error: error.message as string
            });
        }
    };

    // Update type
    updateType = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, description, status, sort_order } = req.body;

            const type = await prisma.type.findUnique({ where: { id: parseInt(id) } });
            if (!type) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Type not found'
                });
            }

            // Check if name is being changed and if it already exists
            if (name && name !== type.name) {
                const existingType = await prisma.type.findUnique({ where: { name } });
                if (existingType) {
                    return res.status(400).json({
                        success: false,
                        message: 'Type with this name already exists'
                    });
                }
            }

            // Prepare update data
            const updateData: any = {};
            if (name) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (status !== undefined) updateData.status = status;
            if (sort_order !== undefined) updateData.sort_order = sort_order;

            await prisma.type.update({ where: { id: parseInt(id) }, data: updateData });

            res.status(httpStatus.OK).json({
                success: true,
                data: type,
                message: 'Type updated successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error updating type',
                error: error.message as string
            });
        }
    };

    // Get active types only
    getActiveTypes = async (req: Request, res: Response) => {
        try {
            const types = await prisma.type.findMany({
                where: { status: true },
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: types,
                message: 'Active types retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving active types',
                error: error.message as string
            });
        }
    };

    // Search types
    searchTypes = async (req: Request, res: Response) => {
        try {
            const { search, status } = req.query;

            let whereClause: any = {};

            if (search) {
                whereClause.name = { contains: search as string };
            }

            if (status !== undefined) {
                whereClause.status = status === 'true';
            }

            const types = await prisma.type.findMany({
                where: whereClause,
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: types,
                message: 'Types searched successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error searching types',
                error: error.message as string
            });
        }
    };

}
const typeController = new TypeController();
export default typeController;