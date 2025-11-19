import { Request, Response } from "express";
import httpStatus from "http-status";
import prisma from "../constants/prisma";

class SliderController {

    // Get all sliders
    getAllSliders = async (req: Request, res: Response) => {
        try {
            const sliders = await prisma.slider.findMany({
                orderBy: {
                    sort_order: 'asc',
                    createdAt: 'desc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: sliders,
                message: 'Sliders retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving sliders',
                error: error.message
            });
        }
    };

    // Get single slider by ID
    getSliderById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const slider = await prisma.slider.findUnique({
                where: { id: parseInt(id) }
            });

            if (!slider) {
                return res.status(404).json({
                    success: false,
                    message: 'Slider not found'
                });
            }

            res.status(httpStatus.OK).json({
                success: true,
                data: slider,
                message: 'Slider retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving slider',
                error: error.message
            });
        }
    };

    // Create new slider
    createSlider = async (req: Request, res: Response) => {
        try {
            const { title, subtitle, description, image, button_text, button_link, status, sort_order } = req.body;

            const slider = await prisma.slider.create({
                data: {
                    title,
                    subtitle,
                    description,
                    image,
                    button_text,
                    button_link,
                    status: status !== undefined ? status : true,
                    sort_order: sort_order || 0
                }
            });

            res.status(httpStatus.CREATED).json({
                success: true,
                data: slider,
                message: 'Slider created successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error creating slider',
                error: error.message
            });
        }
    };

    // Update slider
    updateSlider = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { title, subtitle, description, image, button_text, button_link, status, sort_order } = req.body;

            const slider = await prisma.slider.findUnique({
                where: { id: parseInt(id) }
            });
            if (!slider) {
                return res.status(404).json({
                    success: false,
                    message: 'Slider not found'
                });
            }

            // Prepare update data
            const updateData: any = {};
            if (title !== undefined) updateData.title = title;
            if (subtitle !== undefined) updateData.subtitle = subtitle;
            if (description !== undefined) updateData.description = description;
            if (image !== undefined) updateData.image = image;
            if (button_text !== undefined) updateData.button_text = button_text;
            if (button_link !== undefined) updateData.button_link = button_link;
            if (status !== undefined) updateData.status = status;
            if (sort_order !== undefined) updateData.sort_order = sort_order;

            await prisma.slider.update({
                where: { id: parseInt(id) },
                data: updateData
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: slider,
                message: 'Slider updated successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error updating slider',
                error: error.message
            });
        }
    };

    // Get active sliders only
    getActiveSliders = async (req: Request, res: Response) => {
        try {
            const sliders = await prisma.slider.findMany({
                where: { status: true },
                orderBy: {
                    sort_order: 'asc',
                    createdAt: 'desc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: sliders,
                message: 'Active sliders retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving active sliders',
                error: error.message
            });
        }
    };

    // Search sliders
    searchSliders = async (req: Request, res: Response) => {
        try {
            const { search, status } = req.query;

            let whereClause: any = {};

            if (search) {
                whereClause.title = { contains: search as string };
                whereClause.subtitle = { contains: search as string };
                whereClause.description = { contains: search as string };
            }

            if (status !== undefined) {
                whereClause.status = status === 'true';
            }

            const sliders = await prisma.slider.findMany({
                where: whereClause,
                orderBy: {
                    sort_order: 'asc',
                    createdAt: 'desc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: sliders,
                message: 'Sliders searched successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error searching sliders',
                error: error.message
            });
        }
    };

    // Upload slider image
    uploadSliderImage = async (req: any, res: Response) => {
        try {
            const fileInfo = req.fileInfo;

            res.status(httpStatus.OK).json({
                success: true,
                message: 'Slider image uploaded successfully',
                data: {
                    filename: fileInfo.filename,
                    path: fileInfo.path,
                    size: fileInfo.size,
                    mimetype: fileInfo.mimetype,
                    originalName: fileInfo.originalName
                }
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error uploading slider image',
                error: error.message
            });
        }
    };

    // Get all sliders (matching PHP getAllSlider)
    getAllSlider = async (req: Request, res: Response) => {
        try {
            const sliders = await prisma.slider.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: sliders,
                message: 'All sliders retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving sliders',
                error: error.message
            });
        }
    };

}

const sliderController = new SliderController();
export default sliderController;