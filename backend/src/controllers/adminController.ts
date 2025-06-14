import { Request, Response } from 'express';
import { prisma } from '@/config/database';

class AdminController {
  async getDashboard(req: Request, res: Response) {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: 'DELIVERED' },
      }),
      prisma.order.findMany({
        take: 5,
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        _count: { productId: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { id: true, name: true, price: true, images: true },
        });
        return {
          ...product,
          totalSold: item._sum.quantity,
          orderCount: item._count.productId,
        };
      })
    );

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue._sum.total || 0,
        },
        recentOrders,
        topProducts: topProductsWithDetails,
      },
    });
  }

  async getAnalytics(req: Request, res: Response) {
    // This would include more detailed analytics
    // For now, return basic data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      ordersLast30Days,
      revenueLast30Days,
      newUsersLast30Days,
    ] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: thirtyDaysAgo },
          status: 'DELIVERED',
        },
      }),
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
    ]);

    res.json({
      success: true,
      data: {
        last30Days: {
          orders: ordersLast30Days,
          revenue: revenueLast30Days._sum.total || 0,
          newUsers: newUsersLast30Days,
        },
      },
    });
  }

  async getUsers(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: { orders: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }

  async getOrders(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take,
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
          _count: {
            select: { items: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count(),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }

  async getProducts(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take,
        include: {
          category: {
            select: { name: true },
          },
          _count: {
            select: { orderItems: true, reviews: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count(),
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
}

export const adminController = new AdminController();
