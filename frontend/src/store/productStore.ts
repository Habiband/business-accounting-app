import { create } from 'zustand';
import { productsApi, categoriesApi } from '@/lib/api';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  inventory: number;
  sku: string;
  isActive: boolean;
  categoryId: string;
  images: string[];
  variants: Record<string, any>;
  weight?: number;
  seoData?: Record<string, any>;
  avgRating?: number;
  reviewCount?: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  children?: Category[];
  _count?: {
    products: number;
  };
  createdAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  categories: Category[];
  currentProduct: Product | null;
  isLoading: boolean;
  isLoadingProduct: boolean;
  isLoadingCategories: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  filters: ProductFilters;
}

interface ProductActions {
  fetchProducts: (params?: any) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  searchProducts: (query: string, params?: any) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchCategoryProducts: (categoryId: string, params?: any) => Promise<void>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  clearCurrentProduct: () => void;
}

type ProductStore = ProductState & ProductActions;

export const useProductStore = create<ProductStore>((set, get) => ({
  // Initial state
  products: [],
  featuredProducts: [],
  categories: [],
  currentProduct: null,
  isLoading: false,
  isLoadingProduct: false,
  isLoadingCategories: false,
  pagination: null,
  filters: {},

  // Actions
  fetchProducts: async (params = {}) => {
    try {
      set({ isLoading: true });
      const filters = get().filters;
      const response = await productsApi.getProducts({ ...filters, ...params });
      
      if (response.success && response.data) {
        set({
          products: response.data.products,
          pagination: response.data.pagination,
          isLoading: false,
        });
      }
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch products:', error);
    }
  },

  fetchProduct: async (id) => {
    try {
      set({ isLoadingProduct: true });
      const response = await productsApi.getProduct(id);
      
      if (response.success && response.data) {
        set({
          currentProduct: response.data.product,
          isLoadingProduct: false,
        });
      }
    } catch (error) {
      set({ isLoadingProduct: false });
      console.error('Failed to fetch product:', error);
    }
  },

  searchProducts: async (query, params = {}) => {
    try {
      set({ isLoading: true });
      const response = await productsApi.searchProducts(query, params);
      
      if (response.success && response.data) {
        set({
          products: response.data.products,
          pagination: response.data.pagination,
          isLoading: false,
        });
      }
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to search products:', error);
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      const response = await productsApi.getFeaturedProducts();
      
      if (response.success && response.data) {
        set({
          featuredProducts: response.data.products,
        });
      }
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    }
  },

  fetchCategories: async () => {
    try {
      set({ isLoadingCategories: true });
      const response = await categoriesApi.getCategories();
      
      if (response.success && response.data) {
        set({
          categories: response.data.categories,
          isLoadingCategories: false,
        });
      }
    } catch (error) {
      set({ isLoadingCategories: false });
      console.error('Failed to fetch categories:', error);
    }
  },

  fetchCategoryProducts: async (categoryId, params = {}) => {
    try {
      set({ isLoading: true });
      const response = await categoriesApi.getCategoryProducts(categoryId, params);
      
      if (response.success && response.data) {
        set({
          products: response.data.products,
          pagination: response.data.pagination,
          isLoading: false,
        });
      }
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch category products:', error);
    }
  },

  setFilters: (newFilters) => {
    const currentFilters = get().filters;
    set({
      filters: { ...currentFilters, ...newFilters },
    });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  clearCurrentProduct: () => {
    set({ currentProduct: null });
  },
}));
