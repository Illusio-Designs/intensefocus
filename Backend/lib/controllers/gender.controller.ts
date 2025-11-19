import { Request, Response } from 'express';
import httpStatus from 'http-status';
import prisma from '../constants/prisma';
class GenderController {

    // Get all genders
    getAllGenders = async (req: Request, res: Response) => {
        try {
            const genders = await prisma.gender.findMany({
                orderBy: {
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: genders,
                count: genders.length
            });
        } catch (error: any) {
            console.error('Error fetching genders:', error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to fetch genders',
                error: error.message as string
            });
        }
    };

    // Get active genders only
    getActiveGenders = async (req: Request, res: Response) => {
        try {
            const genders = await prisma.gender.findMany({
                where: { status: true },
                orderBy: {
                    name: 'asc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: genders,
                count: genders.length
            });
        } catch (error: any) {
            console.error('Error fetching active genders:', error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to fetch active genders',
                error: error.message
            });
        }
    };

    // Search genders
    searchGenders = async (req: Request, res: Response) => {
        try {
            const { q } = req.query;

            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }

            const genders = await prisma.gender.findMany({
                where: {
                    OR: [
                        { name: { contains: `%${q}%` } },
                        { description: { contains: `%${q}%` } }
                    ]
                },
                orderBy: {
                    name: 'asc'
                }
            });

            res.json({
                success: true,
                data: genders,
                count: genders.length,
                query: q
            });
        } catch (error: any) {
            console.error('Error searching genders:', error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to search genders',
                error: error.message as string
            });
        }
    };

    // Get single gender by ID
    getGenderById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const gender = await prisma.gender.findUnique({
                where: { id: parseInt(id) }
            });

            if (!gender) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Gender not found'
                });
            }

            res.status(httpStatus.OK).json({
                success: true,
                data: gender
            });
        } catch (error: any) {
            console.error('Error fetching gender:', error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to fetch gender',
                error: error.message as string
            });
        }
    };

    // Create new gender
    createGender = async (req: Request, res: Response) => {
        try {
            const { name, description, status = 1 } = req.body;

            if (!name) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Gender name is required'
                });
            }

            // Check if gender with same name already exists
            const existingGender = await prisma.gender.findFirst({
                where: { name: { contains: name } }
            });

            if (existingGender) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Gender with this name already exists'
                });
            }

            const gender = await prisma.gender.create({
                data: {
                    name,
                    description,
                    status: status !== undefined ? status : true
                }
            });

            res.status(httpStatus.CREATED).json({
                success: true,
                message: 'Gender created successfully',
                data: gender
            });
        } catch (error: any) {
            console.error('Error creating gender:', error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to create gender',
                error: error.message
            });
        }
    };

    // Update gender
    updateGender = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, description, status } = req.body;

            const gender = await prisma.gender.findUnique({ where: { id: parseInt(id) } });

            if (!gender) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Gender not found'
                });
            }

            // Check if name is being updated and if it conflicts with existing gender
            if (name && name !== gender.name) {
                const existingGender = await prisma.gender.findFirst({
                    where: {
                        name: { contains: name },
                        id: { not: parseInt(id) }
                    }
                });

                if (existingGender) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        success: false,
                        message: 'Gender with this name already exists'
                    });
                }
            }

            // Update only provided fields
            const updateData: any = {};
            if (name !== undefined) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (status !== undefined) updateData.status = status;

            await prisma.gender.update({ where: { id: parseInt(id) }, data: updateData });

            res.status(httpStatus.OK).json({
                success: true,
                message: 'Gender updated successfully',
                data: gender
            });
        } catch (error: any) {
            console.error('Error updating gender:', error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to update gender',
                error: error.message
            });
        }
    };

}

const genderController = new GenderController();

export default genderController;