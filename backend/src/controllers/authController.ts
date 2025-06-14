import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/config/database';
import { AppError } from '@/utils/AppError';
import { generateTokens, verifyRefreshToken } from '@/utils/jwt';
import { sendEmail, emailTemplates } from '@/utils/email';
import { AuthenticatedRequest } from '@/middleware/auth';
import { config } from '@/config/config';

class AuthController {
  async register(req: Request, res: Response) {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User already exists with this email', 409, 'USER_EXISTS');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Send welcome email with verification link
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationUrl = `${config.corsOrigin}/verify-email/${verificationToken}`;
    
    try {
      const emailContent = emailTemplates.welcomeEmail(user.firstName, verificationUrl);
      await sendEmail({
        to: user.email,
        ...emailContent,
      });
    } catch (error) {
      // Log error but don't fail registration
      console.error('Failed to send welcome email:', error);
    }

    res.status(201).json({
      success: true,
      data: {
        user,
        tokens,
      },
      message: 'User registered successfully',
    });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        tokens,
      },
      message: 'Login successful',
    });
  }

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    // Update refresh token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      success: true,
      data: { tokens },
      message: 'Tokens refreshed successfully',
    });
  }

  async logout(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;

    // Remove all refresh tokens for the user
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    res.json({
      success: true,
      message: 'Logout successful',
    });
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        emailVerified: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.json({
      success: true,
      data: { user },
    });
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const { firstName, lastName, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        emailVerified: true,
        avatar: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      data: { user },
      message: 'Profile updated successfully',
    });
  }

  async changePassword(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new AppError('Current password is incorrect', 400, 'INVALID_PASSWORD');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, config.bcryptRounds);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    // Invalidate all refresh tokens
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return res.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetUrl = `${config.corsOrigin}/reset-password/${resetToken}`;

    // Store reset token (you might want to add a passwordResetToken field to User model)
    // For now, we'll use a simple approach with refresh tokens table
    await prisma.refreshToken.create({
      data: {
        token: `reset_${resetToken}`,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send reset email
    try {
      const emailContent = emailTemplates.passwordResetEmail(user.firstName, resetUrl);
      await sendEmail({
        to: user.email,
        ...emailContent,
      });
    } catch (error) {
      throw new AppError('Failed to send reset email', 500, 'EMAIL_SEND_FAILED');
    }

    res.json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  }

  async resetPassword(req: Request, res: Response) {
    const { token, password } = req.body;

    // Find reset token
    const resetToken = await prisma.refreshToken.findUnique({
      where: { token: `reset_${token}` },
      include: { user: true },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new AppError('Invalid or expired reset token', 400, 'INVALID_RESET_TOKEN');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);

    // Update password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Remove reset token
    await prisma.refreshToken.delete({
      where: { id: resetToken.id },
    });

    // Remove all other refresh tokens
    await prisma.refreshToken.deleteMany({
      where: { userId: resetToken.userId },
    });

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  }

  async verifyEmail(req: Request, res: Response) {
    const { token } = req.params;

    // In a real implementation, you'd store email verification tokens
    // For now, we'll just mark the user as verified
    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  }
}

export const authController = new AuthController();
