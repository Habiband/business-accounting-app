import { Request, Response } from 'express';
import { prisma } from '@/config/database';
import { AppError } from '@/utils/AppError';
import { AuthenticatedRequest } from '@/middleware/auth';

class ProductController {
  async getProducts(req: Request, res: Response) {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {
      isActive: true,
    };

    if (category) {
      where.categoryId = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy as string]: sortOrder },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          reviews: {
            select: { rating: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;
      
      const { reviews, ...productData } = product;
      return {
        ...productData,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      };
    });

    res.json({
      success: true,
      data: {
        products: productsWithRating,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }

  async getProduct(req: Request, res: Response) {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        reviews: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product || !product.isActive) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0;

    res.json({
      success: true,
      data: {
        product: {
          ...product,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount: product.reviews.length,
        },
      },
    });
  }

  async searchProducts(req: Request, res: Response) {
    const { q, page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q as string, mode: 'insensitive' } },
            { description: { contains: q as string, mode: 'insensitive' } },
          ],
        },
        skip,
        take,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      prisma.product.count({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q as string, mode: 'insensitive' } },
            { description: { contains: q as string, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }

  async getFeaturedProducts(req: Request, res: Response) {
    // For now, return most recent products
    const products = await prisma.product.findMany({
      where: { isActive: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    res.json({
      success: true,
      data: { products },
    });
  }

  async getRecommendations(req: AuthenticatedRequest, res: Response) {
    // Simple recommendation: return random products for now
    const products = await prisma.product.findMany({
      where: { isActive: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    res.json({
      success: true,
      data: { products },
    });
  }

  async getProductReviews(req: Request, res: Response) {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [reviews, total] = await Promise.all([
      prisma.productReview.findMany({
        where: { productId: id },
        skip,
        take,
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.productReview.count({ where: { productId: id } }),
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }

  async createReview(req: AuthenticatedRequest, res: Response) {
    const { id: productId } = req.params;
    const userId = req.user!.id;
    const { rating, title, comment } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.productReview.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    if (existingReview) {
      throw new AppError('You have already reviewed this product', 409, 'REVIEW_EXISTS');
    }

    const review = await prisma.productReview.create({
      data: {
        productId,
        userId,
        rating,
        title,
        comment,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: { review },
      message: 'Review created successfully',
    });
  }

  async updateReview(req: AuthenticatedRequest, res: Response) {
    const { reviewId } = req.params;
    const userId = req.user!.id;
    const { rating, title, comment } = req.body;

    const review = await prisma.productReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new AppError('Review not found', 404, 'REVIEW_NOT_FOUND');
    }

    if (review.userId !== userId) {
      throw new AppError('You can only update your own reviews', 403, 'FORBIDDEN');
    }

    const updatedReview = await prisma.productReview.update({
      where: { id: reviewId },
      data: { rating, title, comment },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    res.json({
      success: true,
      data: { review: updatedReview },
      message: 'Review updated successfully',
    });
  }

  async deleteReview(req: AuthenticatedRequest, res: Response) {
    const { reviewId } = req.params;
    const userId = req.user!.id;

    const review = await prisma.productReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new AppError('Review not found', 404, 'REVIEW_NOT_FOUND');
    }

    if (review.userId !== userId) {
      throw new AppError('You can only delete your own reviews', 403, 'FORBIDDEN');
    }

    await prisma.productReview.delete({
      where: { id: reviewId },
    });

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  }

  async createProduct(req: Request, res: Response) {
    const productData = req.body;

    const product = await prisma.product.create({
      data: {
        ...productData,
        slug: productData.name.toLowerCase().replace(/\s+/g, '-'),
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: { product },
      message: 'Product created successfully',
    });
  }

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.name) {
      updateData.slug = updateData.name.toLowerCase().replace(/\s+/g, '-');
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    res.json({
      success: true,
      data: { product },
      message: 'Product updated successfully',
    });
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  }
}

export const productController = new ProductController();
