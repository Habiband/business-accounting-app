import Joi from 'joi';
import { schemas } from '@/utils/validation';

export const productValidation = {
  getProducts: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    category: Joi.string().optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    sortBy: Joi.string().valid('name', 'price', 'createdAt', 'rating').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    search: Joi.string().optional(),
  }),

  searchProducts: Joi.object({
    q: Joi.string().required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),

  createProduct: Joi.object({
    name: Joi.string().min(2).max(200).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().positive().required(),
    comparePrice: Joi.number().positive().optional(),
    inventory: Joi.number().integer().min(0).required(),
    sku: Joi.string().required(),
    categoryId: Joi.string().required(),
    images: Joi.array().items(Joi.string()).min(1).required(),
    variants: Joi.object().optional(),
    weight: Joi.number().positive().optional(),
    seoData: Joi.object({
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      keywords: Joi.array().items(Joi.string()).optional(),
    }).optional(),
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(2).max(200).optional(),
    description: Joi.string().min(10).optional(),
    price: Joi.number().positive().optional(),
    comparePrice: Joi.number().positive().optional(),
    inventory: Joi.number().integer().min(0).optional(),
    sku: Joi.string().optional(),
    categoryId: Joi.string().optional(),
    images: Joi.array().items(Joi.string()).optional(),
    variants: Joi.object().optional(),
    weight: Joi.number().positive().optional(),
    isActive: Joi.boolean().optional(),
    seoData: Joi.object({
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      keywords: Joi.array().items(Joi.string()).optional(),
    }).optional(),
  }),

  createReview: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    title: Joi.string().min(2).max(100).required(),
    comment: Joi.string().min(10).max(1000).required(),
  }),

  updateReview: Joi.object({
    rating: Joi.number().integer().min(1).max(5).optional(),
    title: Joi.string().min(2).max(100).optional(),
    comment: Joi.string().min(10).max(1000).optional(),
  }),
};
