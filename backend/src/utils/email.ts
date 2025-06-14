import nodemailer from 'nodemailer';
import { config } from '@/config/config';
import { logger } from './logger';

const transporter = nodemailer.createTransporter({
  host: config.emailHost,
  port: config.emailPort,
  secure: config.emailPort === 465,
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: config.emailFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${options.to}`);
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
};

export const emailTemplates = {
  welcomeEmail: (name: string, verificationUrl: string) => ({
    subject: 'Welcome to Our E-commerce Store!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome, ${name}!</h1>
        <p>Thank you for joining our e-commerce store. We're excited to have you as part of our community.</p>
        <p>To get started, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${verificationUrl}</p>
        <p>Best regards,<br>The E-commerce Team</p>
      </div>
    `,
    text: `Welcome, ${name}! Please verify your email address by visiting: ${verificationUrl}`,
  }),

  passwordResetEmail: (name: string, resetUrl: string) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
        <p>To reset your password, click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <p>Best regards,<br>The E-commerce Team</p>
      </div>
    `,
    text: `Hi ${name}, reset your password by visiting: ${resetUrl}`,
  }),

  orderConfirmationEmail: (name: string, orderNumber: string, orderDetails: any) => ({
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Confirmation</h1>
        <p>Hi ${name},</p>
        <p>Thank you for your order! We've received your order and are processing it now.</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Order Details</h2>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Total:</strong> $${orderDetails.total}</p>
          <p><strong>Status:</strong> ${orderDetails.status}</p>
        </div>
        <p>We'll send you another email when your order ships.</p>
        <p>Best regards,<br>The E-commerce Team</p>
      </div>
    `,
    text: `Hi ${name}, your order ${orderNumber} has been confirmed. Total: $${orderDetails.total}`,
  }),
};
