import { Request, Response } from 'express';
import Stripe from 'stripe';
import { config } from '@/config/config';
import { AppError } from '@/utils/AppError';
import { AuthenticatedRequest } from '@/middleware/auth';

const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2023-10-16',
});

class PaymentController {
  async createStripePaymentIntent(req: AuthenticatedRequest, res: Response) {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          userId: req.user!.id,
          ...metadata,
        },
      });

      res.json({
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        },
      });
    } catch (error) {
      throw new AppError('Failed to create payment intent', 500, 'PAYMENT_INTENT_FAILED');
    }
  }

  async confirmStripePayment(req: AuthenticatedRequest, res: Response) {
    const { paymentIntentId } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        res.json({
          success: true,
          data: { paymentIntent },
          message: 'Payment confirmed successfully',
        });
      } else {
        throw new AppError('Payment not completed', 400, 'PAYMENT_NOT_COMPLETED');
      }
    } catch (error) {
      throw new AppError('Failed to confirm payment', 500, 'PAYMENT_CONFIRMATION_FAILED');
    }
  }

  async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'] as string;

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        config.stripeWebhookSecret
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          // Handle successful payment
          console.log('Payment succeeded:', event.data.object);
          break;
        case 'payment_intent.payment_failed':
          // Handle failed payment
          console.log('Payment failed:', event.data.object);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).send('Webhook Error');
    }
  }

  async createPayPalOrder(req: AuthenticatedRequest, res: Response) {
    // PayPal integration would go here
    // This is a placeholder implementation
    res.json({
      success: true,
      data: {
        orderId: 'PAYPAL_ORDER_ID',
        approvalUrl: 'https://paypal.com/approve',
      },
      message: 'PayPal order created (placeholder)',
    });
  }

  async capturePayPalOrder(req: AuthenticatedRequest, res: Response) {
    // PayPal capture would go here
    // This is a placeholder implementation
    res.json({
      success: true,
      data: {
        orderId: req.body.orderId,
        status: 'COMPLETED',
      },
      message: 'PayPal order captured (placeholder)',
    });
  }
}

export const paymentController = new PaymentController();
