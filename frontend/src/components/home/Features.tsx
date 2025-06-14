'use client';

import { 
  TruckIcon, 
  ShieldCheckIcon, 
  CreditCardIcon, 
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: TruckIcon,
    title: 'Free Shipping',
    description: 'Free shipping on orders over $100. Fast and reliable delivery worldwide.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Payment',
    description: 'Your payment information is processed securely with industry-standard encryption.',
  },
  {
    icon: ArrowPathIcon,
    title: 'Easy Returns',
    description: '30-day return policy. No questions asked if you\'re not completely satisfied.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: '24/7 Support',
    description: 'Our customer support team is available around the clock to help you.',
  },
  {
    icon: CreditCardIcon,
    title: 'Flexible Payment',
    description: 'Multiple payment options including credit cards, PayPal, and buy now pay later.',
  },
  {
    icon: GiftIcon,
    title: 'Loyalty Rewards',
    description: 'Earn points with every purchase and redeem them for exclusive discounts.',
  },
];

export function Features() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We're committed to providing you with the best shopping experience possible.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                <feature.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
