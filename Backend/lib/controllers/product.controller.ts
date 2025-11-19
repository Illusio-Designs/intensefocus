import { Request, Response } from 'express';
import httpStatus from 'http-status';
import prisma from '../constants/prisma';

class ProductController {

    // Get all products
    getAllProducts = async (req: Request, res: Response) => {
        try {
            const products = await prisma.product.findMany({
                include: {
                    brand: true,
                    collection: true,
                    shape: true,
                    gender: true,
                    lensMaterial: true,
                    lensColor: true,
                    frameMaterial: true,
                    frameColor: true,
                    type: true
                },
                orderBy: { createdAt: 'desc' }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: products,
                message: 'Products retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving products',
                error: error.message
            });
        }
    };

    // Get single product by ID
    getProductById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const product = await prisma.product.findUnique({
                where: { id: parseInt(id) },
                include: {
                    brand: true,
                    shape: true,
                    gender: true,
                    lensMaterial: true,
                    lensColor: true,
                    frameMaterial: true,
                    frameColor: true,
                    type: true
                },
            });

            if (!product) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.status(httpStatus.OK).json({
                success: true,
                data: product,
                message: 'Product retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving product',
                error: error.message
            });
        }
    };

    // Create new product
    createProduct = async (req: Request, res: Response) => {
        try {
            const {
                name,
                description,
                price,
                sale_price,
                brand_id,
                collection_id,
                shape_id,
                gender_id,
                lens_material_id,
                lens_color_id,
                frame_material_id,
                frame_color_id,
                type_id,
                sku,
                stock_quantity,
                status,
                featured,
                meta_title,
                meta_description,
                meta_keywords
            } = req.body;

            // Check if SKU already exists
            if (sku) {
                const existingProduct = await prisma.product.findUnique({ where: { sku } });
                if (existingProduct) {
                    return res.status(400).json({
                        success: false,
                        message: 'Product with this SKU already exists'
                    });
                }
            }

            const product = await prisma.product.create({
                data: {
                    name,
                    description,
                    price,
                    sale_price,
                    brand_id,
                    collection_id,
                    shape_id,
                    gender_id,
                    lens_material_id,
                    lens_color_id,
                    frame_material_id,
                    frame_color_id,
                    type_id,
                    sku,
                    stock_quantity: stock_quantity || 0,
                    status: status !== undefined ? status : true,
                    featured: featured || false,
                    meta_title,
                    meta_description,
                    meta_keywords
                }
            });

            res.status(httpStatus.CREATED).json({
                success: true,
                data: product,
                message: 'Product created successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error creating product',
                error: error.message
            });
        }
    };

    // Update product
    updateProduct = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const {
                name,
                description,
                price,
                sale_price,
                brand_id,
                collection_id,
                shape_id,
                gender_id,
                lens_material_id,
                lens_color_id,
                frame_material_id,
                frame_color_id,
                type_id,
                sku,
                stock_quantity,
                status,
                featured,
                meta_title,
                meta_description,
                meta_keywords
            } = req.body;

            const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
            if (!product) {
                return res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            // Check if SKU is being changed and if it already exists
            if (sku && sku !== product.sku) {
                const existingProduct = await prisma.product.findUnique({ where: { sku } });
                if (existingProduct) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        success: false,
                        message: 'Product with this SKU already exists'
                    });
                }
            }

            // Prepare update data
            const updateData: any = {};
            if (name) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (price !== undefined) updateData.price = price;
            if (sale_price !== undefined) updateData.sale_price = sale_price;
            if (brand_id !== undefined) updateData.brand_id = brand_id;
            if (collection_id !== undefined) updateData.collection_id = collection_id;
            if (shape_id !== undefined) updateData.shape_id = shape_id;
            if (gender_id !== undefined) updateData.gender_id = gender_id;
            if (lens_material_id !== undefined) updateData.lens_material_id = lens_material_id;
            if (lens_color_id !== undefined) updateData.lens_color_id = lens_color_id;
            if (frame_material_id !== undefined) updateData.frame_material_id = frame_material_id;
            if (frame_color_id !== undefined) updateData.frame_color_id = frame_color_id;
            if (type_id !== undefined) updateData.type_id = type_id;
            if (sku !== undefined) updateData.sku = sku;
            if (stock_quantity !== undefined) updateData.stock_quantity = stock_quantity;
            if (status !== undefined) updateData.status = status;
            if (featured !== undefined) updateData.featured = featured;
            if (meta_title !== undefined) updateData.meta_title = meta_title;
            if (meta_description !== undefined) updateData.meta_description = meta_description;
            if (meta_keywords !== undefined) updateData.meta_keywords = meta_keywords;

            await prisma.product.update({ where: { id: parseInt(id) }, data: updateData });

            res.status(httpStatus.OK).json({
                success: true,
                data: product,
                message: 'Product updated successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error updating product',
                error: error.message
            });
        }
    };

    // Get active products only
    getActiveProducts = async (req: Request, res: Response) => {
        try {
            const products = await prisma.product.findMany({
                where: { status: true },
                include: {
                    brand: true,
                    shape: true,
                    gender: true,
                    lensMaterial: true,
                    lensColor: true,
                    frameMaterial: true,
                    frameColor: true,
                    type: true
                },
                orderBy: { createdAt: 'desc' }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: products,
                message: 'Active products retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving active products',
                error: error.message
            });
        }
    };

    // Get featured products
    getFeaturedProducts = async (req: Request, res: Response) => {
        try {
            const products = await prisma.product.findMany({
                where: {
                    status: true,
                    featured: true
                },
                include: {
                    brand: true,
                    shape: true,
                    gender: true,
                    lensMaterial: true,
                    lensColor: true,
                    frameMaterial: true,
                    frameColor: true,
                    type: true
                },
                orderBy: { createdAt: 'desc' }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: products,
                message: 'Featured products retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving featured products',
                error: error.message
            });
        }
    };

    // Search products
    searchProducts = async (req: Request, res: Response) => {
        try {
            const {
                search,
                status,
                featured,
                brand_id,
                collection_id,
                shape_id,
                gender_id,
                min_price,
                max_price
            } = req.query;

            let whereClause: any = {};

            if (search) {
                whereClause.name = { contains: search as string };
            }

            if (status !== undefined) {
                whereClause.status = status === 'true';
            }

            if (featured !== undefined) {
                whereClause.featured = featured === 'true';
            }

            if (brand_id) {
                whereClause.brand_id = brand_id;
            }

            if (collection_id) {
                whereClause.collection_id = collection_id;
            }

            if (shape_id) {
                whereClause.shape_id = shape_id;
            }

            if (gender_id) {
                whereClause.gender_id = gender_id;
            }

            if (min_price || max_price) {
                whereClause.price = {};
                if (min_price) whereClause.price[">="] = min_price;
                if (max_price) whereClause.price["<="] = max_price;
            }

            const products = await prisma.product.findMany({
                where: whereClause,
                include: {
                    brand: true,
                    shape: true,
                    gender: true,
                    lensMaterial: true,
                    lensColor: true,
                    frameMaterial: true,
                    frameColor: true,
                    type: true
                },
                orderBy: { createdAt: 'desc' }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: products,
                message: 'Products searched successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error searching products',
                error: error.message
            });
        }
    };

    // Upload product image
    uploadProductImage = async (req: any, res: Response) => {
        try {
            const fileInfo = req.fileInfo;

            res.status(httpStatus.OK).json({
                success: true,
                message: 'Product image uploaded successfully',
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
                message: 'Error uploading product image',
                error: error.message
            });
        }
    };

    // Get all products with images and related data (matching PHP getAllProducts)
    getAllProductsWithImages = async (req: Request, res: Response) => {
        try {
            const products = await prisma.product.findMany({
                where: {
                    status: true,
                    stock_quantity: { gt: 0 }
                },
                include: {
                    brand: true,
                    shape: true,
                    gender: true,
                    lensMaterial: true,
                    lensColor: true,
                    frameMaterial: true,
                    frameColor: true,
                    type: true
                },
                orderBy: { id: 'asc' }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: products,
                message: 'Products with images retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving products with images',
                error: error.message
            });
        }
    };

    // Get shapes (matching PHP getShapes)
    getShapes = async (req: Request, res: Response) => {
        try {
            const shapes = await prisma.shape.findMany({
                where: { status: true }
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
                error: error.message
            });
        }
    };

    // Get brands (matching PHP getBrands)
    getBrands = async (req: Request, res: Response) => {
        try {
            const brands = await prisma.brand.findMany({
                where: { status: true }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: brands,
                message: 'Brands retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving brands',
                error: error.message
            });
        }
    };

    // Get genders (matching PHP getGenders)
    getGenders = async (req: Request, res: Response) => {
        try {
            const genders = await prisma.gender.findMany({
                where: { status: true }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: genders,
                message: 'Genders retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving genders',
                error: error.message
            });
        }
    };

    // Get lens materials (matching PHP getLensMaterials)
    getLensMaterials = async (req: Request, res: Response) => {
        try {
            const lensMaterials = await prisma.lensMaterial.findMany({
                where: { status: true }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: lensMaterials,
                message: 'Lens materials retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving lens materials',
                error: error.message
            });
        }
    };

    // Get lens colors (matching PHP getLensColors)
    getLensColors = async (req: Request, res: Response) => {
        try {
            const lensColors = await prisma.lensColor.findMany({
                where: { status: true }
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
                error: error.message
            });
        }
    };

    // Get frame materials (matching PHP getFrameMaterials)
    getFrameMaterials = async (req: Request, res: Response) => {
        try {
            const frameMaterials = await prisma.frameMaterial.findMany({
                where: { status: true }
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

    // Get frame colors (matching PHP getFrameColors)
    getFrameColors = async (req: Request, res: Response) => {
        try {
            const frameColors = await prisma.frameColor.findMany({
                where: { status: true }
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
                error: error.message
            });
        }
    };

    // Get types (matching PHP getTypes)
    getTypes = async (req: Request, res: Response) => {
        try {
            const types = await prisma.type.findMany({
                where: { status: true }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: types,
                message: 'Types retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving types',
                error: error.message
            });
        }
    };

    // Get filtered products (matching PHP getFilteredProducts)
    getFilteredProducts = async (req: Request, res: Response) => {
        try {
            const {
                brand_id,
                shape_id,
                gender_id,
                lens_material_id,
                lens_color_id,
                frame_material_id,
                frame_color_id,
                type_id,
                min_price,
                max_price
            } = req.query;

            let whereClause: any = {};

            if (brand_id) whereClause.brand_id = brand_id;
            if (shape_id) whereClause.shape_id = shape_id;
            if (gender_id) whereClause.gender_id = gender_id;
            if (lens_material_id) whereClause.lens_material_id = lens_material_id;
            if (lens_color_id) whereClause.lens_color_id = lens_color_id;
            if (frame_material_id) whereClause.frame_material_id = frame_material_id;
            if (frame_color_id) whereClause.frame_color_id = frame_color_id;
            if (type_id) whereClause.type_id = type_id;

            if (min_price || max_price) {
                whereClause.price = {};
                if (min_price) whereClause.price[">="] = min_price;
                if (max_price) whereClause.price["<="] = max_price;
            }

            const products = await prisma.product.findMany({
                where: whereClause,
                include: {
                    brand: true,
                    collection: true,
                    shape: true,
                    gender: true,
                    lensMaterial: true,
                    lensColor: true,
                    frameMaterial: true,
                    frameColor: true,
                    type: true
                },
                orderBy: { createdAt: 'desc' }
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: products,
                message: 'Filtered products retrieved successfully'
            });
        } catch (error: any) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving filtered products',
                error: error.message
            });
        }
    };
}
const productController = new ProductController();
export default productController;