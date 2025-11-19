import { Request, Response } from 'express';
import httpStatus from 'http-status';
import prisma from '../constants/prisma';
class FrameColorController {

    // Get all frame colors
    getAllFrameColors = async (req: Request, res: Response) => {
        try {
            const frameColors = await prisma.frameColor.findMany({
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: frameColors,
                message: 'Frame colors retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving frame colors',
                error: error.message as string
            });
        }
    };

    // Get single frame color by ID
    getFrameColorById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const frameColor = await prisma.frameColor.findUnique({
                where: { id: parseInt(id) }
            });

            if (!frameColor) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Frame color not found'
                });
            }

            res.status(httpStatus.OK).json({
                success: true,
                data: frameColor,
                message: 'Frame color retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving frame color',
                error: error.message as string
            });
        }
    };

    // Create new frame color
    createFrameColor = async (req: Request, res: Response) => {
        try {
            const { name, description, color_code, status, sort_order } = req.body;

            // Check if frame color already exists
            const existingFrameColor = await prisma.frameColor.findUnique({ where: { name } });
            if (existingFrameColor) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Frame color with this name already exists'
                });
            }

            const frameColor = await prisma.frameColor.create({
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
                data: frameColor,
                message: 'Frame color created successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error creating frame color',
                error: error.message
            });
        }
    };

    // Update frame color
    updateFrameColor = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, description, color_code, status, sort_order } = req.body;

            const frameColor = await prisma.frameColor.findUnique({
                where: { id: parseInt(id) }
            });
            if (!frameColor) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Frame color not found'
                });
            }

            // Check if name is being changed and if it already exists
            if (name && name !== frameColor.name) {
                const existingFrameColor = await prisma.frameColor.findUnique({ where: { name } });
                if (existingFrameColor) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        success: false,
                        message: 'Frame color with this name already exists'
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

            await prisma.frameColor.update({ where: { id: parseInt(id) }, data: updateData });

            res.status(httpStatus.OK).json({
                success: true,
                data: frameColor,
                message: 'Frame color updated successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error updating frame color',
                error: error.message as string
            });
        }
    };

    // Get active frame colors only
    getActiveFrameColors = async (req: Request, res: Response) => {
        try {
            const frameColors = await prisma.frameColor.findMany({
                where: { status: true },
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: frameColors,
                message: 'Active frame colors retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving active frame colors',
                error: error.message as string
            });
        }
    };

    // Search frame colors
    searchFrameColors = async (req: Request, res: Response) => {
        try {
            const { search, status } = req.query;

            let whereClause: any = {};

            if (search) {
                whereClause.name = { contains: search as string };
            }

            if (status !== undefined) {
                whereClause.status = status === 'true';
            }

            const frameColors = await prisma.frameColor.findMany({
                where: whereClause,
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: frameColors,
                message: 'Frame colors searched successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error searching frame colors',
                error: error.message as string
            });
        }
    };

}

const frameColorController = new FrameColorController();
export default frameColorController;