'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const heroSlides = [
  {
    id: 1,
    title: 'Latest Electronics',
    subtitle: 'Discover cutting-edge technology',
    description: 'Shop the newest smartphones, laptops, and gadgets with exclusive deals.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
    cta: 'Shop Electronics',
    link: '/categories/electronics',
    bgColor: 'from-blue-600 to-purple-700',
  },
  {
    id: 2,
    title: 'Fashion Forward',
    subtitle: 'Style that speaks to you',
    description: 'Explore our curated collection of trendy clothing and accessories.',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=600&fit=crop',
    cta: 'Shop Fashion',
    link: '/categories/clothing',
    bgColor: 'from-pink-500 to-rose-600',
  },
  {
    id: 3,
    title: 'Special Offers',
    subtitle: 'Up to 50% off',
    description: 'Limited time deals on your favorite products. Don\'t miss out!',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop',
    cta: 'View Deals',
    link: '/deals',
    bgColor: 'from-green-500 to-emerald-600',
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentSlideData.image}
          alt={currentSlideData.title}
          fill
          className="object-cover transition-opacity duration-1000"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${currentSlideData.bgColor} opacity-80`} />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <div className="animate-fade-in">
              <p className="text-lg md:text-xl font-medium mb-2 opacity-90">
                {currentSlideData.subtitle}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                {currentSlideData.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90 max-w-lg">
                {currentSlideData.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={currentSlideData.link}>
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                    {currentSlideData.cta}
                  </Button>
                </Link>
                <Link href="/products">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-gray-900"
                  >
                    Browse All
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{ 
            width: `${((currentSlide + 1) / heroSlides.length) * 100}%` 
          }}
        />
      </div>
    </section>
  );
}
