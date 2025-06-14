import { Request, Response } from 'express';
import { prisma } from '@/config/database';
import { AppError } from '@/utils/AppError';
import { AuthenticatedRequest } from '@/middleware/auth';

class CartController {
  async getCart(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                inventory: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: true,
                  inventory: true,
                  isActive: true,
                },
              },
            },
          },
        },
      });
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (Number(item.product.price) * item.quantity);
    }, 0);

    res.json({
      success: true,
      data: {
        cart: {
          ...cart,
          subtotal,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        },
      },
    });
  }

  async addToCart(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const { productId, quantity = 1, selectedVariant = {} } = req.body;

    // Check if product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    if (product.inventory < quantity) {
      throw new AppError('Insufficient inventory', 400, 'INSUFFICIENT_INVENTORY');
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.inventory < newQuantity) {
        throw new AppError('Insufficient inventory', 400, 'INSUFFICIENT_INVENTORY');
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          selectedVariant,
        },
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                inventory: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: { cart: updatedCart },
      message: 'Item added to cart successfully',
    });
  }

  async updateCartItem(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const { quantity } = req.body;

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: { userId },
      },
      include: { product: true },
    });

    if (!cartItem) {
      throw new AppError('Cart item not found', 404, 'CART_ITEM_NOT_FOUND');
    }

    if (cartItem.product.inventory < quantity) {
      throw new AppError('Insufficient inventory', 400, 'INSUFFICIENT_INVENTORY');
    }

    await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });

    res.json({
      success: true,
      message: 'Cart item updated successfully',
    });
  }

  async removeFromCart(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: { userId },
      },
    });

    if (!cartItem) {
      throw new AppError('Cart item not found', 404, 'CART_ITEM_NOT_FOUND');
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
    });
  }

  async clearCart(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully',
    });
  }
}

export const cartController = new CartController();
