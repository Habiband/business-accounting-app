import { Router } from 'express';
import { categoryController } from '@/controllers/categoryController';
import { authenticate, authorize } from '@/middleware/auth';
import { validate, validateParams } from '@/utils/validation';
import { schemas } from '@/utils/validation';

const router = Router();

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', validateParams(schemas.id), categoryController.getCategory);
router.get('/:id/products', validateParams(schemas.id), categoryController.getCategoryProducts);

// Admin routes
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), categoryController.createCategory);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateParams(schemas.id), categoryController.updateCategory);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateParams(schemas.id), categoryController.deleteCategory);

export default router;
