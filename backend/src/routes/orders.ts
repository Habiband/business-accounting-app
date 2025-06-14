import { Router } from 'express';
import { orderController } from '@/controllers/orderController';
import { authenticate, authorize } from '@/middleware/auth';
import { validate, validateParams, validateQuery } from '@/utils/validation';
import { schemas } from '@/utils/validation';

const router = Router();

// Protected routes
router.get('/', authenticate, validateQuery(schemas.pagination), orderController.getOrders);
router.get('/:id', authenticate, validateParams(schemas.id), orderController.getOrder);
router.post('/', authenticate, orderController.createOrder);
router.put('/:id/cancel', authenticate, validateParams(schemas.id), orderController.cancelOrder);

// Admin routes
router.get('/admin/all', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateQuery(schemas.pagination), orderController.getAllOrders);
router.put('/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateParams(schemas.id), orderController.updateOrderStatus);

export default router;
