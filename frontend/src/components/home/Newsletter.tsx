'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Stay in the Loop
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Subscribe to our newsletter and be the first to know about new products, 
                exclusive deals, and special offers.
              </p>
            </div>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  loading={isLoading}
                  className="bg-white text-primary-600 hover:bg-gray-100 focus:ring-white"
                  disabled={isLoading}
                >
                  Subscribe
                </Button>
              </div>
            </form>

            {/* Benefits */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm opacity-90">
              <div className="flex items-center justify-center space-x-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Exclusive deals & offers</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>New product announcements</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>No spam, unsubscribe anytime</span>
              </div>
            </div>

            {/* Privacy Note */}
            <p className="mt-6 text-sm opacity-75">
              We respect your privacy. Your email will never be shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
