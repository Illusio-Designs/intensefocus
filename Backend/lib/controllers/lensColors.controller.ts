import { Request, Response } from 'express';
import httpStatus from 'http-status';
import prisma from '../constants/prisma';
class LensColorsController {

    // Get all lens colors
    getAllLensColors = async (req: Request, res: Response) => {
        try {
            const lensColors = await prisma.lensColor.findMany({
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: lensColors,
                message: 'Lens colors retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving lens colors',
                error: error.message as string
            });
        }
    };

    // Get single lens color by ID
    getLensColorById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const lensColor = await prisma.lensColor.findUnique({
                where: { id: parseInt(id) }
            });

            if (!lensColor) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Lens color not found'
                });
            }

            res.status(httpStatus.OK).json({
                success: true,
                data: lensColor,
                message: 'Lens color retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving lens color',
                error: error.message as string
            });
        }
    };

    // Create new lens color
    createLensColor = async (req: Request, res: Response) => {
        try {
            const { name, description, color_code, status, sort_order } = req.body;

            // Check if lens color already exists
            const existingLensColor = await prisma.lensColor.findUnique({ where: { name } });
            if (existingLensColor) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Lens color with this name already exists'
                });
            }

            const lensColor = await prisma.lensColor.create({
                data: {
                    name,
                    description,
                    color_code: color_code || '',
                    status: status !== undefined ? status : true,
                    sort_order: sort_order || 0
                }
            });

            res.status(httpStatus.CREATED).json({
                success: true,
                data: lensColor,
                message: 'Lens color created successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error creating lens color',
                error: error.message as string
            });
        }
    };

    // Update lens color
    updateLensColor = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, description, color_code, status, sort_order } = req.body;

            const lensColor = await prisma.lensColor.findUnique({
                where: { id: parseInt(id) }
            });
            if (!lensColor) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Lens color not found'
                });
            }

            // Check if name is being changed and if it already exists
            if (name && name !== lensColor.name) {
                const existingLensColor = await prisma.lensColor.findUnique({ where: { name } });
                if (existingLensColor) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        success: false,
                        message: 'Lens color with this name already exists'
                    });
                }
            }

            // Prepare update data
            const updateData: any = {};
            if (name) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (color_code !== undefined) updateData.color_code = color_code;
            if (status !== undefined) updateData.status = status;
            if (sort_order !== undefined) updateData.sort_order = sort_order;

            await prisma.lensColor.update({ where: { id: parseInt(id) }, data: updateData });

            res.status(httpStatus.OK).json({
                success: true,
                data: lensColor,
                message: 'Lens color updated successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error updating lens color',
                error: error.message
            });
        }
    };

    // Get active lens colors only
    getActiveLensColors = async (req: Request, res: Response) => {
        try {
            const lensColors = await prisma.lensColor.findMany({
                where: { status: true },
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: lensColors,
                message: 'Active lens colors retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving active lens colors',
                error: error.message
            });
        }
    };

    // Search lens colors
    searchLensColors = async (req: Request, res: Response) => {
        try {
            const { search, status } = req.query;

            let whereClause: any = {};

            if (search) {
                whereClause.name = { contains: search as string };
            }

            if (status !== undefined) {
                whereClause.status = status === 'true';
            }

            const lensColors = await prisma.lensColor.findMany({
                where: whereClause,
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: lensColors,
                message: 'Lens colors searched successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error searching lens colors',
                error: error.message
            });
        }
    };

}

const lensColorsController = new LensColorsController();

export default lensColorsController;