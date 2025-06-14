import { Router } from 'express';
import { userController } from '@/controllers/userController';
import { authenticate, authorize } from '@/middleware/auth';
import { validate, validateParams } from '@/utils/validation';
import { schemas } from '@/utils/validation';

const router = Router();

// Protected routes
router.get('/addresses', authenticate, userController.getAddresses);
router.post('/addresses', authenticate, userController.createAddress);
router.put('/addresses/:id', authenticate, validateParams(schemas.id), userController.updateAddress);
router.delete('/addresses/:id', authenticate, validateParams(schemas.id), userController.deleteAddress);

// Admin routes
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), userController.getUsers);
router.get('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateParams(schemas.id), userController.getUser);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateParams(schemas.id), userController.updateUser);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), validateParams(schemas.id), userController.deleteUser);

export default router;
