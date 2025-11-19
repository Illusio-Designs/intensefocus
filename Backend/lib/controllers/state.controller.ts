import { Request, Response } from 'express';
import httpStatus from 'http-status';
import prisma from "../constants/prisma";

class StateController {

    // Get all states
    getAllStates = async (req: Request, res: Response) => {
        try {
            const states = await prisma.state.findMany({
                orderBy: { name: 'asc' }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: states,
                message: 'States retrieved successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving states',
                error: error.message as string
            });
        }
    };

    // Get single state by ID
    getStateById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const state = await prisma.state.findUnique({
                where: { id: parseInt(id) }
            });

            if (!state) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'State not found'
                });
            }

            res.status(httpStatus.OK).json({
                success: true,
                data: state,
                message: 'State retrieved successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving state',
                error: error.message as string
            });
        }
    };

    // Create new state
    createState = async (req: Request, res: Response) => {
        try {
            const { name, code, country_id, status } = req.body;

            // Check if state already exists
            const existingState = await prisma.state.findUnique({ where: { name } });
            if (existingState) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'State with this name already exists'
                });
            }

            // Check if code already exists
            if (code) {
                const existingStateCode = await prisma.state.findFirst({ where: { code: code as string } });
                if (existingStateCode) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        success: false,
                        message: 'State with this code already exists'
                    });
                }
            }

            const state = await prisma.state.create({
                data: {
                    name,
                    code: code as string,
                    country_id: country_id || 1,
                    status: status !== undefined ? status : true
                }
            });

            res.status(httpStatus.CREATED).json({
                success: true,
                data: state,
                message: 'State created successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error creating state',
                error: error.message as string
            });
        }
    };

    // Update state
    updateState = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, code, country_id, status } = req.body;

            const state = await prisma.state.findUnique({ where: { id: parseInt(id) } });
            if (!state) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'State not found'
                });
            }

            // Check if name is being changed and if it already exists
            if (name && name !== state.name) {
                const existingState = await prisma.state.findUnique({ where: { name } });
                if (existingState) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        success: false,
                        message: 'State with this name already exists'
                    });
                }
            }

            // Check if code is being changed and if it already exists
            if (code && code !== state.code) {
                const existingStateCode = await prisma.state.findFirst({ where: { code } });
                if (existingStateCode) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        success: false,
                        message: 'State with this code already exists'
                    });
                }
            }

            // Prepare update data
            const updateData: any = {};
            if (name) updateData.name = name;
            if (code !== undefined) updateData.code = code;
            if (country_id !== undefined) updateData.country_id = country_id;
            if (status !== undefined) updateData.status = status;

            await prisma.state.update({ where: { id: parseInt(id) }, data: updateData });

            res.status(httpStatus.OK).json({
                success: true,
                data: state,
                message: 'State updated successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error updating state',
                error: error.message as string
            });
        }
    };

    // Get active states only
    getActiveStates = async (req: Request, res: Response) => {
        try {
            const states = await prisma.state.findMany({
                where: { status: true },
                orderBy: { name: 'asc' }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: states,
                message: 'Active states retrieved successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving active states',
                error: error.message as string
            });
        }
    };

    // Search states
    searchStates = async (req: Request, res: Response) => {
        try {
            const { search, status } = req.query;

            let whereClause: any = {};

            if (search) {
                whereClause = {
                    OR: [
                        { name: { contains: search as string } },
                        { code: { contains: search as string } }
                    ]
                };
            }

            if (status !== undefined) {
                whereClause.status = status === 'true';
            }

            const states = await prisma.state.findMany({
                where: whereClause,
                orderBy: { name: 'asc' }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: states,
                message: 'States searched successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error searching states',
                error: error.message as string
            });
        }
    };
}
const stateController = new StateController();
export default stateController;