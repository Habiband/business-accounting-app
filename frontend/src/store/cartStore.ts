import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  selectedVariant: Record<string, any>;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    inventory: number;
    isActive: boolean;
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isUpdating: boolean;
}

interface CartActions {
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number, selectedVariant?: any) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  getSubtotal: () => number;
  isItemInCart: (productId: string) => boolean;
  getCartItem: (productId: string) => CartItem | undefined;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      cart: null,
      isLoading: false,
      isUpdating: false,

      // Actions
      fetchCart: async () => {
        try {
          set({ isLoading: true });
          const response = await cartApi.getCart();
          
          if (response.success && response.data) {
            set({
              cart: response.data.cart,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({ isLoading: false });
          // Don't show error toast for cart fetch failures
          console.error('Failed to fetch cart:', error);
        }
      },

      addToCart: async (productId, quantity = 1, selectedVariant = {}) => {
        try {
          set({ isUpdating: true });
          const response = await cartApi.addToCart({
            productId,
            quantity,
            selectedVariant,
          });
          
          if (response.success && response.data) {
            set({
              cart: response.data.cart,
              isUpdating: false,
            });
            
            toast.success('Item added to cart!');
          }
        } catch (error: any) {
          set({ isUpdating: false });
          throw error;
        }
      },

      updateCartItem: async (itemId, quantity) => {
        try {
          set({ isUpdating: true });
          await cartApi.updateCartItem(itemId, { quantity });
          
          // Update local state optimistically
          const currentCart = get().cart;
          if (currentCart) {
            const updatedItems = currentCart.items.map(item =>
              item.id === itemId ? { ...item, quantity } : item
            );
            
            const subtotal = updatedItems.reduce((sum, item) => 
              sum + (item.product.price * item.quantity), 0
            );
            
            const itemCount = updatedItems.reduce((sum, item) => 
              sum + item.quantity, 0
            );
            
            set({
              cart: {
                ...currentCart,
                items: updatedItems,
                subtotal,
                itemCount,
              },
              isUpdating: false,
            });
          }
          
          toast.success('Cart updated!');
        } catch (error: any) {
          set({ isUpdating: false });
          throw error;
        }
      },

      removeFromCart: async (itemId) => {
        try {
          set({ isUpdating: true });
          await cartApi.removeFromCart(itemId);
          
          // Update local state optimistically
          const currentCart = get().cart;
          if (currentCart) {
            const updatedItems = currentCart.items.filter(item => item.id !== itemId);
            
            const subtotal = updatedItems.reduce((sum, item) => 
              sum + (item.product.price * item.quantity), 0
            );
            
            const itemCount = updatedItems.reduce((sum, item) => 
              sum + item.quantity, 0
            );
            
            set({
              cart: {
                ...currentCart,
                items: updatedItems,
                subtotal,
                itemCount,
              },
              isUpdating: false,
            });
          }
          
          toast.success('Item removed from cart!');
        } catch (error: any) {
          set({ isUpdating: false });
          throw error;
        }
      },

      clearCart: async () => {
        try {
          set({ isUpdating: true });
          await cartApi.clearCart();
          
          set({
            cart: null,
            isUpdating: false,
          });
          
          toast.success('Cart cleared!');
        } catch (error: any) {
          set({ isUpdating: false });
          throw error;
        }
      },

      getItemCount: () => {
        const cart = get().cart;
        return cart?.itemCount || 0;
      },

      getSubtotal: () => {
        const cart = get().cart;
        return cart?.subtotal || 0;
      },

      isItemInCart: (productId) => {
        const cart = get().cart;
        return cart?.items.some(item => item.productId === productId) || false;
      },

      getCartItem: (productId) => {
        const cart = get().cart;
        return cart?.items.find(item => item.productId === productId);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cart: state.cart,
      }),
    }
  )
);
