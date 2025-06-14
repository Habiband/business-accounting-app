import { Router } from 'express';
import { paymentController } from '@/controllers/paymentController';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/utils/validation';

const router = Router();

// Stripe webhook (no auth required)
router.post('/stripe/webhook', paymentController.stripeWebhook);

// Protected routes
router.post('/stripe/create-intent', authenticate, paymentController.createStripePaymentIntent);
router.post('/stripe/confirm', authenticate, paymentController.confirmStripePayment);
router.post('/paypal/create-order', authenticate, paymentController.createPayPalOrder);
router.post('/paypal/capture', authenticate, paymentController.capturePayPalOrder);

export default router;
