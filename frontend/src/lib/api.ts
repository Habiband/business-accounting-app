import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Create axios instance
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add auth token if available
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 errors (unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh token
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
              { refreshToken }
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      }

      // Handle other errors
      const errorMessage = error.response?.data?.error?.message || error.message || 'An error occurred';
      
      // Don't show toast for certain errors
      const silentErrors = ['VALIDATION_ERROR', 'NOT_FOUND'];
      const errorCode = error.response?.data?.error?.code;
      
      if (!silentErrors.includes(errorCode)) {
        toast.error(errorMessage);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const api = createApiInstance();

// API helper functions
export const apiRequest = async <T = any>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await api(config);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest({
      method: 'POST',
      url: '/auth/login',
      data: credentials,
    }),

  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) =>
    apiRequest({
      method: 'POST',
      url: '/auth/register',
      data: userData,
    }),

  logout: () =>
    apiRequest({
      method: 'POST',
      url: '/auth/logout',
    }),

  getProfile: () =>
    apiRequest({
      method: 'GET',
      url: '/auth/me',
    }),

  updateProfile: (data: any) =>
    apiRequest({
      method: 'PUT',
      url: '/auth/me',
      data,
    }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest({
      method: 'PUT',
      url: '/auth/change-password',
      data,
    }),

  forgotPassword: (email: string) =>
    apiRequest({
      method: 'POST',
      url: '/auth/forgot-password',
      data: { email },
    }),

  resetPassword: (data: { token: string; password: string }) =>
    apiRequest({
      method: 'POST',
      url: '/auth/reset-password',
      data,
    }),
};

// Products API
export const productsApi = {
  getProducts: (params?: any) =>
    apiRequest({
      method: 'GET',
      url: '/products',
      params,
    }),

  getProduct: (id: string) =>
    apiRequest({
      method: 'GET',
      url: `/products/${id}`,
    }),

  searchProducts: (query: string, params?: any) =>
    apiRequest({
      method: 'GET',
      url: '/products/search',
      params: { q: query, ...params },
    }),

  getFeaturedProducts: () =>
    apiRequest({
      method: 'GET',
      url: '/products/featured',
    }),

  getRecommendations: () =>
    apiRequest({
      method: 'GET',
      url: '/products/recommendations',
    }),

  getProductReviews: (productId: string, params?: any) =>
    apiRequest({
      method: 'GET',
      url: `/products/${productId}/reviews`,
      params,
    }),

  createReview: (productId: string, review: any) =>
    apiRequest({
      method: 'POST',
      url: `/products/${productId}/reviews`,
      data: review,
    }),
};

// Categories API
export const categoriesApi = {
  getCategories: () =>
    apiRequest({
      method: 'GET',
      url: '/categories',
    }),

  getCategory: (id: string) =>
    apiRequest({
      method: 'GET',
      url: `/categories/${id}`,
    }),

  getCategoryProducts: (id: string, params?: any) =>
    apiRequest({
      method: 'GET',
      url: `/categories/${id}/products`,
      params,
    }),
};

// Cart API
export const cartApi = {
  getCart: () =>
    apiRequest({
      method: 'GET',
      url: '/cart',
    }),

  addToCart: (data: { productId: string; quantity: number; selectedVariant?: any }) =>
    apiRequest({
      method: 'POST',
      url: '/cart/items',
      data,
    }),

  updateCartItem: (itemId: string, data: { quantity: number }) =>
    apiRequest({
      method: 'PUT',
      url: `/cart/items/${itemId}`,
      data,
    }),

  removeFromCart: (itemId: string) =>
    apiRequest({
      method: 'DELETE',
      url: `/cart/items/${itemId}`,
    }),

  clearCart: () =>
    apiRequest({
      method: 'DELETE',
      url: '/cart',
    }),
};

// Orders API
export const ordersApi = {
  getOrders: (params?: any) =>
    apiRequest({
      method: 'GET',
      url: '/orders',
      params,
    }),

  getOrder: (id: string) =>
    apiRequest({
      method: 'GET',
      url: `/orders/${id}`,
    }),

  createOrder: (data: any) =>
    apiRequest({
      method: 'POST',
      url: '/orders',
      data,
    }),

  cancelOrder: (id: string) =>
    apiRequest({
      method: 'PUT',
      url: `/orders/${id}/cancel`,
    }),
};

// Payments API
export const paymentsApi = {
  createStripePaymentIntent: (data: { amount: number; currency?: string; metadata?: any }) =>
    apiRequest({
      method: 'POST',
      url: '/payments/stripe/create-intent',
      data,
    }),

  confirmStripePayment: (paymentIntentId: string) =>
    apiRequest({
      method: 'POST',
      url: '/payments/stripe/confirm',
      data: { paymentIntentId },
    }),

  createPayPalOrder: (data: any) =>
    apiRequest({
      method: 'POST',
      url: '/payments/paypal/create-order',
      data,
    }),

  capturePayPalOrder: (orderId: string) =>
    apiRequest({
      method: 'POST',
      url: '/payments/paypal/capture',
      data: { orderId },
    }),
};
