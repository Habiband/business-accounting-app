import { Request, Response } from 'express';
import { prisma } from '@/config/database';
import { AppError } from '@/utils/AppError';
import { AuthenticatedRequest } from '@/middleware/auth';
import { sendEmail, emailTemplates } from '@/utils/email';

class OrderController {
  async getOrders(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take,
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, images: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { userId } }),
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

  async getOrder(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;

    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, images: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    res.json({
      success: true,
      data: { order },
    });
  }

  async createOrder(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const { shippingAddress, billingAddress, paymentMethod, paymentId } = req.body;

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400, 'EMPTY_CART');
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (Number(item.product.price) * item.quantity);
    }, 0);

    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress,
        billingAddress,
        paymentMethod,
        paymentId,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            productSnapshot: {
              name: item.product.name,
              images: item.product.images,
              selectedVariant: item.selectedVariant,
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, images: true },
            },
          },
        },
      },
    });

    // Update product inventory
    for (const item of cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          inventory: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Send order confirmation email
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, email: true },
      });

      if (user) {
        const emailContent = emailTemplates.orderConfirmationEmail(
          user.firstName,
          order.orderNumber,
          { total: order.total, status: order.status }
        );
        
        await sendEmail({
          to: user.email,
          ...emailContent,
        });
      }
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
    }

    res.status(201).json({
      success: true,
      data: { order },
      message: 'Order created successfully',
    });
  }

  async cancelOrder(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;

    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: { items: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
      throw new AppError('Order cannot be cancelled', 400, 'ORDER_CANNOT_BE_CANCELLED');
    }

    // Update order status
    await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    // Restore product inventory
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          inventory: {
            increment: item.quantity,
          },
        },
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
    });
  }

  // Admin methods
  async getAllOrders(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take,
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          items: {
            include: {
              product: {
                select: { id: true, name: true },
              },
            },
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

  async updateOrderStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status, trackingNumber },
    });

    res.json({
      success: true,
      data: { order },
      message: 'Order status updated successfully',
    });
  }
}

export const orderController = new OrderController();
