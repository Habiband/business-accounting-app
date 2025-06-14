import { Request, Response } from 'express';
import { prisma } from '@/config/database';
import { AppError } from '@/utils/AppError';

class CategoryController {
  async getCategories(req: Request, res: Response) {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        children: {
          where: { isActive: true },
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: { categories },
    });
  }

  async getCategory(req: Request, res: Response) {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        children: {
          where: { isActive: true },
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category || !category.isActive) {
      throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    }

    res.json({
      success: true,
      data: { category },
    });
  }

  async getCategoryProducts(req: Request, res: Response) {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { categoryId: id, isActive: true },
        skip,
        take,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where: { categoryId: id, isActive: true } }),
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

  async createCategory(req: Request, res: Response) {
    const { name, description, image, parentId } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description,
        image,
        parentId,
      },
    });

    res.status(201).json({
      success: true,
      data: { category },
      message: 'Category created successfully',
    });
  }

  async updateCategory(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.name) {
      updateData.slug = updateData.name.toLowerCase().replace(/\s+/g, '-');
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      data: { category },
      message: 'Category updated successfully',
    });
  }

  async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;

    // Check if category has products
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new AppError('Cannot delete category with products', 400, 'CATEGORY_HAS_PRODUCTS');
    }

    await prisma.category.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  }
}

export const categoryController = new CategoryController();
