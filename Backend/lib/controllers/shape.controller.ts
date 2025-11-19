import { Request, Response } from 'express';
import httpStatus from 'http-status';
import prisma from '../constants/prisma';
class ShapeController {

    // Get all shapes
    getAllShapes = async (req: Request, res: Response) => {
        try {
            const shapes = await prisma.shape.findMany({
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: shapes,
                message: 'Shapes retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving shapes',
                error: error.message as string
            });
        }
    };

    // Get single shape by ID
    getShapeById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const shape = await prisma.shape.findUnique({
                where: { id: parseInt(id) }
            });

            if (!shape) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Shape not found'
                });
            }

            res.status(httpStatus.OK).json({
                success: true,
                data: shape,
                message: 'Shape retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving shape',
                error: error.message as string
            });
        }
    };

    // Create new shape
    createShape = async (req: Request, res: Response) => {
        try {
            const { name, description, status, sort_order } = req.body;

            // Check if shape already exists
            const existingShape = await prisma.shape.findUnique({ where: { name } });
            if (existingShape) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Shape with this name already exists'
                });
            }

            const shape = await prisma.shape.create({
                data: {
                    name,
                    description,
                    status: status !== undefined ? status : true,
                    sort_order: sort_order || 0
                }
            });

            res.status(httpStatus.CREATED).json({
                success: true,
                data: shape,
                message: 'Shape created successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error creating shape',
                error: error.message as string
            });
        }
    };

    // Update shape
    updateShape = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, description, status, sort_order } = req.body;

            const shape = await prisma.shape.findUnique({ where: { id: parseInt(id) } });
            if (!shape) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Shape not found'
                });
            }

            // Check if name is being changed and if it already exists
            if (name && name !== shape.name) {
                const existingShape = await prisma.shape.findUnique({ where: { name } });
                if (existingShape) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        success: false,
                        message: 'Shape with this name already exists'
                    });
                }
            }

            // Prepare update data
            const updateData: any = {};
            if (name) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (status !== undefined) updateData.status = status;
            if (sort_order !== undefined) updateData.sort_order = sort_order;

            await prisma.shape.update({ where: { id: parseInt(id) }, data: updateData });

            res.status(httpStatus.OK).json({
                success: true,
                data: shape,
                message: 'Shape updated successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error updating shape',
                error: error.message as string
            });
        }
    };

    // Get active shapes only
    getActiveShapes = async (req: Request, res: Response) => {
        try {
            const shapes = await prisma.shape.findMany({
                where: { status: true },
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: shapes,
                message: 'Active shapes retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving active shapes',
                error: error.message as string
            });
        }
    };

    // Search shapes
    searchShapes = async (req: Request, res: Response) => {
        try {
            const { search, status } = req.query;

            let whereClause: any = {};

            if (search) {
                whereClause.name = { like: `%${search}%` };
            }

            if (status !== undefined) {
                whereClause.status = status === 'true' ? true : false;
            }

            const shapes = await prisma.shape.findMany({
                where: whereClause,
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: shapes,
                message: 'Shapes searched successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error searching shapes',
                error: error.message as string
            });
        }
    };

}

const shapeController = new ShapeController();

export default shapeController;