import { Request, Response } from 'express';
import { prisma } from '@/config/database';
import { AppError } from '@/utils/AppError';
import { AuthenticatedRequest } from '@/middleware/auth';

class UserController {
  async getAddresses(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });

    res.json({
      success: true,
      data: { addresses },
    });
  }

  async createAddress(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const { street, city, state, zipCode, country, isDefault } = req.body;

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: isDefault || false,
      },
    });

    res.status(201).json({
      success: true,
      data: { address },
      message: 'Address created successfully',
    });
  }

  async updateAddress(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const updateData = req.body;

    const address = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new AppError('Address not found', 404, 'ADDRESS_NOT_FOUND');
    }

    // If this is set as default, unset other default addresses
    if (updateData.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      data: { address: updatedAddress },
      message: 'Address updated successfully',
    });
  }

  async deleteAddress(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;

    const address = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new AppError('Address not found', 404, 'ADDRESS_NOT_FOUND');
    }

    await prisma.address.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Address deleted successfully',
    });
  }

  // Admin methods
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
          phone: true,
          role: true,
          emailVerified: true,
          createdAt: true,
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

  async getUser(req: Request, res: Response) {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        addresses: true,
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.json({
      success: true,
      data: { user },
    });
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        emailVerified: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      data: { user },
      message: 'User updated successfully',
    });
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  }
}

export const userController = new UserController();
