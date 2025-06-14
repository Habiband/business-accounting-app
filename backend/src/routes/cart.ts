import { Router } from 'express';
import { cartController } from '@/controllers/cartController';
import { authenticate } from '@/middleware/auth';
import { validate, validateParams } from '@/utils/validation';
import { schemas } from '@/utils/validation';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/items', cartController.addToCart);
router.put('/items/:id', validateParams(schemas.id), cartController.updateCartItem);
router.delete('/items/:id', validateParams(schemas.id), cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
