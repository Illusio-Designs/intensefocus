import { Request, Response } from 'express';
import httpStatus from 'http-status';
import prisma from '../constants/prisma';

class CollectionController {

    // Get all collections
    getAllCollections = async (req: Request, res: Response) => {
        try {
            const collections = await prisma.collection.findMany({
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: collections,
                message: 'Collections retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving collections',
                error: error.message
            });
        }
    };

    // Get single collection by ID
    getCollectionById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const collection = await prisma.collection.findUnique({
                where: { id: parseInt(id) }
            });

            if (!collection) {
                return res.status(404).json({
                    success: false,
                    message: 'Collection not found'
                });
            }

            res.status(httpStatus.OK).json({
                success: true,
                data: collection,
                message: 'Collection retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving collection',
                error: error.message
            });
        }
    };

    // Create new collection
    createCollection = async (req: Request, res: Response) => {
        try {
            const { name, description, image, status, sort_order, meta_title, meta_description, meta_keywords } = req.body;

            // Check if collection already exists
            const existingCollection = await prisma.collection.findUnique({ where: { name } });
            if (existingCollection) {
                return res.status(400).json({
                    success: false,
                    message: 'Collection with this name already exists'
                });
            }

            const collection = await prisma.collection.create({
                data: {
                    name,
                    description,
                    image,
                    status: status !== undefined ? status : true,
                    sort_order: sort_order || 0,
                    meta_title,
                    meta_description,
                    meta_keywords
                }
            });

            res.status(201).json({
                success: true,
                data: collection,
                message: 'Collection created successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error creating collection',
                error: error.message
            });
        }
    };

    // Update collection
    updateCollection = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, description, image, status, sort_order, meta_title, meta_description, meta_keywords } = req.body;

            const collection = await prisma.collection.findUnique({ where: { id: parseInt(id) } });
            if (!collection) {
                return res.status(404).json({
                    success: false,
                    message: 'Collection not found'
                });
            }

            // Check if name is being changed and if it already exists
            if (name && name !== collection.name) {
                const existingCollection = await prisma.collection.findUnique({ where: { name } });
                if (existingCollection) {
                    return res.status(400).json({
                        success: false,
                        message: 'Collection with this name already exists'
                    });
                }
            }

            // Prepare update data
            const updateData: any = {};
            if (name) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (image !== undefined) updateData.image = image;
            if (status !== undefined) updateData.status = status;
            if (sort_order !== undefined) updateData.sort_order = sort_order;
            if (meta_title !== undefined) updateData.meta_title = meta_title;
            if (meta_description !== undefined) updateData.meta_description = meta_description;
            if (meta_keywords !== undefined) updateData.meta_keywords = meta_keywords;

            await prisma.collection.update({
                where: { id: parseInt(id) },
                data: updateData
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: collection,
                message: 'Collection updated successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error updating collection',
                error: error.message
            });
        }
    };

    // Get active collections only
    getActiveCollections = async (req: Request, res: Response) => {
        try {
            const collections = await prisma.collection.findMany({
                where: { status: true },
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: collections,
                message: 'Active collections retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving active collections',
                error: error.message
            });
        }
    };

    // Search collections
    searchCollections = async (req: Request, res: Response) => {
        try {
            const { search, status } = req.query;

            let whereClause: any = {};

            if (search) {
                whereClause.name = { contains: search as string };
            }

            if (status !== undefined) {
                whereClause.status = status === 'true';
            }

            const collections = await prisma.collection.findMany({
                where: whereClause,
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: collections,
                message: 'Collections searched successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error searching collections',
                error: error.message
            });
        }
    };

}

const collectionController = new CollectionController();

export default collectionController;