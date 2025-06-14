import { Router } from 'express';
import { authController } from '@/controllers/authController';
import { validate } from '@/utils/validation';
import { authValidation } from '@/validation/authValidation';
import { authenticate } from '@/middleware/auth';

const router = Router();

// Public routes
router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/refresh-token', validate(authValidation.refreshToken), authController.refreshToken);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getProfile);
router.put('/me', authenticate, validate(authValidation.updateProfile), authController.updateProfile);
router.put('/change-password', authenticate, validate(authValidation.changePassword), authController.changePassword);

export default router;
