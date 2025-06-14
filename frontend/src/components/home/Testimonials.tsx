'use client';

import { useState } from 'react';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Verified Customer',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    content: 'Amazing quality products and super fast shipping! I\'ve been shopping here for over a year and never been disappointed.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Tech Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    content: 'The electronics section is fantastic. Great prices and authentic products. Customer service is top-notch too!',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Fashion Lover',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    content: 'Love the fashion collection! Always on-trend and great quality. The return policy is also very customer-friendly.',
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Regular Shopper',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    content: 'Excellent shopping experience every time. The website is easy to use and the delivery is always on time.',
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 md:p-12">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 text-primary-200 dark:text-primary-800">
              <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
              </svg>
            </div>

            {/* Testimonial Content */}
            <div className="text-center">
              <div className="mb-6">
                <Image
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                  width={80}
                  height={80}
                  className="rounded-full mx-auto mb-4"
                />
                <div className="flex justify-center mb-4">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
              </div>

              <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                "{currentTestimonial.content}"
              </blockquote>

              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-lg">
                  {currentTestimonial.name}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {currentTestimonial.role}
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-primary-600'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
