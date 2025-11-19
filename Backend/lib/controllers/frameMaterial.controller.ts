import { Request, Response } from 'express';
import httpStatus from 'http-status';
import prisma from '../constants/prisma';
class FrameMaterialController {

    // Get all frame materials
    getAllFrameMaterials = async (req: Request, res: Response) => {
        try {
            const frameMaterials = await prisma.frameMaterial.findMany({
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: frameMaterials,
                message: 'Frame materials retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving frame materials',
                error: error.message
            });
        }
    };

    // Get single frame material by ID
    getFrameMaterialById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const frameMaterial = await prisma.frameMaterial.findUnique({
                where: { id: parseInt(id) }
            });

            if (!frameMaterial) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Frame material not found'
                });
            }

            res.status(httpStatus.OK).json({
                success: true,
                data: frameMaterial,
                message: 'Frame material retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving frame material',
                error: error.message
            });
        }
    };

    // Create new frame material
    createFrameMaterial = async (req: Request, res: Response) => {
        try {
            const { name, description, status, sort_order } = req.body;

            // Check if frame material already exists
            const existingFrameMaterial = await prisma.frameMaterial.findUnique({ where: { name } });
            if (existingFrameMaterial) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Frame material with this name already exists'
                });
            }

            const frameMaterial = await prisma.frameMaterial.create({
                data: {
                    name,
                    description,
                    status: status !== undefined ? status : true,
                    sort_order: sort_order || 0
                }
            });

            res.status(httpStatus.CREATED).json({
                success: true,
                data: frameMaterial,
                message: 'Frame material created successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error creating frame material',
                error: error.message
            });
        }
    };

    // Update frame material
    updateFrameMaterial = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, description, status, sort_order } = req.body;

            const frameMaterial = await prisma.frameMaterial.findUnique({ where: { id: parseInt(id) } });
            if (!frameMaterial) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Frame material not found'
                });
            }

            // Check if name is being changed and if it already exists
            if (name && name !== frameMaterial.name) {
                const existingFrameMaterial = await prisma.frameMaterial.findUnique({ where: { name } });
                if (existingFrameMaterial) {
                    return res.status(400).json({
                        success: false,
                        message: 'Frame material with this name already exists'
                    });
                }
            }

            // Prepare update data
            const updateData: any = {};
            if (name) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (status !== undefined) updateData.status = status;
            if (sort_order !== undefined) updateData.sort_order = sort_order;

            await prisma.frameMaterial.update({ where: { id: parseInt(id) }, data: updateData });

            res.status(httpStatus.OK).json({
                success: true,
                data: frameMaterial,
                message: 'Frame material updated successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error updating frame material',
                error: error.message
            });
        }
    };

    // Get active frame materials only
    getActiveFrameMaterials = async (req: Request, res: Response) => {
        try {
            const frameMaterials = await prisma.frameMaterial.findMany({
                where: { status: true },
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: frameMaterials,
                message: 'Active frame materials retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving active frame materials',
                error: error.message
            });
        }
    };

    // Search frame materials
    searchFrameMaterials = async (req: Request, res: Response) => {
        try {
            const { search, status } = req.query;

            let whereClause: any = {};

            if (search) {
                whereClause.name = { contains: search as string };
            }

            if (status !== undefined) {
                whereClause.status = status === 'true';
            }

            const frameMaterials = await prisma.frameMaterial.findMany({
                where: whereClause,
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: frameMaterials,
                message: 'Frame materials searched successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error searching frame materials',
                error: error.message
            });
        }
    };

}
const frameMaterialController = new FrameMaterialController();
export default frameMaterialController;