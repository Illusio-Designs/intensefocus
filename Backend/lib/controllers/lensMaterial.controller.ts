import { Request, Response } from 'express';
import httpStatus from 'http-status';
import prisma from '../constants/prisma';
class LensMaterialController {

    // Get all lens materials
    getAllLensMaterials = async (req: Request, res: Response) => {
        try {
            const lensMaterials = await prisma.lensMaterial.findMany({
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: lensMaterials,
                message: 'Lens materials retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving lens materials',
                error: error.message as string
            });
        }
    };

    // Get single lens material by ID
    getLensMaterialById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const lensMaterial = await prisma.lensMaterial.findUnique({
                where: { id: parseInt(id) }
            });

            if (!lensMaterial) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Lens material not found'
                });
            }

            res.status(httpStatus.OK).json({
                success: true,
                data: lensMaterial,
                message: 'Lens material retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving lens material',
                error: error.message as string
            });
        }
    };

    // Create new lens material
    createLensMaterial = async (req: Request, res: Response) => {
        try {
            const { name, description, status, sort_order } = req.body;

            // Check if lens material already exists
            const existingLensMaterial = await prisma.lensMaterial.findUnique({ where: { name } });
            if (existingLensMaterial) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Lens material with this name already exists'
                });
            }

            const lensMaterial = await prisma.lensMaterial.create({
                data: {
                    name,
                    description,
                    status: status !== undefined ? status : true,
                    sort_order: sort_order || 0
                }
            });

            res.status(httpStatus.CREATED).json({
                success: true,
                data: lensMaterial,
                message: 'Lens material created successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error creating lens material',
                error: error.message
            });
        }
    };

    // Update lens material
    updateLensMaterial = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, description, status, sort_order } = req.body;

            const lensMaterial = await prisma.lensMaterial.findUnique({ where: { id: parseInt(id) } });
            if (!lensMaterial) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Lens material not found'
                });
            }

            // Check if name is being changed and if it already exists
            if (name && name !== lensMaterial.name) {
                const existingLensMaterial = await prisma.lensMaterial.findUnique({ where: { name } });
                if (existingLensMaterial) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        success: false,
                        message: 'Lens material with this name already exists'
                    });
                }
            }

            // Prepare update data
            const updateData: any = {};
            if (name) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (status !== undefined) updateData.status = status;
            if (sort_order !== undefined) updateData.sort_order = sort_order;

            await prisma.lensMaterial.update({ where: { id: parseInt(id) }, data: updateData });

            res.status(httpStatus.OK).json({
                success: true,
                data: lensMaterial,
                message: 'Lens material updated successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error updating lens material',
                error: error.message as string
            });
        }
    };

    // Get active lens materials only
    getActiveLensMaterials = async (req: Request, res: Response) => {
        try {
            const lensMaterials = await prisma.lensMaterial.findMany({
                where: { status: true },
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: lensMaterials,
                message: 'Active lens materials retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving active lens materials',
                error: error.message as string
            });
        }
    };

    // Search lens materials
    searchLensMaterials = async (req: Request, res: Response) => {
        try {
            const { search, status } = req.query;

            let whereClause: any = {};

            if (search) {
                whereClause.name = { contains: search as string };
            }

            if (status !== undefined) {
                whereClause.status = status === 'true';
            }

            const lensMaterials = await prisma.lensMaterial.findMany({
                where: whereClause,
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: lensMaterials,
                message: 'Lens materials searched successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error searching lens materials',
                error: error.message as string
            });
        }
    };

}

const lensMaterialController = new LensMaterialController();

export default lensMaterialController;