import { Request, Response } from 'express';
import httpStatus from 'http-status';
import prisma from '../constants/prisma';
class ProductImagesController {

    // Get all product images
    getAllProductImages = async (req: Request, res: Response) => {
        try {
            const productImages = await prisma.productImage.findMany({
                orderBy: {
                    sort_order: 'asc',
                    createdAt: 'desc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: productImages,
                message: 'Product images retrieved successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving product images',
                error: error.message
            });
        }
    };

    // Get single product image by ID
    getProductImageById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const productImage = await prisma.productImage.findUnique({
                where: { id: parseInt(id) },
                include: {
                    product: true
                }
            });

            if (!productImage) {
                return res.status(404).json({
                    success: false,
                    message: 'Product image not found'
                });
            }

            res.status(httpStatus.OK).json({
                success: true,
                data: productImage,
                message: 'Product image retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving product image',
                error: error.message as string
            });
        }
    };

    // Create new product image
    createProductImage = async (req: Request, res: Response) => {
        try {
            const { product_id, image, sort_order, status, is_primary } = req.body;

            // Verify product exists
            const product = await prisma.product.findUnique({ where: { id: product_id } });
            if (!product) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Selected product does not exist'
                });
            }

            // If this is a primary image, unset other primary images for this product
            if (is_primary) {
                await prisma.productImage.updateMany({
                    where: { product_id },
                    data: { is_primary: false }
                });
            }

            const productImage = await prisma.productImage.create({
                data: {
                    product_id,
                    image,
                    is_primary: is_primary || false,
                    product: {
                        connect: {
                            id: product_id
                        }
                    },
                    productId: product_id,
                    sort_order: sort_order || 0,
                    status: status !== undefined ? status : true
                }
            });


            res.status(httpStatus.CREATED).json({
                success: true,
                data: productImage,
                message: 'Product image created successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error creating product image',
                error: error.message as string
            });
        }
    };

    // Update product image
    updateProductImage = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { product_id, image, sort_order, status } = req.body;

            const productImage = await prisma.productImage.findUnique({ where: { id: parseInt(id) } });
            if (!productImage) {
                return res.status(404).json({
                    success: false,
                    message: 'Product image not found'
                });
            }

            // Verify product exists if being changed
            if (product_id && product_id !== productImage.product_id) {
                const product = await prisma.product.findUnique({ where: { id: product_id } });
                if (!product) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        success: false,
                        message: 'Selected product does not exist'
                    });
                }
            }

            // If this is being set as primary, unset other primary images for this product
            if (status && !productImage.status) {
                const targetProductId = product_id || productImage.product_id;
                await prisma.productImage.updateMany({
                    where: { product_id: targetProductId },
                    data: { status: false }
                });
            }

            // Prepare update data
            const updateData: any = {};
            if (product_id !== undefined) updateData.productId = product_id;
            if (image !== undefined) updateData.image = image;
            if (sort_order !== undefined) updateData.sort_order = sort_order;
            if (status !== undefined) updateData.status = status;

            await prisma.productImage.update({ where: { id: parseInt(id) }, data: updateData });

            res.status(httpStatus.OK).json({
                success: true,
                data: productImage,
                message: 'Product image updated successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error updating product image',
                error: error.message as string
            });
        }
    };

    // Get images by product
    getImagesByProduct = async (req: Request, res: Response) => {
        try {
            const { product_id } = req.params;

            // Verify product exists
            const product = await prisma.product.findUnique({ where: { id: parseInt(product_id) } });
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            const productImages = await prisma.productImage.findMany({
                where: {
                    productId: parseInt(product_id),
                    status: true
                },
                orderBy: {
                    sort_order: 'asc',
                    createdAt: 'desc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: productImages,
                message: 'Product images retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving product images',
                error: error.message as string
            });
        }
    };

    // Get primary image by product
    getPrimaryImageByProduct = async (req: Request, res: Response) => {
        try {
            const { product_id } = req.params;

            // Verify product exists
            const product = await prisma.product.findUnique({ where: { id: parseInt(product_id) } });
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            const primaryImage = await prisma.productImage.findFirst({
                where: {
                    productId: parseInt(product_id),
                    status: true,
                },
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: primaryImage,
                message: 'Primary product image retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving primary product image',
                error: error.message as string
            });
        }
    };

    // Set primary image
    setPrimaryImage = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const productImage = await prisma.productImage.findUnique({ where: { id: parseInt(id) } });
            if (!productImage) {
                return res.status(404).json({
                    success: false,
                    message: 'Product image not found'
                });
            }

            // Unset all primary images for this product
            await prisma.productImage.updateMany({
                where: { productId: productImage.productId },
                data: { status: false }
            });

            // Set this image as primary
            await prisma.productImage.update({ where: { id: parseInt(id) }, data: { status: true } });

            res.status(httpStatus.OK).json({
                success: true,
                data: productImage,
                message: 'Primary image set successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error setting primary image',
                error: error.message as string
            });
        }
    };

    // Get active product images only
    getActiveProductImages = async (req: Request, res: Response) => {
        try {
            const productImages = await prisma.productImage.findMany({
                where: { status: true },
                orderBy: {
                    sort_order: 'asc',
                    createdAt: 'desc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: productImages,
                message: 'Active product images retrieved successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving active product images',
                error: error.message as string
            });
        }
    };

    // Search product images
    searchProductImages = async (req: Request, res: Response) => {
        try {
            const { search, product_id, status } = req.query;

            let whereClause: any = {};

            if (search) {
                whereClause = {
                    image: { contains: search as string }
                };
            }

            if (product_id) {
                whereClause.productId = { equals: parseInt(product_id as string) };
            }

            if (status !== undefined) {
                whereClause.status = { equals: status === 'true' };
            }

            const productImages = await prisma.productImage.findMany({
                where: whereClause,
                orderBy: {
                    sort_order: 'asc',
                    createdAt: 'desc'
                }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: productImages,
                message: 'Product images searched successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error searching product images',
                error: error.message
            });
        }
    };

}
const productImagesController = new ProductImagesController();
export default productImagesController;