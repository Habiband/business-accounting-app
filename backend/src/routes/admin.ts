import { Router } from 'express';
import { adminController } from '@/controllers/adminController';
import { authenticate, authorize } from '@/middleware/auth';
import { validateQuery } from '@/utils/validation';
import { schemas } from '@/utils/validation';

const router = Router();

// All admin routes require admin authentication
router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.get('/analytics', validateQuery(schemas.pagination), adminController.getAnalytics);
router.get('/users', validateQuery(schemas.pagination), adminController.getUsers);
router.get('/orders', validateQuery(schemas.pagination), adminController.getOrders);
router.get('/products', validateQuery(schemas.pagination), adminController.getProducts);

export default router;
