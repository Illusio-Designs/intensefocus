import { Request, Response } from 'express';
import httpStatus from 'http-status';
import prisma from "../constants/prisma";

class BrandController {
    getAllBrands = async (req: Request, res: Response) => {
        try {
            const brands = await prisma.brand.findMany({
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });
            res.status(httpStatus.OK).json(brands);
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to get brands' });
        }
    }

    getActiveBrands = async (req: Request, res: Response) => {
        try {
            const brands = await prisma.brand.findMany({
                where: {
                    status: true
                }, orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });
            res.status(httpStatus.OK).json(brands);
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to get active brands' });
        }
    }

    searchBrands = async (req: Request, res: Response) => {
        try {
            const { search, status } = req.query;

            let whereClause: any = {};

            if (search) {
                whereClause.name = { contains: search as string };
            }

            if (status !== undefined) {
                whereClause.status = status === 'true';
            }

            const brands = await prisma.brand.findMany({
                where: whereClause,
                orderBy: {
                    sort_order: 'asc',
                    name: 'asc'
                }
            });
            res.status(httpStatus.OK).json(brands);
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to search brands' });
        }
    }

    getBrandById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const brand = await prisma.brand.findUnique({
                where: { id: parseInt(id) }
            });
            res.status(httpStatus.OK).json(brand);
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to get brand by id' });
        }
    }

    createBrand = async (req: Request, res: Response) => {
        try {
            const { name, description, logo, status, sort_order, meta_title, meta_description, meta_keywords } = req.body;

            // Check if brand already exists
            const existingBrand = await prisma.brand.findUnique({ where: { name } });
            if (existingBrand) {
                res.status(httpStatus.BAD_REQUEST).json({ message: 'Brand with this name already exists' });
            }

            const brand = await prisma.brand.create({
                data: {
                    name,
                    description,
                    logo,
                    status: status !== undefined ? status : true,
                    sort_order: sort_order || 0,
                    meta_title,
                    meta_description,
                    meta_keywords
                }
            });

            res.status(httpStatus.CREATED).json(brand);
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create brand' });
        }
    }

    updateBrand = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, description, logo, status, meta_title, meta_description, meta_keywords, sort_order } = req.body;
            const brand = await prisma.brand.update({
                where: { id: parseInt(id) },
                data: { name, description, logo, status, meta_title, meta_description, meta_keywords, sort_order }
            });
            res.status(httpStatus.OK).json(brand);
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update brand' });
        }
    }
}

const brandController = new BrandController();
export default brandController;