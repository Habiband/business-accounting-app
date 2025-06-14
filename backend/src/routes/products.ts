import { Router } from 'express';
import { productController } from '@/controllers/productController';
import { validate, validateQuery, validateParams } from '@/utils/validation';
import { productValidation } from '@/validation/productValidation';
import { authenticate, authorize, optionalAuth } from '@/middleware/auth';
import { schemas } from '@/utils/validation';

const router = Router();

// Public routes
router.get('/', validateQuery(productValidation.getProducts), productController.getProducts);
router.get('/search', validateQuery(productValidation.searchProducts), productController.searchProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/recommendations', optionalAuth, productController.getRecommendations);
router.get('/:id', validateParams(schemas.id), productController.getProduct);
router.get('/:id/reviews', validateParams(schemas.id), validateQuery(schemas.pagination), productController.getProductReviews);

// Protected routes
router.post('/:id/reviews', authenticate, validateParams(schemas.id), validate(productValidation.createReview), productController.createReview);
router.put('/reviews/:reviewId', authenticate, validateParams(schemas.id), validate(productValidation.updateReview), productController.updateReview);
router.delete('/reviews/:reviewId', authenticate, validateParams(schemas.id), productController.deleteReview);

// Admin routes
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(productValidation.createProduct), productController.createProduct);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateParams(schemas.id), validate(productValidation.updateProduct), productController.updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateParams(schemas.id), productController.deleteProduct);

export default router;
